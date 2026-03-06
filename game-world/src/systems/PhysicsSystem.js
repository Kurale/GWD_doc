export class PhysicsSystem {
  constructor({ gravity = 0, friction = 1 }) {
    this.gravity = gravity;
    this.friction = friction;
  }

  static intersects(a, b) {
    return (
      a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y
    );
  }

  updateEntity(entity, dt, level) {
    entity.velocity.y += this.gravity * dt;

    entity.velocity.x *= this.friction;
    entity.velocity.y *= this.friction;

    const nextX = entity.position.x + entity.velocity.x * dt;
    const nextY = entity.position.y + entity.velocity.y * dt;

    const resolvedX = this.resolveAxis(entity, nextX, entity.position.y, level, 'x');
    entity.position.x = resolvedX.position;
    if (resolvedX.collided) {
      entity.velocity.x = 0;
    }

    const resolvedY = this.resolveAxis(entity, entity.position.x, nextY, level, 'y');
    entity.position.y = resolvedY.position;
    if (resolvedY.collided) {
      entity.velocity.y = 0;
    }
  }

  resolveAxis(entity, proposedX, proposedY, level, axis) {
    const bounds = {
      x: proposedX,
      y: proposedY,
      width: entity.width,
      height: entity.height,
    };

    const tiles = level.getSolidTilesNear(bounds);

    for (const tile of tiles) {
      if (!PhysicsSystem.intersects(bounds, tile)) {
        continue;
      }

      if (axis === 'x') {
        if (entity.velocity.x > 0) {
          return { position: tile.x - entity.width, collided: true };
        }
        return { position: tile.x + tile.width, collided: true };
      }

      if (entity.velocity.y > 0) {
        return { position: tile.y - entity.height, collided: true };
      }
      return { position: tile.y + tile.height, collided: true };
    }

    return { position: axis === 'x' ? proposedX : proposedY, collided: false };
  }
}
