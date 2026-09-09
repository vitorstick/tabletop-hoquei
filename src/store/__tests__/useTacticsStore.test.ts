import { describe, it, expect, beforeEach } from 'vitest';
import { useTacticsStore } from '../useTacticsStore';
import { RINK_DIMENSIONS } from '../../constants/rinkDimensions';

describe('useTacticsStore', () => {
  beforeEach(() => {
    useTacticsStore.getState().resetToInitial();
  });

  it('initializes with default step and metadata', () => {
    const state = useTacticsStore.getState();
    expect(state.steps.length).toBe(1);
    expect(state.currentStepIndex).toBe(0);
    expect(state.showBehindGoalClearance).toBe(true);
    expect(state.showCourtGrid).toBe(false);
    expect(state.rinkViewTheme).toBe('parquet');
    expect(state.steps[0].players['H1']).toBeDefined();
    expect(state.steps[0].players['A1']).toBeDefined();
  });

  it('toggles behind goal clearance properly via encapsulated action', () => {
    const store = useTacticsStore.getState();
    expect(store.showBehindGoalClearance).toBe(true);

    store.toggleBehindGoalClearance();
    expect(useTacticsStore.getState().showBehindGoalClearance).toBe(false);

    store.toggleBehindGoalClearance();
    expect(useTacticsStore.getState().showBehindGoalClearance).toBe(true);
  });

  it('toggles court grid properly', () => {
    const store = useTacticsStore.getState();
    expect(store.showCourtGrid).toBe(false);

    store.toggleCourtGrid();
    expect(useTacticsStore.getState().showCourtGrid).toBe(true);
  });

  it('addStep creates an independent deep-cloned step using structuredClone', () => {
    const store = useTacticsStore.getState();
    expect(store.steps.length).toBe(1);

    store.addStep();
    const updated = useTacticsStore.getState();
    expect(updated.steps.length).toBe(2);
    expect(updated.currentStepIndex).toBe(1);

    // Modify step 2 player position
    updated.setPlayerPosition('H1', { x: -10, z: -5 });
    const afterMove = useTacticsStore.getState();

    // Step 2 player H1 should be moved, but Step 1 player H1 should remain untouched
    expect(afterMove.steps[1].players['H1'].x).toBe(-10);
    expect(afterMove.steps[1].players['H1'].z).toBe(-5);
    expect(afterMove.steps[0].players['H1'].x).toBe(-16.5);
    expect(afterMove.steps[0].players['H1'].z).toBe(0);
  });

  it('duplicateStep duplicates target step without mutating the original', () => {
    const store = useTacticsStore.getState();
    store.duplicateStep(0);

    const state = useTacticsStore.getState();
    expect(state.steps.length).toBe(2);
    expect(state.steps[1].name).toContain('(Copy)');
    expect(state.currentStepIndex).toBe(1);
  });

  it('deleteStep removes step and maintains minimum of one step', () => {
    const store = useTacticsStore.getState();
    store.addStep();
    expect(useTacticsStore.getState().steps.length).toBe(2);

    store.deleteStep(1);
    expect(useTacticsStore.getState().steps.length).toBe(1);

    // Trying to delete when only 1 step remains should do nothing
    store.deleteStep(0);
    expect(useTacticsStore.getState().steps.length).toBe(1);
  });

  it('clamps player coordinates within official rink boundaries', () => {
    const store = useTacticsStore.getState();

    // Attempt to move player way outside rink (+100m, -100m)
    store.setPlayerPosition('H2', { x: 100, z: -100 });

    const p = useTacticsStore.getState().steps[0].players['H2'];
    expect(p.x).toBe(RINK_DIMENSIONS.CLAMP_X_MAX);
    expect(p.z).toBe(RINK_DIMENSIONS.CLAMP_Z_MIN);
  });

  it('moves ball along when player has ball attached', () => {
    const store = useTacticsStore.getState();

    // Attach ball to player H1
    store.setBallAttachedPlayer('H1');
    const stepWithBall = useTacticsStore.getState().steps[0];
    expect(stepWithBall.ballAttachedTo).toBe('H1');

    // Move player H1
    store.setPlayerPosition('H1', { x: -14, z: 2 });
    const updatedStep = useTacticsStore.getState().steps[0];

    // Ball should have moved in front of player
    expect(updatedStep.ball.x).toBeCloseTo(-14 + 0.9, 1);
    expect(updatedStep.ball.z).toBeCloseTo(2, 1);
  });

  it('flips sides correctly for tactical transitions', () => {
    const store = useTacticsStore.getState();
    const h1Before = store.steps[0].players['H1'];
    const ballBefore = store.steps[0].ball;

    store.flipSides();
    const flipped = useTacticsStore.getState().steps[0];

    expect(flipped.players['H1'].x).toBe(-h1Before.x);
    expect(flipped.players['H1'].z).toBe(-h1Before.z);
    expect(flipped.ball.x).toBe(-ballBefore.x);
    expect(flipped.ball.z).toBe(-ballBefore.z);
  });

  it('importStateJSON safely imports valid tactical data and defensively sanitizes malformed data', () => {
    const store = useTacticsStore.getState();

    // Invalid JSON
    expect(store.importStateJSON('{ invalid json')).toBe(false);

    // Empty steps array
    expect(store.importStateJSON(JSON.stringify({ steps: [] }))).toBe(false);

    // Valid tactical export
    const validJson = store.exportStateJSON();
    expect(store.importStateJSON(validJson)).toBe(true);

    // Malformed steps with missing fields should be defensively sanitized
    const partialData = JSON.stringify({
      version: '1.0.0',
      steps: [
        {
          id: 'partial-step',
          // missing durationMs, ball, annotations
          players: { 'H1': { x: 0, z: 0, rotation: 0 } }
        }
      ]
    });
    expect(store.importStateJSON(partialData)).toBe(true);
    const sanitized = useTacticsStore.getState().steps[0];
    expect(sanitized.id).toBe('partial-step');
    expect(sanitized.durationMs).toBe(1500);
    expect(sanitized.ball).toEqual({ x: -2.0, z: 0 });
    expect(sanitized.annotations).toEqual([]);
  });
});
