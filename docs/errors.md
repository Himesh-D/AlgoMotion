# AlgoMotion — Error Reference

Documents every major error encountered during development, its root cause, and the fix applied.

---

## E-01 · Prism Background Disappears on Every Run

**Symptom**  
The Prism WebGL animation is visible on first load, but vanishes as soon as `▶ Run` is clicked or `Reset` is pressed. The `#prism-bg` div is missing from the DOM after execution.

**Root Cause**  
`ArrayRenderer.reset()` used `this.container.innerHTML = ''` to clear the canvas. This nuked **all** children of `#visualization-canvas` — including the `#prism-bg` div and its WebGL `<canvas>` element.

**Fix Applied**  
Track the managed `arrayContainer` element explicitly. On reset, only remove that one element using `removeChild`:

```js
// ❌ Before — destroys everything
this.container.innerHTML = '';

// ✅ After — only removes the array-container
if (this.arrayContainer && this.arrayContainer.parentElement === this.container) {
  this.container.removeChild(this.arrayContainer);
}
this.arrayContainer = null;
```

**File**: `src/renderers/ArrayRenderer.js` → `reset()`

---

## E-02 · Setup Panel Blocks Input During Playback

**Symptom**  
After clicking `▶ Run`, clicking on any input field, textarea, or dropdown in the setup panel has no effect. The user cannot edit the array or parameters while the simulation is playing.

**Root Cause**  
The `.setup-panel-dimmed` CSS class included `pointer-events: none`, which intercepts and swallows all mouse and keyboard events over the panel.

**Fix Applied**  
Removed `pointer-events: none`. The panel dims visually but remains fully interactive:

```css
/* ❌ Before */
.editor-panel.setup-panel-dimmed {
  opacity: 0.35;
  pointer-events: none;
  filter: blur(0.5px);
}

/* ✅ After */
.editor-panel.setup-panel-dimmed {
  opacity: 0.45;
  filter: blur(0.3px);
}
```

**File**: `src/style.css` → `.editor-panel.setup-panel-dimmed`

---

## E-03 · `ArrayRenderer.initialize()` Left Duplicate Orphaned Code

**Symptom**  
IDE reported multiple parse errors across `ArrayRenderer.js` (unexpected tokens, missing semicolons on lines 33, 34, 47, 52…). The file would not compile.

**Root Cause**  
A partial `replace_file_content` edit to `initialize()` replaced only the opening lines of the method but left the **original body still present**, creating two merged method bodies inside one class definition.

**Fix Applied**  
Full overwrite of `ArrayRenderer.js` using `write_to_file` with `Overwrite: true` to produce a clean, syntactically valid file.

**File**: `src/renderers/ArrayRenderer.js`

---

## E-04 · `npm install ogl` Exits with Code 1

**Symptom**  
Running `npm install ogl` in the project directory exits immediately with error code 1 and produces no output.

**Root Cause**  
The Vite dev server (`npm run dev`) was running in the **same terminal process**, blocking the package manager from acquiring a file lock on `node_modules`.

**Fix Applied**  
Used the `--prefix` flag to run npm in a separate shell context, avoiding the lock conflict:

```powershell
npm install ogl --prefix "d:\My_Projects\ALGO_CODE"
```

---

## E-05 · Visualization States Not Regenerating on Input Change

**Symptom**  
After changing the array input or parameters, the canvas continues to show the old states from the previous run. Clicking `▶ Run` again is required to see updates.

**Root Cause**  
The debounced `runVisualization()` was not calling `arrayRenderer.reset()` and `arrayRenderer.initialize()` before loading new states. Old `boxElements` references remained stale, causing renders to operate on detached DOM nodes.

**Fix Applied**  
Enforced a strict reset–initialize–load sequence in `runVisualization()`:

```js
timeline.reset();
arrayRenderer.reset();
uiRenderer.reset();
arrayRenderer.initialize([...currentArray]); // fresh boxes from new input
timeline.loadStates(result.states);
```

**File**: `src/main.js` → `runVisualization()`

---

## E-06 · Invalid JSON Params Crash the Whole Visualizer

**Symptom**  
Typing in the Parameters field mid-edit throws an uncaught exception, freezing the UI.

**Root Cause**  
`JSON.parse` throws synchronously on malformed input. The call was not wrapped in try/catch, so partial JSON like `{"target":` would crash the entire `runVisualization` function.

**Fix Applied**  
Wrapped params parsing in a dedicated try/catch that shows a UI error message and returns early, without crashing:

```js
try {
  params = JSON.parse(paramsStr);
} catch (e) {
  uiRenderer.updateExplanation('Error: Invalid parameter JSON');
  return;
}
```

**File**: `src/main.js` → `runVisualization()`

---

## E-07 · Syntax Errors in User Code Show Confusing Messages

**Symptom**  
While typing algorithm logic, the explanation panel flashes errors like `Unexpected token '}'` or `Unexpected end of JSON input`, which are irrelevant to the user's intent.

**Root Cause**  
The `ExecutionEngine` reports all syntax errors from `new Function(...)`, including partial/mid-type states that are expected and harmless.

**Fix Applied**  
In `main.js`, errors containing `Unexpected token` or `Unexpected end of JSON` are silently swallowed:

```js
} else if (result.error &&
           !result.error.includes('Unexpected token') &&
           !result.error.includes('Unexpected end of JSON')) {
  uiRenderer.updateExplanation(`Error: ${result.error}`);
}
```

**File**: `src/main.js` → `runVisualization()`

---

## E-08 · Variable Panel Shows Stale Data After Reset

**Symptom**  
After clicking `Reset`, the Variables panel (now the floating chips overlay) still shows values from the last execution step.

**Root Cause**  
`UIRenderer.reset()` was clearing `previousVariables` and re-setting text but not clearing the `#var-chips-overlay` container, leaving old chip elements in the DOM.

**Fix Applied**  
`reset()` now explicitly empties the chips overlay:

```js
reset() {
  this.previousVariables = {};
  if (this.varChipsOverlay) this.varChipsOverlay.innerHTML = '';
  // ... rest of reset
}
```

**File**: `src/renderers/UIRenderer.js` → `reset()`

---

## E-09 · Swap Animation Leaves Boxes Stuck in Wrong Position

**Symptom**  
After a swap step, two array boxes remain visually displaced (shifted left/right) for all subsequent steps, even though their text values are correct.

**Root Cause**  
`anime.js` applies `translateX` as an inline style that persists after the animation. On the next `renderState()` call, the transform was not cleared, so boxes remained offset.

**Fix Applied**  
Added a `setTimeout` callback after the swap animation duration (650ms) to reset `translateX` to `0` via `anime.set()`:

```js
setTimeout(() => {
  anime.set([boxA, boxB], { translateX: 0 });
  if (state.array) {
    boxA.innerText = state.array[idxA];
    boxB.innerText = state.array[idxB];
  }
}, 650);
```

**File**: `src/renderers/ArrayRenderer.js` → `renderState()`

---

## E-10 · Demo Dropdown Stays Open After Selecting an Item

**Symptom**  
Clicking a demo item from the dropdown loads the preset correctly, but the dropdown menu remains visible on screen.

**Root Cause**  
The `click` event listener on `.demo-item` did not explicitly close the dropdown menu.

**Fix Applied**  
Added `demoMenu.classList.remove('open')` inside the demo item click handler, and also a document-level `click` listener for outside-click dismissal:

```js
item.addEventListener('click', () => {
  // ... load preset ...
  demoMenu.classList.remove('open'); // ← explicit close
});

document.addEventListener('click', () => demoMenu.classList.remove('open'));
```

**File**: `src/main.js`

---

## Quick Reference

| ID | Error | File | Fix |
|---|---|---|---|
| E-01 | Prism bg disappears on run/reset | `ArrayRenderer.js` | `removeChild` instead of `innerHTML = ''` |
| E-02 | Can't edit during playback | `style.css` | Remove `pointer-events: none` from dimmed class |
| E-03 | Parse errors after partial edit | `ArrayRenderer.js` | Full file overwrite |
| E-04 | `npm install` exits with code 1 | Shell | Use `--prefix` flag |
| E-05 | Stale states after input change | `main.js` | reset → initialize → load sequence |
| E-06 | Invalid JSON crashes visualizer | `main.js` | try/catch around `JSON.parse` |
| E-07 | Partial syntax errors shown mid-type | `main.js` | Filter `Unexpected token` errors |
| E-08 | Chips show stale data after reset | `UIRenderer.js` | Clear `varChipsOverlay.innerHTML` in `reset()` |
| E-09 | Swap boxes stay displaced | `ArrayRenderer.js` | `anime.set` translateX reset after 650ms |
| E-10 | Dropdown stays open after selection | `main.js` | `classList.remove('open')` on item click |
