// src/components/MuseumHUD.jsx
// Minimalist, elegant on-screen museum HUD indicators

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function MuseumHUD({
  viewedCount,
  totalCount,
  daisyCount = 0,
  toastMessage = null,
  isMuted,
  onToggleMute
}) {
  return (
    <div className="fixed inset-x-0 top-0 pointer-events-none z-30 p-4 sm:p-6 flex justify-between items-start select-none">
      {/* Top Left: Exhibit Counter & Daisy Counter */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-[#181513]/90 border border-stone-800 px-3.5 py-1.5 rounded-full shadow-md">
          <span className="font-serif text-xs text-stone-300 tracking-wider uppercase">
            Exhibits
          </span>
          <span className="text-stone-500 text-xs">/</span>
          <span className="font-serif font-medium text-xs text-[#c5a880]">
            {viewedCount} of {totalCount}
          </span>
        </div>

        {daisyCount > 0 && (
          <div className="flex items-center gap-1.5 bg-[#181513]/90 border border-stone-700/80 px-3 py-1.5 rounded-full shadow-md text-amber-200 text-xs font-serif animate-in fade-in slide-in-from-top-1 duration-200">
            <span>🌼</span>
            <span className="font-medium text-[#fef08a]">{daisyCount}</span>
            <span className="text-stone-400 text-[10px] uppercase tracking-wider font-sans">
              {daisyCount === 1 ? 'daisy' : 'daisies'}
            </span>
          </div>
        )}
      </div>

      {/* Floating Center Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none bg-[#1e1a17]/95 border border-[#8a7657]/50 text-[#f5ebd9] px-4 py-1.5 rounded-full text-xs font-serif shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Right: Audio Control */}
      <div className="pointer-events-auto">
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          className="p-2.5 rounded-full bg-[#181513]/90 border border-stone-800 text-stone-300 hover:text-stone-100 hover:border-stone-700 shadow-md transition-all active:scale-95"
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Bottom Center: Desktop Controls Hint */}
      <div className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 pointer-events-none items-center gap-3 bg-[#181513]/90 border border-stone-800 px-4 py-1.5 rounded-full shadow-lg text-[11px] font-sans text-stone-400">
        <span><kbd className="text-stone-200 font-mono bg-stone-800 px-1.5 py-0.5 rounded">WASD</kbd> Walk</span>
        <span className="text-stone-600">•</span>
        <span><kbd className="text-stone-200 font-mono bg-stone-800 px-1.5 py-0.5 rounded">E</kbd> / <kbd className="text-stone-200 font-mono bg-stone-800 px-1.5 py-0.5 rounded">Space</kbd> Interact / Pick</span>
        <span className="text-stone-600">•</span>
        <span><kbd className="text-stone-200 font-mono bg-stone-800 px-1.5 py-0.5 rounded">Esc</kbd> Close</span>
      </div>
    </div>
  );
}
