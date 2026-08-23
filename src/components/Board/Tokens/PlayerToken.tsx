import React, { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import { useTacticsStore } from '../../../store/useTacticsStore';
import { RINK_DIMENSIONS } from '../../../constants/rinkDimensions';

interface PlayerTokenProps {
  id: string;
  position: { x: number; z: number };
  rotation: number;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({
  id,
  position,
  rotation
}) => {
  const setDraggedItem = useTacticsStore((s) => s.setDraggedItem);
  const selectedTokenId = useTacticsStore((s) => s.selectedTokenId);
  const setSelectedTokenId = useTacticsStore((s) => s.setSelectedTokenId);
  const activeTool = useTacticsStore((s) => s.activeTool);
  const metadata = useTacticsStore((s) => s.playersMetadata[id]);
  const isPlaying = useTacticsStore((s) => s.isPlaying);
  const currentStep = useTacticsStore((s) => s.steps[s.currentStepIndex]);

  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedTokenId === id;
  const isHome = metadata?.team === 'home';
  const isGK = metadata?.role === 'GK';
  const hasBall = currentStep?.ballAttachedTo === id;

  // Primary & secondary team colors
  const mainColor = isHome ? '#e63946' : '#1d3557';
  const ringColor = isHome ? '#b51724' : '#0f1d31';
  const accentColor = isGK ? '#fbbf24' : '#ffffff';

  const groupRef = useRef<THREE.Group>(null);

  // Drag start on XZ plane
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (isPlaying || (activeTool !== 'select' && activeTool !== 'move')) return;
    e.stopPropagation();
    
    // Select token and start dragging
    setSelectedTokenId(id);
    setDraggedItem({
      type: 'player',
      id,
      offset: {
        x: e.point.x - position.x,
        z: e.point.z - position.z
      }
    });
  }, [isPlaying, activeTool, id, position.x, position.z, setSelectedTokenId, setDraggedItem]);

  // Rotation Handle Pointer Events
  const handleRotateDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (isPlaying) return;
    e.stopPropagation();
    setDraggedItem({
      type: 'rotate',
      id
    });
  }, [isPlaying, id, setDraggedItem]);

  // Direction chevron indicator coordinates
  const chevronRadius = RINK_DIMENSIONS.PLAYER_RADIUS * 0.95;
  const tipX = Math.cos(rotation) * (chevronRadius + 0.35);
  const tipZ = Math.sin(rotation) * (chevronRadius + 0.35);

  return (
    <group
      ref={groupRef}
      position={[position.x, 0.12, position.z]}
    >
      {/* Selection Glow / Ring */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[RINK_DIMENSIONS.PLAYER_RADIUS + 0.15, RINK_DIMENSIONS.PLAYER_RADIUS + 0.3, 32]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.85} />
        </mesh>
      )}

      {/* Ball Possession Halo Ring */}
      {hasBall && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[RINK_DIMENSIONS.PLAYER_RADIUS + 0.05, RINK_DIMENSIONS.PLAYER_RADIUS + 0.18, 32]} />
          <meshBasicMaterial color="#ff7b00" transparent opacity={0.9} />
        </mesh>
      )}

      {/* Token Main Body (Cylinder Disc) */}
      <mesh
        position={[0, 0.1, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        castShadow
      >
        <cylinderGeometry
          args={[
            RINK_DIMENSIONS.PLAYER_RADIUS,
            RINK_DIMENSIONS.PLAYER_RADIUS,
            RINK_DIMENSIONS.PLAYER_HEIGHT,
            32
          ]}
        />
        <meshStandardMaterial
          color={mainColor}
          roughness={0.2}
          metalness={0.3}
          emissive={isHovered ? mainColor : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Outer Border Ring on top of disc */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RINK_DIMENSIONS.PLAYER_RADIUS * 0.82, RINK_DIMENSIONS.PLAYER_RADIUS * 0.98, 32]} />
        <meshBasicMaterial color={ringColor} />
      </mesh>

      {/* Direction Chevron Arrow pointing forward */}
      <Line
        points={[
          [Math.cos(rotation + 0.5) * chevronRadius, 0.23, Math.sin(rotation + 0.5) * chevronRadius],
          [tipX, 0.23, tipZ],
          [Math.cos(rotation - 0.5) * chevronRadius, 0.23, Math.sin(rotation - 0.5) * chevronRadius]
        ]}
        color="#fbbf24"
        lineWidth={4}
      />

      {/* Player Number Label (Large & Crisp) */}
      <Text
        position={[0, 0.235, -0.08]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.48}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {isGK ? 'GK' : String(metadata?.number ?? id)}
      </Text>

      {/* Player ID / Small Sub-label */}
      <Text
        position={[0, 0.235, 0.32]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.24}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
      >
        {id}
      </Text>

      {/* Interactive Rotation Drag Handle (Visible when Selected and Not Playing) */}
      {isSelected && !isPlaying && (
        <group
          position={[tipX * 1.35, 0.25, tipZ * 1.35]}
          onPointerDown={handleRotateDown}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.26, 24]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.26, 0.32, 24]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
        </group>
      )}
    </group>
  );
};
