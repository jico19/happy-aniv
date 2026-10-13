// src/components/MuseumGame.jsx
// React wrapper managing Phaser lifecycle with strict-mode double-mount safety and responsive resize

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/MuseumGameConfig';

export function MuseumGame({ isPortrait = false }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Guard against React strict mode double-initialization
    if (!gameRef.current) {
      const config = createGameConfig(containerRef.current);
      gameRef.current = new Phaser.Game(config);
    }

    const handleResize = () => {
      if (gameRef.current) {
        setTimeout(() => {
          gameRef.current?.scale?.refresh();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Refresh scale whenever switching between portrait and landscape modes
  useEffect(() => {
    if (gameRef.current) {
      setTimeout(() => {
        gameRef.current?.scale?.refresh();
      }, 100);
    }
  }, [isPortrait]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#100d0b] overflow-hidden select-none">
      <div
        ref={containerRef}
        id="phaser-container"
        className="w-full h-full flex items-center justify-center"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
