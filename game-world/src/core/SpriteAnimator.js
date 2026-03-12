export class SpriteAnimator {
  constructor(assetManager, animationConfig) {
    this.assets = assetManager;
    this.animations = animationConfig;
    this.currentAnimation = 'idle';
    this.frameIndex = 0;
    this.frameTimer = 0;
  }

  setAnimation(name) {
    if (this.currentAnimation !== name && this.animations[name]) {
      this.currentAnimation = name;
      this.frameIndex = 0;
      this.frameTimer = 0;
    }
  }

  update(dt) {
    const animName = this.animations[this.currentAnimation];
    if (!animName) {
      return;
    }

    const tileset = this.assets.get(animName);
    if (!tileset || !tileset.animation || tileset.animation.length <= 1) {
      return;
    }

    const currentFrame = tileset.animation[this.frameIndex];
    this.frameTimer += dt * 1000;

    if (this.frameTimer >= currentFrame.duration) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % tileset.animation.length;
    }
  }

  getCurrentTileset() {
    const animName = this.animations[this.currentAnimation];
    if (!animName) {
      return null;
    }
    return this.assets.get(animName);
  }

  getCurrentFrameIndex() {
    const tileset = this.getCurrentTileset();
    if (!tileset || !tileset.animation) {
      return 0;
    }
    return tileset.animation[this.frameIndex]?.tileid || 0;
  }

  render(ctx, x, y, width, height) {
    const tileset = this.getCurrentTileset();
    if (!tileset || !tileset.image) {
      return;
    }

    const frameIndex = this.getCurrentFrameIndex();
    const { columns, tileWidth, tileHeight, image } = tileset;

    // Calculate source position in tileset
    const srcX = (frameIndex % columns) * tileWidth;
    const srcY = Math.floor(frameIndex / columns) * tileHeight;

    ctx.drawImage(
      image,
      srcX, srcY, tileWidth, tileHeight,  // Source
      x, y, width, height                  // Destination
    );
  }
}
