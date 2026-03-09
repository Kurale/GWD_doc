export class SpriteAnimator {
  constructor(assetManager, animationConfig) {
    this.assets = assetManager;
    this.animations = animationConfig;
    this.currentAnimation = 'idle';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 150; // ms per frame
  }

  setAnimation(name) {
    if (this.currentAnimation !== name && this.animations[name]) {
      this.currentAnimation = name;
      this.frameIndex = 0;
      this.frameTimer = 0;
    }
  }

  update(dt) {
    const anim = this.animations[this.currentAnimation];
    if (!anim || !anim.frames || anim.frames.length <= 1) {
      return;
    }

    this.frameTimer += dt * 1000;
    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % anim.frames.length;
    }
  }

  getCurrentFrame() {
    const anim = this.animations[this.currentAnimation];
    if (!anim || !anim.frames) {
      return null;
    }
    return anim.frames[this.frameIndex];
  }

  render(ctx, x, y, width, height) {
    const frameKey = this.getCurrentFrame();
    if (!frameKey) {
      return;
    }

    const img = this.assets.get(frameKey);
    if (!img) {
      return;
    }

    ctx.drawImage(img, x, y, width, height);
  }
}
