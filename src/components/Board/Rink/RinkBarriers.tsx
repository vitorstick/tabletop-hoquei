import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { RINK_DIMENSIONS } from '../../../constants/rinkDimensions';

function createRoundedRect(width: number, height: number, radius: number, segments = 24): [number, number, number][] {
  const points: [number, number, number][] = [];
  const halfW = width / 2;
  const halfH = height / 2;
  const r = Math.min(radius, halfW, halfH);

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([halfW - r + r * Math.sin(theta), 0.1, -halfH + r - r * Math.cos(theta)]);
  }
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([halfW - r + r * Math.cos(theta), 0.1, halfH - r + r * Math.sin(theta)]);
  }
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([-halfW + r - r * Math.sin(theta), 0.1, halfH - r + r * Math.cos(theta)]);
  }
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * (Math.PI / 2);
    points.push([-halfW + r - r * Math.cos(theta), 0.1, -halfH + r - r * Math.sin(theta)]);
  }
  points.push(points[0]);
  return points;
}

export const RinkBarriers: React.FC = () => {
  const outerBorderPoints = useMemo(() => {
    return createRoundedRect(
      RINK_DIMENSIONS.LENGTH + 0.5,
      RINK_DIMENSIONS.WIDTH + 0.5,
      RINK_DIMENSIONS.CORNER_RADIUS + 0.25
    );
  }, []);

  const innerDasherPoints = useMemo(() => {
    return createRoundedRect(
      RINK_DIMENSIONS.LENGTH,
      RINK_DIMENSIONS.WIDTH,
      RINK_DIMENSIONS.CORNER_RADIUS
    );
  }, []);

  return (
    <group>
      {/* Outer Protective Wall Border */}
      <Line
        points={outerBorderPoints}
        color="#1e293b"
        lineWidth={6}
      />
      {/* Inner White Kickplate */}
      <Line
        points={innerDasherPoints}
        color="#f8fafc"
        lineWidth={3}
      />
    </group>
  );
};
