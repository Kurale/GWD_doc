import { Entity } from './Entity.js';

export class Pet extends Entity {
  constructor({ x, y, config }) {
    super({
      id: 'pet',
      type: 'pet',
      x,
      y,
      width: config.width,
      height: config.height,
      color: config.color,
      solid: false,
    });
    this.followDistance = config.followDistance;
    this.speed = config.speed;
  }

  update(dt, player) {
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.followDistance) {
      this.velocity.x = (dx / dist) * this.speed;
      this.velocity.y = (dy / dist) * this.speed;
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      return;
    }

    this.velocity.x = 0;
    this.velocity.y = 0;
  }
}
