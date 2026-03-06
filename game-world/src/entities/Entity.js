export class Entity {
  constructor({ id, x, y, width, height, color = '#fff', solid = false, type = 'entity' }) {
    this.id = id;
    this.type = type;
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.width = width;
    this.height = height;
    this.color = color;
    this.solid = solid;
    this.active = true;
  }

  get bounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }

  update() {}

  render(ctx, camera) {
    const screenX = this.position.x - camera.x;
    const screenY = this.position.y - camera.y;

    ctx.fillStyle = this.color;
    ctx.fillRect(screenX, screenY, this.width, this.height);
  }
}
