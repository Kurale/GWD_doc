import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor({ x, y, config }) {
    super({
      id: 'player',
      type: 'player',
      x,
      y,
      width: config.width,
      height: config.height,
      color: config.color,
      solid: true,
    });
    this.maxSpeed = config.maxSpeed;
    this.acceleration = config.acceleration;
    this.interactionRange = config.interactionRange;
    this.facing = { x: 1, y: 0 };
  }

  update(dt, input) {
    const dirX = (input.isPressed('ArrowRight') || input.isPressed('KeyD') ? 1 : 0)
      - (input.isPressed('ArrowLeft') || input.isPressed('KeyA') ? 1 : 0);
    const dirY = (input.isPressed('ArrowDown') || input.isPressed('KeyS') ? 1 : 0)
      - (input.isPressed('ArrowUp') || input.isPressed('KeyW') ? 1 : 0);

    if (dirX || dirY) {
      const length = Math.hypot(dirX, dirY) || 1;
      const normX = dirX / length;
      const normY = dirY / length;
      this.facing = { x: normX, y: normY };

      this.velocity.x += normX * this.acceleration * dt;
      this.velocity.y += normY * this.acceleration * dt;
    }

    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > this.maxSpeed) {
      const ratio = this.maxSpeed / speed;
      this.velocity.x *= ratio;
      this.velocity.y *= ratio;
    }
  }
}
