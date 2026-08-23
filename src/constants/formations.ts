import { Vector2D } from '../types/tactics';

export interface FormationTemplate {
  name: string;
  description: string;
  category: 'Offensive' | 'Defensive' | 'Set Piece' | 'Special Teams';
  home: Record<string, { pos: Vector2D; rot: number }>;
  away: Record<string, { pos: Vector2D; rot: number }>;
  ball: Vector2D;
}

export const FORMATIONS: Record<string, FormationTemplate> = {
  'box-2-2': {
    name: 'Square / Box (2-2)',
    description: 'Classic balanced 2 defenders and 2 forwards structure.',
    category: 'Offensive',
    home: {
      'H1': { pos: { x: -16.5, z: 0 }, rot: 0 },         // GK
      'H2': { pos: { x: -10.0, z: -5.0 }, rot: 0 },      // Left Back
      'H3': { pos: { x: -10.0, z: 5.0 }, rot: 0 },       // Right Back
      'H4': { pos: { x: -3.0, z: -5.5 }, rot: 0 },       // Left Forward
      'H5': { pos: { x: -3.0, z: 5.5 }, rot: 0 },        // Right Forward
    },
    away: {
      'A1': { pos: { x: 16.5, z: 0 }, rot: Math.PI },      // GK
      'A2': { pos: { x: 10.0, z: 5.0 }, rot: Math.PI },    // Left Back
      'A3': { pos: { x: 10.0, z: -5.0 }, rot: Math.PI },   // Right Back
      'A4': { pos: { x: 3.0, z: 5.5 }, rot: Math.PI },     // Left Forward
      'A5': { pos: { x: 3.0, z: -5.5 }, rot: Math.PI },    // Right Forward
    },
    ball: { x: -2.0, z: 0 }
  },

  'diamond-1-2-1': {
    name: 'Diamond (1-2-1)',
    description: 'Fluid system with 1 Sweeper/Defender, 2 Ala/Wings, and 1 Pivot/Striker.',
    category: 'Offensive',
    home: {
      'H1': { pos: { x: -16.5, z: 0 }, rot: 0 },         // GK
      'H2': { pos: { x: -11.0, z: 0 }, rot: 0 },         // Sweeper / Fixador
      'H3': { pos: { x: -5.5, z: -6.5 }, rot: 0.2 },     // Left Wing / Ala Esq
      'H4': { pos: { x: -5.5, z: 6.5 }, rot: -0.2 },     // Right Wing / Ala Dir
      'H5': { pos: { x: 1.5, z: 0 }, rot: 0 },           // Pivot / Striker
    },
    away: {
      'A1': { pos: { x: 16.5, z: 0 }, rot: Math.PI },
      'A2': { pos: { x: 11.0, z: 0 }, rot: Math.PI },
      'A3': { pos: { x: 5.5, z: 6.5 }, rot: Math.PI - 0.2 },
      'A4': { pos: { x: 5.5, z: -6.5 }, rot: Math.PI + 0.2 },
      'A5': { pos: { x: -1.5, z: 0 }, rot: Math.PI },
    },
    ball: { x: -11.0, z: 0.8 }
  },

  'triangle-1-1-2': {
    name: 'Triangle + 1 (1-1-2 / Y-Shape)',
    description: 'Deep high pressure with dual forwards pinning defense and central playmaker.',
    category: 'Offensive',
    home: {
      'H1': { pos: { x: -16.5, z: 0 }, rot: 0 },
      'H2': { pos: { x: -12.0, z: 0 }, rot: 0 },         // Last Defender
      'H3': { pos: { x: -6.0, z: 0 }, rot: 0 },          // Playmaker Center
      'H4': { pos: { x: 2.0, z: -6.0 }, rot: 0.3 },      // High Left Forward
      'H5': { pos: { x: 2.0, z: 6.0 }, rot: -0.3 },      // High Right Forward
    },
    away: {
      'A1': { pos: { x: 16.5, z: 0 }, rot: Math.PI },
      'A2': { pos: { x: 10.0, z: -3.5 }, rot: Math.PI },
      'A3': { pos: { x: 10.0, z: 3.5 }, rot: Math.PI },
      'A4': { pos: { x: 4.0, z: -4.0 }, rot: Math.PI },
      'A5': { pos: { x: 4.0, z: 4.0 }, rot: Math.PI },
    },
    ball: { x: -6.0, z: 0.8 }
  },

  'power-play': {
    name: 'Power Play (4 vs 3 Overload)',
    description: 'Special team offensive setup exploiting numerical advantage around the perimeter.',
    category: 'Special Teams',
    home: {
      'H1': { pos: { x: -16.5, z: 0 }, rot: 0 },
      'H2': { pos: { x: 3.0, z: 0 }, rot: 0 },           // Top of the key shooter
      'H3': { pos: { x: 8.0, z: -7.0 }, rot: 0.4 },      // Wide Left wing
      'H4': { pos: { x: 8.0, z: 7.0 }, rot: -0.4 },      // Wide Right wing
      'H5': { pos: { x: 15.0, z: -3.0 }, rot: 0.6 },     // Net-front / Post deflection
    },
    away: {
      'A1': { pos: { x: 16.5, z: 0 }, rot: Math.PI },    // GK
      'A2': { pos: { x: 13.0, z: -2.5 }, rot: Math.PI }, // Triangle low left
      'A3': { pos: { x: 13.0, z: 2.5 }, rot: Math.PI },  // Triangle low right
      'A4': { pos: { x: 9.0, z: 0 }, rot: Math.PI },     // Triangle high tip
      'A5': { pos: { x: 18.0, z: 8.0 }, rot: Math.PI },  // Penalty box / Out
    },
    ball: { x: 3.0, z: 0.8 }
  },

  'free-hit-defense': {
    name: 'Direct Free-Hit (Livre Direto)',
    description: 'Set piece with shooter at 7.4m spot and 4-player defensive barrier formation.',
    category: 'Set Piece',
    home: {
      'H1': { pos: { x: -16.5, z: 0 }, rot: 0 },         // Defending GK
      'H2': { pos: { x: -12.0, z: -1.5 }, rot: 0 },      // Wall 1
      'H3': { pos: { x: -12.0, z: 1.5 }, rot: 0 },       // Wall 2
      'H4': { pos: { x: -9.0, z: -6.0 }, rot: 0 },       // Rebound protect L
      'H5': { pos: { x: -9.0, z: 6.0 }, rot: 0 },        // Rebound protect R
    },
    away: {
      'A1': { pos: { x: 16.5, z: 0 }, rot: Math.PI },
      'A2': { pos: { x: -9.6, z: 0 }, rot: Math.PI },    // Free-hit Direct Shooter!
      'A3': { pos: { x: -5.0, z: -5.0 }, rot: Math.PI }, // Supporting winger
      'A4': { pos: { x: -5.0, z: 5.0 }, rot: Math.PI },  // Supporting winger
      'A5': { pos: { x: 2.0, z: 0 }, rot: Math.PI },     // Safety
    },
    ball: { x: -9.6, z: 0 }
  },

  'behind-net-wrap': {
    name: 'Behind-The-Net Wrap Play (Curva de Tabela)',
    description: 'Exploiting the 3-meter behind-the-net clearance zone to feed a slot one-timer.',
    category: 'Offensive',
    home: {
      'H1': { pos: { x: -16.5, z: 0 }, rot: 0 },
      'H2': { pos: { x: 0.0, z: -4.0 }, rot: 0 },
      'H3': { pos: { x: 0.0, z: 4.0 }, rot: 0 },
      'H4': { pos: { x: 12.0, z: 0.0 }, rot: 0 },         // Slot shooter
      'H5': { pos: { x: 18.5, z: 4.0 }, rot: -1.8 },      // Carrier behind the net!
    },
    away: {
      'A1': { pos: { x: 16.5, z: 0 }, rot: 0.8 },        // GK tracking behind net
      'A2': { pos: { x: 14.5, z: 2.5 }, rot: Math.PI },  // Near post defender
      'A3': { pos: { x: 14.5, z: -2.5 }, rot: Math.PI }, // Far post defender
      'A4': { pos: { x: 10.0, z: 0.0 }, rot: Math.PI },  // Slot cover
      'A5': { pos: { x: 5.0, z: -3.0 }, rot: Math.PI },  // Outlet
    },
    ball: { x: 18.5, z: 4.0 }
  }
};
