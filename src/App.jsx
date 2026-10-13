// src/App.jsx
// Main application container uniting Phaser 3, React UI modals, HUD, and Mobile Joycon

import React, { useState, useEffect } from 'react';
import { MuseumGame } from './components/MuseumGame';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ExhibitModal } from './components/ExhibitModal';
import { AnniversaryLetter } from './components/AnniversaryLetter';
import { MuseumHUD } from './components/MuseumHUD';
import { MobileJoycon } from './components/MobileJoycon';
import { EXHIBITS } from './data/exhibits';
import { EventBus, EVENTS } from './game/EventBus';
import { GameState } from './game/GameState';
import { ambientAudio } from './utils/ambientAudio';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isNearExhibit, setIsNearExhibit] = useState(false);
  const [viewedExhibits, setViewedExhibits] = useState(() => new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [daisyCount, setDaisyCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth && window.innerWidth <= 1024;
  });

  // Track responsive screen orientation
  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 1024;
      setIsPortrait(portrait);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubNear = EventBus.on(EVENTS.PLAYER_NEAR_EXHIBIT, () => {
      setIsNearExhibit(true);
    });

    const unsubLeft = EventBus.on(EVENTS.PLAYER_LEFT_EXHIBIT, () => {
      setIsNearExhibit(false);
    });

    const unsubPickDaisy = EventBus.on(EVENTS.PICK_DAISY, ({ id }) => {
      if (id) GameState.markDaisyPicked(id);
      setDaisyCount((prev) => {
        const next = prev + 1;
        setToastMessage(`Picked a fresh daisy for Lovey 🌼 (${next})`);
        return next;
      });
    });

    const unsubOpenExhibit = EventBus.on(EVENTS.OPEN_EXHIBIT, ({ exhibitId, exhibit }) => {
      const targetExhibit = exhibit || EXHIBITS.find((e) => e.id === exhibitId);
      if (targetExhibit) {
        GameState.markExhibitViewed(targetExhibit.id);
        setActiveExhibit(targetExhibit);
        setViewedExhibits((prev) => new Set(prev).add(targetExhibit.id));
      }
    });

    const unsubCloseExhibit = EventBus.on(EVENTS.CLOSE_EXHIBIT, () => {
      setActiveExhibit(null);
    });

    const unsubOpenLetter = EventBus.on(EVENTS.OPEN_LETTER, () => {
      setIsLetterOpen(true);
    });

    const unsubCloseLetter = EventBus.on(EVENTS.CLOSE_LETTER, () => {
      setIsLetterOpen(false);
    });

    const unsubToast = EventBus.on(EVENTS.SHOW_TOAST, ({ message }) => {
      setToastMessage(message);
    });

    return () => {
      unsubNear();
      unsubLeft();
      unsubPickDaisy();
      unsubOpenExhibit();
      unsubCloseExhibit();
      unsubOpenLetter();
      unsubCloseLetter();
      unsubToast();
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleStart = () => {
    setHasStarted(true);
    if (!isMuted) {
      ambientAudio.play();
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (nextMuted) {
        ambientAudio.pause();
      } else {
        ambientAudio.play();
      }
      return nextMuted;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {!hasStarted && <WelcomeScreen onStart={handleStart} />}

      {hasStarted && (
        <>
          {isPortrait ? (
            /* DEDICATED PORTRAIT CONSOLE LAYOUT (Main Screen on Top, Controls on Bottom) */
            <div className="relative w-full h-[100dvh] flex flex-col bg-[#0c0a09] overflow-hidden select-none">
              {/* TOP: Main Screen Viewport */}
              <div className="relative w-full flex-1 min-h-0 flex flex-col bg-[#14110f] overflow-hidden border-b-2 border-stone-800/90 shadow-2xl">
                <MuseumGame isPortrait={true} />
                <MuseumHUD
                  viewedCount={viewedExhibits.size}
                  totalCount={EXHIBITS.length}
                  daisyCount={daisyCount}
                  toastMessage={toastMessage}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  isPortrait={true}
                />
              </div>

              {/* BOTTOM: Dedicated Controller Deck */}
              <div className="relative w-full h-[38vh] min-h-[220px] max-h-[340px] bg-[#161311] border-t border-stone-800/80 shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] shrink-0 flex flex-col justify-between">
                <MobileJoycon
                  isNearExhibit={isNearExhibit}
                  isModalOpen={Boolean(activeExhibit || isLetterOpen)}
                  isPortrait={true}
                />
              </div>
            </div>
          ) : (
            /* IMMERSIVE FULLSCREEN LAYOUT (Desktop / Landscape Mobile) */
            <>
              <MuseumGame isPortrait={false} />
              <MuseumHUD
                viewedCount={viewedExhibits.size}
                totalCount={EXHIBITS.length}
                daisyCount={daisyCount}
                toastMessage={toastMessage}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                isPortrait={false}
              />
              <MobileJoycon
                isNearExhibit={isNearExhibit}
                isModalOpen={Boolean(activeExhibit || isLetterOpen)}
                isPortrait={false}
              />
            </>
          )}

          {/* Exhibit Photo & Memory Modal */}
          {activeExhibit && (
            <ExhibitModal
              exhibit={activeExhibit}
              allExhibits={EXHIBITS}
              onSelectExhibit={(ex) => {
                GameState.markExhibitViewed(ex.id);
                setActiveExhibit(ex);
                setViewedExhibits((prev) => new Set(prev).add(ex.id));
              }}
              onClose={() => setActiveExhibit(null)}
            />
          )}

          {/* Anniversary Letter Ending Modal */}
          {isLetterOpen && (
            <AnniversaryLetter
              daisyCount={daisyCount}
              onClose={() => setIsLetterOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
