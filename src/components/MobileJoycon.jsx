// src/components/MobileJoycon.jsx
// Joycon-styled mobile analog thumbstick and tactile action button

import React, { useState, useRef, useEffect } from 'react';
import { EventBus, EVENTS } from '../game/EventBus';

const MAX_RADIUS = 42;
const DEAD_ZONE = 6;

export function MobileJoycon({ isNearExhibit, isModalOpen }) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;
  });
  const stickBaseRef = useRef(null);
  const touchIdRef = useRef(null);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch || window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateKnob = (clientX, clientY) => {
    if (!stickBaseRef.current) return;
    const rect = stickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < DEAD_ZONE) {
      setKnobPos({ x: 0, y: 0 });
      EventBus.emit(EVENTS.JOYSTICK_STOP);
      return;
    }

    const clampedDist = Math.min(distance, MAX_RADIUS);
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: clampedX, y: clampedY });

    // Normalized vector & proportional force
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const force = Math.min(1.0, distance / MAX_RADIUS);

    EventBus.emit(EVENTS.JOYSTICK_MOVE, { vx, vy, force });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (!stickBaseRef.current || touchIdRef.current !== null) return;

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onTouchMove = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          updateKnob(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const onTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setIsDragging(false);
          setKnobPos({ x: 0, y: 0 });
          EventBus.emit(EVENTS.JOYSTICK_STOP);
          break;
        }
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDragging]);

  const handleActionButton = (e) => {
    e.preventDefault();
    EventBus.emit(EVENTS.ACTION_PRESS);
  };

  // If desktop or if modal is open, don't show joycon overlay
  if (!isTouchDevice || isModalOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 pointer-events-none z-30 select-none pb-6 px-6 flex justify-between items-end"
      style={{ touchAction: 'none' }}
    >
      {/* 1. Left Joycon Thumbstick */}
      <div
        ref={stickBaseRef}
        onTouchStart={handleTouchStart}
        className="pointer-events-auto relative w-24 h-24 rounded-full bg-[#181513]/85 border border-stone-700/70 shadow-xl flex items-center justify-center touch-none transition-colors"
      >
        {/* Subtle cardinal markers */}
        <div className="absolute top-1.5 w-1 h-1.5 bg-stone-600 rounded-full" />
        <div className="absolute bottom-1.5 w-1 h-1.5 bg-stone-600 rounded-full" />
        <div className="absolute left-1.5 h-1 w-1.5 bg-stone-600 rounded-full" />
        <div className="absolute right-1.5 h-1 w-1.5 bg-stone-600 rounded-full" />

        {/* Inner track ring */}
        <div className="w-14 h-14 rounded-full border border-stone-800" />

        {/* Movable Joycon Knob */}
        <div
          className={`absolute w-12 h-12 rounded-full bg-[#272320] border border-stone-600 shadow-md flex items-center justify-center transition-transform ${
            isDragging ? 'scale-95 duration-75' : 'duration-150'
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
          }}
        >
          {/* Thumb cap texture */}
          <div className="w-5 h-5 rounded-full bg-[#1e1b19] border border-stone-700/60 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600" />
          </div>
        </div>
      </div>

      {/* 2. Right Joycon Action Button */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <button
          onTouchStart={handleActionButton}
          onClick={handleActionButton}
          aria-label="Inspect Exhibit"
          className={`relative w-18 h-18 rounded-full flex flex-col items-center justify-center font-serif transition-all active:scale-95 shadow-xl ${
            isNearExhibit
              ? 'bg-[#c5a880] text-stone-950 border-2 border-[#e6d0b3] shadow-[0_0_20px_rgba(197,168,128,0.25)]'
              : 'bg-[#221e1b]/90 text-stone-400 border border-stone-700'
          }`}
        >
          <span className="text-base font-semibold">A</span>
          <span className="text-[10px] tracking-wider uppercase font-sans -mt-0.5">
            {isNearExhibit ? 'View' : 'Act'}
          </span>
        </button>
      </div>
    </div>
  );
}
