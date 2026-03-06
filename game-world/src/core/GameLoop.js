export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.lastTime = 0;
    this.running = false;
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    requestAnimationFrame((timestamp) => this.step(timestamp));
  }

  step(timestamp) {
    if (!this.running) {
      return;
    }

    const dt = Math.min((timestamp - this.lastTime) / 1000 || 0, 0.033);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((next) => this.step(next));
  }
}
