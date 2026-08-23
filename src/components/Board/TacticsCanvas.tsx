import React, { useState, useCallback, useRef } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, Grid } from '@react-three/drei';
import { useTacticsStore } from '../../store/useTacticsStore';
import { usePlayAnimation } from '../../hooks/usePlayAnimation';
import { RinkFloor } from './Rink/RinkFloor';
import { RinkGoals } from './Rink/RinkGoals';
import { RinkBarriers } from './Rink/RinkBarriers';
import { PlayerToken } from './Tokens/PlayerToken';
import { BallToken } from './Tokens/BallToken';
import { TacticalAnnotations } from './Annotations/TacticalAnnotations';
import { Vector2D } from '../../types/tactics';
import { RINK_DIMENSIONS } from '../../constants/rinkDimensions';

// Inner 3D Scene
const SceneContent: React.FC = () => {
  const activeTool = useTacticsStore((s) => s.activeTool);
  const activeColor = useTacticsStore((s) => s.activeColor);
  const addAnnotation = useTacticsStore((s) => s.addAnnotation);
  const setSelectedTokenId = useTacticsStore((s) => s.setSelectedTokenId);
  const showCourtGrid = useTacticsStore((s) => s.showCourtGrid);

  const draggedItem = useTacticsStore((s) => s.draggedItem);
  const setDraggedItem = useTacticsStore((s) => s.setDraggedItem);
  const setPlayerPosition = useTacticsStore((s) => s.setPlayerPosition);
  const setPlayerRotation = useTacticsStore((s) => s.setPlayerRotation);
  const setBallPosition = useTacticsStore((s) => s.setBallPosition);

  const { players, ball, annotations } = usePlayAnimation();

  // Drawing state
  const [drawingPreview, setDrawingPreview] = useState<{
    type: 'arrow' | 'pass' | 'curve' | 'zone';
    start: Vector2D;
    current: Vector2D;
    color: string;
  } | null>(null);

  const isDrawingRef = useRef(false);

  // Global pointerup safety
  React.useEffect(() => {
    const handleGlobalUp = () => {
      if (useTacticsStore.getState().draggedItem) {
        useTacticsStore.getState().setDraggedItem(null);
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  const handleFloorPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (activeTool === 'select' || activeTool === 'move') {
      setSelectedTokenId(null);
      return;
    }

    if (activeTool === 'arrow' || activeTool === 'pass' || activeTool === 'curve' || activeTool === 'zone') {
      isDrawingRef.current = true;
      const pt = { x: e.point.x, z: e.point.z };
      setDrawingPreview({
        type: activeTool,
        start: pt,
        current: pt,
        color: activeColor
      });
    }
  }, [activeTool, activeColor, setSelectedTokenId]);

  const handleFloorPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    // 1. Handle Token Dragging
    if (draggedItem) {
      if (draggedItem.type === 'player' && draggedItem.id) {
        const offX = draggedItem.offset?.x ?? 0;
        const offZ = draggedItem.offset?.z ?? 0;
        setPlayerPosition(draggedItem.id, {
          x: e.point.x - offX,
          z: e.point.z - offZ
        });
      } else if (draggedItem.type === 'ball') {
        const offX = draggedItem.offset?.x ?? 0;
        const offZ = draggedItem.offset?.z ?? 0;
        setBallPosition({
          x: e.point.x - offX,
          z: e.point.z - offZ
        });
      } else if (draggedItem.type === 'rotate' && draggedItem.id) {
        const currentStep = useTacticsStore.getState().steps[useTacticsStore.getState().currentStepIndex];
        const p = currentStep?.players[draggedItem.id];
        if (p) {
          const angle = Math.atan2(e.point.z - p.z, e.point.x - p.x);
          setPlayerRotation(draggedItem.id, angle);
        }
      }
      return;
    }

    // 2. Handle Drawing Preview
    if (isDrawingRef.current && drawingPreview) {
      setDrawingPreview(prev => prev ? {
        ...prev,
        current: { x: e.point.x, z: e.point.z }
      } : null);
    }
  }, [draggedItem, setPlayerPosition, setBallPosition, setPlayerRotation, drawingPreview]);

  const handleFloorPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (draggedItem) {
      setDraggedItem(null);
    }

    if (isDrawingRef.current && drawingPreview) {
      isDrawingRef.current = false;

      const dist = Math.hypot(
        drawingPreview.current.x - drawingPreview.start.x,
        drawingPreview.current.z - drawingPreview.start.z
      );

      // Only add if there is a deliberate drag
      if (dist > 0.4) {
        addAnnotation({
          id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: drawingPreview.type,
          points: [drawingPreview.start, drawingPreview.current],
          color: drawingPreview.color
        });
      }

      setDrawingPreview(null);
    }
  }, [draggedItem, setDraggedItem, drawingPreview, addAnnotation]);

  return (
    <>
      {/* Top-Down Fixed Orthographic Camera (Looking straight down Y, Up is -Z) */}
      <OrthographicCamera
        makeDefault
        position={[0, 50, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        up={[0, 0, -1]}
        zoom={23}
        near={0.1}
        far={1000}
      />

      {/* Lighting for clean whiteboard view with 3D token depth */}
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[10, 30, 15]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-10, 30, -15]}
        intensity={0.4}
      />

      {/* Interactive Raycast Floor Plane for Dragging, Drawing and Deselection */}
      <mesh
        position={[0, 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handleFloorPointerDown}
        onPointerMove={handleFloorPointerMove}
        onPointerUp={handleFloorPointerUp}
      >
        <planeGeometry args={[RINK_DIMENSIONS.LENGTH + 20, RINK_DIMENSIONS.WIDTH + 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Rink Model */}
      <RinkFloor />
      <RinkBarriers />
      <RinkGoals />

      {/* Optional Coaching Tactical Grid */}
      {showCourtGrid && (
        <Grid
          position={[0, 0.005, 0]}
          args={[40, 20]}
          cellSize={2}
          cellThickness={0.8}
          cellColor="#64748b"
          sectionSize={10}
          sectionThickness={1.2}
          sectionColor="#94a3b8"
          fadeDistance={60}
          fadeStrength={1}
        />
      )}

      {/* Annotations & Drawing Layer */}
      <TacticalAnnotations
        annotations={annotations}
        drawingPreview={drawingPreview}
      />

      {/* Player Tokens */}
      {Object.entries(players).map(([id, p]) => (
        <PlayerToken
          key={id}
          id={id}
          position={{ x: p.x, z: p.z }}
          rotation={p.rotation}
        />
      ))}

      {/* Ball Token */}
      <BallToken position={ball} />
    </>
  );
};

export const TacticsCanvas: React.FC = () => {
  return (
    <div className="w-full h-full relative select-none cursor-default bg-slate-950 flex items-center justify-center overflow-hidden">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};
