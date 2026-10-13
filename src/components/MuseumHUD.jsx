// src/components/MuseumHUD.jsx
// Museum archival gallery HUD: tailored typography, accession docket styling, no generic AI pill slop

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function MuseumHUD({
  viewedCount,
  totalCount,
  daisyCount = 0,
  toastMessage = null,
  isMuted,
  onToggleMute,
  isPortrait = false
}) {
  const containerClass = isPortrait
    ? 'absolute inset-x-0 top-0 pointer-events-none z-20 p-2.5 flex justify-between items-start select-none'
    : 'fixed inset-x-0 top-0 pointer-events-none z-30 p-4 sm:p-5 flex justify-between items-start select-none';

  return (
    <div className={containerClass}>
      {/* Top Left: Exhibition Archival Docket */}
      <div className="pointer-events-auto flex items-stretch bg-[#151210]/95 border border-[#38312b] rounded-sm shadow-md divide-x divide-[#38312b]/80">
        {/* Gallery Label with Brass Diamond Marker */}
        <div className="px-2.5 py-1 flex items-center gap-1.5 text-[10px] uppercase font-serif tracking-[0.16em] text-[#a89988]">
          <span className="inline-block w-1.5 h-1.5 bg-[#c5a880]/80 rounded-[1px] rotate-45" />
          <span>Exhibits</span>
        </div>

        {/* Archival Ratio Counter */}
        <div className="px-2.5 py-1 flex items-center gap-1 font-serif text-xs">
          <span className="font-semibold text-[#f5ebd9]">{viewedCount}</span>
          <span className="text-[#6d6154] text-[10px]">/</span>
          <span className="text-[#968877] text-[11px]">{totalCount}</span>
        </div>

        {/* Daisy Bouquet Badge (Only when daisies collected) */}
        {daisyCount > 0 && (
          <div className="px-2.5 py-1 flex items-center gap-1.5 text-[#fef08a] bg-[#1e1913]/60 font-serif text-xs">
            <span className="text-xs">🌼</span>
            <span className="font-semibold text-[11px]">{daisyCount}</span>
          </div>
        )}
      </div>

      {/* Floating Center Notification: Archival Placard */}
      {toastMessage && (
        <div
          className={`fixed ${
            isPortrait ? 'top-13' : 'top-15'
          } left-1/2 -translate-x-1/2 z-40 pointer-events-none bg-[#171310] border border-[#524436] text-[#f7efe1] px-3.5 py-1.5 rounded-sm shadow-xl flex items-center gap-2 text-xs font-serif tracking-wide animate-fade-in`}
        >
          <span className="w-1.5 h-1.5 bg-[#c5a880] rounded-[1px] rotate-45 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Right: Museum Audio Guide Button */}
      <div className="pointer-events-auto">
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute background melody' : 'Mute background melody'}
          className="px-2.5 py-1 rounded-sm bg-[#151210]/95 border border-[#38312b] hover:border-[#6d6154] hover:bg-[#1c1815] shadow-md transition-colors flex items-center gap-1.5 text-stone-300 active:scale-95 cursor-pointer"
          title={isMuted ? 'Play music' : 'Mute music'}
        >
          {isMuted ? (
            <VolumeX size={14} className="text-stone-500" />
          ) : (
            <Volume2 size={14} className="text-[#c5a880]" />
          )}
          <span className="hidden sm:inline font-serif text-[10px] tracking-wider uppercase text-[#a89988]">
            {isMuted ? 'Muted' : 'Audio'}
          </span>
        </button>
      </div>

      {/* Bottom Center: Minimalist Exhibition Floor Legend (Desktop / Landscape only) */}
      {!isPortrait && (
        <div className="hidden md:flex fixed bottom-2.5 left-1/2 -translate-x-1/2 pointer-events-none items-center gap-3.5 bg-[#120f0d]/90 border border-[#2d251f] px-3.5 py-1 rounded-sm shadow-md text-[11px] font-serif tracking-wide text-[#8a7c6d]">
          <span><strong className="text-[#c5a880] font-normal">WASD</strong> Move</span>
          <span className="text-[#3d332b]">|</span>
          <span><strong className="text-[#c5a880] font-normal">E / Space</strong> View</span>
          <span className="text-[#3d332b]">|</span>
          <span><strong className="text-[#c5a880] font-normal">Esc</strong> Dismiss</span>
        </div>
      )}
    </div>
  );
}
