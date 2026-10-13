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

  useEffect(() => {
    const unsubNear = EventBus.on(EVENTS.PLAYER_NEAR_EXHIBIT, () => {
      setIsNearExhibit(true);
    });

    const unsubLeft = EventBus.on(EVENTS.PLAYER_LEFT_EXHIBIT, () => {
      setIsNearExhibit(false);
    });

    const unsubPickDaisy = EventBus.on(EVENTS.PICK_DAISY, () => {
      setDaisyCount((prev) => {
        const next = prev + 1;
        setToastMessage(`Picked a fresh daisy for Lovey 🌼 (${next})`);
        return next;
      });
    });

    const unsubOpenExhibit = EventBus.on(EVENTS.OPEN_EXHIBIT, ({ exhibitId, exhibit }) => {
      const targetExhibit = exhibit || EXHIBITS.find((e) => e.id === exhibitId);
      if (targetExhibit) {
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

    return () => {
      unsubNear();
      unsubLeft();
      unsubPickDaisy();
      unsubOpenExhibit();
      unsubCloseExhibit();
      unsubOpenLetter();
      unsubCloseLetter();
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
          {/* Main Phaser Game Layer */}
          <MuseumGame />

          {/* Heads-up display with exhibit counter, daisy counter & audio toggle */}
          <MuseumHUD
            viewedCount={viewedExhibits.size}
            totalCount={EXHIBITS.length}
            daisyCount={daisyCount}
            toastMessage={toastMessage}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          {/* Mobile Virtual Joycon Overlay */}
          <MobileJoycon
            isNearExhibit={isNearExhibit}
            isModalOpen={Boolean(activeExhibit || isLetterOpen)}
          />

          {/* Exhibit Photo & Memory Modal */}
          {activeExhibit && (
            <ExhibitModal
              exhibit={activeExhibit}
              allExhibits={EXHIBITS}
              onSelectExhibit={(ex) => {
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
