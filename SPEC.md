# 2D/3D Top-Down Roller Hockey (Hóquei em Patins) Tactics Board — Technical Specification

## 1. Project Overview & Architecture
A high-performance tactical board web application specifically engineered for **Roller Hockey** (*Hóquei em Patins* / *Rink Hockey*). Built with a top-down orthographic 3D rendering pipeline combined with reactive UI controls for match planning, set-piece design, training drills, and tactical animation playback.

### Core Tech Stack
- **Framework & Bundler:** Vite + React 18 + TypeScript
- **Render Engine:** **React Three Fiber (R3F)** (`@react-three/fiber`, `three`) with a fixed **Top-Down Orthographic Camera**
- **3D Helper Ecosystem:** **`@react-three/drei`**
  - `<Text>` for crisp vector player numbers, names, and roles
  - `<Line>` & `<QuadraticBezierLine>` for tactical passing vectors, skating runs, and directional chevrons
  - `<OrthographicCamera>` for mathematically true 2D whiteboard rendering without perspective distortion
- **State Management:** **Zustand** reactive store for token positions, animations, step keyframes, annotations, presets, and serialization
- **Styling & UI:** Tailwind CSS + `clsx` + `tailwind-merge` + `lucide-react` icons

---

## 2. Rink Geometry & Visual Specifications (World Skate / FIRS Standards)

### Dimensions & Coordinate Space
- **Standard Roller Hockey Rink Ratio:** **2:1** (40.0m × 20.0m).
- **Coordinate Space:** Plane on XZ axis:
  - Width: `40.0m` (`x ∈ [-20.0, 20.0]`)
  - Height / Depth: `20.0m` (`z ∈ [-10.0, 10.0]`)
  - Corner Radius: `1.5m` rounded rink corners.

### Surface & Court Markings
- **Themes Supported:**
  - `parquet`: Warm polished wood / parquet board finish with standard contrast lines.
  - `modern-dark`: High-contrast dark tactical board styling.
- **Outer Barriers:** Rounded perimeter fence with corner arcs.
- **Center Court:** Red dividing line at `x = 0`, center spot, and `3.0m` radius center circle.
- **Goal Lines & Behind-the-Net Clearance:**
  - Inset at **`x = ±17.0m`** (strictly preserving the official **3.0m clearance** from end boards for behind-the-net play).
- **Goalkeeper Protection Area (Crease):**
  - Semicircle with **`radius = 1.5m`** extending from the goal line towards center court.
- **Penalty Area:** Rectangular penalty zone surrounding each crease.
- **Penalty Spot (*Grande Penalidade*):** Located **5.4m** from goal line (`x = ±11.6m`).
- **Direct Free-Hit Spot (*Livre Direto*):** Located **7.4m** from goal line (`x = ±9.6m`).
- **Goals (Cages):** 2D/3D visual nets placed at `x = ±17.0m` with official width (`1.70m`) and depth (`1.05m`).

---

## 3. Tokens & Ball System

### Team Composition (5 vs 5)
- **Home Team (5 Tokens):**
  - Goalkeeper (`H1` / GK)
  - 4 Outfield Players (`H2`–`H5` / FP)
  - Default Color: Primary Red / White Accent
- **Away Team (5 Tokens):**
  - Goalkeeper (`A1` / GK)
  - 4 Outfield Players (`A2`–`A5` / FP)
  - Default Color: Royal Blue / White Accent
- **Ball Token:**
  - High-visibility orange spherical disc (`radius: 0.28m`).
  - Supports direct dragging or magnetic attachment to player tokens.

### Interaction & Manipulation
- **Direct Pointer Dragging:** Raycast plane projection with boundary clamping to keep tokens strictly within court walls (`x ∈ [-19.2, 19.2]`, `z ∈ [-9.2, 9.2]`).
- **Facing Rotation:** Dedicated interactive rotation handle attached to selected player token for precise 360° orientation angles.
- **Player Inspector Panel:** Modal / sidebar to customize player name, jersey number, and goalkeeper/field player role.

---

## 4. Tactical Drawing & Annotation Layer

### Available Tool Modes
1. **Select (`select`):** Click and select players or ball to view inspector and rotate.
2. **Move (`move`):** Drag and position players and ball across the rink.
3. **Pass Line (`pass`):** Dashed vector line with directional arrowhead.
4. **Movement Arrow (`arrow`):** Solid tactical directional arrow.
5. **Curved Skating Route (`curve`):** Quadratic bezier curve for skating runs and wrap-arounds.
6. **Tactical Zone (`zone`):** Semi-transparent rectangular / highlighted area for marking defensive zones or attacking pockets.
7. **Eraser (`erase`):** One-click removal of specific drawn annotations.

---

## 5. Play Sequencing & Keyframe Animation System

- **Multi-Step Timeline:** Coaches can construct complex multi-phase tactical routines (e.g. *Step 1: Setup* ➔ *Step 2: Screen & Roll* ➔ *Step 3: Direct Shot*).
- **Interpolation Engine (LERP):**
  - Smooth linear and angular interpolation of player positions, facing angles, and ball trajectory between keyframes.
- **Playback Controls:**
  - Play / Pause toggling.
  - Step progress scrubber (`0%` to `100%`).
  - Playback speed multiplier (`0.5x`, `1.0x`, `1.5x`, `2.0x`).
  - Continuous loop mode toggle.
  - Add, Duplicate, Reorder, Rename, and Delete keyframe steps.

---

## 6. Preset Formations & Quick Tactics

Built-in one-click tactical configurations:
- **Square / Box (2-2):** Balanced classic roller hockey setup.
- **Diamond (1-2-1):** Deep distributor with dynamic wingers and high pivot.
- **Triangle + 1 (1-1-2 / Y-shape):** Offensive overload structure.
- **Power Play (4v3):** Man-advantage offensive spread against a defensive box/triangle.
- **Free Hit Wall:** Set-piece direct free-hit defensive setup.
- **Flip Sides:** Instant horizontal court flip for tactical transitions and period changes.

---

## 7. Data Models & Store Schema

```typescript
export type Team = 'home' | 'away';
export type PlayerRole = 'GK' | 'FP';
export type ToolMode = 'select' | 'move' | 'arrow' | 'pass' | 'curve' | 'zone' | 'erase';

export interface Vector2D {
  x: number;
  z: number;
}

export interface PlayerData {
  id: string;              // e.g. "H1", "H2", "A1", "A2"
  team: Team;
  role: PlayerRole;
  number: number;
  name: string;
  position: Vector2D;
  rotation: number;        // Angle in radians (facing direction)
}

export interface BallData {
  position: Vector2D;
  attachedToPlayerId: string | null;
}

export type AnnotationType = 'arrow' | 'pass' | 'curve' | 'zone';

export interface TacticalAnnotation {
  id: string;
  type: AnnotationType;
  points: Vector2D[];
  color: string;
  label?: string;
  curvature?: number;
}

export interface PlayStep {
  id: string;
  name: string;
  durationMs: number;
  players: Record<string, { x: number; z: number; rotation: number }>;
  ball: Vector2D;
  ballAttachedTo: string | null;
  annotations: TacticalAnnotation[];
}

export interface TacticsDataExport {
  version: string;
  timestamp: string;
  title: string;
  currentStepIndex: number;
  steps: PlayStep[];
  playersMetadata: Record<string, { team: Team; role: PlayerRole; number: number; name: string }>;
}
```

---

## 8. Project Structure

```text
table-manager/
├── src/
│   ├── components/
│   │   ├── Board/
│   │   │   ├── Annotations/
│   │   │   │   └── TacticalAnnotations.tsx # Lines, curved vectors, zones & labels
│   │   │   ├── Rink/
│   │   │   │   ├── RinkBarriers.tsx       # Perimeter boards & rounded corners
│   │   │   │   ├── RinkFloor.tsx          # Parquet/dark floor & official markings
│   │   │   │   └── RinkGoals.tsx          # Inset 1.70x1.05m goal structures
│   │   │   ├── Tokens/
│   │   │   │   ├── BallToken.tsx          # Interactive orange ball token
│   │   │   │   └── PlayerToken.tsx        # Player discs, numbers, roles & rotation handle
│   │   │   └── TacticsCanvas.tsx          # R3F Orthographic Canvas & drag handlers
│   │   └── UI/
│   │       ├── ExportImportModal.tsx      # JSON load/save & clipboard export
│   │       ├── Header.tsx                 # App bar, title, theme toggle & settings
│   │       ├── PlayerInspector.tsx        # Player metadata editor & role config
│   │       ├── PresetsBar.tsx             # Formation presets & quick setups
│   │       ├── TimelineControls.tsx       # Multi-step animator & playback controls
│   │       └── Toolbar.tsx                # Drawing tools & color palette selector
│   ├── constants/
│   │   ├── formations.ts                  # Preset team coordinates (2-2, 1-2-1, etc.)
│   │   └── rinkDimensions.ts              # 40x20m World Skate dimensional constants
│   ├── hooks/
│   │   └── usePlayAnimation.ts            # LERP playback engine & requestAnimationFrame loop
│   ├── store/
│   │   └── useTacticsStore.ts             # Zustand state store with actions & serialization
│   ├── types/
│   │   └── tactics.ts                     # TypeScript interfaces & types
│   ├── App.tsx                            # Root application layout
│   ├── index.css                          # Tailwind CSS & global styles
│   └── main.tsx                           # React DOM mount point
├── package.json
├── tsconfig.json
└── vite.config.ts
```
