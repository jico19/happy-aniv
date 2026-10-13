// src/game/MuseumGameConfig.js
// Phaser 3 configuration tuned for crisp retro pixel art & responsive scaling

import Phaser from 'phaser';
import { GalleryScene } from './scenes/GalleryScene';
import { FinalRoomScene } from './scenes/FinalRoomScene';

export function createGameConfig(containerId) {
  return {
    type: Phaser.AUTO,
    parent: containerId,
    width: 800,
    height: 576,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#161210',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
      keyboard: {
        target: window
      }
    },
    scene: [GalleryScene, FinalRoomScene]
  };
}
