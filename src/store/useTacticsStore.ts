import { create } from 'zustand';
import { 
  BoardState, 
  PlayStep, 
  PlayerRole, 
  TacticalAnnotation, 
  Team, 
  ToolMode, 
  Vector2D,
  TacticsDataExport 
} from '../types/tactics';
import { FORMATIONS } from '../constants/formations';
import { RINK_DIMENSIONS } from '../constants/rinkDimensions';

const initialPlayersMetadata: Record<string, { team: Team; role: PlayerRole; number: number; name: string }> = {
  'H1': { team: 'home', role: 'GK', number: 1, name: 'Guarda-Redes (H)' },
  'H2': { team: 'home', role: 'FP', number: 2, name: 'Defesa / Fixador' },
  'H3': { team: 'home', role: 'FP', number: 3, name: 'Ala Esquerdo' },
  'H4': { team: 'home', role: 'FP', number: 7, name: 'Ala Direito' },
  'H5': { team: 'home', role: 'FP', number: 9, name: 'Avançado / Pivot' },
  'A1': { team: 'away', role: 'GK', number: 1, name: 'Guarda-Redes (A)' },
  'A2': { team: 'away', role: 'FP', number: 4, name: 'Defesa / Fixador' },
  'A3': { team: 'away', role: 'FP', number: 5, name: 'Ala Esquerdo' },
  'A4': { team: 'away', role: 'FP', number: 8, name: 'Ala Direito' },
  'A5': { team: 'away', role: 'FP', number: 10, name: 'Avançado / Pivot' },
};

const defaultInitialStep: PlayStep = {
  id: 'step-1',
  name: 'Initial Setup (2-2)',
  durationMs: 1200,
  players: {
    'H1': { x: -16.5, z: 0, rotation: 0 },
    'H2': { x: -10.0, z: -5.0, rotation: 0 },
    'H3': { x: -10.0, z: 5.0, rotation: 0 },
    'H4': { x: -3.0, z: -5.5, rotation: 0 },
    'H5': { x: -3.0, z: 5.5, rotation: 0 },
    'A1': { x: 16.5, z: 0, rotation: Math.PI },
    'A2': { x: 10.0, z: 5.0, rotation: Math.PI },
    'A3': { x: 10.0, z: -5.0, rotation: Math.PI },
    'A4': { x: 3.0, z: 5.5, rotation: Math.PI },
    'A5': { x: 3.0, z: -5.5, rotation: Math.PI },
  },
  ball: { x: -2.0, z: 0 },
  ballAttachedTo: null,
  annotations: []
};

// Clamp helper
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export const useTacticsStore = create<BoardState>((set, get) => ({
  // Play sequencing
  currentStepIndex: 0,
  steps: [defaultInitialStep],
  isPlaying: false,
  playbackSpeed: 1.0,
  playbackProgress: 0,
  loopPlayback: true,

  // Metadata & Selection
  playersMetadata: initialPlayersMetadata,
  selectedTokenId: null,
  draggedItem: null,
  activeTool: 'select',
  activeColor: '#ef233c', // Default red
  showCourtGrid: false,
  showBehindGoalClearance: true,
  rinkViewTheme: 'parquet',

  // Actions - Token / Ball
  setPlayerPosition: (id: string, pos: Vector2D) => {
    const { steps, currentStepIndex } = get();
    const clampedPos = {
      x: clamp(pos.x, RINK_DIMENSIONS.CLAMP_X_MIN, RINK_DIMENSIONS.CLAMP_X_MAX),
      z: clamp(pos.z, RINK_DIMENSIONS.CLAMP_Z_MIN, RINK_DIMENSIONS.CLAMP_Z_MAX),
    };

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const currentPlayer = currentStep.players[id];
    const newPlayers = {
      ...currentStep.players,
      [id]: {
        ...(currentPlayer || { rotation: 0 }),
        ...clampedPos
      }
    };

    // If ball is attached to this player, move ball along
    let newBall = currentStep.ball;
    if (currentStep.ballAttachedTo === id) {
      // Offset ball slightly in front of player
      const angle = currentPlayer?.rotation ?? 0;
      newBall = {
        x: clamp(clampedPos.x + Math.cos(angle) * 0.9, RINK_DIMENSIONS.CLAMP_X_MIN, RINK_DIMENSIONS.CLAMP_X_MAX),
        z: clamp(clampedPos.z + Math.sin(angle) * 0.9, RINK_DIMENSIONS.CLAMP_Z_MIN, RINK_DIMENSIONS.CLAMP_Z_MAX),
      };
    }

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      players: newPlayers,
      ball: newBall
    };

    set({ steps: updatedSteps });
  },

  setPlayerRotation: (id: string, angle: number) => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep || !currentStep.players[id]) return;

    const updatedPlayers = {
      ...currentStep.players,
      [id]: {
        ...currentStep.players[id],
        rotation: angle
      }
    };

    // If ball is attached, rotate ball around player
    let newBall = currentStep.ball;
    if (currentStep.ballAttachedTo === id) {
      const pos = currentStep.players[id];
      newBall = {
        x: clamp(pos.x + Math.cos(angle) * 0.9, RINK_DIMENSIONS.CLAMP_X_MIN, RINK_DIMENSIONS.CLAMP_X_MAX),
        z: clamp(pos.z + Math.sin(angle) * 0.9, RINK_DIMENSIONS.CLAMP_Z_MIN, RINK_DIMENSIONS.CLAMP_Z_MAX),
      };
    }

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      players: updatedPlayers,
      ball: newBall
    };

    set({ steps: updatedSteps });
  },

  setPlayerInfo: (id: string, updates) => {
    set((state) => ({
      playersMetadata: {
        ...state.playersMetadata,
        [id]: {
          ...state.playersMetadata[id],
          ...updates
        }
      }
    }));
  },

  setBallPosition: (pos: Vector2D) => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const clampedPos = {
      x: clamp(pos.x, RINK_DIMENSIONS.CLAMP_X_MIN, RINK_DIMENSIONS.CLAMP_X_MAX),
      z: clamp(pos.z, RINK_DIMENSIONS.CLAMP_Z_MIN, RINK_DIMENSIONS.CLAMP_Z_MAX),
    };

    // Check if close to any player to snap / attach
    let nearestPlayerId: string | null = null;
    let minDistance: number = RINK_DIMENSIONS.BALL_ATTACH_DISTANCE;

    for (const [playerId, player] of Object.entries(currentStep.players)) {
      const dist = Math.hypot(player.x - clampedPos.x, player.z - clampedPos.z);
      if (dist < minDistance) {
        minDistance = dist;
        nearestPlayerId = playerId;
      }
    }

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      ball: clampedPos,
      ballAttachedTo: nearestPlayerId
    };

    set({ steps: updatedSteps });
  },

  setBallAttachedPlayer: (playerId: string | null) => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    let newBallPos = currentStep.ball;
    if (playerId && currentStep.players[playerId]) {
      const player = currentStep.players[playerId];
      const angle = player.rotation;
      newBallPos = {
        x: clamp(player.x + Math.cos(angle) * 0.9, RINK_DIMENSIONS.CLAMP_X_MIN, RINK_DIMENSIONS.CLAMP_X_MAX),
        z: clamp(player.z + Math.sin(angle) * 0.9, RINK_DIMENSIONS.CLAMP_Z_MIN, RINK_DIMENSIONS.CLAMP_Z_MAX),
      };
    }

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      ball: newBallPos,
      ballAttachedTo: playerId
    };

    set({ steps: updatedSteps });
  },

  setSelectedTokenId: (id: string | null) => {
    set({ selectedTokenId: id });
  },

  setDraggedItem: (item) => {
    set({ draggedItem: item });
  },

  // Actions - Tools & Annotations
  setActiveTool: (tool: ToolMode) => {
    set({ activeTool: tool });
  },

  setActiveColor: (color: string) => {
    set({ activeColor: color });
  },

  addAnnotation: (annotation: TacticalAnnotation) => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      annotations: [...currentStep.annotations, annotation]
    };

    set({ steps: updatedSteps });
  },

  removeAnnotation: (id: string) => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      annotations: currentStep.annotations.filter(a => a.id !== id)
    };

    set({ steps: updatedSteps });
  },

  clearAnnotations: () => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      annotations: []
    };

    set({ steps: updatedSteps });
  },

  toggleCourtGrid: () => {
    set((state) => ({ showCourtGrid: !state.showCourtGrid }));
  },

  toggleBehindGoalClearance: () => {
    set((state) => ({ showBehindGoalClearance: !state.showBehindGoalClearance }));
  },

  setRinkViewTheme: (theme) => {
    set({ rinkViewTheme: theme });
  },

  // Actions - Formations
  applyFormation: (formationKey: string) => {
    const formation = FORMATIONS[formationKey];
    if (!formation) return;

    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const newPlayers = { ...currentStep.players };

    // Apply Home
    for (const [id, data] of Object.entries(formation.home)) {
      newPlayers[id] = { x: data.pos.x, z: data.pos.z, rotation: data.rot };
    }
    // Apply Away
    for (const [id, data] of Object.entries(formation.away)) {
      newPlayers[id] = { x: data.pos.x, z: data.pos.z, rotation: data.rot };
    }

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      players: newPlayers,
      ball: { ...formation.ball },
      ballAttachedTo: null
    };

    set({ steps: updatedSteps });
  },

  resetToInitial: () => {
    set({
      currentStepIndex: 0,
      steps: [defaultInitialStep],
      isPlaying: false,
      playbackProgress: 0,
      selectedTokenId: null
    });
  },

  flipSides: () => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const flippedPlayers: Record<string, { x: number; z: number; rotation: number }> = {};
    for (const [id, p] of Object.entries(currentStep.players)) {
      flippedPlayers[id] = {
        x: -p.x,
        z: -p.z,
        rotation: (p.rotation + Math.PI) % (Math.PI * 2)
      };
    }

    const flippedBall = {
      x: -currentStep.ball.x,
      z: -currentStep.ball.z
    };

    const flippedAnnotations = currentStep.annotations.map(ann => ({
      ...ann,
      points: ann.points.map(pt => ({ x: -pt.x, z: -pt.z }))
    }));

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...currentStep,
      players: flippedPlayers,
      ball: flippedBall,
      annotations: flippedAnnotations
    };

    set({ steps: updatedSteps });
  },

  // Actions - Keyframe Steps
  addStep: () => {
    const { steps, currentStepIndex } = get();
    const currentStep = steps[currentStepIndex];
    const newStepIndex = steps.length;

    // Clone current step as baseline for next phase
    const newStep: PlayStep = {
      id: `step-${Date.now()}`,
      name: `Step ${newStepIndex + 1}: Rotation / Action`,
      durationMs: 1500,
      players: structuredClone(currentStep.players),
      ball: { ...currentStep.ball },
      ballAttachedTo: currentStep.ballAttachedTo,
      annotations: []
    };

    set({
      steps: [...steps, newStep],
      currentStepIndex: newStepIndex
    });
  },

  duplicateStep: (index: number) => {
    const { steps } = get();
    const targetStep = steps[index];
    if (!targetStep) return;

    const newStep: PlayStep = {
      ...structuredClone(targetStep),
      id: `step-${Date.now()}`,
      name: `${targetStep.name} (Copy)`
    };

    const newSteps = [...steps.slice(0, index + 1), newStep, ...steps.slice(index + 1)];
    set({
      steps: newSteps,
      currentStepIndex: index + 1
    });
  },

  deleteStep: (index: number) => {
    const { steps, currentStepIndex } = get();
    if (steps.length <= 1) return; // Keep at least one step

    const newSteps = steps.filter((_, i) => i !== index);
    const newIndex = Math.min(currentStepIndex, newSteps.length - 1);

    set({
      steps: newSteps,
      currentStepIndex: newIndex
    });
  },

  setStep: (index: number) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStepIndex: index, playbackProgress: 0 });
    }
  },

  setStepName: (index: number, name: string) => {
    const { steps } = get();
    if (index < 0 || index >= steps.length) return;

    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], name };
    set({ steps: updatedSteps });
  },

  setStepDuration: (index: number, durationMs: number) => {
    const { steps } = get();
    if (index < 0 || index >= steps.length) return;

    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], durationMs };
    set({ steps: updatedSteps });
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setPlaybackSpeed: (speed: number) => {
    set({ playbackSpeed: speed });
  },

  setPlaybackProgress: (progress: number) => {
    set({ playbackProgress: Math.max(0, Math.min(1, progress)) });
  },

  setLoopPlayback: (loop: boolean) => {
    set({ loopPlayback: loop });
  },

  // Actions - Import / Export
  exportStateJSON: () => {
    const { steps, playersMetadata, currentStepIndex } = get();
    const exportData: TacticsDataExport = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      title: 'Roller Hockey Tactical Play',
      currentStepIndex,
      steps,
      playersMetadata
    };
    return JSON.stringify(exportData, null, 2);
  },

  importStateJSON: (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr) as TacticsDataExport;
      if (!data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
        return false;
      }

      // Defensive validation for steps structure
      const sanitizedSteps: PlayStep[] = data.steps.map((step, idx) => ({
        id: typeof step.id === 'string' ? step.id : `step-${Date.now()}-${idx}`,
        name: typeof step.name === 'string' ? step.name : `Step ${idx + 1}`,
        durationMs: typeof step.durationMs === 'number' && step.durationMs > 0 ? step.durationMs : 1500,
        players: (step.players && typeof step.players === 'object') ? step.players : defaultInitialStep.players,
        ball: (step.ball && typeof step.ball.x === 'number' && typeof step.ball.z === 'number')
          ? { x: step.ball.x, z: step.ball.z }
          : { x: -2.0, z: 0 },
        ballAttachedTo: typeof step.ballAttachedTo === 'string' ? step.ballAttachedTo : null,
        annotations: Array.isArray(step.annotations) ? step.annotations : []
      }));

      set({
        steps: sanitizedSteps,
        currentStepIndex: 0,
        playersMetadata: data.playersMetadata || initialPlayersMetadata,
        isPlaying: false,
        playbackProgress: 0,
        selectedTokenId: null
      });
      return true;
    } catch {
      return false;
    }
  }
}));
