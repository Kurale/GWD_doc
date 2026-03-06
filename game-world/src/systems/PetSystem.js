import { Pet } from '../entities/Pet.js';

export class PetSystem {
  constructor(config) {
    this.config = config;
    this.pet = null;
    this.isAdopted = false;
  }

  adoptAtPlayer(player) {
    if (this.isAdopted) {
      return;
    }
    this.pet = new Pet({
      x: player.position.x - 20,
      y: player.position.y + 8,
      config: this.config,
    });
    this.isAdopted = true;
  }

  update(dt, player) {
    if (!this.pet || !this.isAdopted) {
      return;
    }
    this.pet.update(dt, player);
  }

  render(ctx, camera) {
    if (this.pet?.active) {
      this.pet.render(ctx, camera);
    }
  }
}
