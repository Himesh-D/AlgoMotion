import { ArrayRenderer } from './renderers/ArrayRenderer.js';
import { UIRenderer } from './renderers/UIRenderer.js';
import { ExecutionEngine } from './engine/ExecutionEngine.js';
import { TimelineManager } from './engine/TimelineManager.js';
import { InputParser } from './engine/InputParser.js';
import { initPrism } from './prism.js';
import { CustomSelect } from './custom-select.js';

// ─── Algorithm Metadata ──────────────────────────────────────────
const ALGO_OPTIONS = {
  array: [
    { 
      value: 'traversal', 
      text: 'Traversal', 
      params: '{}', 
      array: '1, 2, 3, 4, 5',
      code: `for (let i = 0; i < array.length; i++) {\n  // visiting index i\n}\nreturn array;` 
    },
    { 
      value: 'two-pointers', 
      text: 'Two Pointers (Two Sum)', 
      params: '{"target": 9}', 
      array: '2, 7, 11, 15',
      code: `let left = 0;\nlet right = array.length - 1;\n\nwhile (left < right) {\n  let sum = array[left] + array[right];\n  if (sum === target) return [left, right];\n  if (sum < target) left++;\n  else right--;\n}\nreturn [];` 
    },
    { 
      value: 'sliding-window', 
      text: 'Sliding Window', 
      params: '{"k": 3}', 
      array: '1, 3, -1, -3, 5, 3, 6, 7',
      code: `let maxSum = 0;\nlet windowSum = 0;\nlet windowStart = 0;\n\nfor (let windowEnd = 0; windowEnd < array.length; windowEnd++) {\n  windowSum += array[windowEnd];\n  if (windowEnd >= k - 1) {\n    maxSum = Math.max(maxSum, windowSum);\n    windowSum -= array[windowStart];\n    windowStart++;\n  }\n}\nreturn maxSum;` 
    },
    { 
      value: 'array-reversal', 
      text: 'Array Reversal', 
      params: '{}', 
      array: '10, 20, 30, 40, 50',
      code: `let left = 0;\nlet right = array.length - 1;\n\nwhile (left < right) {\n  let temp = array[left];\n  array[left] = array[right];\n  array[right] = temp;\n  left++;\n  right--;\n}\nreturn array;` 
    },
    { 
      value: 'linear-search', 
      text: 'Linear Search', 
      params: '{"target": 5}', 
      array: '1, 3, 5, 7, 9',
      code: `for(let i = 0; i < array.length; i++){\n  if(array[i] === target) return i;\n}\nreturn -1;` 
    },
    { 
      value: 'prefix-sum', 
      text: 'Prefix Sum', 
      params: '{}', 
      array: '1, 2, 3, 4, 5',
      code: `let prefix = new Array(array.length).fill(0);\nprefix[0] = array[0];\nfor(let i = 1; i < array.length; i++){\n  prefix[i] = prefix[i-1] + array[i];\n}\nreturn prefix;` 
    },
    { 
      value: 'custom', 
      text: 'Custom Algorithm', 
      params: '{}', 
      array: '1, 2, 3, 4, 5',
      code: `// Write your array algorithm here\nreturn array;` 
    }
  ],
  string: [
    { 
      value: 'palindrome-check', 
      text: 'Palindrome Check', 
      params: '{}', 
      array: 'racecar',
      code: `let left = 0;\nlet right = array.length - 1;\nlet isPalindrome = true;\n\nwhile (left < right) {\n  if (array[left] !== array[right]) {\n    isPalindrome = false;\n    break;\n  }\n  left++;\n  right--;\n}\nreturn isPalindrome;` 
    },
    { 
      value: 'reverse-string', 
      text: 'Reverse String', 
      params: '{}', 
      array: 'hello',
      code: `let s = array;\nlet left = 0, right = s.length - 1;\nwhile(left < right){\n  let temp = s[left]; s[left] = s[right]; s[right] = temp;\n  left++; right--;\n}\nreturn s.join("");` 
    },
    { 
      value: 'char-frequency', 
      text: 'Character Frequency', 
      params: '{}', 
      array: 'abbccc',
      code: `let freq = {};\nfor(let char of array){\n  freq[char] = (freq[char] || 0) + 1;\n}\nreturn freq;` 
    },
    { 
      value: 'custom-string', 
      text: 'Custom String Logic', 
      params: '{}', 
      array: 'example',
      code: `// Write your string logic here\nreturn array.join("");` 
    }
  ]
};

// ─── Algorithm Metadata ──────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── Init components ─────────────────────────────────────────────
  const arrayRenderer = new ArrayRenderer('visualization-canvas');
  const uiRenderer = new UIRenderer('step-counter', 'timeline-slider');
  const engine = new ExecutionEngine();
  const timeline = new TimelineManager();

  // ── Prism WebGL background ───────────────────────────────────────
  const prismContainer = document.getElementById('prism-bg');
  if (prismContainer) {
    initPrism(prismContainer, {
      animationType:  'rotate',
      timeScale:      0.2,
      height:         3.5,
      baseWidth:      5.5,
      scale:          3.8,
      glow:           0.75,
      noise:          0,
      bloom:          0.9,
      hueShift:       0.3,
      colorFrequency: 1,
      transparent:    true,
    });
  }

  // ── DOM refs ─────────────────────────────────────────────────────
  const arrayInput      = document.getElementById('array-input');
  const paramsInput     = document.getElementById('params-input');
  const codeInput       = document.getElementById('code-input');
  const modeSelect      = document.getElementById('mode-select'); // hidden
  const dataTypeSelect  = document.getElementById('data-type-select');
  const algoTypeSelect  = document.getElementById('algo-type-select');
  const modeIndicator   = document.getElementById('mode-indicator');

  const btnRun          = document.getElementById('btn-run');
  const btnReset        = document.getElementById('btn-reset');

  const btnPlay         = document.getElementById('btn-play');
  const btnPrev         = document.getElementById('btn-prev');
  const btnNext         = document.getElementById('btn-next');
  const btnReplay       = document.getElementById('btn-replay');
  const slider          = document.getElementById('timeline-slider');
  const speedSelect     = document.getElementById('speed-select');

  const editorPanel     = document.getElementById('editor-panel');
  const vizWrapper      = document.getElementById('visualization-wrapper');

  const logicToggle     = document.getElementById('logic-toggle');
  const logicBody       = document.getElementById('logic-body');
  const logicChevron    = document.getElementById('logic-chevron');

  // ── Upgrade native selects to custom dropdowns ───────────────────
  const csDataType     = new CustomSelect(dataTypeSelect);
  const csAlgoType     = new CustomSelect(algoTypeSelect);
  const csSpeed        = new CustomSelect(speedSelect);
  csSpeed.wrapper.classList.add('cs-wrapper--speed');

  let currentArray = [];
  let pendingReturnValue = null; // stored at compile time, shown after playback ends

  // ── Timeline callbacks ───────────────────────────────────────────
  timeline.onStateChange = (state, index, totalSteps) => {
    uiRenderer.renderVariableChips(state.variables || {});
    uiRenderer.updateTimeline(index + 1, totalSteps);
    uiRenderer.updateExplanation(state.status || '');
    arrayRenderer.renderState(state);
  };

  timeline.onPlaybackEnd = () => {
    btnPlay.innerText = '▶';
    // Show result toast now that all steps have played
    if (pendingReturnValue !== null) {
      const rv = describeResult(pendingReturnValue);
      if (rv !== null) {
        const isPalin = typeof pendingReturnValue === 'boolean';
        const isFound = Array.isArray(pendingReturnValue) && pendingReturnValue.length > 0;
        const isNum   = typeof pendingReturnValue === 'number';
        showToast({
          icon:    isPalin ? (pendingReturnValue ? '✅' : '❌') : isFound ? '🎯' : isNum ? '🔢' : '✨',
          title:   isPalin ? (pendingReturnValue ? 'Palindrome!' : 'Not a Palindrome') : isFound ? 'Result Found' : isNum ? 'Result' : 'Algorithm Complete',
          message: rv,
          variant: (isPalin && !pendingReturnValue) ? 'error' : 'result',
          duration: 5000,
        });
      }
      pendingReturnValue = null;
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const debounce = (fn, delay) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  };

  const focusCanvas = () => {
    editorPanel.classList.add('setup-panel-dimmed');
    vizWrapper.classList.add('canvas-focused');
  };
  const unfocusCanvas = () => {
    editorPanel.classList.remove('setup-panel-dimmed');
    vizWrapper.classList.remove('canvas-focused');
  };

  const updateModeIndicator = () => {
    const dt = dataTypeSelect.value;
    const algo = algoTypeSelect.options[algoTypeSelect.selectedIndex]?.text || 'None';
    const modeIcon = document.getElementById('mode-icon');
    
    if (modeIcon) {
      modeIcon.innerText = dt === 'string' ? '🔤' : '📊';
    }
    
    modeIndicator.innerText = `${dt.charAt(0).toUpperCase() + dt.slice(1)} → ${algo}`;
  };

  // ── Toast notification ────────────────────────────────────────────
  const toastContainer = document.getElementById('toast-container');

  const showToast = ({ icon = '💡', title, message, variant = 'result', duration = 4000 }) => {
    const toast = document.createElement('div');
    toast.className = `toast toast--${variant}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
    `;
    toastContainer.appendChild(toast);

    toast.addEventListener('click', () => dismiss(toast));
    const dismiss = (el) => {
      el.classList.add('toast-out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };
    setTimeout(() => dismiss(toast), duration);
  };

  const describeResult = (value) => {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return `[${value.join(', ')}]`;
    }
    if (typeof value === 'boolean') return value ? 'true ✓' : 'false ✗';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return `"${value}"`;
    return JSON.stringify(value);
  };

  // ── Core run logic ───────────────────────────────────────────────
  const runVisualization = () => {
    try {
      const dataType = dataTypeSelect.value;
      const arrayStr = arrayInput.value;
      const paramsStr = paramsInput.value;
      const code = codeInput.value;

      // 1. Validation and Parsing
      let parsedArray, parsedParams;
      try {
        parsedArray = InputParser.parseArray(arrayStr, dataType);
        parsedParams = InputParser.parseParams(paramsStr);
        InputParser.validateCode(code);
      } catch (err) {
        // Clear viz on parse/validation error
        resetEverything();
        uiRenderer.updateExplanation(`💡 ${err.message}`);
        return;
      }

      // 2. Execution
      const result = engine.execute([...parsedArray], parsedParams, code);

      if (result.success && result.states.length > 0) {
        timeline.reset();
        arrayRenderer.reset();
        uiRenderer.reset();
        arrayRenderer.initialize([...parsedArray]);

        [btnPrev, btnNext, btnReset, btnReplay, slider].forEach(el => el.disabled = false);
        timeline.loadStates(result.states);
        timeline.pause();
        btnPlay.innerText = '▶';
        btnPlay.disabled = false;
        uiRenderer.updateExplanation('Logic compiled. Press Play ▶');
        pendingReturnValue = result.returnValue ?? null;
      } else if (result.error) {
        // Clear viz on execution error
        resetEverything();
        uiRenderer.updateExplanation(`❌ ${result.error}`);
      }
    } catch (err) {
      console.error('Unexpected error during visualization run:', err);
      uiRenderer.updateExplanation('An unexpected error occurred.');
    }
  };

  const debouncedRun = debounce(runVisualization, 400);

  // ── Dynamic Options ──────────────────────────────────────────────
  const updateAlgoOptions = (dataType) => {
    const options = ALGO_OPTIONS[dataType] || [];
    algoTypeSelect.innerHTML = '';
    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.text = opt.text;
      algoTypeSelect.appendChild(o);
    });
    csAlgoType.updateOptions();
    
    // Auto-load first template and its params
    if (options.length > 0) {
      codeInput.value = options[0].code;
      paramsInput.value = options[0].params;
    }
  };

  // ── Reset All ────────────────────────────────────────────────────
  const resetEverything = () => {
    timeline.pause();
    timeline.reset();
    arrayRenderer.reset();
    uiRenderer.reset();
    pendingReturnValue = null;
    [btnPrev, btnNext, btnReset, btnReplay, slider, btnPlay].forEach(el => el.disabled = true);
    unfocusCanvas();
  };

  // ── Event Listeners ──────────────────────────────────────────────
  btnRun.addEventListener('click', () => {
    runVisualization();
    timeline.play();
    btnPlay.innerText = '⏸';
    focusCanvas();
  });

  btnReset.addEventListener('click', resetEverything);

  btnPlay.addEventListener('click', () => {
    if (timeline.isPlaying) {
      timeline.pause();
      btnPlay.innerText = '▶';
    } else {
      timeline.play();
      btnPlay.innerText = '⏸';
      focusCanvas();
    }
  });

  btnNext.addEventListener('click', () => timeline.next());
  btnPrev.addEventListener('click', () => timeline.previous());
  btnReplay.addEventListener('click', () => {
    timeline.reset();
    timeline.play();
    btnPlay.innerText = '⏸';
    focusCanvas();
  });

  slider.addEventListener('input', e => {
    timeline.pause();
    btnPlay.innerText = '▶';
    timeline.goToStep(Number(e.target.value) - 1);
  });

  speedSelect.addEventListener('change', e => {
    timeline.setSpeed(parseFloat(e.target.value));
  });

  dataTypeSelect.addEventListener('change', () => {
    resetEverything();
    updateAlgoOptions(dataTypeSelect.value);
    updateModeIndicator();
    
    // Update labels/placeholders
    const arrayLabel = document.querySelector('label[for="array-input"]');
    if (dataTypeSelect.value === 'string') {
      arrayLabel.innerHTML = '<span class="icon">[]</span> String (Raw Text)';
      arrayInput.placeholder = 'e.g. racecar';
      arrayInput.value = 'racecar';
    } else {
      arrayLabel.innerHTML = '<span class="icon">[]</span> Array';
      arrayInput.placeholder = 'e.g. 2, 7, 11, 15';
      arrayInput.value = '2, 7, 11, 15';
    }
    debouncedRun();
  });

  algoTypeSelect.addEventListener('change', () => {
    const dt = dataTypeSelect.value;
    const opt = ALGO_OPTIONS[dt].find(o => o.value === algoTypeSelect.value);
    if (opt) {
      codeInput.value = opt.code;
      paramsInput.value = opt.params;
      if (opt.array) {
        arrayInput.value = opt.array;
      }
    }
    updateModeIndicator();
    if (!logicBody.classList.contains('open')) {
      logicBody.classList.add('open');
      logicChevron.classList.add('open');
    }
    debouncedRun();
  });

  arrayInput.addEventListener('input', () => { uiRenderer.updateExplanation('Compiling...'); debouncedRun(); });
  paramsInput.addEventListener('input', () => { uiRenderer.updateExplanation('Compiling...'); debouncedRun(); });
  codeInput.addEventListener('input', () => { uiRenderer.updateExplanation('Compiling...'); debouncedRun(); });


  logicToggle.addEventListener('click', () => {
    const isOpen = logicBody.classList.toggle('open');
    logicChevron.classList.toggle('open', isOpen);
  });

  // ── Draggable Resizers ────────────────────────────────────────────
  const resizerV     = document.getElementById('resizer-v');
  const resizerH     = document.getElementById('resizer-h');
  const controlStrip = document.getElementById('control-strip');

  let isDraggingV = false, isDraggingH = false;

  resizerV.addEventListener('mousedown', e => { isDraggingV = true; document.body.style.cursor = 'col-resize'; e.preventDefault(); });
  resizerH.addEventListener('mousedown', e => { isDraggingH = true; document.body.style.cursor = 'row-resize'; e.preventDefault(); });

  document.addEventListener('mousemove', e => {
    if (!isDraggingV && !isDraggingH) return;
    document.body.style.userSelect = 'none';

    if (isDraggingV) {
      const newWidth = e.clientX - editorPanel.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < window.innerWidth - 350) {
        editorPanel.style.width = `${newWidth}px`;
      }
    }

    if (isDraggingH) {
      const vizArea = document.getElementById('visualization-area');
      const vizAreaRect = vizArea.getBoundingClientRect();
      const stripHeight = controlStrip.getBoundingClientRect().height;
      const resizerHeight = resizerH.getBoundingClientRect().height;
      const newWrapperHeight = e.clientY - vizAreaRect.top;
      const minH = 150, maxH = vizAreaRect.height - stripHeight - resizerHeight - 20;
      if (newWrapperHeight > minH && newWrapperHeight < maxH) {
        document.getElementById('visualization-wrapper').style.flexBasis = `${newWrapperHeight}px`;
        document.getElementById('visualization-wrapper').style.flex = '0 0 auto';
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingV || isDraggingH) {
      isDraggingV = false; isDraggingH = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // ── Initial Setup ─────────────────────────────────────────────────
  updateAlgoOptions('array');
  updateModeIndicator();
  runVisualization();
});
