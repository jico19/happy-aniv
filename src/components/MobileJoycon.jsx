// src/components/MobileJoycon.jsx
// Joycon-styled mobile analog thumbstick and tactile action button
// Supports both dedicated portrait mobile console deck and floating landscape overlay

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EventBus, EVENTS } from '../game/EventBus';

const MAX_RADIUS = 42;
const DEAD_ZONE = 6;

export function MobileJoycon({ isNearExhibit, isModalOpen, isPortrait = false }) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;
  });
  const stickBaseRef = useRef(null);
  const touchIdRef = useRef(null);
  const lastActionTimeRef = useRef(0);

  // Update touch detection on window resize
  useEffect(() => {
    const handleResize = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch || window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateKnob = useCallback((clientX, clientY) => {
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
  }, []);

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
  }, [isDragging, updateKnob]);

  // Debounced action button handler to prevent duplicate triggers and click bleed-through
  const handleActionButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastActionTimeRef.current < 450) return;
    lastActionTimeRef.current = now;
    EventBus.emit(EVENTS.ACTION_PRESS);
  };

  // If in landscape / desktop mode and modal is open or not a touch device, hide floating joycon
  if (!isPortrait && (!isTouchDevice || isModalOpen)) {
    return null;
  }

  // 1. DEDICATED PORTRAIT CONSOLE DECK LAYOUT (Game Boy / Switch style bottom controller)
  if (isPortrait) {
    return (
      <div
        className="w-full h-full flex flex-col justify-between px-6 py-3.5 select-none touch-none bg-gradient-to-b from-[#1c1815] via-[#151210] to-[#0c0a09]"
        style={{ touchAction: 'none' }}
      >
        {/* Console Bezel Header */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-pulse" />
            <span className="font-serif text-[11px] tracking-widest uppercase text-stone-400">
              Ang ating museum
            </span>
          </div>
          <div className="text-[10px] font-mono tracking-wider uppercase text-[#c5a880]/80 bg-stone-900/90 px-2 py-0.5 rounded border border-stone-800">
            Handheld Deck
          </div>
        </div>

        {/* Main Controls Deck: Left Thumbstick, Center Accent, Right Action Buttons */}
        <div className="flex items-center justify-between py-1 flex-1">
          {/* Left: Joycon Analog Stick */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              ref={stickBaseRef}
              onTouchStart={handleTouchStart}
              onPointerDown={(e) => {
                // Support mouse dragging during testing/emulation
                if (e.pointerType === 'mouse') {
                  const onMouseMove = (me) => updateKnob(me.clientX, me.clientY);
                  const onMouseUp = () => {
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    setKnobPos({ x: 0, y: 0 });
                    EventBus.emit(EVENTS.JOYSTICK_STOP);
                  };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                  updateKnob(e.clientX, e.clientY);
                }
              }}
              className="relative w-24 h-24 rounded-full bg-[#181513] border-2 border-stone-700/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center touch-none cursor-pointer"
            >
              {/* Cardinal Markers */}
              <div className="absolute top-1.5 w-1 h-1.5 bg-stone-600 rounded-full" />
              <div className="absolute bottom-1.5 w-1 h-1.5 bg-stone-600 rounded-full" />
              <div className="absolute left-1.5 h-1 w-1.5 bg-stone-600 rounded-full" />
              <div className="absolute right-1.5 h-1 w-1.5 bg-stone-600 rounded-full" />

              {/* Inner Track Ring */}
              <div className="w-14 h-14 rounded-full border border-stone-800/80" />

              {/* Movable Joycon Knob */}
              <div
                className={`absolute w-12 h-12 rounded-full bg-[#272320] border border-stone-600 shadow-md flex items-center justify-center transition-transform ${
                  isDragging ? 'scale-95 duration-75' : 'duration-150'
                }`}
                style={{
                  transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
                }}
              >
                {/* Thumb Cap Texture */}
                <div className="w-5 h-5 rounded-full bg-[#1e1b19] border border-stone-700/60 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                </div>
              </div>
            </div>
            <span className="text-[10px] font-sans uppercase tracking-wider text-stone-500 font-medium">
              Walk
            </span>
          </div>

          {/* Center: Decorative Grill Accent */}
          <div className="hidden sm:flex flex-col items-center gap-1 opacity-50">
            <div className="flex gap-1 text-[10px] text-stone-600">
              <span>••••</span>
              <span>••••</span>
            </div>
          </div>

          {/* Right: Tactile Action Buttons Deck */}
          <div className="flex items-center gap-3">
            {/* Secondary B Button */}
            <div className="flex flex-col items-center gap-1.5 pt-4">
              <button
                type="button"
                disabled
                className="w-11 h-11 rounded-full bg-[#1f1b18] border border-stone-800 text-stone-600 flex flex-col items-center justify-center shadow-inner select-none opacity-40 cursor-default"
              >
                <span className="text-xs font-serif font-bold">B</span>
              </button>
              <span className="text-[9px] font-sans uppercase tracking-wider text-stone-600">
                Back
              </span>
            </div>

            {/* Primary A Action Button */}
            <div className="flex flex-col items-center gap-1.5 pb-2">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onPointerUp={(e) => {
                  handleActionButton(e);
                }}
                onClick={(e) => {
                  handleActionButton(e);
                }}
                aria-label="Inspect Exhibit"
                className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center font-serif transition-all active:scale-90 shadow-2xl cursor-pointer ${
                  isNearExhibit
                    ? 'bg-gradient-to-b from-[#e1cca7] to-[#b89569] text-stone-950 border-2 border-[#f5ebd9] shadow-[0_0_28px_rgba(197,168,128,0.45)] ring-2 ring-[#c5a880]/30'
                    : 'bg-gradient-to-b from-[#2a2420] to-[#1a1715] text-stone-300 border border-stone-700/90 shadow-lg'
                }`}
              >
                <span className={`text-xl font-bold ${isNearExhibit ? 'text-stone-950' : 'text-stone-200'}`}>
                  A
                </span>
                <span className="text-[10px] tracking-wider uppercase font-sans font-semibold -mt-0.5">
                  {isNearExhibit ? 'View' : 'Act'}
                </span>
              </button>
              <span className={`text-[10px] font-sans uppercase tracking-wider font-medium ${
                isNearExhibit ? 'text-[#c5a880]' : 'text-stone-500'
              }`}>
                {isNearExhibit ? 'Inspect' : 'Action'}
              </span>
            </div>
          </div>
        </div>

        {/* Console Bottom Hint */}
        <div className="flex items-center justify-between text-[9px] text-stone-600 font-mono tracking-widest pt-1 border-t border-stone-800/40">
          <span>DRAG TO MOVE</span>
          <span>TAP A TO INTERACT</span>
        </div>
      </div>
    );
  }

  // 2. FLOATING OVERLAY LAYOUT (Landscape mobile)
  return (
    <div
      className="fixed inset-x-0 bottom-0 pointer-events-none z-30 select-none pb-6 px-6 flex justify-between items-end"
      style={{ touchAction: 'none' }}
    >
      {/* Left Joycon Thumbstick */}
      <div
        ref={stickBaseRef}
        onTouchStart={handleTouchStart}
        className="pointer-events-auto relative w-24 h-24 rounded-full bg-[#181513]/85 border border-stone-700/70 shadow-xl flex items-center justify-center touch-none transition-colors"
      >
        <div className="absolute top-1.5 w-1 h-1.5 bg-stone-600 rounded-full" />
        <div className="absolute bottom-1.5 w-1 h-1.5 bg-stone-600 rounded-full" />
        <div className="absolute left-1.5 h-1 w-1.5 bg-stone-600 rounded-full" />
        <div className="absolute right-1.5 h-1 w-1.5 bg-stone-600 rounded-full" />
        <div className="w-14 h-14 rounded-full border border-stone-800" />
        <div
          className={`absolute w-12 h-12 rounded-full bg-[#272320] border border-stone-600 shadow-md flex items-center justify-center transition-transform ${
            isDragging ? 'scale-95 duration-75' : 'duration-150'
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
          }}
        >
          <div className="w-5 h-5 rounded-full bg-[#1e1b19] border border-stone-700/60 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600" />
          </div>
        </div>
      </div>

      {/* Right Joycon Action Button */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={handleActionButton}
          onClick={handleActionButton}
          aria-label="Inspect Exhibit"
          className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center font-serif transition-all active:scale-95 shadow-xl ${
            isNearExhibit
              ? 'bg-[#c5a880] text-stone-950 border-2 border-[#e6d0b3] shadow-[0_0_20px_rgba(197,168,128,0.25)]'
              : 'bg-[#221e1b]/90 text-stone-400 border border-stone-700'
          }`}
        >
          <span className="text-lg font-semibold">A</span>
          <span className="text-[10px] tracking-wider uppercase font-sans -mt-0.5">
            {isNearExhibit ? 'View' : 'Act'}
          </span>
        </button>
      </div>
    </div>
  );
}
