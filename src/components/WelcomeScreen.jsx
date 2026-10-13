// src/components/WelcomeScreen.jsx
// Quiet, elegant gallery invitation card without generic AI slop

import React from 'react';

export function WelcomeScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0e0c0b] select-none">
      {/* Museum Exhibition Entrance Card */}
      <div className="relative w-full max-w-md bg-[#181513] border border-stone-800 rounded-lg p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">

        {/* Exhibition Title */}
        <h1 className="text-3xl sm:text-4xl font-serif text-[#f4efe8] tracking-tight font-normal mb-2">
          Ang ating museum
        </h1>
        <p className="text-xs tracking-wider uppercase text-[#c5a880] font-serif mb-6">
          First Anniversary Exhibition
        </p>

        <div className="w-12 h-px bg-stone-700 mb-6" />

        <p className="text-stone-300 font-serif text-sm leading-relaxed mb-8 max-w-xs">
          An intimate collection of shared memories, milestones, and personal moments from our first year together.
        </p>

        {/* Enter Button: Solid, understated, tactile */}
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-3 bg-[#c5a880] hover:bg-[#d5bc97] text-[#1c1611] font-serif text-sm tracking-widest uppercase font-semibold rounded transition-all active:scale-[0.98] shadow-md"
        >
          Enter Gallery
        </button>
      </div>
    </div>
  );
}
