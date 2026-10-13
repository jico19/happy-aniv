# The Museum of Us — Product Requirements Document

**Version:** 1.0  
**Project Type:** Interactive anniversary website  
**Target:** First anniversary celebration  
**Platform:** Web, desktop and mobile  
**Deadline:** October 11, 2026

## 1. Product Overview

The Museum of Us is a small, interactive, pixel-art museum dedicated to celebrating one year of a romantic relationship.

Visitors explore a classic art gallery, interact with framed photographs, discover personal memories, and unlock a final anniversary letter.

The experience should feel like exploring a quiet, curated museum rather than browsing a conventional photo gallery.

### Product goals

- Create a personalized digital anniversary gift.
- Present shared memories as museum exhibits.
- Provide a simple, enjoyable exploration experience.
- Deliver a polished, responsive website that can be opened through a public URL.
- Avoid unnecessary infrastructure and recurring costs.

## 2. Target User

The primary visitor is the developer's girlfriend.

The experience is designed for one person at a time, primarily using a mobile phone or desktop browser.

No account creation or registration is required.

## 3. Visual Direction

### Art style

Classic art gallery rendered in pixel art.

### Visual characteristics

- Symmetrical exhibition rooms.
- Polished wooden or marble floors.
- Cream-colored walls.
- Elegant gold or dark wooden picture frames.
- Warm, subtle gallery lighting.
- Pixel-art plants, decorative columns, and museum signage.
- Retro-inspired dialogue boxes and interaction prompts.

### Atmosphere

Quiet, nostalgic, elegant, intimate, and romantic.

Avoid excessive hearts, distracting animations, loud colors, and generic romantic decorations.

### Typography

Use a readable serif font for exhibit titles and letters, paired with a pixel font for small game interface elements.

All body text must remain legible on mobile devices.

## 4. Core User Journey

1. The visitor opens the anniversary website.
2. A title screen introduces The Museum of Us.
3. The visitor selects **Enter Museum**.
4. The museum scene loads.
5. The visitor explores the gallery using keyboard or touch controls.
6. Approaching an exhibit displays an interaction prompt.
7. Interacting with a frame opens a memory modal.
8. The visitor views a photograph, title, date if available, and personal caption.
9. The visitor explores the remaining exhibits.
10. The visitor discovers the final room and opens the anniversary letter.

## 5. Functional Requirements

### FR-01: Welcome Screen

The application must display:

- Museum name: The Museum of Us.
- A short introductory message.
- An Enter Museum button.
- A visible audio toggle if background music is provided.

The museum must not play audio automatically before the visitor interacts with the page.

### FR-02: Museum Environment

The application must render a pixel-art gallery with:

- A walkable floor.
- Walls and decorative elements.
- Framed photographs.
- Collision boundaries that prevent the player from walking through walls.
- A clear entrance and exit or navigation path.

The initial version should contain one main gallery and one final room.

### FR-03: Player Controls

Desktop controls:

- W, A, S, D or arrow keys for movement.
- E or Space to interact with a nearby exhibit.
- Escape to close an open exhibit modal.

Mobile controls:

- On-screen directional pad or touch controls.
- A dedicated interaction button.
- Responsive modal layout.

Controls must not activate movement while the visitor is typing or interacting with modal content.

### FR-04: Exhibit Interaction

Each exhibit must contain:

- A unique identifier.
- A title.
- A photograph.
- A short personal description.
- An optional date or location.
- An optional additional message.

When the player is within interaction range, the application must show an interaction prompt.

Selecting the exhibit opens a React modal containing the memory details.

The visitor must be able to close the modal and continue exploring.

### FR-05: Memory Collection

The main gallery should contain approximately 6–8 exhibits.

Suggested exhibit categories:

1. How We Started
2. Our First Favorite Memory
3. The Little Things
4. Our Adventures
5. The Moments That Made Me Smile
6. What I Appreciate About You
7. What We've Overcome
8. Our Next Chapter

The categories and their content are customizable.

Do not fabricate personal memories. All photos and captions must be supplied or approved by the developer.

### FR-06: Final Room

After exploring the main gallery, the visitor can enter a separate final room.

The room contains:

- A special decorative centerpiece or framed photograph.
- A short anniversary message.
- An Open Letter interaction.

The letter should appear in a readable React modal or dedicated page.

### FR-07: Anniversary Letter

The letter must support:

- Personalized text.
- Readable line spacing and typography.
- Optional typewriter animation.
- A close or return-to-gallery action.

The complete letter must remain accessible if animations are disabled or interrupted.

### FR-08: Progress and Completion

The application may track the number of exhibits viewed during the current session.

The final screen displays:

**Achievement Unlocked: One Year Together**

The achievement is awarded after the visitor reaches the final room or completes the intended exhibit sequence.

Progress persistence across browser sessions is optional and is not required for the first release.

### FR-09: Audio

If included, background music must:

- Start only after explicit visitor interaction.
- Include a visible play/pause control.
- Fail gracefully if the audio file cannot load.

Audio is optional and must not block the experience.

## 6. Non-Functional Requirements

### Performance

- Load the initial scene quickly.
- Use appropriately sized images and sprites.
- Avoid unnecessarily large asset bundles.
- Keep movement responsive.
- Avoid repeated recreation of the Phaser game instance during React renders.

### Responsive Design

- Support current desktop and mobile browsers.
- Scale the game canvas to the available viewport.
- Keep controls and dialogs usable on small screens.
- Prevent mobile scrolling from interfering with game controls.

### Accessibility

- Provide readable text contrast.
- Include accessible labels for interface buttons.
- Support keyboard navigation in React dialogs.
- Provide a reduced-motion-friendly experience where practical.
- Do not communicate important information exclusively through color.

### Reliability

- Handle missing or failed image assets gracefully.
- Allow the visitor to close dialogs and resume the game.
- Prevent multiple game instances from being created during component remounts.
- Clean up event listeners when the game component unmounts.

### Privacy

- No user accounts or tracking are required.
- No analytics or third-party AI API is necessary.
- Personal photos should be shared only through a deployment and hosting arrangement the developer is comfortable with.

## 7. Technical Architecture

### Frontend

- React
- Vite
- Tailwind CSS
- Phaser 3
- Optional: Lucide React

### Game layer

Phaser is responsible for:

- Rendering the museum.
- Player movement.
- Collision detection.
- Exhibit proximity detection.
- Game-scene transitions.
- Emitting exhibit interaction events.

### UI layer

React is responsible for:

- Welcome screen.
- Exhibit modals.
- Photo presentation.
- Progress display.
- Audio controls.
- Final room interface.
- Anniversary letter.

### Data layer

Use a local JavaScript or TypeScript data file for exhibit metadata.

Store photographs and game assets in the public directory or import them through Vite as appropriate.

A backend and database are not required.

## 8. Proposed Project Structure

    src/
      components/
        MuseumGame.jsx
        ExhibitModal.jsx
        MuseumHUD.jsx
        AnniversaryLetter.jsx
      game/
        MuseumGameConfig.js
        scenes/
          GalleryScene.js
          FinalRoomScene.js
        objects/
          Player.js
          Exhibit.js
      data/
        exhibits.js
      App.jsx
      main.jsx

    public/
      assets/
        tilesets/
        sprites/
        decorations/
        audio/
      images/
        memories/

    PRD.md

This is a proposed structure, not a requirement to create every file immediately.

## 9. Scope and Priorities

### P0 — Required for the anniversary release

- Welcome screen.
- One playable museum room.
- Player movement and wall collisions.
- At least 6 interactive exhibits.
- Photo and caption modals.
- Final room or final exhibit.
- Personalized anniversary letter.
- Responsive controls or a usable mobile alternative.
- Public deployment.

### P1 — Add if time permits

- Background music.
- Animated exhibit transitions.
- Exhibit completion counter.
- Decorative pixel-art particles.
- A special final achievement screen.

### P2 — Out of scope for the first release

- Multiplayer.
- User accounts.
- Backend API.
- Database.
- Inventory system.
- Complex quests.
- Multiple floors.
- Procedural map generation.
- AI-generated dialogue.
- Persistent cloud saves.

## 10. Acceptance Criteria

The project is ready to share when:

- The website opens successfully from its deployed URL.
- The visitor can enter the museum.
- The player can move around without passing through walls.
- Every configured exhibit opens the correct photo and description.
- Closing an exhibit returns control to the museum.
- The final letter is accessible.
- The interface works on a desktop browser and a mobile viewport.
- No critical console errors occur during the main user journey.
- The experience does not require an account, API key, or paid service.

## 11. Implementation Plan

### Phase 1: Foundation

- Confirm the existing Vite and Tailwind setup works.
- Install Phaser.
- Create a React component that initializes and destroys the Phaser game correctly.

### Phase 2: Playable Gallery

- Create a simple gallery scene.
- Add the player sprite and movement.
- Define wall collisions.
- Add placeholder exhibit locations.

### Phase 3: Memory Integration

- Connect exhibit interaction events to React.
- Build the exhibit modal.
- Add photographs, captions, and dates.

### Phase 4: Anniversary Ending

- Add the final room or final exhibit.
- Implement the anniversary letter.
- Add the completion screen.

### Phase 5: Polish and Release

- Test keyboard and touch controls.
- Optimize image sizes.
- Check mobile layouts.
- Deploy to a public URL.
- Test the deployed version before sharing it.

## 12. Definition of Success

The visitor can explore a small, polished pixel-art museum, discover personal memories through framed photographs, and finish by reading a meaningful anniversary letter.

The experience should prioritize personal details and usability over game complexity.
