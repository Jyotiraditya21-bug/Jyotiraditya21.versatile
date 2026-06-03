# Stark-Editorial-Portfolio

A state-of-the-art, interactive portfolio for an **AI/ML & Agentic Systems Architect**. Inspired by the high-contrast, bold, editorial layout of *Anthem Creative*, this site focuses on visual precision, rich typography pairings, and a highly synchronized tactile micro-interaction system.

---

## 🌟 Key HUD Features

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

---

## ✨ Animation & Transition Specification

The website uses a custom-engineered animation system written in pure CSS3 and Vanilla ES6. Below are the technical transition formulas, easing curves, and coordinate math equations utilized across the site:

### 1. Easing Curves & Timing Functions
- **Fluid Easing Curve (`--ease-fluid`)**: 
  ```css
  --ease-fluid: cubic-bezier(0.25, 1, 0.5, 1);
  ```
  This is a custom-tailored quintic easing curve that provides a rapid initial acceleration followed by an extended, smooth deceleration, making all reveals, button hovers, and cursor morphs feel organic.
- **Lenis Easing Formula**:
  ```javascript
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  ```
  An exponential decay formula (`easeOutExpo`) applied to the viewport scroll event. It removes linear scroll steps and creates a fluid, momentum-based scrolling experience.

### 2. Keyframe Animations
- **CRT Scanline Sweep (`scan`)**:
  Slowly sweeps an opacity-gradient light beam down the height of the HUD panel, looping infinitely.
  ```css
  @keyframes scan {
      0% { transform: translateY(-80px); }
      100% { transform: translateY(600px); }
  }
  ```
- **Agent Flow Packet Stream (`flow-packet`)**:
  Simulates a data packet traveling between horizontal node gateways, utilizing a linear progress factor coupled with keyframe opacity fading.
  ```css
  @keyframes flow-packet {
      0% { left: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
  }
  ```
- **Hero Keyword Rotation (`rotate-words-list`)**:
  Smoothly slides a vertical list of skills using stepped translations synchronized with keyframe delays:
  ```css
  @keyframes rotate-words-list {
      0%, 22% { transform: translateY(0); }
      25%, 47% { transform: translateY(-1.4em); }
      50%, 72% { transform: translateY(-2.8em); }
      75%, 97% { transform: translateY(-4.2em); }
      100% { transform: translateY(-5.6em); }
  }
  ```

### 3. Mouse Coordinate Mathematics

#### A. 3D Perspectival Card Tilt
When hovering over terminal previews, mouse coordinates are normalized relative to the card's center boundary. This normalized offset ($X_c, Y_c$ in a range of $[-1, 1]$) is then mapped to rotation degrees ($6^\circ$ max) to pivot the container in 3D perspective:
$$\Delta X_{coord} = \left(\frac{X_{mouse}}{Width_{rect}} - 0.5\right) \times 2$$
$$\Delta Y_{coord} = \left(\frac{Y_{mouse}}{Height_{rect}} - 0.5\right) \times 2 \times -1$$
```javascript
const tiltX = yc * 6; // pitch rotation
const tiltY = xc * 6; // yaw rotation
card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
```

#### B. Physics-Based Magnetic Pull
Interactive elements pull toward the cursor using a distance coefficient offset ($35\%$ attraction force). When the cursor leaves the target radius, the element transitions back to center point coordinates:
$$X_{pull} = \left(X_{mouse} - X_{center}\right) \times 0.35$$
$$Y_{pull} = \left(Y_{mouse} - Y_{center}\right) \times 0.35$$
```javascript
el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
```

#### C. Custom Cursor Position Lerping
The circular cursor follower lags behind the native hardware pointer using Linear Interpolation (`lerp`) updated on every animation frame:
$$Pos_{current} = Pos_{current} + \left(Pos_{target} - Pos_{current}\right) \times 0.15$$
```javascript
followerPos.x += (mousePos.x - followerPos.x) * 0.15;
followerPos.y += (mousePos.y - followerPos.y) * 0.15;
```

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

## 🌐 Automatic Deployment (GitHub Actions)
This repository is configured to deploy automatically via GitHub Actions.
1. Push any commit to the `main` branch.
2. Go to your repository settings on GitHub, select **Pages**, and set the Source to **GitHub Actions**.
3. The workflow will build and host your portfolio live on the web in seconds!
