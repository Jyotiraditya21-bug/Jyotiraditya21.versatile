# stark-editorial-portfolio

A state-of-the-art, interactive portfolio for an **AI/ML & Agentic Systems Architect**. Inspired by the high-contrast, bold, editorial layout of *Anthem Creative*, this site focuses on visual precision, rich typography pairings, and tactile micro-interactions.

---

## 🌟 Key Features

### 1. Cybernetic HUD Control Dashboard (Profile Section)
The profile portrait box has been redesigned as a highly interactive **Agentic Control Dashboard**:
- **Grid Scan Backplate**: Holographic 20px matrix grid backplate and a vertical scanning CRT lens overlay.
- **Simulated Real-Time Logs Console**: A scrolling terminal console showing live simulated agent logs (`> querying ChromaDB`, `> Tavily search request sent`, etc.) that stream automatically.
- **Attraction & Reset Controls**: 
  - **ATTRACT** button toggles mouse attraction fields on the canvas network dynamically.
  - **RESET** button wipes and re-populates the particle network.

### 2. Playful Interactive Neural Canvas
- Glow-particle nodes (representing `agent`, `planner`, `llm`, `memory`, etc.) drift smoothly and automatically draw connection vectors when close to each other.
- Move your cursor over the canvas to draw surrounding agent nodes into an attraction field.
- Click anywhere on the canvas to trigger a node burst, spawning 5 new concept nodes that ripple outwards.
- Connections feature traveling "data packets" (neon light dots sliding fractionally along active lines).

### 3. Animated Agentic Flow Pipeline
- A custom horizontal flowchart illustrating an active agent execution loop:
  `input 📥` ➔ `planner 🧠` ➔ `tools 🛠️` ➔ `rag 📚` ➔ `llm ⚡`
- Nodes cycle through active highlighted states sequentially every 2.5 seconds, firing glowing packet sweeps along the paths.

### 4. Premium Micro-Animations
- **Lenis Smooth Scroll**: Inertial momentum smooth scrolling across viewports.
- **Aesthetic Cursor Follower**: A minimalist circular ring tracking the cursor with spring easing, morphing into solid accent bubbles on link hovers.
- **3D Card Perspectives**: Project mockup cards tilt dynamically in 3D perspective based on pointer positions.
- **Heading reveals**: Titles slide up elegantly line-by-line from hidden overflow masks when entering the viewport.
- **Magnetic buttons**: Interactive items (logo, toggles, buttons, links) are physically pulled towards the cursor on hover.
- **Gauges & Meters**: Statistics percentages animate and fill custom gold progress meters upon scrolling.

---

## 🛠️ Tech Stack
- **Core**: HTML5, Vanilla ES6 JavaScript, Vanilla CSS3 (Custom properties, grid systems, keyframe animations)
- **External Script Libraries**: [Lenis.js](https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.min.js) (Inertia scrolling)

---

## 🚀 Local Run
Simply clone the repository and open `index.html` in any modern web browser:
```bash
open index.html
```

---

## 🌐 Automatic Deployment (GitHub Pages)
This repository is configured to deploy automatically via GitHub Actions.
1. Push any commit to the `main` branch.
2. Go to your repository settings on GitHub, select **Pages**, and set the Source to **GitHub Actions**.
3. The workflow will build and host your portfolio live on the web in seconds!
