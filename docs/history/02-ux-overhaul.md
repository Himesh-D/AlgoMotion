# Development Step: Progressive Disclosure UX Overhaul

## Step Name
AlgoMotion UX Overhaul — Progressive Disclosure & Prism WebGL Background

## Purpose
To redesign the AlgoMotion interface around a **canvas-first, progressive disclosure** model. The previous layout gave equal visual weight to every component causing cognitive overload. This overhaul establishes a clear three-level visual hierarchy:

- **Primary**: Visualization canvas (dominant focus)
- **Secondary**: Array elements, pointers, explanation card
- **Tertiary**: Setup inputs, playback controls

---

## Layout Changes

### Before
```
Header (4 buttons)
Editor Panel (wide) | Canvas | Variables Panel
                    | Bottom: Variables | Timeline
```

### After
```
Header (Run · Reset · Demo▾)
Setup Panel (narrow, ~280px) | Canvas (flex: 1, dominant)
                             | Explanation Card
Control Strip (single row: ↺ ⏮ ▶ ⏭ · Slider · Step · Speed)
```

---

## Implementation Details

### HTML (`visualizer.html`)
- **Header trimmed** to 3 elements: `▶ Run`, `Reset`, `Demo ▾` dropdown
- **Algorithm Type selector** added with 4 presets: Two Pointers, Sliding Window, Traversal, Custom
- **Code editor** hidden by default under `▶ Advanced Logic` collapsible toggle
- **Variables panel removed** entirely; replaced by floating chip overlay inside the canvas
- **Explanation card** replaces old text bar — includes `💡` icon and styled card
- **Merged control strip** replaces the old split Variables + Timeline bottom area: single flex row with all transport controls, slider, step counter, and speed `<select>`
- **`#prism-bg` div** added as first child of `#visualization-canvas` for WebGL background

### CSS (`style.css`)
- Full rewrite to new dark `#0d1117` base with ambient radial gradients in the body
- `editor-panel`: fixed `280px` width, `flex-shrink: 0`
- `visualization-area`: `flex: 1` — takes all remaining width
- **`.setup-panel-dimmed`**: `opacity: 0.45`, `filter: blur(0.3px)` — applied during playback (no `pointer-events: none` so inputs remain editable)
- **`.canvas-focused`**: amber glow border + inset shadow — applied on play
- **`.var-chips-overlay`**: `position: absolute; bottom; left` inside canvas
- **`.var-chip`**: pill-shaped, mono font, cyan flash animation on change
- **`.explanation-card`**: flex row with icon and text, replaces `.explanation-panel`
- **`.control-strip`**: single-row flex panel housing all controls
- **`.logic-toggle` / `.logic-body`**: collapsible section with `max-height` CSS transition
- **`.demo-menu`**: absolute dropdown with opacity + transform transition
- **`.prism-bg`**: `position: absolute; inset: 0; z-index: 0; pointer-events: none`
- Removed old CSS animated grid and `canvasPulse` keyframes

### JavaScript (`main.js`)
- **Demo presets**: `DEMOS` map with full `array`, `params`, `algoType`, and `code` for: Two Sum, Reverse Array, Sliding Window, Palindrome Check
- **Algo snippets**: `ALGO_SNIPPETS` map — auto-fills code editor when Algorithm Type selector changes
- **Demo dropdown**: click-outside-to-close, each item loads preset + auto-runs
- **`focusCanvas()` / `unfocusCanvas()`**: add/remove `.setup-panel-dimmed` on `editor-panel` and `.canvas-focused` on `visualization-wrapper`
- **Speed control**: changed from 3 `.btn-speed` buttons to a `<select id="speed-select">`
- **Advanced Logic toggle**: toggles `.open` on `#logic-body` and rotates chevron
- **Prism init**: `initPrism(prismContainer, { animationType:'rotate', timeScale:0.2, hueShift:1.8, colorFrequency:0.7, glow:0.75, ... })`

### UIRenderer (`src/renderers/UIRenderer.js`)
- Removed `variablesContainer` — no longer targets a variables panel
- Added **`renderVariableChips(variables)`** — builds `.var-chip` elements inside `#var-chips-overlay`
- `updateExplanation()` now targets `#explanation-text` inside the explanation card
- `reset()` clears the chips overlay and restores card text

### ArrayRenderer (`src/renderers/ArrayRenderer.js`)
- **Critical fix**: `reset()` changed from `container.innerHTML = ''` to `container.removeChild(this.arrayContainer)` — preserves the `#prism-bg` WebGL canvas across every re-run and reset

### Prism WebGL (`src/prism.js`) — New File
- Vanilla JS port of the `Prism` React component (from `prism.txt`)
- Exports `initPrism(container, options)` → returns cleanup function
- Uses `ogl` (`npm install ogl`) for WebGL rendering via `Renderer`, `Triangle`, `Program`, `Mesh`
- Three animation modes: `'rotate'` (default wob matrix), `'3drotate'` (Euler angles), `'hover'` (pointer-driven)
- WebGL `<canvas>` styled with `pointer-events: none`, `z-index: 0` — purely decorative

---

## Demo Presets

| Name | Array | Params | Algorithm |
|---|---|---|---|
| Two Sum | `2, 7, 11, 15` | `{"target": 9}` | Two Pointers |
| Reverse Array | `1, 2, 3, 4, 5` | `{}` | Two Pointers |
| Sliding Window | `1, 3, -1, -3, 5, 3, 6, 7` | `{"k": 3}` | Sliding Window |
| Palindrome Check | `r, a, c, e, c, a, r` | `{}` | Two Pointers |

---

## Files Created / Modified

| File | Action |
|---|---|
| `visualizer.html` | Modified (full restructure) |
| `src/style.css` | Modified (full rewrite) |
| `src/main.js` | Modified (full rewrite) |
| `src/renderers/UIRenderer.js` | Modified (chip rendering, new IDs) |
| `src/renderers/ArrayRenderer.js` | Modified (reset fix, preserves prism-bg) |
| `src/prism.js` | **New** — vanilla JS WebGL Prism |
| `prism.txt` | New — original React component reference |

---

## Expected Behaviour
- Canvas immediately dominates ~70% of width; setup panel sits quietly on the left
- Clicking `▶ Run`: setup panel softly dims, canvas glows with amber border
- Variable chips float bottom-left of canvas, flash cyan when a value changes  
- `▶ Advanced Logic` toggle reveals the code textarea with a smooth slide animation
- `Demo ▾` dropdown shows 4 examples; clicking one loads + auto-plays immediately
- Algorithm Type selector auto-fills the code editor with the matching snippet
- Control strip at the bottom: `↺ ⏮ ▶ ⏭` + scrubable slider + step count + speed dropdown
- Prism WebGL background animates slowly (violet→amber tone, `timeScale 0.2`) behind the array without interfering with any click/drag interactions
