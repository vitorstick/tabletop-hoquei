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
  curvature?: number;      // For curved skating runs
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

export interface BoardState {
  // Play sequencing
  currentStepIndex: number;
  steps: PlayStep[];
  isPlaying: boolean;
  playbackSpeed: number;    // 0.5, 1.0, 1.5, 2.0
  playbackProgress: number; // 0..1 for current step lerp
  loopPlayback: boolean;

  // Metadata & Selection
  playersMetadata: Record<string, { team: Team; role: PlayerRole; number: number; name: string }>;
  selectedTokenId: string | null;
  draggedItem: { type: 'player' | 'ball' | 'rotate'; id?: string; offset?: Vector2D } | null;
  activeTool: ToolMode;
  activeColor: string;
  showCourtGrid: boolean;
  showBehindGoalClearance: boolean;
  rinkViewTheme: 'parquet' | 'modern-dark';

  // Actions - Token / Ball
  setPlayerPosition: (id: string, pos: Vector2D) => void;
  setPlayerRotation: (id: string, angle: number) => void;
  setPlayerInfo: (id: string, updates: Partial<{ name: string; number: number; role: PlayerRole }>) => void;
  setBallPosition: (pos: Vector2D) => void;
  setBallAttachedPlayer: (playerId: string | null) => void;
  setSelectedTokenId: (id: string | null) => void;
  setDraggedItem: (item: { type: 'player' | 'ball' | 'rotate'; id?: string; offset?: Vector2D } | null) => void;

  // Actions - Tools & Annotations
  setActiveTool: (tool: ToolMode) => void;
  setActiveColor: (color: string) => void;
  addAnnotation: (annotation: TacticalAnnotation) => void;
  removeAnnotation: (id: string) => void;
  clearAnnotations: () => void;
  toggleCourtGrid: () => void;
  setRinkViewTheme: (theme: 'parquet' | 'modern-dark') => void;

  // Actions - Formations & Presets
  applyFormation: (formationKey: string, team?: Team) => void;
  resetToInitial: () => void;
  flipSides: () => void;

  // Actions - Keyframe Steps
  addStep: () => void;
  duplicateStep: (index: number) => void;
  deleteStep: (index: number) => void;
  setStep: (index: number) => void;
  setStepName: (index: number, name: string) => void;
  setStepDuration: (index: number, durationMs: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setPlaybackProgress: (progress: number) => void;
  setLoopPlayback: (loop: boolean) => void;

  // Actions - Import / Export
  exportStateJSON: () => string;
  importStateJSON: (jsonStr: string) => boolean;
}
