// src/game/scenes/FinalRoomScene.js
// The Anniversary Chamber with glowing letter pedestal and return portal

import Phaser from 'phaser';
import { generateTextures } from '../textures/TextureGenerator';
import { Player } from '../objects/Player';
import { EventBus, EVENTS } from '../EventBus';

export class FinalRoomScene extends Phaser.Scene {
  constructor() {
    super('FinalRoomScene');
  }

  preload() {
    generateTextures(this);
  }

  create() {
    const mapWidth = 512;
    const mapHeight = 448;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // 1. Dark warm wooden floor
    for (let x = 0; x < mapWidth; x += 32) {
      for (let y = 0; y < mapHeight; y += 32) {
        this.add.image(x + 16, y + 16, 'floor');
      }
    }

    // 2. Velvet carpet running up to the center pedestal
    for (let y = 192; y < mapHeight - 32; y += 32) {
      this.add.image(256 - 32, y + 16, 'carpet');
      this.add.image(256, y + 16, 'carpet');
      this.add.image(256 + 32, y + 16, 'carpet');
    }

    // 3. Ambient warm spotlight over the pedestal
    const light = this.add.graphics();
    light.fillStyle(0xfff3d1, 0.12);
    light.fillCircle(256, 192, 110);
    light.fillStyle(0xfff3d1, 0.22);
    light.fillCircle(256, 192, 60);

    // 4. Perimeter Walls
    this.walls = this.physics.add.staticGroup();

    // Top Wall
    for (let x = 0; x < mapWidth; x += 32) {
      const wall = this.walls.create(x + 16, 16, 'wall');
      wall.body.setSize(32, 32);
      wall.refreshBody();
    }

    // Bottom Wall with doorway gap at center (x=256)
    for (let x = 0; x < mapWidth; x += 32) {
      if (x < 224 || x > 288) {
        const wall = this.walls.create(x + 16, mapHeight - 16, 'wall');
        wall.body.setSize(32, 32);
        wall.refreshBody();
      }
    }

    // Left and Right Walls
    for (let y = 32; y < mapHeight - 32; y += 32) {
      const leftWall = this.walls.create(16, y + 16, 'wall');
      leftWall.body.setSize(32, 32);
      leftWall.refreshBody();

      const rightWall = this.walls.create(mapWidth - 16, y + 16, 'wall');
      rightWall.body.setSize(32, 32);
      rightWall.refreshBody();
    }

    // 5. Marble Columns flanking the pedestal
    const columnPositions = [
      { x: 140, y: 160 },
      { x: 372, y: 160 }
    ];

    columnPositions.forEach(pos => {
      const col = this.add.image(pos.x, pos.y, 'column');
      col.setDepth(pos.y + 20);
      const colBase = this.walls.create(pos.x, pos.y + 18, null);
      colBase.setVisible(false);
      colBase.body.setSize(24, 16);
      colBase.refreshBody();
    });

    // 5b. Flanking Daisy Vases around the Anniversary Pedestal (Interactive pickups)
    this.daisyItems = [];
    const daisyPositions = [
      { x: 195, y: 180 },
      { x: 317, y: 180 },
      { x: 60, y: 60 },
      { x: 452, y: 60 }
    ];

    daisyPositions.forEach((pos, idx) => {
      const vase = this.add.image(pos.x, pos.y, 'daisy-vase');
      vase.setDepth(pos.y + 12);
      const vaseBase = this.walls.create(pos.x, pos.y + 12, null);
      vaseBase.setVisible(false);
      vaseBase.body.setSize(16, 14);
      vaseBase.refreshBody();

      // Floating prompt bubble above vase
      const bubble = this.add.image(pos.x, pos.y - 20, 'bubble-e');
      bubble.setDepth(999);
      bubble.setVisible(false);

      this.daisyItems.push({
        id: `daisy-f-${idx + 1}`,
        x: pos.x,
        y: pos.y,
        vase,
        bubble,
        picked: false
      });
    });

    // 6. Centerpiece Pedestal with Anniversary Envelope
    this.pedestal = this.add.image(256, 180, 'pedestal');
    this.pedestal.setDepth(185);

    // Pedestal collision base
    const pedBase = this.walls.create(256, 192, null);
    pedBase.setVisible(false);
    pedBase.body.setSize(36, 24);
    pedBase.refreshBody();

    // Floating [E] prompt above pedestal
    this.bubble = this.add.image(256, 140, 'bubble-e');
    this.bubble.setDepth(200);
    this.bubble.setVisible(false);

    // Pedestal proximity sensor
    this.pedSensor = this.physics.add.sprite(256, 215, null);
    this.pedSensor.setVisible(false);
    this.pedSensor.body.setSize(50, 50);

    // Subtle gentle floating bob on pedestal envelope
    this.tweens.add({
      targets: this.pedestal,
      y: 177,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 7. South Exit Return Trigger
    this.exitTrigger = this.physics.add.sprite(256, mapHeight - 12, null);
    this.exitTrigger.setVisible(false);
    this.exitTrigger.body.setSize(48, 20);

    // 8. Spawn Player at South Entrance
    this.player = new Player(this, 256, 380);
    this.physics.add.collider(this.player.sprite, this.walls);

    // 9. Camera setup
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // 10. Exit Doorway overlap -> Return to Gallery
    this.physics.add.overlap(this.player.sprite, this.exitTrigger, () => {
      EventBus.emit(EVENTS.RETURN_TO_GALLERY);
      this.scene.start('GalleryScene', { spawn: 'doorway' });
    });

    // Cleanup player listeners on scene shutdown
    this.events.once('shutdown', () => {
      this.player?.destroy();
    });

    // Announce ready
    EventBus.emit(EVENTS.GAME_READY, { sceneKey: 'FinalRoomScene' });
  }

  onDaisyPicked(item) {
    if (item.bubble) {
      this.tweens.killTweensOf(item.bubble);
      item.bubble.setVisible(false);
    }
    // Swap texture to picked vase
    if (item.vase && this.textures.exists('daisy-vase-picked')) {
      item.vase.setTexture('daisy-vase-picked');
    }

    // Sparkle / petal particles burst
    for (let i = 0; i < 7; i++) {
      const petal = this.add.circle(
        item.x + (Math.random() - 0.5) * 10,
        item.y - 8 + (Math.random() - 0.5) * 6,
        2.5,
        i % 2 === 0 ? 0xffffff : 0xfef08a
      );
      petal.setDepth(1000);
      this.tweens.add({
        targets: petal,
        x: petal.x + (Math.random() - 0.5) * 30,
        y: petal.y - 30 - Math.random() * 20,
        alpha: 0,
        scale: 0.3,
        duration: 800 + Math.random() * 300,
        ease: 'Cubic.easeOut',
        onComplete: () => petal.destroy()
      });
    }

    // Floating pickup label
    const text = this.add.text(item.x, item.y - 18, '+1 🌼', {
      fontFamily: 'serif',
      fontSize: '12px',
      color: '#fef08a'
    }).setOrigin(0.5).setDepth(1001);

    this.tweens.add({
      targets: text,
      y: text.y - 22,
      alpha: 0,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy()
    });
  }

  update() {
    this.player.update();

    // 1. Check distance to anniversary pedestal
    const distance = Phaser.Math.Distance.Between(
      this.player.sprite.x,
      this.player.sprite.y,
      this.pedSensor.x,
      this.pedSensor.y
    );

    if (distance < 45) {
      this.player.isInPedestal = true;
      if (!this.bubble.visible) {
        this.bubble.setVisible(true);
        this.tweens.add({
          targets: this.bubble,
          y: 135,
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        EventBus.emit(EVENTS.PLAYER_NEAR_EXHIBIT, {
          exhibitId: 'anniversary-letter',
          title: 'The Anniversary Letter'
        });
      }
    } else {
      if (this.bubble.visible) {
        this.bubble.setVisible(false);
        this.tweens.killTweensOf(this.bubble);
        this.bubble.y = 140;
        this.player.isInPedestal = false;
        EventBus.emit(EVENTS.PLAYER_LEFT_EXHIBIT, { exhibitId: 'anniversary-letter' });
      }
    }

    // 2. Check proximity to unpicked daisies
    let nearDaisy = null;
    for (const daisy of this.daisyItems) {
      if (daisy.picked) continue;

      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        daisy.x,
        daisy.y
      );

      if (dist < 36) {
        nearDaisy = daisy;
        if (!daisy.bubble.visible) {
          daisy.bubble.setVisible(true);
          this.tweens.add({
            targets: daisy.bubble,
            y: daisy.y - 24,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
          EventBus.emit(EVENTS.PLAYER_NEAR_EXHIBIT, {
            exhibitId: daisy.id,
            title: 'White Daisy',
            type: 'daisy'
          });
        }
      } else if (daisy.bubble.visible) {
        daisy.bubble.setVisible(false);
        this.tweens.killTweensOf(daisy.bubble);
        daisy.bubble.y = daisy.y - 20;
      }
    }

    if (nearDaisy) {
      this.player.currentNearDaisy = nearDaisy;
    } else if (this.player.currentNearDaisy) {
      this.player.currentNearDaisy = null;
      if (!this.player.currentNearExhibit && !this.player.isInPedestal) {
        EventBus.emit(EVENTS.PLAYER_LEFT_EXHIBIT, { exhibitId: 'daisy' });
      }
    }
  }
}
