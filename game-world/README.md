# Arcadia World (Arcade + RPG, 2D Tile)

Production-oriented browser project with scalable architecture:

- 3 isolated levels (`level-1`, `level-2`, `level-3`) with seamless transitions via portals.
- Orthogonal 2D tile maps stored in JSON, compatible with Tiled workflow.
- Expandable entity model: player, NPC, collectible, portal, pet.
- "Life" system starter: adoptable pet that follows player across locations.

## Stack decision

- **Vanilla JavaScript + Canvas 2D + ES Modules** for full control over engine boundaries and predictable performance.
- Data-driven levels to keep game logic independent from map authoring in Tiled Editor.

## Project structure

```text
game-world/
  index.html
  styles.css
  src/
    main.js
    config/gameConfig.js
    core/
      Engine.js
      GameLoop.js
      Camera.js
      InputManager.js
      AssetManager.js
    entities/
      Entity.js
      Player.js
      Pet.js
      NPC.js
      Collectible.js
      Portal.js
    systems/
      PhysicsSystem.js
      LevelManager.js
      EntityFactory.js
      UISystem.js
      PetSystem.js
    data/levels/
      level-1.json
      level-2.json
      level-3.json
```

## Run

Use any static server from IDE terminal:

```bash
cd game-world
python -m http.server 8080
```

Open `http://localhost:8080`.

## Tiled Editor integration

1. Build maps in **Orthogonal** mode.
2. Keep tile size aligned with config (`tileSize = 32`).
3. Export map to JSON.
4. Convert exported tile layers to `tiles` 2D matrix expected by `LevelManager`.
5. Add level entities in JSON under `entities` with `kind` field (`npc`, `collectible`, `portal`).


## Graphics requirements

Подробная памятка по требованиям к графике, форматам, атласам и budget:

- `docs/GRAPHICS_REQUIREMENTS.md`

## Architectural overview

- **Engine** — composition root and runtime orchestration.
- **Game Loop** — `requestAnimationFrame`, `delta time`, strict `update/render` split.
- **Physics** — AABB, axis-separated collision resolution.
- **Rendering** — viewport-culling tile renderer + entity pass, zoom scaling.
- **Input** — edge-triggered + hold handling.
- **Entity System** — base class with extensible domain entities.
- **Level System** — JSON-driven loader + factory-based entity creation.
- **UI** — HUD state projection.
- **Asset Management** — prepared layer for atlas/sound pipeline.

## Game loop scheme

1. Capture input state.
2. `update(dt)`:
   - Process interactions.
   - Update player/pet.
   - Resolve physics.
   - Handle triggers (collectibles, portals).
   - Move camera and project UI state.
3. `render()`:
   - Apply camera transform and scale.
   - Render visible tile region.
   - Render active entities.


## Portal transition notes

- `level-1 -> level-2 -> level-3` использует разнесённые spawn-позиции, чтобы после загрузки игрок не появлялся внутри обратного портала.
- Если в Tiled вы меняете порталы, проверяйте: spawn не должен пересекаться с trigger-боксом любого portal.

## Extension guide

- **Add level:** create new `src/data/levels/level-X.json`; add portal entity from existing map.
- **Add enemy type:** create `Enemy` entity + behavior system; register in `EntityFactory`.
- **Power-ups:** add new `collectible` subtype and apply effects in update pipeline.
- **Animations:** replace solid-color rendering with sprite atlas in render pass.
- **Sound:** implement `AudioSystem` and trigger by game events.
