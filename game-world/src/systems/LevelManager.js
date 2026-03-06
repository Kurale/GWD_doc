import { TILE_TYPES } from '../config/gameConfig.js';
import { EntityFactory } from './EntityFactory.js';

export class Level {
  constructor(data, tileSize) {
    this.id = data.id;
    this.name = data.name;
    this.tileSize = tileSize;
    this.width = data.width;
    this.height = data.height;
    this.tiles = data.tiles;
    this.spawn = data.spawn;
    this.adoptionZone = data.adoptionZone;
    this.entities = data.entities.map((entity) => EntityFactory.build(entity));
  }

  getSolidTilesNear(bounds) {
    const minX = Math.max(0, Math.floor(bounds.x / this.tileSize) - 1);
    const minY = Math.max(0, Math.floor(bounds.y / this.tileSize) - 1);
    const maxX = Math.min(this.width - 1, Math.ceil((bounds.x + bounds.width) / this.tileSize) + 1);
    const maxY = Math.min(this.height - 1, Math.ceil((bounds.y + bounds.height) / this.tileSize) + 1);

    const solids = [];
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const tile = this.tiles[y][x];
        if (tile === TILE_TYPES.WALL || tile === TILE_TYPES.HOUSE || tile === TILE_TYPES.WATER) {
          solids.push({
            x: x * this.tileSize,
            y: y * this.tileSize,
            width: this.tileSize,
            height: this.tileSize,
          });
        }
      }
    }
    return solids;
  }
}

export class LevelManager {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.cache = new Map();
    this.currentLevel = null;
  }

  async load(id) {
    if (!this.cache.has(id)) {
      const response = await fetch(`./src/data/levels/${id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load level ${id}`);
      }
      const data = await response.json();
      this.cache.set(id, new Level(data, this.tileSize));
    }
    this.currentLevel = this.cache.get(id);
    return this.currentLevel;
  }
}
