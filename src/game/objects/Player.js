// src/game/objects/Player.js
// Player entity handling physics, animations, keyboard, and virtual joycon input

import Phaser from 'phaser';
import { EventBus, EVENTS } from '../EventBus';

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create player animations if not already created
    this.createAnimations();

    // Create arcade sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player-sheet', 1);
    this.sprite.setDepth(10);
    this.sprite.setCollideWorldBounds(true);

    // Bounded hitbox around feet for top-down 2.5D depth illusion
    this.sprite.body.setSize(18, 12);
    this.sprite.body.setOffset(7, 20);

    this.baseSpeed = 160;
    this.currentDirection = 'down';
    this.isFrozen = false;
    this.currentNearExhibit = null;
    this.isInDoorway = false;
    this.isInPedestal = false;

    // Mobile joystick vector
    this.mobileInput = { active: false, vx: 0, vy: 0, force: 0 };

    // 1. Setup Phaser keyboard listeners
    if (scene.input && scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        interactE: Phaser.Input.Keyboard.KeyCodes.E,
        interactSpace: Phaser.Input.Keyboard.KeyCodes.SPACE
      });
    }

    // 2. Direct Window Keyboard Listeners (Bulletproof across focus and browser states)
    this.keysDown = new Set();
    this.handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      this.keysDown.add(e.code);
      this.keysDown.add(e.key.toLowerCase());

      if (e.code === 'KeyE' || e.key.toLowerCase() === 'e' || e.code === 'Space') {
        this.triggerInteraction();
      }
    };

    this.handleKeyUp = (e) => {
      this.keysDown.delete(e.code);
      this.keysDown.delete(e.key.toLowerCase());
    };

    this.handleBlur = () => {
      this.keysDown.clear();
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);

    // 3. Listen to mobile controller events
    this.unsubscribeJoystickMove = EventBus.on(EVENTS.JOYSTICK_MOVE, (data) => {
      this.mobileInput = {
        active: true,
        vx: data.vx,
        vy: data.vy,
        force: data.force
      };
    });

    this.unsubscribeJoystickStop = EventBus.on(EVENTS.JOYSTICK_STOP, () => {
      this.mobileInput = { active: false, vx: 0, vy: 0, force: 0 };
    });

    this.unsubscribeActionPress = EventBus.on(EVENTS.ACTION_PRESS, () => {
      this.triggerInteraction();
    });

    this.unsubscribeOpenExhibit = EventBus.on(EVENTS.OPEN_EXHIBIT, () => {
      this.freeze();
    });

    this.unsubscribeCloseExhibit = EventBus.on(EVENTS.CLOSE_EXHIBIT, () => {
      this.unfreeze();
    });

    this.unsubscribeOpenLetter = EventBus.on(EVENTS.OPEN_LETTER, () => {
      this.freeze();
    });

    this.unsubscribeCloseLetter = EventBus.on(EVENTS.CLOSE_LETTER, () => {
      this.unfreeze();
    });
  }

  createAnimations() {
    const anims = this.scene.anims;
    if (anims.exists('walk-down')) return;

    // Row 0: Down (frames 0, 1, 2)
    anims.create({
      key: 'walk-down',
      frames: anims.generateFrameNumbers('player-sheet', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });
    // Row 1: Left (frames 3, 4, 5)
    anims.create({
      key: 'walk-left',
      frames: anims.generateFrameNumbers('player-sheet', { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    // Row 2: Right (frames 6, 7, 8)
    anims.create({
      key: 'walk-right',
      frames: anims.generateFrameNumbers('player-sheet', { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });
    // Row 3: Up (frames 9, 10, 11)
    anims.create({
      key: 'walk-up',
      frames: anims.generateFrameNumbers('player-sheet', { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
  }

  freeze() {
    this.isFrozen = true;
    this.keysDown.clear();
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.stop();
    this.setIdleFrame();
  }

  unfreeze() {
    this.isFrozen = false;
    this.keysDown.clear();
  }

  setIdleFrame() {
    const idleMap = {
      down: 1,
      left: 4,
      right: 7,
      up: 10
    };
    this.sprite.setFrame(idleMap[this.currentDirection] ?? 1);
  }

  triggerInteraction() {
    if (this.isFrozen) return;

    if (this.currentNearDaisy && !this.currentNearDaisy.picked) {
      this.currentNearDaisy.picked = true;
      if (this.currentNearDaisy.bubble) {
        this.currentNearDaisy.bubble.setVisible(false);
      }
      if (this.scene.onDaisyPicked) {
        this.scene.onDaisyPicked(this.currentNearDaisy);
      }
      EventBus.emit(EVENTS.PICK_DAISY, { id: this.currentNearDaisy.id });
      this.currentNearDaisy = null;
      EventBus.emit(EVENTS.PLAYER_LEFT_EXHIBIT, { exhibitId: 'daisy' });
      return;
    }

    if (this.currentNearExhibit) {
      EventBus.emit(EVENTS.OPEN_EXHIBIT, {
        exhibitId: this.currentNearExhibit.id,
        exhibit: this.currentNearExhibit
      });
    } else if (this.isInPedestal) {
      EventBus.emit(EVENTS.OPEN_LETTER);
    }
  }

  update() {
    // Dynamic depth sorting so player stands behind/in front of furniture correctly
    this.sprite.setDepth(this.sprite.y);

    if (this.isFrozen) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    // Check interaction keys via Phaser JustDown
    if (
      this.wasd &&
      (Phaser.Input.Keyboard.JustDown(this.wasd.interactE) ||
        Phaser.Input.Keyboard.JustDown(this.wasd.interactSpace))
    ) {
      this.triggerInteraction();
    }

    let vx = 0;
    let vy = 0;

    // 1. Direct Keyboard & Cursor Inputs
    const isLeft =
      this.keysDown.has('KeyA') ||
      this.keysDown.has('a') ||
      this.keysDown.has('ArrowLeft') ||
      Boolean(this.cursors?.left?.isDown) ||
      Boolean(this.wasd?.left?.isDown);

    const isRight =
      this.keysDown.has('KeyD') ||
      this.keysDown.has('d') ||
      this.keysDown.has('ArrowRight') ||
      Boolean(this.cursors?.right?.isDown) ||
      Boolean(this.wasd?.right?.isDown);

    const isUp =
      this.keysDown.has('KeyW') ||
      this.keysDown.has('w') ||
      this.keysDown.has('ArrowUp') ||
      Boolean(this.cursors?.up?.isDown) ||
      Boolean(this.wasd?.up?.isDown);

    const isDown =
      this.keysDown.has('KeyS') ||
      this.keysDown.has('s') ||
      this.keysDown.has('ArrowDown') ||
      Boolean(this.cursors?.down?.isDown) ||
      Boolean(this.wasd?.down?.isDown);

    if (isLeft) vx -= 1;
    if (isRight) vx += 1;
    if (isUp) vy -= 1;
    if (isDown) vy += 1;

    // 2. Mobile Joystick Override / Blend
    if (
      this.mobileInput.active &&
      (Math.abs(this.mobileInput.vx) > 0.05 || Math.abs(this.mobileInput.vy) > 0.05)
    ) {
      vx = this.mobileInput.vx * this.mobileInput.force;
      vy = this.mobileInput.vy * this.mobileInput.force;
    } else if (vx !== 0 && vy !== 0) {
      // Normalize diagonal keyboard speed
      vx *= 0.7071;
      vy *= 0.7071;
    }

    // Apply Velocity
    const finalVx = vx * this.baseSpeed;
    const finalVy = vy * this.baseSpeed;
    this.sprite.setVelocity(finalVx, finalVy);

    // Update Facing Direction and Walk Cycle
    if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
      if (Math.abs(vx) > Math.abs(vy)) {
        if (vx < 0) {
          this.currentDirection = 'left';
          this.sprite.play('walk-left', true);
        } else {
          this.currentDirection = 'right';
          this.sprite.play('walk-right', true);
        }
      } else {
        if (vy < 0) {
          this.currentDirection = 'up';
          this.sprite.play('walk-up', true);
        } else {
          this.currentDirection = 'down';
          this.sprite.play('walk-down', true);
        }
      }
    } else {
      this.sprite.anims.stop();
      this.setIdleFrame();
    }
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);

    this.unsubscribeJoystickMove?.();
    this.unsubscribeJoystickStop?.();
    this.unsubscribeActionPress?.();
    this.unsubscribeOpenExhibit?.();
    this.unsubscribeCloseExhibit?.();
    this.unsubscribeOpenLetter?.();
    this.unsubscribeCloseLetter?.();

    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
