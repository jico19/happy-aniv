// src/components/AnniversaryLetter.jsx
// Intimate anniversary letter presented on fine stationery paper

import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { ANNIVERSARY_LETTER } from '../data/exhibits';
import { EventBus, EVENTS } from '../game/EventBus';

export function AnniversaryLetter({ daisyCount = 0, onClose }) {
  const fullText = useMemo(() => {
    return [
      ANNIVERSARY_LETTER.salutation,
      '',
      ...ANNIVERSARY_LETTER.paragraphs,
      '',
      ANNIVERSARY_LETTER.closing,
      ANNIVERSARY_LETTER.signature
    ].join('\n\n');
  }, []);

  const [displayedLength, setDisplayedLength] = useState(0);
  const isFinished = displayedLength >= fullText.length;

  // Typewriter streaming effect
  useEffect(() => {
    if (displayedLength < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedLength((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [displayedLength, fullText.length]);

  const handleSkip = () => {
    setDisplayedLength(fullText.length);
  };

  const handleClose = () => {
    EventBus.emit(EVENTS.CLOSE_LETTER);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#faf6f0] text-[#2c2621] rounded-lg shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Stationery Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f2ece1] border-b border-stone-200">
          <span className="font-serif text-xs tracking-widest uppercase text-stone-600">
            October 11, 2026 • 365 Days
          </span>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <button
                onClick={handleSkip}
                className="text-xs font-serif text-stone-600 hover:text-stone-900 underline decoration-stone-400 underline-offset-2 transition-colors"
              >
                Read full letter
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Close letter"
              className="p-1 text-stone-500 hover:text-stone-800 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Letter Body: Generous line height & authentic editorial typography */}
        <div className="overflow-y-auto p-6 sm:p-10 font-serif leading-relaxed text-sm sm:text-base text-[#241f1b] whitespace-pre-line selection:bg-[#e6dccb]">
          {fullText.slice(0, displayedLength)}

          {!isFinished && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-stone-700 animate-pulse align-middle" />
          )}

          {isFinished && (
            <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-col items-center justify-center gap-3 text-center">
              {/* Deep Red Wax Seal */}
              <div className="w-11 h-11 rounded-full bg-[#7a2026] shadow-md border border-[#521317] flex items-center justify-center text-[#f7e6d4] text-xs font-serif font-bold tracking-widest select-none">
                365
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-serif">
                Foundation Day 2024 — Today
              </span>

              {daisyCount > 0 && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#786145] font-serif bg-[#f3ecdf] px-3.5 py-1.5 rounded-full border border-[#ded5c5]">
                  <span>🌼</span>
                  <span>
                    A bouquet of {daisyCount} {daisyCount === 1 ? 'daisy' : 'daisies'} gathered for you
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f2ece1] border-t border-stone-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-[#2c2621] hover:bg-[#1a1714] text-[#faf6f0] font-serif text-xs tracking-wider uppercase rounded transition-colors"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
