// src/components/ExhibitModal.jsx
// Gallery exhibit viewer designed like an authentic museum exhibition installation

import React, { useEffect, useCallback, useRef } from 'react';
import { X, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventBus, EVENTS } from '../game/EventBus';

export function ExhibitModal({ exhibit, onClose, onSelectExhibit, allExhibits = [] }) {
  const mountTimeRef = useRef(null);
  const backdropDownRef = useRef(false);

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  const currentIndex = allExhibits.findIndex((e) => e.id === exhibit?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allExhibits.length - 1;

  const handleClose = useCallback(() => {
    EventBus.emit(EVENTS.CLOSE_EXHIBIT);
    onClose();
  }, [onClose]);

  const handlePrev = useCallback(() => {
    if (hasPrev && onSelectExhibit) {
      onSelectExhibit(allExhibits[currentIndex - 1]);
    }
  }, [hasPrev, onSelectExhibit, allExhibits, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && onSelectExhibit) {
      onSelectExhibit(allExhibits[currentIndex + 1]);
    }
  }, [hasNext, onSelectExhibit, allExhibits, currentIndex]);

  const handleBackdropPointerDown = (e) => {
    const elapsed = mountTimeRef.current ? Date.now() - mountTimeRef.current : 0;
    if (e.target === e.currentTarget && elapsed >= 400) {
      backdropDownRef.current = true;
    } else {
      backdropDownRef.current = false;
    }
  };

  const handleBackdropClick = (e) => {
    const elapsed = mountTimeRef.current ? Date.now() - mountTimeRef.current : 0;
    if (e.target === e.currentTarget && backdropDownRef.current && elapsed >= 400) {
      backdropDownRef.current = false;
      handleClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, handlePrev, handleNext]);

  if (!exhibit) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl bg-[#141210] border border-stone-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Metadata Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#1a1715] border-b border-stone-800">
          <div className="flex items-center gap-3 text-xs font-serif tracking-widest uppercase text-stone-400">
            <span className="text-[#c5a880]">Exhibit {currentIndex >= 0 ? currentIndex + 1 : 1}</span>
            <span className="text-stone-600">/</span>
            <span>{allExhibits.length || 8}</span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close exhibit"
            className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Gallery Content */}
        <div className="overflow-y-auto p-5 sm:p-8 flex flex-col items-center gap-6">
          {/* Framed Photo with Clean Side Nav */}
          <div className="relative flex items-center justify-center w-full">
            {hasPrev && (
              <button
                onClick={handlePrev}
                aria-label="Previous photograph"
                className="absolute left-0 sm:-left-3 z-10 p-2.5 rounded-full bg-[#1c1815]/90 border border-stone-700 text-stone-300 hover:text-stone-100 hover:bg-stone-800 shadow-lg transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Archival Mat & Frame */}
            <div className="relative p-2.5 sm:p-3 bg-[#1e1b18] rounded border border-stone-800 shadow-xl max-w-full">
              <img
                src={exhibit.image}
                alt={exhibit.title}
                className="max-h-[48vh] sm:max-h-[54vh] w-auto object-contain rounded-sm"
                onError={(e) => {
                  e.target.src = '/hero.png';
                }}
              />
            </div>

            {hasNext && (
              <button
                onClick={handleNext}
                aria-label="Next photograph"
                className="absolute right-0 sm:-right-3 z-10 p-2.5 rounded-full bg-[#1c1815]/90 border border-stone-700 text-stone-300 hover:text-stone-100 hover:bg-stone-800 shadow-lg transition-all"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Exhibition Placard */}
          <div className="w-full bg-[#1a1715] border border-stone-800/90 rounded p-5 sm:p-6 text-center max-w-xl">
            <h2 className="text-xl sm:text-2xl font-serif text-[#f5efe6] tracking-normal mb-2 font-normal">
              {exhibit.title}
            </h2>

            {/* Metadata Tags */}
            {(exhibit.date || exhibit.location) && (
              <div className="flex items-center justify-center gap-4 text-xs text-[#c5a880] mb-3.5 font-serif tracking-wide uppercase">
                {exhibit.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="opacity-80" />
                    {exhibit.date}
                  </span>
                )}
                {exhibit.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="opacity-80" />
                    {exhibit.location}
                  </span>
                )}
              </div>
            )}

            {/* Curated Narrative */}
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
              {exhibit.caption}
            </p>

            {/* Footnote */}
            {exhibit.subtext && (
              <p className="mt-3.5 text-xs text-stone-400 font-serif italic border-t border-stone-800 pt-3">
                "{exhibit.subtext}"
              </p>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-3.5 bg-[#161412] border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
          <div className="flex items-center gap-2">
            {hasPrev && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded bg-stone-800/80 hover:bg-stone-700 text-stone-300 flex items-center gap-1 font-serif text-xs transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>
            )}
            {hasNext && (
              <button
                onClick={handleNext}
                className="px-3 py-1.5 rounded bg-stone-800/80 hover:bg-stone-700 text-stone-300 flex items-center gap-1 font-serif text-xs transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            )}
            <span className="hidden sm:inline text-stone-500 text-[11px] ml-2">
              (Arrow keys navigate)
            </span>
          </div>

          <button
            onClick={handleClose}
            className="px-4 py-1.5 bg-[#c5a880] hover:bg-[#d5bc97] text-stone-950 font-serif text-xs tracking-wider uppercase font-semibold rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
