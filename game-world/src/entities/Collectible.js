import { Entity } from './Entity.js';

export class Collectible extends Entity {
  constructor({ id, x, y, itemType, value = 1 }) {
    super({
      id,
      type: 'collectible',
      x,
      y,
      width: 16,
      height: 16,
      color: '#2a9d8f',
      solid: false,
    });
    this.itemType = itemType;
    this.value = value;
    this.collected = false;
  }
}
