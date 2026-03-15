
---

# Product Title

**AlgoMotion — Interactive Code Execution Visualizer**

Short description:
A browser-based tool that visually simulates how algorithms manipulate arrays and strings step-by-step, helping developers debug logic through animated execution rather than manual dry runs.

---

# Core Idea

When solving algorithm problems (LeetCode-style), developers often **dry run code manually**.

AlgoMotion replaces manual dry runs with a **visual execution timeline**.

Users input:

* array / string
* algorithm logic
* parameters

The system generates **step-by-step execution states** and animates them.

Important rule:

The system **does NOT judge correctness**.
It simply **visualizes the logic flow**.

---

# Target Users

Primary users:

* beginner programmers
* DSA learners
* interview preparation students
* coding bootcamp learners

Secondary users:

* educators explaining algorithms

---

# Problem Solved

Current workflow:

```
write code
↓
manually simulate values
↓
track variables on paper
↓
find logic bugs
```

Problems:

* hard to track pointer movement
* difficult to visualize sliding windows
* variable changes become confusing

Solution:

**visual execution timeline**

---

# Key Features (MVP)

### 1 Input Workspace

User provides:

* array or string
* parameters
* logic snippet

Example:

```
Array: [2,7,11,15]
Target: 9
```

---

### 2 Step Execution Engine

User code produces **execution states**.

Example state:

```
Step 3
i = 1
sum = 9
array = [2,7,11,15]
```

---

### 3 Array Visualization

Animated boxes represent array elements.

Pointer indicators show:

* index
* left/right pointers
* swaps

---

### 4 Variable Inspector

Side panel showing current variable values.

Example:

```
Variables
---------
i = 1
sum = 9
target = 9
left = 0
right = 2
```

---

### 5 Execution Timeline

Controls:

```
Play
Pause
Next
Previous
Reset
```

---

### 6 Step History

Shows step list.

Example:

```
Step 1
Step 2
Step 3
Step 4
```

Clicking a step jumps to it.

---

# What the System Will NOT Do

For MVP:

* No login
* No database
* No cloud storage
* No user accounts
* No correctness validation
* No full programming language parsing

Everything runs **locally in the browser**.

---

# Tech Stack

Frontend:

* HTML
* CSS
* JavaScript

Animation:

* Anime.js

Optional enhancements:

* Monaco Editor
* Prism.js

Visualization:

* DOM + CSS transforms

No backend required.

---

# System Architecture

High-level architecture:

```
User Input
   ↓
Execution Engine
   ↓
State Timeline
   ↓
Visualizer
   ↓
Animation Renderer
```

---

## Module Breakdown

### 1 Input Module

Handles:

* array parsing
* parameter input
* code snippet

Output:

```
user configuration object
```

Example:

```
{
 array:[2,7,11,15],
 target:9
}
```

---

### 2 Execution Engine

Runs algorithm logic and generates **states**.

Example output:

```
[
 {i:0,sum:0},
 {i:0,sum:2},
 {i:1,sum:2},
 {i:1,sum:9}
]
```

---

### 3 State Timeline Manager

Stores all steps.

Functions:

```
nextStep()
previousStep()
goToStep(n)
reset()
```

---

### 4 Visual Renderer

Responsible for drawing:

* array
* pointers
* highlights
* variable panel

---

### 5 Animation Engine

Uses Anime.js to animate:

* pointer movement
* array highlighting
* swaps
* window expansion

---

# UI Layout

Main layout:

```
-------------------------------------
 Header
-------------------------------------

  Editor        Visualization
  Panel          Canvas

-------------------------------------
 Variables | Timeline | Controls
-------------------------------------
```

---

# Navigation Flow

### Step 1

User opens app.

Landing screen:

```
Start Visualizing
View Demo
```

---

### Step 2

Workspace loads.

User enters:

```
Array input
Parameters
Logic snippet
```

---

### Step 3

User presses:

```
Run Visualization
```

---

### Step 4

System generates execution states.

Visualizer begins.

---

### Step 5

User navigates execution using:

```
Play
Next
Previous
Reset
```

---

# UI Theme

Goal:

Minimal but slightly playful.

Style inspiration:

* developer tools
* futuristic dashboards

---

## Color Palette

Background:

```
#0f172a
```

Gradient surfaces:

```
#1e293b → #0f172a
```

Accent colors:

```
Neon blue
#38bdf8
```

```
Purple
#a78bfa
```

```
Pink
#f472b6
```

Array element highlight:

```
#22c55e
```

Pointer color:

```
#facc15
```

---

# UI Components

### Array Boxes

Style:

```
rounded
glass effect
soft shadow
```

Example:

```
[ 2 ] [ 7 ] [ 11 ] [ 15 ]
```

Hover animation:

```
scale 1 → 1.08
```

---

### Pointer Indicator

Triangle marker above element.

Animated movement.

---

### Variable Panel

Glass panel.

Example:

```
Variables
---------
i = 1
sum = 9
target = 9
```

---

### Timeline Slider

Horizontal bar showing step progress.

Example:

```
[====----]
Step 3 / 8
```

---

# Animation Design

Pointer movement:

```
translateX animation
300ms ease-in-out
```

Array highlight:

```
glow effect
pulse animation
```

Window expansion:

```
border expansion
```

Swap animation:

```
elements slide across positions
```

---

# UX Principles

1 clarity first
2 minimal controls
3 immediate visual feedback
4 no unnecessary complexity

---

# Example Demo Scenario

User input:

```
Array: [2,7,11,15]
Target: 9
```

Algorithm:

```
Two sum logic
```

Visualization:

```
Step 1
i = 0
sum = 2

Step 2
i = 1
sum = 9
target found
```

Pointer moves.

Array element glows.

---

# Performance Requirements

* Must run smoothly on laptop browsers
* Animations under **16ms frame time**
* Steps precomputed before playback

---

# Future Extensions (Not MVP)

Possible upgrades:

* real code parsing
* AST execution
* recursion visualization
* graph algorithms
* linked list animations

---

# MVP Development Plan

Phase 1

```
array renderer
pointer animation
```

Phase 2

```
state timeline
step navigation
```

Phase 3

```
variable inspector
```

Phase 4

```
code input UI
```

# Development Rules & Documentation Requirements

## Environment Setup

1. Before starting development, install all required dependencies.
2. The project must be configured to run using:

```

npm install
npm run dev

```

3. Ensure all required packages are installed automatically through `package.json`.
4. The project must run locally without any manual configuration beyond dependency installation.

---

## Project Execution Requirement

The application **must run in development mode using:**

```

npm run dev

```

This should start the local development server and launch the application in the browser.

Requirements:

- Fast development server
- Hot module reload (HMR)
- Immediate reflection of code changes
- Clear console logging for errors

---

## Dependency Installation Rule

Before any development begins:

1. Install all required dependencies.
2. Ensure the following types of dependencies are configured if needed:
   - framework dependencies
   - animation libraries
   - UI utilities
   - development tools
3. All dependencies must be properly declared in `package.json`.

Example workflow:

```

npm install
npm run dev

```

No additional manual setup should be required.

---

# Documentation Rules

## Mandatory Documentation Policy

Every major step of development must be documented.

Documentation must include:

- what was implemented
- why the implementation was done
- how the feature works
- important technical decisions
- any assumptions made

Each module must include clear explanation comments or markdown documentation.

---

## Step Documentation Requirement

Each development stage must contain documentation structured like:

```

Step Name
Purpose
Implementation Details
Files Created/Modified
Expected Behavior

```

Example:

```

Step: Array Visualization Engine

Purpose:
Render arrays visually as interactive boxes.

Implementation:
Created array rendering component that maps array elements to UI boxes.

Files:
components/ArrayRenderer.js

Expected Result:
Array elements appear as animated boxes in the visualization panel.

```

---

## Error Documentation Rule

Every encountered error must be documented with the following format:

```

Error Description
Root Cause
Solution Applied
Files Modified
Prevention Strategy

```

Example:

```

Error:
Array animation jittering during pointer movement.

Cause:
Incorrect transform calculations.

Fix:
Adjusted animation timing and transform values.

Prevention:
Add animation state validation before rendering.

```

This ensures reproducibility and easier debugging.

---

## Improvement Documentation Rule

Whenever improvements or refactoring are performed, documentation must include:

```

What was improved
Why improvement was necessary
How the improvement affects performance or UX

```

Example:

```

Improvement:
Optimized rendering of array elements.

Reason:
DOM updates were causing unnecessary re-renders.

Impact:
Smoother animation and improved frame rate.

```

---

# Development Discipline Rules

1. Never skip documentation for a completed feature.
2. Always document the reasoning behind design decisions.
3. Maintain clear code comments for complex logic.
4. Ensure documentation is updated whenever code changes occur.
5. Any debugging or bug fixes must be recorded in the documentation.

---

# Development Workflow

1. Install dependencies

```

npm install

```

2. Start development server

```

npm run dev

```

3. Implement features step-by-step

4. Document each step

5. Record any encountered errors

6. Document improvements when changes are made

---

# Goal of These Rules

These rules ensure:

- structured development
- easy debugging
- reproducible fixes
- clear understanding of the system
- maintainable codebase
```

