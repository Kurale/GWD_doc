import { NPC } from '../entities/NPC.js';
import { Collectible } from '../entities/Collectible.js';
import { Portal } from '../entities/Portal.js';

export class EntityFactory {
  static build(definition) {
    switch (definition.kind) {
      case 'npc':
        return new NPC(definition);
      case 'collectible':
        return new Collectible(definition);
      case 'portal':
        return new Portal(definition);
      default:
        throw new Error(`Unknown entity kind: ${definition.kind}`);
    }
  }
}
