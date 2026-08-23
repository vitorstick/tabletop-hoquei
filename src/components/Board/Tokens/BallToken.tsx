import React, { useState, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useTacticsStore } from '../../../store/useTacticsStore';
import { RINK_DIMENSIONS } from '../../../constants/rinkDimensions';

interface BallTokenProps {
  position: { x: number; z: number };
}

export const BallToken: React.FC<BallTokenProps> = ({ position }) => {
  const setDraggedItem = useTacticsStore((s) => s.setDraggedItem);
  const isPlaying = useTacticsStore((s) => s.isPlaying);
  const activeTool = useTacticsStore((s) => s.activeTool);
  const currentStep = useTacticsStore((s) => s.steps[s.currentStepIndex]);

  const [isHovered, setIsHovered] = useState(false);

  const isAttached = !!currentStep?.ballAttachedTo;

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (isPlaying || (activeTool !== 'select' && activeTool !== 'move')) return;
    e.stopPropagation();
    setDraggedItem({
      type: 'ball',
      offset: {
        x: e.point.x - position.x,
        z: e.point.z - position.z
      }
    });
  }, [isPlaying, activeTool, position.x, position.z, setDraggedItem]);

  return (
    <group position={[position.x, 0.18, position.z]}>
      {/* Ball Shadow */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RINK_DIMENSIONS.BALL_RADIUS * 1.1, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Outer Pulse Ring when attached */}
      {isAttached && (
        <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[RINK_DIMENSIONS.BALL_RADIUS + 0.05, RINK_DIMENSIONS.BALL_RADIUS + 0.15, 24]} />
          <meshBasicMaterial color="#ff7b00" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Main Ball Sphere */}
      <mesh
        onPointerDown={handlePointerDown}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        castShadow
      >
        <sphereGeometry args={[RINK_DIMENSIONS.BALL_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color="#ff6b00"
          roughness={0.15}
          metalness={0.2}
          emissive={isHovered ? '#ff8533' : '#331500'}
          emissiveIntensity={isHovered ? 0.6 : 0.2}
        />
      </mesh>

      {/* Highlight core */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
