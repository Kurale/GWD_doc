export class Camera {
  constructor({ width, height, smoothing }) {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.smoothing = smoothing;
    this.x = 0;
    this.y = 0;
  }

  resize(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  follow(target, worldWidth, worldHeight) {
    const desiredX = target.position.x - this.viewportWidth / 2 + target.width / 2;
    const desiredY = target.position.y - this.viewportHeight / 2 + target.height / 2;

    const maxX = Math.max(0, worldWidth - this.viewportWidth);
    const maxY = Math.max(0, worldHeight - this.viewportHeight);

    const clampedX = Math.max(0, Math.min(desiredX, maxX));
    const clampedY = Math.max(0, Math.min(desiredY, maxY));

    this.x += (clampedX - this.x) * this.smoothing;
    this.y += (clampedY - this.y) * this.smoothing;
  }
}
