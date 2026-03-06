import { Entity } from './Entity.js';

export class NPC extends Entity {
  constructor({ id, x, y, name, dialog, role = 'villager' }) {
    super({
      id,
      type: 'npc',
      x,
      y,
      width: 24,
      height: 28,
      color: '#e9c46a',
      solid: true,
    });
    this.name = name;
    this.dialog = dialog;
    this.role = role;
  }
}
