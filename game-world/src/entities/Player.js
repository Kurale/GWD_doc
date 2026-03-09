import { Entity } from './Entity.js';
import { SpriteAnimator } from '../core/SpriteAnimator.js';

export class Player extends Entity {
  constructor({ x, y, config, assetManager }) {
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
    this.isMoving = false;

    // Animation setup - now uses tileset names directly
    this.animationConfig = {
      idle: 'standStill',
      right: 'Right',
      left: 'Right',  // Use Right tileset and flip horizontally
      down: 'OnDown',
      up: 'FromUp',
      downRight: 'DownRight',
      downLeft: 'DownRight',  // Use DownRight and flip horizontally
      upRight: 'TopRight',
      upLeft: 'TopRight'  // Use TopRight and flip horizontally
    };
    this.animator = new SpriteAnimator(assetManager, this.animationConfig);
  }

  update(dt, input) {
    const dirX = (input.isPressed('ArrowRight') || input.isPressed('KeyD') ? 1 : 0)
      - (input.isPressed('ArrowLeft') || input.isPressed('KeyA') ? 1 : 0);
    const dirY = (input.isPressed('ArrowDown') || input.isPressed('KeyS') ? 1 : 0)
      - (input.isPressed('ArrowUp') || input.isPressed('KeyW') ? 1 : 0);

    this.isMoving = dirX !== 0 || dirY !== 0;

    if (this.isMoving) {
      const length = Math.hypot(dirX, dirY) || 1;
      const normX = dirX / length;
      const normY = dirY / length;
      this.facing = { x: normX, y: normY };

      this.velocity.x += normX * this.acceleration * dt;
      this.velocity.y += normY * this.acceleration * dt;

      this.updateAnimation(normX, normY);
    } else {
      // Quick deceleration when not moving
      const stopSpeed = 20; // Quick stop factor
      this.velocity.x *= Math.pow(0.01, dt);
      this.velocity.y *= Math.pow(0.01, dt);

      // Snap to zero when very slow
      if (Math.abs(this.velocity.x) < 1) this.velocity.x = 0;
      if (Math.abs(this.velocity.y) < 1) this.velocity.y = 0;

      this.animator.setAnimation('idle');
    }

    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > this.maxSpeed) {
      const ratio = this.maxSpeed / speed;
      this.velocity.x *= ratio;
      this.velocity.y *= ratio;
    }

    this.animator.update(dt);
  }

  updateAnimation(dirX, dirY) {
    const threshold = 0.5;

    if (dirY < -threshold && dirX > threshold) {
      this.animator.setAnimation('upRight');
    } else if (dirY < -threshold && dirX < -threshold) {
      this.animator.setAnimation('upLeft');
    } else if (dirY > threshold && dirX > threshold) {
      this.animator.setAnimation('downRight');
    } else if (dirY > threshold && dirX < -threshold) {
      this.animator.setAnimation('downLeft');
    } else if (dirX > threshold) {
      this.animator.setAnimation('right');
    } else if (dirX < -threshold) {
      this.animator.setAnimation('left');
    } else if (dirY > threshold) {
      this.animator.setAnimation('down');
    } else if (dirY < -threshold) {
      this.animator.setAnimation('up');
    }
  }

  render(ctx, camera) {
    const screenX = this.position.x - camera.x;
    const screenY = this.position.y - camera.y;

    const isFlipped = this.animator.currentAnimation === 'left' ||
                      this.animator.currentAnimation === 'downLeft' ||
                      this.animator.currentAnimation === 'upLeft';

    ctx.save();
    if (isFlipped) {
      ctx.translate(screenX + this.width, screenY);
      ctx.scale(-1, 1);
      this.animator.render(ctx, 0, 0, this.width, this.height);
    } else {
      this.animator.render(ctx, screenX, screenY, this.width, this.height);
    }
    ctx.restore();
  }
}
