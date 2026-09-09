import { useEffect } from 'react';
import { useTacticsStore } from '../store/useTacticsStore';
import { ToolMode } from '../types/tactics';

export function useKeyboardShortcuts() {
  const isPlaying = useTacticsStore((s) => s.isPlaying);
  const setIsPlaying = useTacticsStore((s) => s.setIsPlaying);
  const steps = useTacticsStore((s) => s.steps);
  const currentStepIndex = useTacticsStore((s) => s.currentStepIndex);
  const setStep = useTacticsStore((s) => s.setStep);
  const setActiveTool = useTacticsStore((s) => s.setActiveTool);
  const setSelectedTokenId = useTacticsStore((s) => s.setSelectedTokenId);
  const toggleCourtGrid = useTacticsStore((s) => s.toggleCourtGrid);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcuts when typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Space: Play / Pause
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
        return;
      }

      // Arrow Left: Previous step
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (!isPlaying && currentStepIndex > 0) {
          setStep(currentStepIndex - 1);
        }
        return;
      }

      // Arrow Right: Next step
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isPlaying && currentStepIndex < steps.length - 1) {
          setStep(currentStepIndex + 1);
        }
        return;
      }

      // Number keys 1-6: Switch tool modes
      const toolMap: Record<string, ToolMode> = {
        '1': 'select',
        '2': 'arrow',
        '3': 'pass',
        '4': 'curve',
        '5': 'zone',
        '6': 'erase',
      };
      if (toolMap[e.key]) {
        e.preventDefault();
        setActiveTool(toolMap[e.key]);
        return;
      }

      // Escape: Deselect active token
      if (e.key === 'Escape') {
        setSelectedTokenId(null);
        return;
      }

      // 'g': Toggle Grid
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleCourtGrid();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying,
    setIsPlaying,
    steps.length,
    currentStepIndex,
    setStep,
    setActiveTool,
    setSelectedTokenId,
    toggleCourtGrid,
  ]);
}
