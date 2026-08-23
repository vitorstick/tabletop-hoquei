/**
 * Official World Skate / FIRS Roller Hockey Rink Dimensions (in meters)
 * Coordinate system:
 * X-axis: Long side [-20.0, 20.0] (40m total)
 * Z-axis: Short side [-10.0, 10.0] (20m total)
 * Y-axis: Up
 */
export const RINK_DIMENSIONS = {
  // Dimensions
  LENGTH: 40.0,      // X span: [-20, 20]
  WIDTH: 20.0,       // Z span: [-10, 10]
  CORNER_RADIUS: 2.5,
  BARRIER_HEIGHT: 1.0,
  
  // Clamping boundaries for tokens
  CLAMP_X_MIN: -19.2,
  CLAMP_X_MAX: 19.2,
  CLAMP_Z_MIN: -9.2,
  CLAMP_Z_MAX: 9.2,

  // Goal & Inset specifications
  GOAL_LINE_X_HOME: -17.0, // Inset 3m from end board at -20m
  GOAL_LINE_X_AWAY: 17.0,  // Inset 3m from end board at +20m
  BEHIND_NET_CLEARANCE: 3.0,

  // Goal Cage dimensions
  GOAL_WIDTH: 1.70,   // Along Z: [-0.85, 0.85]
  GOAL_DEPTH: 1.05,   // Towards the end boards
  GOAL_HEIGHT: 1.05,  // Above rink floor

  // Goalkeeper Crease (Protection Area)
  CREASE_RADIUS: 1.5, // Semi-circle towards center

  // Penalty & Direct Free Hit Spots
  PENALTY_SPOT_DISTANCE: 5.4,   // 5.4m from goal line (x = ±11.6)
  FREE_HIT_SPOT_DISTANCE: 7.4,  // 7.4m from goal line (x = ±9.6)
  
  PENALTY_SPOT_HOME_X: -11.6,
  PENALTY_SPOT_AWAY_X: 11.6,
  FREE_HIT_HOME_X: -9.6,
  FREE_HIT_AWAY_X: 9.6,

  // Penalty Area Box (surrounding the crease)
  PENALTY_BOX_WIDTH: 9.0, // Z from -4.5 to +4.5
  PENALTY_BOX_DEPTH: 5.4, // Extends to penalty spot (x from ±17 to ±11.6)

  // Center Markings
  CENTER_CIRCLE_RADIUS: 3.0,
  CENTER_SPOT_RADIUS: 0.15,

  // Token sizes
  PLAYER_RADIUS: 0.75,
  PLAYER_HEIGHT: 0.22,
  BALL_RADIUS: 0.28,
  BALL_ATTACH_DISTANCE: 1.1, // Max distance to snap ball
} as const;
