export class AssetManager {
  constructor() {
    this.cache = new Map();
  }

  async loadImage(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(path, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  }

  async preload() {
    const basePath = './assets/tiles/characters/player';
    const sprites = [
      'standStill',
      'Left',
      'Right',
      'OnDown',
      'FromUp',
      'DownLeft',
      'DownRight',
      'TopLeft',
      'TopRight'
    ];

    const loadPromises = sprites.map(sprite =>
      this.loadImage(`${basePath}/${sprite}.png`)
        .then(img => ({ key: sprite, img }))
        .catch(err => {
          console.warn(`Warning: ${err.message}`);
          return null;
        })
    );

    const results = await Promise.all(loadPromises);
    const loaded = results.filter(r => r !== null);

    console.log(`Loaded ${loaded.length}/${sprites.length} player sprites`);
    return Promise.resolve();
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}
