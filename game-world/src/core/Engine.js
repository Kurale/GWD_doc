import { GAME_CONFIG, TILE_COLORS } from '../config/gameConfig.js';
import { Player } from '../entities/Player.js';
import { Camera } from './Camera.js';
import { GameLoop } from './GameLoop.js';
import { InputManager } from './InputManager.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { LevelManager } from '../systems/LevelManager.js';
import { UISystem } from '../systems/UISystem.js';
import { PetSystem } from '../systems/PetSystem.js';

export class Engine {
  constructor({ canvas, statusNode }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.input = new InputManager();
    this.physics = new PhysicsSystem({
      gravity: GAME_CONFIG.world.gravity,
      friction: GAME_CONFIG.world.friction,
    });
    this.levels = new LevelManager(GAME_CONFIG.world.tileSize);
    this.ui = new UISystem(statusNode);
    this.petSystem = new PetSystem(GAME_CONFIG.pet);

    this.zoomIndex = 1;
    this.scale = GAME_CONFIG.world.zoomLevels[this.zoomIndex];
    this.logicalWidth = canvas.width / this.scale;
    this.logicalHeight = canvas.height / this.scale;

    this.player = null;
    this.level = null;
    this.coins = 0;

    this.camera = new Camera({
      width: this.logicalWidth,
      height: this.logicalHeight,
      smoothing: GAME_CONFIG.camera.smoothing,
    });

    this.loop = new GameLoop((dt) => this.update(dt), () => this.render());
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
  }

  async init() {
    await this.loadLevel('level-1');
    this.loop.start();
  }

  async loadLevel(levelId, spawnOverride) {
    this.level = await this.levels.load(levelId);

    if (!this.player) {
      this.player = new Player({
        x: 0,
        y: 0,
        config: GAME_CONFIG.player,
      });
    }

    const spawn = spawnOverride || this.level.spawn;
    this.player.position.x = spawn.x;
    this.player.position.y = spawn.y;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;

    this.ui.setMessage(`Локация: ${this.level.name}`);
  }

  onResize() {
    const ratio = 16 / 9;
    const width = Math.min(window.innerWidth - 32, 1280);
    const height = width / ratio;
    this.canvas.width = width;
    this.canvas.height = height;
    this.logicalWidth = this.canvas.width / this.scale;
    this.logicalHeight = this.canvas.height / this.scale;
    this.camera.resize(this.logicalWidth, this.logicalHeight);
  }

  handleInteractions() {
    if (this.input.consumePressed('KeyQ')) {
      this.zoomIndex = (this.zoomIndex + 1) % GAME_CONFIG.world.zoomLevels.length;
      this.scale = GAME_CONFIG.world.zoomLevels[this.zoomIndex];
      this.onResize();
      this.ui.setMessage(`Масштаб: x${this.scale.toFixed(1)}`);
    }

    if (!this.input.consumePressed('KeyE')) {
      return;
    }

    const hitBox = {
      x: this.player.position.x + this.player.facing.x * this.player.interactionRange,
      y: this.player.position.y + this.player.facing.y * this.player.interactionRange,
      width: this.player.width,
      height: this.player.height,
    };

    const candidateNpc = this.level.entities.find((entity) => entity.type === 'npc' && PhysicsSystem.intersects(hitBox, entity.bounds));
    if (candidateNpc) {
      if (candidateNpc.role === 'pet-master' && !this.petSystem.isAdopted) {
        this.petSystem.adoptAtPlayer(this.player);
        this.ui.setMessage(`${candidateNpc.name}: ${candidateNpc.dialog} Питомец теперь с вами.`);
      } else {
        this.ui.setMessage(`${candidateNpc.name}: ${candidateNpc.dialog}`);
      }
    }
  }

  update(dt) {
    if (!this.level || !this.player) {
      return;
    }

    this.handleInteractions();

    this.player.update(dt, this.input);
    this.physics.updateEntity(this.player, dt, this.level);

    for (const entity of this.level.entities) {
      if (!entity.active) {
        continue;
      }

      if (entity.type === 'collectible' && PhysicsSystem.intersects(this.player.bounds, entity.bounds)) {
        entity.active = false;
        this.coins += entity.value;
        this.ui.setMessage('Подобран ресурс.');
      }

      if (entity.type === 'portal' && PhysicsSystem.intersects(this.player.bounds, entity.bounds)) {
        this.loadLevel(entity.targetLevel, entity.targetSpawn);
        return;
      }
    }

    this.petSystem.update(dt, this.player);

    const worldWidth = this.level.width * this.level.tileSize;
    const worldHeight = this.level.height * this.level.tileSize;
    this.camera.follow(this.player, worldWidth, worldHeight);
    this.ui.setCoins(this.coins);
    this.ui.render({ levelName: this.level.name, hasPet: this.petSystem.isAdopted });
  }

  renderTileLayer() {
    const tileSize = this.level.tileSize;
    const startX = Math.floor(this.camera.x / tileSize);
    const startY = Math.floor(this.camera.y / tileSize);
    const endX = Math.min(this.level.width, startX + Math.ceil(this.logicalWidth / tileSize) + 1);
    const endY = Math.min(this.level.height, startY + Math.ceil(this.logicalHeight / tileSize) + 1);

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const tile = this.level.tiles[y][x];
        this.ctx.fillStyle = TILE_COLORS[tile] ?? '#223';
        this.ctx.fillRect(x * tileSize - this.camera.x, y * tileSize - this.camera.y, tileSize, tileSize);
      }
    }
  }

  renderEntities() {
    for (const entity of this.level.entities) {
      if (entity.active) {
        entity.render(this.ctx, this.camera);
      }
    }
    this.player.render(this.ctx, this.camera);
    this.petSystem.render(this.ctx, this.camera);
  }

  render() {
    if (!this.level || !this.player) {
      return;
    }

    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    this.renderTileLayer();
    this.renderEntities();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
