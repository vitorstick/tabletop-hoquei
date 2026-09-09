import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { RINK_DIMENSIONS } from '../../../constants/rinkDimensions';
import { useTacticsStore } from '../../../store/useTacticsStore';

// Helper to generate rounded rectangle line points
function createRoundedRectPoints(width: number, height: number, radius: number, segments = 16): [number, number, number][] {
  const points: [number, number, number][] = [];
  const halfW = width / 2;
  const halfH = height / 2;
  const r = Math.min(radius, halfW, halfH);

  // Top-right corner
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([halfW - r + r * Math.sin(theta), 0.01, -halfH + r - r * Math.cos(theta)]);
  }
  // Bottom-right corner
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([halfW - r + r * Math.cos(theta), 0.01, halfH - r + r * Math.sin(theta)]);
  }
  // Bottom-left corner
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([-halfW + r - r * Math.sin(theta), 0.01, halfH - r + r * Math.cos(theta)]);
  }
  // Top-left corner
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([-halfW + r - r * Math.cos(theta), 0.01, -halfH + r - r * Math.sin(theta)]);
  }
  // Close loop
  points.push(points[0]);
  return points;
}

// Generate semicircle points for goalkeeper crease
function createCreasePoints(goalX: number, radius: number, direction: 1 | -1, segments = 32): [number, number, number][] {
  const points: [number, number, number][] = [];
  const startAngle = direction === 1 ? -Math.PI / 2 : Math.PI / 2;
  const endAngle = direction === 1 ? Math.PI / 2 : (3 * Math.PI) / 2;

  for (let i = 0; i <= segments; i++) {
    const theta = startAngle + (i / segments) * (endAngle - startAngle);
    points.push([goalX + radius * Math.cos(theta), 0.012, radius * Math.sin(theta)]);
  }
  return points;
}

// Generate full circle points
function createCirclePoints(centerX: number, centerZ: number, radius: number, segments = 64): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push([centerX + radius * Math.cos(theta), 0.012, centerZ + radius * Math.sin(theta)]);
  }
  return points;
}

export const RinkFloor: React.FC = () => {
  const rinkTheme = useTacticsStore((s) => s.rinkViewTheme);
  const showBehindGoalClearance = useTacticsStore((s) => s.showBehindGoalClearance);

  // Parquet wood procedural texture
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (rinkTheme === 'parquet') {
      // Warm golden parquet planks
      ctx.fillStyle = '#c89558';
      ctx.fillRect(0, 0, 1024, 512);

      const plankHeight = 16;
      const plankWidth = 96;

      for (let y = 0; y < 512; y += plankHeight) {
        const row = Math.floor(y / plankHeight);
        const offsetX = (row % 2) * (plankWidth / 2);
        for (let x = -offsetX; x < 1024 + plankWidth; x += plankWidth) {
          const shade = ((x * 17 + y * 23) % 20) - 10;
          const r = 200 + shade;
          const g = 149 + Math.floor(shade * 0.8);
          const b = 88 + Math.floor(shade * 0.6);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

          // Subtle wood grain
          ctx.strokeStyle = `rgba(160, 110, 50, 0.2)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x + 2, y + plankHeight / 2);
          ctx.lineTo(x + plankWidth - 2, y + plankHeight / 2);
          ctx.stroke();
        }
      }
    } else {
      // Sleek tactical dark grey court
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = '#1e293b';
      const grid = 32;
      for (let x = 0; x < 1024; x += grid) {
        for (let y = 0; y < 512; y += grid) {
          if ((x / grid + y / grid) % 2 === 0) {
            ctx.fillRect(x, y, grid, grid);
          }
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    tex.anisotropy = 8;
    return tex;
  }, [rinkTheme]);

  // Clean up WebGL texture memory on theme switch or unmount
  useEffect(() => {
    return () => {
      floorTexture?.dispose();
    };
  }, [floorTexture]);

  // Rounded boundary points
  const boundaryPoints = useMemo(() => {
    return createRoundedRectPoints(RINK_DIMENSIONS.LENGTH, RINK_DIMENSIONS.WIDTH, RINK_DIMENSIONS.CORNER_RADIUS);
  }, []);

  // Center circle & spots
  const centerCirclePoints = useMemo(() => {
    return createCirclePoints(0, 0, RINK_DIMENSIONS.CENTER_CIRCLE_RADIUS);
  }, []);

  // Creases
  const homeCreasePoints = useMemo(() => {
    return createCreasePoints(RINK_DIMENSIONS.GOAL_LINE_X_HOME, RINK_DIMENSIONS.CREASE_RADIUS, 1);
  }, []);

  const awayCreasePoints = useMemo(() => {
    return createCreasePoints(RINK_DIMENSIONS.GOAL_LINE_X_AWAY, RINK_DIMENSIONS.CREASE_RADIUS, -1);
  }, []);

  // Colors
  const redLineColor = '#ef233c';
  const whiteLineColor = rinkTheme === 'parquet' ? '#ffffff' : '#f8fafc';
  const creaseLineColor = '#0284c7';

  return (
    <group>
      {/* Base Floor Plane */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[RINK_DIMENSIONS.LENGTH, RINK_DIMENSIONS.WIDTH]} />
        <meshStandardMaterial
          map={floorTexture ?? undefined}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Behind-The-Net Clearance Zones Highlight (Authentic Roller Hockey 3m Area) */}
      {showBehindGoalClearance && (
        <>
          {/* Home behind net zone */}
          <mesh position={[-18.5, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.0, 19.6]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.06} />
          </mesh>
          {/* Away behind net zone */}
          <mesh position={[18.5, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.0, 19.6]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.06} />
          </mesh>
        </>
      )}

      {/* Outer Rounded Perimeter Line */}
      <Line
        points={boundaryPoints}
        color={whiteLineColor}
        lineWidth={3.5}
        depthWrite={false}
      />

      {/* Center Half-Court Line (x = 0) */}
      <Line
        points={[
          [0, 0.015, -RINK_DIMENSIONS.WIDTH / 2],
          [0, 0.015, RINK_DIMENSIONS.WIDTH / 2],
        ]}
        color={redLineColor}
        lineWidth={4}
      />

      {/* Center Circle */}
      <Line
        points={centerCirclePoints}
        color={redLineColor}
        lineWidth={3}
      />

      {/* Center Spot */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RINK_DIMENSIONS.CENTER_SPOT_RADIUS, 32]} />
        <meshBasicMaterial color={redLineColor} />
      </mesh>

      {/* ================= HOME SIDE (x < 0) ================= */}

      {/* Home Inset Goal Line (x = -17.0, width = 20) */}
      <Line
        points={[
          [RINK_DIMENSIONS.GOAL_LINE_X_HOME, 0.015, -RINK_DIMENSIONS.WIDTH / 2],
          [RINK_DIMENSIONS.GOAL_LINE_X_HOME, 0.015, RINK_DIMENSIONS.WIDTH / 2],
        ]}
        color={redLineColor}
        lineWidth={3.5}
      />

      {/* Home Goalkeeper Protection Crease (Semicircle r = 1.5m) */}
      <Line
        points={homeCreasePoints}
        color={creaseLineColor}
        lineWidth={3}
      />

      {/* Home Penalty Area Box */}
      <Line
        points={[
          [RINK_DIMENSIONS.GOAL_LINE_X_HOME, 0.012, -4.5],
          [RINK_DIMENSIONS.PENALTY_SPOT_HOME_X, 0.012, -4.5],
          [RINK_DIMENSIONS.PENALTY_SPOT_HOME_X, 0.012, 4.5],
          [RINK_DIMENSIONS.GOAL_LINE_X_HOME, 0.012, 4.5],
        ]}
        color={whiteLineColor}
        lineWidth={2}
      />

      {/* Home Penalty Spot (Grande Penalidade at 5.4m from goal line: x = -11.6) */}
      <mesh position={[RINK_DIMENSIONS.PENALTY_SPOT_HOME_X, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={redLineColor} />
      </mesh>

      {/* Home Direct Free-Hit Spot (Livre Direto at 7.4m from goal line: x = -9.6) */}
      <mesh position={[RINK_DIMENSIONS.FREE_HIT_HOME_X, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={whiteLineColor} />
      </mesh>

      {/* ================= AWAY SIDE (x > 0) ================= */}

      {/* Away Inset Goal Line (x = +17.0, width = 20) */}
      <Line
        points={[
          [RINK_DIMENSIONS.GOAL_LINE_X_AWAY, 0.015, -RINK_DIMENSIONS.WIDTH / 2],
          [RINK_DIMENSIONS.GOAL_LINE_X_AWAY, 0.015, RINK_DIMENSIONS.WIDTH / 2],
        ]}
        color={redLineColor}
        lineWidth={3.5}
      />

      {/* Away Goalkeeper Protection Crease (Semicircle r = 1.5m) */}
      <Line
        points={awayCreasePoints}
        color={creaseLineColor}
        lineWidth={3}
      />

      {/* Away Penalty Area Box */}
      <Line
        points={[
          [RINK_DIMENSIONS.GOAL_LINE_X_AWAY, 0.012, -4.5],
          [RINK_DIMENSIONS.PENALTY_SPOT_AWAY_X, 0.012, -4.5],
          [RINK_DIMENSIONS.PENALTY_SPOT_AWAY_X, 0.012, 4.5],
          [RINK_DIMENSIONS.GOAL_LINE_X_AWAY, 0.012, 4.5],
        ]}
        color={whiteLineColor}
        lineWidth={2}
      />

      {/* Away Penalty Spot (Grande Penalidade at 5.4m: x = +11.6) */}
      <mesh position={[RINK_DIMENSIONS.PENALTY_SPOT_AWAY_X, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={redLineColor} />
      </mesh>

      {/* Away Direct Free-Hit Spot (Livre Direto at 7.4m: x = +9.6) */}
      <mesh position={[RINK_DIMENSIONS.FREE_HIT_AWAY_X, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={whiteLineColor} />
      </mesh>
    </group>
  );
};
