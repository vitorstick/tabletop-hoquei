import { useEffect, useRef, useState } from 'react';
import { useTacticsStore } from '../store/useTacticsStore';
import { Vector2D } from '../types/tactics';

// Interpolate angle cleanly without 360 wrap artifacts
function lerpAngle(a: number, b: number, t: number): number {
  let diff = (b - a) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return a + diff * t;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function usePlayAnimation() {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    playbackSpeed,
    loopPlayback,
    setStep,
    setIsPlaying,
    setPlaybackProgress
  } = useTacticsStore();

  const [interpolatedPlayers, setInterpolatedPlayers] = useState<Record<string, { x: number; z: number; rotation: number }>>({});
  const [interpolatedBall, setInterpolatedBall] = useState<Vector2D>({ x: 0, z: 0 });

  const progressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      // Sync static positions to current step
      const currentStep = steps[currentStepIndex];
      if (currentStep) {
        setInterpolatedPlayers(currentStep.players);
        setInterpolatedBall(currentStep.ball);
        progressRef.current = 0;
        setPlaybackProgress(0);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const deltaMs = (now - lastTimeRef.current) * playbackSpeed;
      lastTimeRef.current = now;

      const currentStep = steps[currentStepIndex];
      const nextIndex = currentStepIndex + 1;
      const hasNextStep = nextIndex < steps.length;
      const targetStep = hasNextStep ? steps[nextIndex] : (loopPlayback ? steps[0] : null);

      if (!targetStep || steps.length <= 1) {
        setIsPlaying(false);
        setPlaybackProgress(0);
        return;
      }

      const stepDuration = currentStep?.durationMs || 1500;
      progressRef.current += deltaMs / stepDuration;

      if (progressRef.current >= 1.0) {
        progressRef.current = 0;
        if (hasNextStep) {
          setStep(nextIndex);
        } else if (loopPlayback) {
          setStep(0);
        } else {
          setIsPlaying(false);
          setPlaybackProgress(1.0);
          return;
        }
      } else {
        const t = Math.min(1, Math.max(0, progressRef.current));
        setPlaybackProgress(t);

        // Compute LERP for all players
        const nextPlayers: Record<string, { x: number; z: number; rotation: number }> = {};
        for (const [id, startP] of Object.entries(currentStep.players)) {
          const endP = targetStep.players[id] || startP;
          nextPlayers[id] = {
            x: lerp(startP.x, endP.x, t),
            z: lerp(startP.z, endP.z, t),
            rotation: lerpAngle(startP.rotation, endP.rotation, t)
          };
        }
        setInterpolatedPlayers(nextPlayers);

        // Compute LERP for ball
        const startBall = currentStep.ball;
        const endBall = targetStep.ball;
        setInterpolatedBall({
          x: lerp(startBall.x, endBall.x, t),
          z: lerp(startBall.z, endBall.z, t)
        });
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps, playbackSpeed, loopPlayback, setStep, setIsPlaying, setPlaybackProgress]);

  const activeStep = steps[currentStepIndex];

  return {
    players: isPlaying ? interpolatedPlayers : (activeStep?.players || {}),
    ball: isPlaying ? interpolatedBall : (activeStep?.ball || { x: 0, z: 0 }),
    annotations: activeStep?.annotations || []
  };
}
