// src/components/MuseumGame.jsx
// React wrapper managing Phaser lifecycle with strict-mode double-mount safety

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/MuseumGameConfig';

export function MuseumGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Guard against React 18/19 strict mode double-initialization
    if (!gameRef.current) {
      const config = createGameConfig(containerRef.current);
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-stone-950 overflow-hidden select-none">
      <div
        ref={containerRef}
        id="phaser-container"
        className="w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
