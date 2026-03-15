export class ExecutionEngine {
  constructor() {
    this.states = [];
  }

  /**
   * Instrument the code to inject __snap() calls at key points (loops)
   */
  instrumentCode(code) {
    const varRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    const trackedVars = new Set();
    while ((match = varRegex.exec(code)) !== null) {
      trackedVars.add(match[1]);
    }

    // Inject __snap at start of loops (while, for)
    let instrumented = code.replace(/(while\s*\([^)]+\)|for\s*\([^)]+\))\s*\{/g, (m) => {
      return `${m}\n    __snap("Loop iteration started");`;
    });

    return { instrumented, trackedVars: Array.from(trackedVars) };
  }

  /**
   * Executes the user code and captures states
   */
  execute(array, params, code) {
    this.states = [];
    const maxSteps = 1000; // safety limit
    let stepCount = 0;

    const { instrumented, trackedVars } = this.instrumentCode(code);

    let lastVars = {};
    let lastPointers = {};
    let lastHighlights = [];

    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

    const recordState = (message = '', customState = null) => {
      if (stepCount++ > maxSteps) {
        throw new Error("Execution limit exceeded (infinite loop?)");
      }

      const currentState = {
        array: deepClone(array),
        variables: deepClone(customState?.variables || lastVars),
        pointers: deepClone(customState?.pointers || lastPointers),
        highlights: deepClone(customState?.highlights || lastHighlights),
        status: customState?.message || message,
        operation: customState?.operation || 'auto'
      };

      // Deduplicate consecutive identical states (shallow check)
      const last = this.states[this.states.length - 1];
      if (last && 
          JSON.stringify(last.array) === JSON.stringify(currentState.array) &&
          JSON.stringify(last.pointers) === JSON.stringify(currentState.pointers) &&
          last.operation === currentState.operation) {
          // If only message changed, update it
          last.status = currentState.status;
          return;
      }

      this.states.push(currentState);
      
      // Update persistent refs for next step
      if (customState?.variables) lastVars = customState.variables;
      if (customState?.pointers) lastPointers = customState.pointers;
      if (customState?.highlights) lastHighlights = customState.highlights;
    };

    // Proxy to detect array modifications
    const proxyArray = new Proxy(array, {
      set: (target, property, value) => {
        const oldVal = target[property];
        target[property] = value;
        // ignore length or non-numeric if it's index-based
        if (property !== 'length' && oldVal !== value && !isNaN(property)) {
          recordState(`Modified index ${property}: ${oldVal} → ${value}`, {
            operation: 'modify',
            highlights: [parseInt(property)]
          });
        }
        return true;
      }
    });

    try {
      const paramKeys = Object.keys(params);
      let functionBody = `const __run = () => {\n`;
      
      paramKeys.forEach(k => {
        functionBody += `  let ${k} = params['${k}'];\n`;
      });

      functionBody += `
      const __snap = (msg) => {
        const currentVars = {};
      `;
      trackedVars.forEach(v => {
        functionBody += `  try { currentVars['${v}'] = ${v}; } catch(e) {}\n`;
      });
      functionBody += `
        const currentPointers = {};
        const currentHighlights = [];
        
        // Smarter detection: common pointer names or variables matching array indices
        const POINTER_NAMES = ['i', 'j', 'k', 'left', 'right', 'low', 'high', 'start', 'end', 'mid', 'p', 'q'];
        
        for (const [key, val] of Object.entries(currentVars)) {
          if (typeof val === 'number' && Number.isInteger(val) && val >= 0 && val < array.length) {
            if (POINTER_NAMES.includes(key.toLowerCase())) {
              currentPointers[key] = val;
              currentHighlights.push(val);
            }
          }
        }

        recordState(msg, {
          variables: currentVars,
          pointers: currentPointers,
          highlights: currentHighlights,
          message: msg
        });
      };\n`;

      functionBody += `  ${instrumented}\n  return null;\n};\nreturn __run();`;

      const fn = new Function('array', 'params', 'recordState', 'console', functionBody);
      
      // Seed initial state
      recordState("Algorithm initialized", { 
        variables: {}, 
        pointers: {}, 
        highlights: [] 
      });
      
      const returnValue = fn(proxyArray, params, recordState, console);

      return {
        success: true,
        states: this.states,
        returnValue: returnValue,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        states: this.states,
        error: err.message || err.toString()
      };
    }
  }
}
