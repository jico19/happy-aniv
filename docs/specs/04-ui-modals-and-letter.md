# 04 - React UI, Modals & Anniversary Letter Specification

## 1. Welcome Screen (`src/components/WelcomeScreen.jsx`)

- **Visual Style**: Clean, nostalgic gallery entrance invitation card.
- **Content**:
  - Title: *"The Museum of Us"*
  - Subtitle: *"A celebration of 365 days together"*
  - "Enter Museum" button with vintage framing border.
  - Audio mute/unmute indicator checkbox.
- **Action**: Clicking "Enter Museum" unmounts or fades out the welcome screen and initializes/unpauses Phaser audio context.

---

## 2. Exhibit Modal (`src/components/ExhibitModal.jsx`)

- **Trigger**: Receives `OPEN_EXHIBIT` event with exhibit metadata.
- **Layout**:
  - Centered responsive modal with dark gallery backdrop (`backdrop-blur-sm bg-black/75`).
  - Framed photographic viewport:
    - Gold or vintage wooden border styling.
    - Responsive image (`max-h-[60vh] object-contain rounded`).
  - Exhibit Placard (Plaque):
    - Title in serif typography (e.g. `font-serif tracking-wide text-amber-100`).
    - Date & Location tag in muted brass tone (`text-amber-300/80 text-sm`).
    - Caption text in warm, readable cream tone (`text-stone-200 leading-relaxed`).
  - Dismiss controls:
    - Top-right "X" button.
    - Click outside backdrop to close.
    - Desktop `Escape` key listener.
    - Mobile bottom "Return to Gallery" tap button.
- **Clean-up**: When closed, emits `CLOSE_EXHIBIT` to unfreeze player movement.

---

## 3. Anniversary Letter (`src/components/AnniversaryLetter.jsx`)

- **Trigger**: Interacting with the centerpiece in the `FinalRoomScene`.
- **Layout**:
  - Full-screen or large parchment-style scroll / vintage stationery card.
  - Parchment background with warm drop shadow and wax seal accent.
- **Typewriter Animation**:
  - Letter text streams onto the screen character-by-character (speed ~25ms per character).
  - "Skip Animation" button immediately finishes the entire text.
  - Accessibility: Respects `prefers-reduced-motion` by skipping typewriter effect automatically.
- **Content**:
  - Salutation.
  - Heartfelt letter body celebrating the 1-year journey.
  - Sign-off.
- **Completion Achievement**:
  - Shows an elegant toast or banner: *"Achievement Unlocked: One Year Together"*.

---

## 4. Museum HUD & Audio Controls (`src/components/MuseumHUD.jsx`)

- **Exhibit Counter**: Subtle indicator in top-left (e.g. *"Exhibits Explored: 3 / 8"*).
- **Audio Control**: Top-right floating pill with speaker icon (Play / Pause / Volume).
- **Interaction Hint**: Floating bottom-center chip on desktop (*"[E] Inspect Exhibit"*).
