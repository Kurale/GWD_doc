export const GAME_CONFIG = {
  world: {
    tileSize: 32,
    gravity: 0,
    friction: 0.85,
    baseScale: 2,
    zoomLevels: [1.5, 2, 2.5],
  },
  player: {
    width: 24,
    height: 28,
    maxSpeed: 240,
    acceleration: 1100,
    interactionRange: 48,
    color: '#5bc0be',
  },
  pet: {
    width: 18,
    height: 18,
    followDistance: 50,
    speed: 190,
    color: '#f4a261',
  },
  camera: {
    smoothing: 0.12,
  },
};

export const TILE_TYPES = {
  EMPTY: 0,
  WALL: 1,
  WATER: 2,
  GRASS: 3,
  HOUSE: 4,
};

export const TILE_COLORS = {
  [TILE_TYPES.EMPTY]: '#2c3e50',
  [TILE_TYPES.WALL]: '#4f5d75',
  [TILE_TYPES.WATER]: '#1f6f8b',
  [TILE_TYPES.GRASS]: '#2d6a4f',
  [TILE_TYPES.HOUSE]: '#7f5539',
};
