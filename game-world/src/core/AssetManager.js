export class AssetManager {
  constructor() {
    this.cache = new Map();
  }

  async loadImage(path, key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(key, img);
        console.log(`✓ Loaded sprite: ${key}`);
        resolve(img);
      };
      img.onerror = () => {
        console.error(`✗ Failed to load: ${path}`);
        reject(new Error(`Failed to load image: ${path}`));
      };
      img.src = path;
    });
  }

  async loadTileset(name) {
    const basePath = './assets/tiles/characters/player';
    const imagePath = `${basePath}/${name}.png`;
    const jsonPath = `${basePath}/${name}.json`;

    try {
      // Load JSON metadata
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load JSON: ${jsonPath}`);
      }
      const metadata = await response.json();

      // Load image
      const img = await this.loadImage(imagePath, name);

      const tileset = {
        name,
        image: img,
        tileWidth: metadata.tileWidth,
        tileHeight: metadata.tileHeight,
        columns: metadata.columns,
        tileCount: metadata.tileCount,
        animation: metadata.tiles?.[0]?.animation || []
      };

      this.cache.set(name, tileset);
      console.log(`✓ Loaded tileset: ${name} (${tileset.animation.length} frames)`);
      return tileset;
    } catch (err) {
      console.error(`✗ Failed to load tileset ${name}:`, err.message);
      return null;
    }
  }

  async preload() {
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

    const loadPromises = sprites.map(sprite => this.loadTileset(sprite));
    const results = await Promise.all(loadPromises);
    const loaded = results.filter(r => r !== null);

    console.log(`\n📦 Total: ${loaded.length}/${sprites.length} tilesets loaded`);
    return Promise.resolve();
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}
