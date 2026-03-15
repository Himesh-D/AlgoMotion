# AlgoMotion Bug Fix Log

This document records technical issues identified and resolved during the codebase audit and repair session.

---

## 1. Lack of Numeric Validation in Array Mode
**Bug:**
Users can enter non-numeric characters in "Array" mode, causing the execution engine to produce `NaN` states during arithmetic operations.

**Cause:**
The input parser previously only split the input by commas without validating if the resulting elements were valid numbers before algorithm execution.

**Fix:**
Implemented `InputParser.parseArray` which iterates through elements and throws a descriptive error if a non-numeric value is found (unless it's a quoted string). Added `try...catch` in `main.js` to handle these errors.

**Prevention:**
Strict validation at the parser level; any invalid input now prevents execution and displays a clear error message in the UI.

---

## 2. Visualization Persistence on Error
**Bug:**
When an input error (like an empty array) was triggered, the previous algorithm's visualization remained on screen.

**Cause:**
The `runVisualization` function returned early on error without clearing the current renderer or timeline states.

**Fix:**
Modified `main.js` to call `resetEverything()` immediately when a parsing or validation error occurs.

**Prevention:**
Enforced a "reset-on-failure" policy in the main orchestration logic.

---

## 3. Potential State Desync in Animations
**Bug:**
Rapidly clicking "Next" or "Previous" could lead to overlapping animations or pointers not updating correctly.

**Cause:**
The `ArrayRenderer` didn't always cancel pending animations before starting new ones for the same element, and some pointer removal logic was conditional.

**Fix:**
Enhanced `ExecutionEngine` to use deep cloning for all state captures. Updated `ArrayRenderer` to more aggressively clear animations and ensure pointers are properly tracked/removed in `renderState`.

**Prevention:**
Isolated algorithm state from the visualization rendering loop via deep clones and enforced explicit pointer cleanup.

---

## 4. UI Layout Breadcrumb Overlap
**Bug:**
The mode indicator (`Array -> Two Pointers`) could overlap with other elements when the sidebar was expanded or on smaller screens.

**Cause:**
Missing `overflow: hidden` and `text-overflow: ellipsis` on the status pill text components.

**Fix:**
Updated `style.css` to add `min-width: 0`, `overflow: hidden`, and `text-overflow: ellipsis` to the status pill sections.

**Prevention:**
Standardized responsive CSS patterns for floating status elements.
---

## 5. CSS Syntax Error in Status Pill
**Bug:**
The application could fail to render or show a broken layout due to an invalid CSS property in the `.status-pill`.

**Cause:**
A `box-shadow:` property was left empty during a previous style refactor move.

**Fix:**
Removed the empty property and consolidated the glassmorphic styles in `style.css`.

**Prevention:**
Enforced clean property declarations; visual verification now includes checking the "Status Pill" rendering specifically.

---

## 6. Redundant Demo UI Logic
**Improvement:**
The "Demo" dropdown was functionally redundant with the "Algorithm Type" selector and occupied valuable header space.

**Fix:**
Removed the "Demo" button/dropdown. Integrated "Example Data" (array/string presets) directly into the `ALGO_OPTIONS` metadata in `main.js`. Selecting an algorithm now automatically populates high-quality test data.

**Benefit:**
Streamlined header UI and unified the user journey for exploration.
