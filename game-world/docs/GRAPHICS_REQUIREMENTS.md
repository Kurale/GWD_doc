# Arcadia World — Памятка по графическим требованиям

Документ задаёт единые требования к артам для текущего Canvas 2D runtime и будущего перехода на sprite atlas.

## 1) Базовая сетка и масштаб

- **Базовый размер тайла:** `32x32 px`.
- **Текущий тип проекции:** orthogonal (не isometric).
- **Игровой масштаб рендера:** `1.5x / 2x / 2.5x` (управляется runtime).
- **Pixel-perfect режим:** включён (`imageSmoothingEnabled = false`).

### Рекомендованные размеры

- Terrain/tileset: кратно 32 px по ширине и высоте.
- Персонаж игрока: `24x28` hitbox, визуальный спрайт допустимо до `32x32` с transparent padding.
- NPC: визуально 32x32 (или 32x48 для высоких силуэтов), hitbox остаётся отдельно.
- Collectible: `16x16` или `24x24`.
- Питомец: визуально `24x24`.
- Portal FX: `64x64` (под текущую trigger-зону).

## 2) Форматы файлов

### Обязательные

- **PNG** — основной формат для тайлов, персонажей, UI-иконок, VFX-кадров.
- **JSON (Tiled export)** — описание уровней, слои и object layers.

### Допустимые дополнительные

- **WebP** — для крупных фоновых иллюстраций/декора с потерями (не для pixel-art спрайтов).
- **SVG** — только для UI/иконок вне pixel-art pipeline.

### Не использовать

- JPEG для спрайтов и тайлов (артефакты сжатия).
- Анимированные GIF как runtime-источник (конвертировать в atlas).

## 3) Нейминг и структура ассетов

Рекомендуемая структура:

```text
game-world/assets/
  tiles/
    biome-plains.v1.png
    dungeon.v1.png
  characters/
    player/
      player-idle.v1.png
      player-run.v1.png
    npc/
      villager-a.v1.png
  pets/
    fox.v1.png
  items/
    coins.v1.png
  ui/
    hud-icons.v1.png
```

Правила имени:

- lower-kebab-case
- версия в суффиксе: `.v1`, `.v2`
- без пробелов и кириллицы в именах файлов

## 4) Требования к sprite sheet / atlas

- Кадры одинакового размера в пределах одного atlas-блока.
- Отступ между кадрами: **2 px** (минимум), чтобы исключить bleeding.
- Extrude/padding по краям кадров: **1 px**.
- Pivot/anchor хранить в metadata JSON (подготовка к AnimationSystem).
- Один atlas ≤ 4096x4096.

## 5) Ограничения по весу (performance budget)

- Тайлсет биома: до 2–4 MB PNG (до оптимизации).
- Атлас персонажей: до 4 MB PNG.
- UI atlas: до 1 MB.
- Целевой общий первичный пакет графики: **до 15 MB** (MVP), затем lazy-load по локациям.

## 6) Tiled Editor — обязательные настройки

- Orientation: **Orthogonal**.
- Tile size: **32x32**.
- Infinite map: по необходимости, но для production рекомендуется фиксированный bounding box для каждой локации.
- Export: JSON (не embedded base64 images).
- Object layer для интерактивов: `spawn`, `portal`, `npc`, `collectible`, `collision`.

## 7) Коллизии и визуал

- Коллизии не рисуются в текстуре; collision хранится отдельным слоем/данными.
- Визуальные размеры могут отличаться от hitbox (SSOT для hitbox — config/entity data).
- Для интерактивов (portal, trigger) использовать отдельные object bounds.

## 8) Цвет и прозрачность

- Alpha: только premultiplied-safe PNG.
- Не использовать полупрозрачные края на pixel-art тайлах (иначе ореолы на scale).
- Для палитровых проектов держать фиксированную palette document в дизайне.

## 9) Чеклист перед импортом

- [ ] размеры кратны 2 и соответствуют сетке
- [ ] имя файла валидно и версионировано
- [ ] нет JPEG/GIF в runtime-папках
- [ ] atlas имеет padding/extrude
- [ ] экспорт Tiled в JSON проверен
- [ ] интерактивные объекты вынесены в object layer

## 10) План эволюции пайплайна

1. MVP: прямой рендер PNG + JSON уровней.
2. Step 2: atlas packing (TexturePacker/free альтернативы) + metadata.
3. Step 3: анимационные state machines (idle/run/interact).
4. Step 4: streaming/lazy-load ассетов по уровням.
