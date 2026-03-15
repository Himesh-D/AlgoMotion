# AlgoMotion Global Project Rules & Agent Guide

This document defines the core architecture, constraints, and operational protocols for the AlgoMotion project. Any AI agent (Antigravity or otherwise) working on this repository must adhere to these rules to ensure system integrity and consistency across different environments.

---

## 🏗 System Architecture

AlgoMotion follows a **State Timeline Architecture**. The execution logic is strictly decoupled from the rendering layer.

1.  **Input Parsing (`src/engine/InputParser.js`)**: All user data (arrays, strings, JSON params) MUST pass through this module before reaching the engine. It enforces type safety and prevents `NaN` or malformed inputs.
2.  **Execution Engine (`src/engine/ExecutionEngine.js`)**: Evaluates user code in a sandboxed `Function`. It injects `recordState` and MUST return a JSON-serializable array of deep-cloned execution states.
3.  **Timeline Manager (`src/engine/TimelineManager.js`)**: Manages the playback state (play/pause/step). It is the source of truth for the "current" state being visualized.
4.  **Renderers (`src/renderers/`)**: 
    - `ArrayRenderer.js`: Handles DOM/Canvas visualization of array elements and pointers. Use `anime.js` for all transitions.
    - `UIRenderer.js`: Manages floating labels, step badges, and terminal-style explanations.

---

## 🛠 Development & Build Rules

- **Framework**: No heavy frameworks (React/Vue). This is a **Vanilla JS + Vite** project. 
- **Type Safety**: Use JSDoc for complex functions.
- **Port**: The development server should ideally run on `http://localhost:3000/`. (Configure via `vite.config.js` or CLI if needed).
- **Dependencies**: 
    - `animejs`: For all layout/pointer animations.
    - `ogl`: Exclusively for the WebGL background (`prism.js`). Do not bloat this dependency.
- **File Location**: New documentation goes in `/docs/`. Core logic remains in `src/engine/`.

---

## 🐞 Debugging & Audit Protocols

1.  **Sandboxed Errors**: User code errors in the `ExecutionEngine` are caught and returned in the result object. Do not let these crash the main thread.
2.  **State Immutability**: Always deep-clone states (`JSON.parse(JSON.stringify(state))`) before pushing to the timeline to prevent reference-sharing bugs during playback.
3.  **Visualization Reset**: Any parsing error MUST trigger `resetEverything()` in `main.js` to clear stale visualizations.
4.  **CSS Scope**: Global styles are in `style.css`. Avoid inline styles; use CSS variables (tokens) for theme consistency.

---

## 🚀 Portability Guide (New Instance Setup)

If cloning this repo to a new system:
1.  Run `npm install`.
2.  Start with `npm run dev`.
3.  **Check Browser Console**: The engine logs instrumentation results there.
4.  **Rule Enforcement**: Consult `docs/architecture.md` for logic flow and `docs/bug_fix_log.md` for known pitfalls.

---

## ⚠️ Restricted Actions

- **Do NOT** modify `src/prism.js` without deep knowledge of WebGL/Shaders.
- **Do NOT** remove `recordState` instrumentation from the `ExecutionEngine`.
- **Do NOT** bypass `InputParser` in the `main.js` execution flow.

---

*Last Updated: 2026-03-15 by Antigravity*
