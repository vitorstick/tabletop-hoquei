# 2D/3D Top-Down Roller Hockey (Hóquei em Patins) Tactics Board — Specification & Architecture

## 1. Project Overview & Tech Stack
- **Framework / Bundler:** Vite + React + TypeScript
- **Core Engine:** **React Three Fiber (R3F)** (`@react-three/fiber`, `three`, `@types/three`) configured with a fixed **Top-Down Orthographic Camera**
- **3D/2D Helper Ecosystem:** **`@react-three/drei`**
  - `<Text>` for crisp player numbers, names, and roles on tokens
  - `<Line>` / `<QuadraticBezierLine>` for tactical passing lines & movement arrows
  - `<OrthographicCamera>` with fixed top-down framing (perfect 2D tactical whiteboard look)
- **State Management:** **Zustand** for reactive board state, token positions, formation presets, multi-step playback, and JSON import/export
- **Styling & UI:** Tailwind CSS + `lucide-react` for coaching tools and controls

---

## 2. Rink Geometry & Visual Specifications (World Skate / FIRS Standards)

### Dimensions & Proportions
- **Standard Roller Hockey Rink Ratio:** **2:1** (40m × 20m).
- **Coordinate Space:** Plane on XZ (or XY) plane: Width = `40` (`x ∈ [-20, 20]`), Height = `20` (`z ∈ [-10, 10]`).

### Surface & Court Markings
- **Floor Material:** Warm polished wood / parquet or clean matte floor (`MeshStandardMaterial` / `MeshBasicMaterial`).
- **Outer Barriers:** Rounded rectangle border with corner radius (1–3m).
- **Central Half-Court Line:** Red dividing line at `x = 0` with center spot and circle (radius ~3m).
- **Goal Lines & Behind-the-Net Clearance:**
  - Inset at **`x = ±17.0`** (exactly 3.0m clearance from end boards for full behind-the-net play).
- **Goalkeeper Protection Area (Crease):**
  - Semicircle with **`radius = 1.5m`** extending from the goal line towards center court.
- **Penalty Area:** Rectangular penalty zone lines surrounding each crease.
- **Penalty Spot (*Grande Penalidade*):** Located **5.4m** from goal line (`x = ±11.6`).
- **Direct Free-Hit Spot (*Livre Direto*):** Located **7.4m** from goal line (`x = ±9.6`).
- **Goals (Cages):** Distinct 2D/3D net outlines placed inset at `x = ±17.0`.

---

## 3. Player & Ball Tokens

### Team Composition (5 vs 5)
- **Home Team:** 5 tokens (1 Goalkeeper `GK` / `H1` + 4 Outfield Players `H2`–`H5`), styled in Red with white lettering.
- **Away Team:** 5 tokens (1 Goalkeeper `GK` / `A1` + 4 Outfield Players `A2`–`A5`), styled in Blue with white lettering.
- **Ball:** 1 high-visibility orange spherical/circular token (`radius: 0.28`).

### Token Aesthetics & Structure
- **Mesh:** Top-down circular disc (`<cylinderGeometry args={[0.75, 0.75, 0.2, 32]} />` or circle mesh).
- **Labels:** Rendered via `@react-three/drei`'s `<Text>` component on top of the disc.
- **Orientation Indicator:** Directional chevron or subtle notch indicating player facing direction.

---

## 4. Interaction & Controls

### Top-Down Drag & Drop Mechanics
- Pointer events handled directly on token meshes (`onPointerDown`, `onPointerMove`, `onPointerUp`).
- Direct mapping of pointer screen coordinates to rink `(x, z)` plane.
- **Boundary Clamping:** Token positions constrained strictly within the rink perimeter (`x ∈ [-19.2, 19.2]`, `z ∈ [-9.2, 9.2]`).
- **Fixed Viewport:** Top-down orthographic camera perfectly framed to the 40×20 rink without requiring 3D camera rotations or complex presets.

---

## 5. Tactical Features

1. **Preset Formations:**
   - One-click buttons to load standard Roller Hockey setups:
     - **Square / Box (2-2)**
     - **Diamond (1-2-1)**
     - **Triangle + 1 (1-1-2 / Y-shape)**
     - **Power Play (4v3)** & **Free Hit Defensive Wall**
2. **Drawing & Annotation Layer:**
   - Pass lines (dashed lines with arrowheads)
   - Skating routes (curved arrows)
   - Tactical highlight zones (semi-transparent colored areas)
3. **Step-by-Step Play Sequencing (Keyframes):**
   - Build multi-phase plays (`Step 1: Setup` ➔ `Step 2: Rotation` ➔ `Step 3: Shot`).
   - Animated LERP playback between steps with adjustable speed.
4. **Ball Attachment:**
   - Toggle to lock the ball to a player token while dragging.

---

## 6. TypeScript Data Models & Zustand Store Schema

```typescript
export type Team = 'home' | 'away';
export type PlayerRole = 'GK' | 'FP';
export type ToolMode = 'select' | 'move' | 'arrow' | 'pass' | 'zone';

export interface PlayerPosition {
  id: string;              // e.g. "H1", "A3"
  team: Team;
  role: PlayerRole;
  number: number;
  name?: string;
  position: { x: number; z: number };
  rotation: number;        // Angle in radians (facing direction)
  hasBall?: boolean;
}

export interface TacticalAnnotation {
  id: string;
  type: 'arrow' | 'pass' | 'curve' | 'zone';
  points: Array<{ x: number; z: number }>;
  color: string;
}

export interface PlayStep {
  id: string;
  name: string;
  durationMs: number;
  players: Record<string, { x: number; z: number; rotation: number }>;
  ball: { x: number; z: number };
  annotations: TacticalAnnotation[];
}

export interface BoardState {
  currentStepIndex: number;
  steps: PlayStep[];
  selectedTokenId: string | null;
  activeTool: ToolMode;
  
  // Actions
  setPlayerPosition: (id: string, pos: { x: number; z: number }) => void;
  setPlayerRotation: (id: string, angle: number) => void;
  setBallPosition: (pos: { x: number; z: number }) => void;
  applyFormation: (formationName: string) => void;
  addStep: () => void;
  setStep: (index: number) => void;
  addAnnotation: (annotation: TacticalAnnotation) => void;
  clearAnnotations: () => void;
  exportStateJSON: () => string;
  importStateJSON: (json: string) => void;
}
```

---

## 7. Streamlined Project Directory Structure

```text
table-manager/
├── src/
│   ├── components/
│   │   ├── UI/
│   │   │   ├── Header.tsx          # App bar, title & Import/Export actions
│   │   │   ├── Toolbar.tsx         # Select, Move, Arrow, Pass, Zone tools
│   │   │   ├── PresetsBar.tsx      # Formations (2-2, 1-2-1, Power Play)
│   │   │   └── TimelineControls.tsx# Steps, Play/Pause, Speed slider
│   │   └── Board/
│   │       ├── TacticsCanvas.tsx   # Top-down Orthographic Canvas
│   │       ├── Rink/
│   │       │   ├── RinkFloor.tsx   # Parquet surface & official court lines
│   │       │   ├── RinkBarriers.tsx# Rounded outer perimeter border
│   │       │   └── RinkGoals.tsx   # Inset goal markings at x=±17
│   │       ├── Tokens/
│   │       │   ├── PlayerToken.tsx # Disc token, drei/Text label & direction chevron
│   │       │   └── BallToken.tsx   # Orange ball token with drag support
│   │       └── Annotations/
│   │           └── TacticalArrows.tsx # Passing & movement arrows (drei/Line)
│   ├── constants/
│   │   ├── formations.ts           # Preset coordinates (2-2, 1-2-1, etc.)
│   │   └── rinkDimensions.ts       # 40x20 dimensions & line offset constants
│   ├── hooks/
│   │   ├── useDragToken.ts         # Direct plane pointer drag & boundary clamping
│   │   └── usePlayAnimation.ts     # Step-by-step LERP transition hook
│   ├── store/
│   │   └── useTacticsStore.ts      # Zustand state store
│   ├── types/
│   │   └── tactics.ts              # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 8. Implementation Roadmap

1. **Phase 1: Project Scaffolding & Top-Down Canvas**
   - Initialize Vite + React + TypeScript + Tailwind CSS.
   - Install `@react-three/fiber`, `@react-three/drei`, `three`, `zustand`, `lucide-react`.
   - Setup fixed Top-Down `<OrthographicCamera>` framed to the 40×20 rink.
2. **Phase 2: 2D Rink & Markings**
   - Build `<RinkFloor />` with parquet texture and official Roller Hockey court markings.
   - Add inset goal lines at `x = ±17.0`, 1.5m crease, 5.4m penalty, and 7.4m free-hit spots.
3. **Phase 3: Tokens & Dragging**
   - Create 10 button discs (5 Home, 5 Away) with sharp `<Text>` labels and facing chevrons.
   - Implement pointer drag & drop with boundary clamping.
4. **Phase 4: Zustand Store & Tactical Presets**
   - Connect token positions to Zustand store.
   - Implement preset buttons (Square 2-2, Diamond 1-2-1, Power Play).
   - Implement JSON export/import.
5. **Phase 5: Tactical Annotations & Step Timeline**
   - Add tactical arrows and pass vectors (`drei/Line`).
   - Add multi-step play sequencing with animated playhead.
