# AlgoMotion 📊✨

**Interactive Algorithm Execution Visualizer**

AlgoMotion is a browser-based tool that visually simulates how algorithms manipulate arrays and strings step-by-step. It helps developers and students debug logic through animated execution rather than manual dry runs.

![AlgoMotion Landing Page](public/screenshots/landing_page.png)

## 🚀 Key Features

- **Immersive Intro Animation**: A high-performance spiral particle system powered by React and GSAP that welcomes users into the algorithm space.
- **Modernized Landing Page**: A premium, glassmorphic UI overhaul with smooth transitions and a responsive multi-section layout.
- **Interactive Workspace**: Input your own arrays, strings, and parameters.
- **Custom Logic Execution**: Write or edit algorithm snippets in JavaScript and see them executed in real-time.
- **Visual Execution Timeline**: Navigate through the algorithm's execution with Play, Pause, Next, and Previous controls.
- **Variable Inspector**: Track variable changes (like pointers, sums, and indices) via floating chips and explanation cards.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript (Engine/Visualizer) + React (Intro/Landing UI)
- **Animation**: [GSAP](https://greensock.com/gsap/) (Spiral Intro), [Anime.js](https://animejs.com/) (Algorithm Steps)
- **Graphics**: [OGL](https://github.com/oframe/ogl) (WebGL Raymarching background)
- **Styling**: Modern CSS with Glassmorphism, Tailwind CSS support, and Staggered Animations
- **Bundler**: [Vite](https://vitejs.dev/)
- **Language**: JavaScript & TypeScript support

## 🏃 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- Familiarity with JavaScript

### Installation & Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/algomotion.git
    cd algomotion
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000/`.

The application will be available at `http://localhost:3000/`.

## 📜 Documentation

Detailed technical information can be found in the `docs/` directory:

- [Architecture Overview](file:///d:/My_Projects/ALGO_CODE/docs/architecture.md)
- [Input Parsing & Validation](file:///d:/My_Projects/ALGO_CODE/src/engine/InputParser.js)
- [Bug Fix Log (Audit Session)](file:///d:/My_Projects/ALGO_CODE/docs/bug_fix_log.md)

## 🔮 Future Roadmap

We are committed to making AlgoMotion the ultimate multi-language visualization platform. Upcoming features include:

- **🐍 Python Support**: Execute and visualize Python snippets using [Pyodide](https://pyodide.org/).
- **☕ Java Support**: Implement client-side Java execution via [CheerpJ](https://cheerpj.com/).
- **📈 Graph & Tree Visualizations**: Expand beyond arrays and strings to support complex data structures.
- **☁️ Cloud Sync**: Save and share your custom algorithms and simulation states.

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature suggestion, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
