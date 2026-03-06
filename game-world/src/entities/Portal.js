import { Entity } from './Entity.js';

export class Portal extends Entity {
  constructor({ id, x, y, width = 32, height = 32, targetLevel, targetSpawn }) {
    super({
      id,
      type: 'portal',
      x,
      y,
      width,
      height,
      color: '#9b5de5',
      solid: false,
    });
    this.targetLevel = targetLevel;
    this.targetSpawn = targetSpawn;
  }
}
