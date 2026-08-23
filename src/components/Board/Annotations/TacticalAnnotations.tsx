import React, { useMemo } from 'react';
import { Line, QuadraticBezierLine } from '@react-three/drei';
import { TacticalAnnotation, Vector2D } from '../../../types/tactics';
import { useTacticsStore } from '../../../store/useTacticsStore';

interface TacticalAnnotationsProps {
  annotations: TacticalAnnotation[];
  drawingPreview?: {
    type: 'arrow' | 'pass' | 'curve' | 'zone';
    start: Vector2D;
    current: Vector2D;
    color: string;
  } | null;
}

// Compute arrowhead geometry points
function createArrowHead(from: Vector2D, to: Vector2D, headLength = 0.6, headAngle = 0.45): [number, number, number][] {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const angle = Math.atan2(dz, dx);

  const leftX = to.x - headLength * Math.cos(angle - headAngle);
  const leftZ = to.z - headLength * Math.sin(angle - headAngle);
  const rightX = to.x - headLength * Math.cos(angle + headAngle);
  const rightZ = to.z - headLength * Math.sin(angle + headAngle);

  return [
    [leftX, 0.08, leftZ],
    [to.x, 0.08, to.z],
    [rightX, 0.08, rightZ]
  ];
}

export const TacticalAnnotations: React.FC<TacticalAnnotationsProps> = ({
  annotations,
  drawingPreview
}) => {
  const activeTool = useTacticsStore((s) => s.activeTool);
  const removeAnnotation = useTacticsStore((s) => s.removeAnnotation);

  const renderSingleAnnotation = (ann: TacticalAnnotation) => {
    if (ann.points.length < 2) return null;
    const start = ann.points[0];
    const end = ann.points[ann.points.length - 1];
    const color = ann.color || '#fbbf24';

    const handleAnnotationClick = (e: any) => {
      if (activeTool === 'erase') {
        e.stopPropagation();
        removeAnnotation(ann.id);
      }
    };

    if (ann.type === 'pass') {
      // Dashed pass line with arrowhead
      const head = createArrowHead(start, end, 0.55);
      return (
        <group key={ann.id} onClick={handleAnnotationClick}>
          <Line
            points={[
              [start.x, 0.08, start.z],
              [end.x, 0.08, end.z]
            ]}
            color={color}
            lineWidth={3.5}
            dashed
            dashScale={2}
            dashSize={0.6}
            gapSize={0.4}
          />
          <Line
            points={head}
            color={color}
            lineWidth={4}
          />
        </group>
      );
    }

    if (ann.type === 'curve') {
      // Curved quadratic bezier skating run
      const midX = (start.x + end.x) / 2 + (end.z - start.z) * 0.3;
      const midZ = (start.z + end.z) / 2 - (end.x - start.x) * 0.3;
      const head = createArrowHead({ x: midX, z: midZ }, end, 0.55);

      return (
        <group key={ann.id} onClick={handleAnnotationClick}>
          <QuadraticBezierLine
            start={[start.x, 0.08, start.z]}
            end={[end.x, 0.08, end.z]}
            mid={[midX, 0.08, midZ]}
            color={color}
            lineWidth={3.5}
          />
          <Line
            points={head}
            color={color}
            lineWidth={4}
          />
        </group>
      );
    }

    if (ann.type === 'zone') {
      // Rectangular tactical highlight zone
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minZ = Math.min(start.z, end.z);
      const maxZ = Math.max(start.z, end.z);
      const width = Math.max(0.2, maxX - minX);
      const height = Math.max(0.2, maxZ - minZ);
      const centerX = (minX + maxX) / 2;
      const centerZ = (minZ + maxZ) / 2;

      return (
        <group key={ann.id} onClick={handleAnnotationClick}>
          {/* Shaded zone */}
          <mesh position={[centerX, 0.03, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial color={color} transparent opacity={0.28} />
          </mesh>
          {/* Zone border */}
          <Line
            points={[
              [minX, 0.04, minZ],
              [maxX, 0.04, minZ],
              [maxX, 0.04, maxZ],
              [minX, 0.04, maxZ],
              [minX, 0.04, minZ]
            ]}
            color={color}
            lineWidth={2.5}
          />
        </group>
      );
    }

    // Default: 'arrow' (Solid movement vector)
    const head = createArrowHead(start, end, 0.55);
    return (
      <group key={ann.id} onClick={handleAnnotationClick}>
        <Line
          points={[
            [start.x, 0.08, start.z],
            [end.x, 0.08, end.z]
          ]}
          color={color}
          lineWidth={3.5}
        />
        <Line
          points={head}
          color={color}
          lineWidth={4}
        />
      </group>
    );
  };

  // Live drawing preview while user is dragging pointer
  const previewElement = useMemo(() => {
    if (!drawingPreview) return null;
    const { type, start, current, color } = drawingPreview;

    if (type === 'pass') {
      const head = createArrowHead(start, current, 0.55);
      return (
        <group>
          <Line
            points={[
              [start.x, 0.09, start.z],
              [current.x, 0.09, current.z]
            ]}
            color={color}
            lineWidth={3.5}
            dashed
            dashScale={2}
            dashSize={0.6}
            gapSize={0.4}
          />
          <Line points={head} color={color} lineWidth={4} />
        </group>
      );
    }

    if (type === 'curve') {
      const midX = (start.x + current.x) / 2 + (current.z - start.z) * 0.3;
      const midZ = (start.z + current.z) / 2 - (current.x - start.x) * 0.3;
      const head = createArrowHead({ x: midX, z: midZ }, current, 0.55);
      return (
        <group>
          <QuadraticBezierLine
            start={[start.x, 0.09, start.z]}
            end={[current.x, 0.09, current.z]}
            mid={[midX, 0.09, midZ]}
            color={color}
            lineWidth={3.5}
          />
          <Line points={head} color={color} lineWidth={4} />
        </group>
      );
    }

    if (type === 'zone') {
      const minX = Math.min(start.x, current.x);
      const maxX = Math.max(start.x, current.x);
      const minZ = Math.min(start.z, current.z);
      const maxZ = Math.max(start.z, current.z);
      const width = Math.max(0.2, maxX - minX);
      const height = Math.max(0.2, maxZ - minZ);
      const centerX = (minX + maxX) / 2;
      const centerZ = (minZ + maxZ) / 2;

      return (
        <group>
          <mesh position={[centerX, 0.04, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
          <Line
            points={[
              [minX, 0.05, minZ],
              [maxX, 0.05, minZ],
              [maxX, 0.05, maxZ],
              [minX, 0.05, maxZ],
              [minX, 0.05, minZ]
            ]}
            color={color}
            lineWidth={2.5}
          />
        </group>
      );
    }

    // Arrow preview
    const head = createArrowHead(start, current, 0.55);
    return (
      <group>
        <Line
          points={[
            [start.x, 0.09, start.z],
            [current.x, 0.09, current.z]
          ]}
          color={color}
          lineWidth={3.5}
        />
        <Line points={head} color={color} lineWidth={4} />
      </group>
    );
  }, [drawingPreview]);

  return (
    <group>
      {annotations.map(renderSingleAnnotation)}
      {previewElement}
    </group>
  );
};
