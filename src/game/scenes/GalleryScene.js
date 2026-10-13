// src/game/scenes/GalleryScene.js
// Main museum gallery room with exhibits, collisions, and final room portal

import Phaser from 'phaser';
import { generateTextures } from '../textures/TextureGenerator';
import { Player } from '../objects/Player';
import { EXHIBITS } from '../../data/exhibits';
import { EventBus, EVENTS } from '../EventBus';

export class GalleryScene extends Phaser.Scene {
  constructor() {
    super('GalleryScene');
    this.spawnPoint = 'entrance';
  }

  init(data) {
    this.spawnPoint = data?.spawn || 'entrance';
  }

  preload() {
    generateTextures(this);
    EXHIBITS.forEach((exhibit) => {
      if (exhibit.image) {
        this.load.image(`thumb-${exhibit.id}`, exhibit.image);
      }
    });
  }

  create() {
    const mapWidth = 800;
    const mapHeight = 576;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // 1. Render Parquet Floor (25 cols x 18 rows of 32x32)
    for (let x = 0; x < mapWidth; x += 32) {
      for (let y = 0; y < mapHeight; y += 32) {
        this.add.image(x + 16, y + 16, 'floor');
      }
    }

    // 2. Red Velvet Carpet Runner down the center aisle (cols 11, 12, 13)
    for (let y = 64; y < mapHeight - 32; y += 32) {
      this.add.image(400 - 32, y + 16, 'carpet');
      this.add.image(400, y + 16, 'carpet');
      this.add.image(400 + 32, y + 16, 'carpet');
    }

    // 3. Static Physics Group for Walls and Solid Obstacles
    this.walls = this.physics.add.staticGroup();

    // Top Wall (row 0: y=0 to 32)
    for (let x = 0; x < mapWidth; x += 32) {
      // Leave gap at center (x=384, x=416) for the Arch Doorway
      if (x < 352 || x > 448) {
        const wall = this.walls.create(x + 16, 16, 'wall');
        wall.body.setSize(32, 32);
        wall.refreshBody();
      }
    }

    // Bottom Wall
    for (let x = 0; x < mapWidth; x += 32) {
      const wall = this.walls.create(x + 16, mapHeight - 16, 'wall');
      wall.body.setSize(32, 32);
      wall.refreshBody();
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

    // 4. Arch Doorway to Final Room (Center Top)
    this.doorway = this.add.image(400, 32, 'doorway');
    this.doorway.setDepth(20);

    // Doorway trigger sensor
    this.doorTrigger = this.physics.add.sprite(400, 38, null);
    this.doorTrigger.setVisible(false);
    this.doorTrigger.body.setSize(48, 20);

    // 5. Ornamental Marble Columns
    const columnPositions = [
      { x: 250, y: 160 },
      { x: 550, y: 160 },
      { x: 250, y: 380 },
      { x: 550, y: 380 }
    ];

    columnPositions.forEach(pos => {
      const col = this.add.image(pos.x, pos.y, 'column');
      col.setDepth(pos.y + 20);
      const colBase = this.walls.create(pos.x, pos.y + 18, null);
      colBase.setVisible(false);
      colBase.body.setSize(24, 16);
      colBase.refreshBody();
    });

    // 6. Potted Museum Plants
    const plantPositions = [
      { x: 64, y: 70 },
      { x: 736, y: 70 },
      { x: 64, y: 500 },
      { x: 736, y: 500 }
    ];

    plantPositions.forEach(pos => {
      const plant = this.add.image(pos.x, pos.y, 'plant');
      plant.setDepth(pos.y + 10);
      const plantBase = this.walls.create(pos.x, pos.y + 14, null);
      plantBase.setVisible(false);
      plantBase.body.setSize(20, 16);
      plantBase.refreshBody();
    });

    // 6b. Blooming Daisy Vases (Interactive pickups)
    this.daisyItems = [];
    const daisyPositions = [
      { x: 330, y: 38 }, // Left of Arch Doorway
      { x: 470, y: 38 }, // Right of Arch Doorway
      { x: 48, y: 120 },  // Left Gallery Wall
      { x: 752, y: 120 }, // Right Gallery Wall
      { x: 48, y: 440 },  // Lower Left
      { x: 752, y: 440 }  // Lower Right
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
        id: `daisy-g-${idx + 1}`,
        x: pos.x,
        y: pos.y,
        vase,
        bubble,
        picked: false
      });
    });

    // 6c. Museum Benches in Central Hall
    const benchPositions = [
      { x: 400, y: 270 }
    ];

    benchPositions.forEach(pos => {
      const bench = this.add.image(pos.x, pos.y, 'bench');
      bench.setDepth(pos.y + 8);
      const benchBase = this.walls.create(pos.x, pos.y + 6, null);
      benchBase.setVisible(false);
      benchBase.body.setSize(44, 16);
      benchBase.refreshBody();
    });

    // 7. Framed Exhibits
    this.exhibitItems = [];
    const exhibitPositions = [
      // Top wall (4 exhibits)
      { x: 160, y: 34, exhibit: EXHIBITS[0] },
      { x: 280, y: 34, exhibit: EXHIBITS[1] },
      { x: 520, y: 34, exhibit: EXHIBITS[2] },
      { x: 640, y: 34, exhibit: EXHIBITS[3] },
      // Left wall (2 exhibits)
      { x: 40, y: 200, exhibit: EXHIBITS[4] },
      { x: 40, y: 340, exhibit: EXHIBITS[5] },
      // Right wall (2 exhibits)
      { x: 760, y: 200, exhibit: EXHIBITS[6] },
      { x: 760, y: 340, exhibit: EXHIBITS[7] }
    ];

    exhibitPositions.forEach(slot => {
      if (!slot.exhibit) return;

      // Frame image
      const frame = this.add.image(slot.x, slot.y, 'exhibit-frame');
      frame.setDepth(4);

      // Embedded photo thumbnail inside the frame canvas area
      if (this.textures.exists(`thumb-${slot.exhibit.id}`)) {
        const thumb = this.add.image(slot.x, slot.y - 4, `thumb-${slot.exhibit.id}`);
        thumb.setDisplaySize(20, 20);
        thumb.setDepth(5);
      }

      // Bubble [E] prompt (hidden by default)
      const bubble = this.add.image(slot.x, slot.y - 24, 'bubble-e');
      bubble.setDepth(50);
      bubble.setVisible(false);

      // Proximity sensor area
      const sensor = this.physics.add.sprite(slot.x, slot.y + 24, null);
      sensor.setVisible(false);
      sensor.body.setSize(44, 44);

      this.exhibitItems.push({
        data: slot.exhibit,
        frame,
        bubble,
        sensor
      });
    });

    // 8. Spawn Player (Entrance or returning from final room doorway)
    const spawnX = 400;
    const spawnY = this.spawnPoint === 'doorway' ? 90 : 480;
    this.player = new Player(this, spawnX, spawnY);
    this.physics.add.collider(this.player.sprite, this.walls);

    // 9. Camera setup
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // 10. Doorway overlap transition
    this.physics.add.overlap(this.player.sprite, this.doorTrigger, () => {
      EventBus.emit(EVENTS.ENTER_FINAL_ROOM);
      this.scene.start('FinalRoomScene');
    });

    // Cleanup player listeners on scene shutdown
    this.events.once('shutdown', () => {
      this.player?.destroy();
    });

    // Announce ready
    EventBus.emit(EVENTS.GAME_READY, { sceneKey: 'GalleryScene' });
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

    // 1. Check proximity to all exhibits
    for (const item of this.exhibitItems) {
      const distance = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        item.sensor.x,
        item.sensor.y
      );

      if (distance < 38) {
        if (!item.bubble.visible) {
          item.bubble.setVisible(true);
          // Subtle floating bob tween
          this.tweens.add({
            targets: item.bubble,
            y: item.frame.y - 28,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
          this.player.currentNearExhibit = item.data;
          EventBus.emit(EVENTS.PLAYER_NEAR_EXHIBIT, {
            exhibitId: item.data.id,
            title: item.data.title,
            exhibit: item.data
          });
        }
      } else {
        if (item.bubble.visible) {
          item.bubble.setVisible(false);
          this.tweens.killTweensOf(item.bubble);
          item.bubble.y = item.frame.y - 24;
          if (this.player.currentNearExhibit?.id === item.data.id) {
            this.player.currentNearExhibit = null;
            EventBus.emit(EVENTS.PLAYER_LEFT_EXHIBIT, { exhibitId: item.data.id });
          }
        }
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
      if (!this.player.currentNearExhibit) {
        EventBus.emit(EVENTS.PLAYER_LEFT_EXHIBIT, { exhibitId: 'daisy' });
      }
    }
  }
}
