# 05 - Implementation Task Roadmap

## Phase Breakdown

### Task 1: Foundation & Dependencies (~10m)
- [ ] Install `phaser` and `lucide-react`.
- [ ] Establish directory structure matching specification.
- [ ] Create `src/game/EventBus.js` for decoupled React <-> Phaser communication.
- [ ] Build `src/components/MuseumGame.jsx` with lifecycle mounting/cleanup safety.

### Task 2: Game World & Collision (~25m)
- [ ] Generate pixel-art tiles and character sprites (using Canvas procedural textures or pixel sprites).
- [ ] Build `GalleryScene.js` with museum floor, walls, columns, and doorway.
- [ ] Implement `Player.js` with 4-way arcade physics movement, collision, and depth sorting.
- [ ] Add exhibit frame entities with proximity overlap sensors.

### Task 3: Mobile Virtual Joystick & Joycon Controls (~15m)
- [ ] Create `src/components/MobileJoycon.jsx`.
- [ ] Implement touch vector calculation with normalized speed and deadzone.
- [ ] Wire touch movements to `Player.js` via `JOYSTICK_MOVE` and `JOYSTICK_STOP`.
- [ ] Add touch action button for mobile exhibit inspection.
- [ ] Test mobile viewport touch-locking (`touch-action: none`).

### Task 4: Exhibit Modal & Content Configuration (~20m)
- [ ] Configure `src/data/exhibits.js` with exhibits mapped to `public/*.jpg`.
- [ ] Implement `src/components/ExhibitModal.jsx` with responsive gallery framing and captions.
- [ ] Wire proximity detection to HUD interaction cues.
- [ ] Add viewed exhibit counter tracking.

### Task 5: Final Room & Anniversary Letter (~20m)
- [ ] Build `FinalRoomScene.js` with spotlight ambience and letter pedestal.
- [ ] Implement `src/components/AnniversaryLetter.jsx` with typewriter effect and skip button.
- [ ] Add "Achievement Unlocked: One Year Together" celebration banner.

### Task 6: Polish, Mobile Testing & Verification (~10m)
- [ ] Verify desktop keyboard controls (WASD + Space/E).
- [ ] Verify touch controls in mobile emulation mode.
- [ ] Run `npm run build` to verify clean production bundle with 0 errors.

---

## Verification Acceptance Gates
1. **Desktop Movement Gate**: Player moves in 4 directions without penetrating wall colliders.
2. **Mobile Joystick Gate**: Joycon thumbstick moves player smoothly in 360 degrees on touch devices.
3. **Exhibit Modal Gate**: Approaching a painting displays prompt; pressing E/tapping action button opens correct photo modal; pressing Esc/close button returns focus to player.
4. **Final Chamber Gate**: Walking into top archway transitions to the anniversary room; interacting with centerpiece opens anniversary letter.
5. **Clean Build Gate**: `npm run build` succeeds without lint or bundler errors.
