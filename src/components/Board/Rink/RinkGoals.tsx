import React from 'react';
import { Line } from '@react-three/drei';
import { RINK_DIMENSIONS } from '../../../constants/rinkDimensions';

interface GoalCageProps {
  x: number;
  facing: 1 | -1; // 1: faces +x (Home goal), -1: faces -x (Away goal)
}

const SingleGoalCage: React.FC<GoalCageProps> = ({ x, facing }) => {
  const halfW = RINK_DIMENSIONS.GOAL_WIDTH / 2; // 0.85m
  const depth = RINK_DIMENSIONS.GOAL_DEPTH * facing; // -1.05m for Home, +1.05m for Away
  const backX = x - depth;
  const frameColor = '#dc2626'; // Bright Red Posts
  const netColor = '#e2e8f0';

  // Posts & Crossbar footprint
  const cageOutline: [number, number, number][] = [
    [x, 0.05, -halfW],
    [backX, 0.05, -halfW * 0.7],
    [backX, 0.05, halfW * 0.7],
    [x, 0.05, halfW],
    [x, 0.05, -halfW]
  ];

  return (
    <group>
      {/* 2D/3D Goal Line Frame */}
      <Line
        points={cageOutline}
        color={frameColor}
        lineWidth={4}
      />

      {/* Goal Opening Crossbar highlight */}
      <Line
        points={[
          [x, 0.08, -halfW],
          [x, 0.08, halfW]
        ]}
        color="#ffffff"
        lineWidth={3}
      />

      {/* Net backing mesh representation */}
      <mesh position={[(x + backX) / 2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[Math.abs(x - backX), halfW * 1.5]} />
        <meshBasicMaterial color={netColor} transparent opacity={0.25} />
      </mesh>

      {/* Left and Right Post Discs */}
      <mesh position={[x, 0.08, -halfW]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color={frameColor} />
      </mesh>
      <mesh position={[x, 0.08, halfW]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color={frameColor} />
      </mesh>
    </group>
  );
};

export const RinkGoals: React.FC = () => {
  return (
    <group>
      {/* Home Goal at x = -17.0 */}
      <SingleGoalCage x={RINK_DIMENSIONS.GOAL_LINE_X_HOME} facing={1} />
      {/* Away Goal at x = +17.0 */}
      <SingleGoalCage x={RINK_DIMENSIONS.GOAL_LINE_X_AWAY} facing={-1} />
    </group>
  );
};
