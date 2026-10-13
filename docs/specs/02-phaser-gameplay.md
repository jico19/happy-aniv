# 02 - Phaser Gameplay, Scenes & Collisions Specification

## 1. Engine Configuration (`src/game/MuseumGameConfig.js`)

- **Renderer**: `Phaser.AUTO` with pixel art mode enabled (`pixelArt: true`, `antialias: false`, `roundPixels: true`).
- **Resolution**: Base internal resolution `800x600` (or `960x540` 16:9), scaled automatically with `Phaser.Scale.FIT` and `Phaser.Scale.CENTER_BOTH`.
- **Physics**: Arcade Physics with `gravity: { x: 0, y: 0 }`.
- **Background**: Hex `#1a1614` (dark museum ambient tone).

---

## 2. Scenes

### Scene 1: `GalleryScene` (Main Museum Room)
- **Dimensions**: 25x18 tiles (32x32 per tile = 800x576 px).
- **Layout**:
  - Top wall: 4 framed exhibits evenly spaced.
  - Left & Right walls: 2 framed exhibits each (total 8 exhibits in main gallery).
  - Center: Polished parquet/marble floor with ornamental columns and red gallery runner rug.
  - Bottom center: Main entrance spawn point.
  - Top center: Elegant doorway/archway leading to the `FinalRoomScene`.
- **Collision Layer**:
  - Solid perimeter walls.
  - Ornamental columns / stanchions.
  - Exhibit frames (player cannot walk through frames, only stand in front of them).

### Scene 2: `FinalRoomScene` (The Anniversary Chamber)
- **Dimensions**: 16x14 tiles (512x448 px).
- **Atmosphere**: Warm spotlight illumination on a central pedestal or golden framed centerpiece.
- **Centerpiece**:
  - Pedestal with anniversary envelope / glowing frame.
  - Proximity zone triggers "Press E / Tap to Read Anniversary Letter".
- **Doorway**: South exit returning to `GalleryScene`.

---

## 3. Player Entity (`src/game/objects/Player.js`)

- **Sprite Size**: 32x32 pixels (or 16x16 scaled 2x).
- **Movement Speed**: 150 px/sec.
- **Hitbox**: Bounded to lower body/feet (e.g. 16x12 px centered) for natural top-down depth sorting.
- **Depth Sorting**: Y-sorted (`depth = player.y`) so the player walks behind low objects and in front of walls.
- **Animations**:
  - `walk-down`, `walk-up`, `walk-left`, `walk-right`.
  - `idle-down`, `idle-up`, `idle-left`, `idle-right`.
- **Movement Freeze**:
  - When a modal (`OPEN_EXHIBIT` or `OPEN_LETTER`) is active, set velocity to 0 and ignore keyboard/joystick input until `CLOSE_EXHIBIT` / `CLOSE_LETTER`.

---

## 4. Exhibit Proximity & Interaction

- Each exhibit creates a small interaction zone (48x48 px trigger sensor) in front of the frame.
- **Overlap Logic**:
  - When `player` overlaps `exhibit.sensor`:
    - Display visual indicator in game (e.g., retro floating `[E]` bubble above exhibit).
    - Emit `PLAYER_NEAR_EXHIBIT` through EventBus with exhibit metadata.
  - When overlap ends:
    - Hide `[E]` indicator.
    - Emit `PLAYER_LEFT_EXHIBIT`.
- **Trigger**:
  - If player presses `E` / `Space` while in zone, emit `OPEN_EXHIBIT`.
