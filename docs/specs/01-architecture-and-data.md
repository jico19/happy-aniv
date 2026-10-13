# 01 - Architecture & Data Contract Specification

## 1. System Overview & Boundaries

The application is structured into two cleanly decoupled layers:

```
+-----------------------------------------------------------+
|                        React Layer                        |
|   (App shell, Welcome screen, HUD, Modals, Letter, Audio)  |
+-----------------------------+-----------------------------+
                              |
               Events & State Bridge (EventBus)
                              |
+-----------------------------v-----------------------------+
|                     Phaser Game Layer                     |
|  (Canvas rendering, Player, Rooms, Collisions, Proximity)  |
+-----------------------------------------------------------+
```

### Separation of Concerns:
- **Phaser 3**: Handles world rendering (pixel art tiles, sprites), physics collisions, movement calculations, camera follow, and proximity distance checks. It **never** renders complex text modals or manages UI overlay state.
- **React**: Handles all user interface elements (overlays, dialogs, photos, responsive typography, audio playback). It **never** interacts directly with game loop physics or sprite drawing.
- **EventBus**: A simple publish-subscribe mediator (using Phaser's `Events.EventEmitter` or a custom pub-sub) used to pass messages between React and Phaser without tight coupling.

---

## 2. Event Bridge Protocol

| Event Name | Emitter | Payload | Purpose |
| :--- | :--- | :--- | :--- |
| `GAME_READY` | Phaser | `{ sceneKey: string }` | Notifies React that Phaser engine is mounted and assets are loaded. |
| `PLAYER_NEAR_EXHIBIT` | Phaser | `{ exhibitId: string, title: string }` | Instructs UI to show "Press E / Tap to View" interaction prompt. |
| `PLAYER_LEFT_EXHIBIT` | Phaser | `{ exhibitId: string }` | Instructs UI to dismiss interaction prompt. |
| `OPEN_EXHIBIT` | Phaser / React | `{ exhibitId: string }` | Triggers opening of exhibit photo modal. Pauses player movement. |
| `CLOSE_EXHIBIT` | React | `{}` | Closes modal and unfreezes player movement. |
| `ENTER_FINAL_ROOM` | Phaser | `{}` | Notifies React of scene transition to final chamber. |
| `OPEN_LETTER` | Phaser / React | `{}` | Opens the final anniversary letter modal. |
| `CLOSE_LETTER` | React | `{}` | Closes letter modal and resumes museum exploration. |
| `JOYSTICK_MOVE` | React (Mobile) | `{ dx: number, dy: number, angle: number, force: number }` | Sends normalized thumbstick vector to active Phaser player. |
| `JOYSTICK_STOP` | React (Mobile) | `{}` | Halts player walking animation and velocity. |
| `ACTION_PRESS` | React (Mobile) | `{}` | Emulates "E / Space" button press for mobile users. |

---

## 3. Data Schema: Exhibits (`src/data/exhibits.js`)

Each exhibit in the museum follows this contract:

```javascript
/**
 * @typedef {Object} ExhibitData
 * @property {string} id - Unique slug identifier (e.g. 'first-date')
 * @property {string} title - Exhibit display title
 * @property {string} image - Path to image in public folder (e.g. '/1.jpg')
 * @property {string} [date] - Optional date string (e.g. 'October 2025')
 * @property {string} [location] - Optional location string (e.g. 'Central Park')
 * @property {string} caption - Primary narrative text / memory description
 * @property {string} [subtext] - Optional footnote or special note
 * @property {number} gridX - World X tile/coordinate placement
 * @property {number} gridY - World Y tile/coordinate placement
 * @property {'north'|'south'|'east'|'west'} facing - Wall alignment orientation
 */
```

### Static Exhibits Config:
Exhibits are defined in `src/data/exhibits.js` and exported as an array of items. 
The developer maps their chosen photos from `public/*.jpg` directly into this list.

---

## 4. Asset Directory Convention

```
public/
  assets/
    sprites/
      player.png          # 4-direction 16x16 or 32x32 character sprite sheet
    tilesets/
      museum-tiles.png    # Floor, wall, framing, and column tiles
    ui/
      joystick-base.png   # (Optional) SVG/PNG joystick ring
      joystick-knob.png   # (Optional) SVG/PNG joystick thumb
    audio/
      bgm.mp3             # Subtle background loop (optional)
  images/
    memories/             # Or root public/ where 1.jpg..42.jpg already exist
```
