export class AssetManager {
  constructor() {
    this.cache = new Map();
  }

  async preload() {
    return Promise.resolve();
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}
