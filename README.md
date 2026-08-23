# 🏑 Roller Hockey Tactics Board (Quadro Tático de Hóquei em Patins)

An interactive, high-performance tactical board web application specifically engineered for **Roller Hockey** (*Hóquei em Patins* / *Rink Hockey*). Built with React Three Fiber (orthographic 3D/2D top-down view), Zustand, and Tailwind CSS.

[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.173.0-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Key Features

### 1. 🏟️ Official World Skate (FIRS) Rink Geometry
- **2:1 Aspect Ratio (40m × 20m)** with rounded corners.
- **Behind-the-Net Play:** Official **3.0m clearance** between the back boards and goal lines (`x = ±17.0m`).
- **Standard Court Markings:**
  - Center circle (`radius = 3.0m`) and center line.
  - Semicircular Goalkeeper Crease (`radius = 1.5m`).
  - Penalty Area and Penalty Spot (*Grande Penalidade*, 5.4m).
  - Direct Free-Hit Spot (*Livre Direto*, 7.4m).
  - 1.70m × 1.05m Inset Goal Cages.
- **Visual Themes:** Switch between **Parquet Wood Floor** and **Modern Dark Tactical Board**.

### 2. 👥 5v5 Team Management & Player Customization
- Full team rosters: **Home (Red)** & **Away (Blue)** (1 GK + 4 Outfield Players each).
- **Smooth Drag-and-Drop** with automatic boundary clamping.
- **Interactive Facing Angle (Rotation Handle)** for indicating vision and body orientation.
- **Player Inspector:** Edit player names, jersey numbers, and toggle roles (`GK` / `FP`).

### 3. 🎯 Smart Ball Dynamics
- High-visibility orange roller hockey ball token.
- Drag freely across the rink or **magnetically attach to any player** for possession movement.

### 4. ✏️ Tactical Drawing & Annotation Suite
- **Pass Vectors:** Dashed arrows indicating direct or lobbed passes.
- **Movement Arrows:** Solid tactical run indicators.
- **Curved Skating Routes:** Quadratic Bezier curves for wrap-arounds and rotational runs.
- **Tactical Zones:** Shaded tactical areas for defensive blocks and offensive pockets.
- **Eraser Tool:** Remove annotations with a single click.
- **Color Palette:** Custom line colors (Yellow, Cyan, Emerald, Orange, Crimson, White).

### 5. 🎬 Step-by-Step Keyframe Animator & Playback
- Construct multi-phase plays (*Setup ➔ Rotation ➔ Shot*).
- **Real-time LERP interpolation:** Smooth player and ball movement transitions.
- Play, pause, step scrubbing, speed selector (`0.5x`, `1.0x`, `1.5x`, `2.0x`), and loop mode.
- Duplicate, reorder, rename, and customize duration for each step.

### 6. 📋 Instant Tactical Presets
- **Square / Box (2-2)**
- **Diamond (1-2-1)**
- **Triangle + 1 (1-1-2 / Y-Formation)**
- **Power Play (4v3)** & **Free Hit Defensive Wall**
- **Flip Sides:** Instant horizontal court flip for period changes.

### 7. 💾 JSON Import / Export
- Export complete tactical plays (positions, steps, annotations, player metadata) to JSON.
- Import and share tactical files with coaches and players.
- Copy tactical payload directly to clipboard.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Vite** | Next-generation frontend build tooling |
| **React 18** | UI component architecture |
| **TypeScript** | Type safety and domain models |
| **React Three Fiber (R3F)** | Declarative 3D/2D top-down WebGL rendering |
| **@react-three/drei** | Camera controls, 3D text labels, and vector lines |
| **Zustand** | Centralized reactive tactical store & animation state |
| **Tailwind CSS** | Modern UI styling and responsive controls |
| **Lucide React** | Tactical icons and UI controls |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vitorstick/tabletop-hoquei.git
   cd tabletop-hoquei
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🎮 Controls & Shortcuts

| Action | Control |
|---|---|
| **Select Token** | Click on any player or ball |
| **Move Token** | Click and drag token across the rink |
| **Rotate Player** | Select player, then drag the orange rotation handle |
| **Attach Ball to Player** | Click the Ball Attachment button in the player inspector or toolbar |
| **Draw Pass / Arrow** | Select drawing tool from toolbar and drag on rink |
| **Erase Annotation** | Select Eraser tool and click on any annotation |
| **Play / Pause Animation** | Click Play button in the bottom timeline |
| **Toggle Theme** | Click Theme switch in the top header |

---

## 📂 Project Architecture

```text
table-manager/
├── src/
│   ├── components/
│   │   ├── Board/
│   │   │   ├── Annotations/
│   │   │   │   └── TacticalAnnotations.tsx # Passing vectors, arrows & zone drawings
│   │   │   ├── Rink/
│   │   │   │   ├── RinkBarriers.tsx       # Perimeter barriers & rounded corners
│   │   │   │   ├── RinkFloor.tsx          # Floor texture & World Skate markings
│   │   │   │   └── RinkGoals.tsx          # 1.70x1.05m goal structures
│   │   │   ├── Tokens/
│   │   │   │   ├── BallToken.tsx          # Ball token with possession attachment
│   │   │   │   └── PlayerToken.tsx        # Player discs, numbers, labels & rotation
│   │   │   └── TacticsCanvas.tsx          # R3F Orthographic Canvas
│   │   └── UI/
│   │       ├── ExportImportModal.tsx      # JSON import/export dialog
│   │       ├── Header.tsx                 # App header & theme controls
│   │       ├── PlayerInspector.tsx        # Player metadata editor
│   │       ├── PresetsBar.tsx             # Formation preset quick-buttons
│   │       ├── TimelineControls.tsx       # Keyframe animation & playback controls
│   │       └── Toolbar.tsx                # Drawing tools & color selector
│   ├── constants/
│   │   ├── formations.ts                  # Standard formation coordinates
│   │   └── rinkDimensions.ts              # 40x20m court dimension constants
│   ├── hooks/
│   │   └── usePlayAnimation.ts            # LERP animation loop hook
│   ├── store/
│   │   └── useTacticsStore.ts             # Central Zustand store
│   ├── types/
│   │   └── tactics.ts                     # TypeScript interfaces
│   ├── App.tsx                            # Root application component
│   └── main.tsx                           # App entry point
├── SPEC.md                                # Detailed technical specification
└── package.json
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
