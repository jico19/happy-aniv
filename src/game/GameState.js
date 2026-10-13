// src/game/GameState.js
// Centralized state tracker for gallery progression (exhibits viewed and daisies collected)

import { EXHIBITS } from '../data/exhibits';
import { EventBus, EVENTS } from './EventBus';

export const GameState = {
  viewedExhibits: new Set(),
  pickedDaisies: new Set(),
  totalExhibits: EXHIBITS.length, // 8
  totalGalleryDaisies: 6, // 6 in main gallery

  markExhibitViewed(id) {
    if (!id) return;
    const wasUnlocked = this.isArchwayUnlocked();
    this.viewedExhibits.add(id);
    if (!wasUnlocked && this.isArchwayUnlocked()) {
      EventBus.emit(EVENTS.DOORWAY_UNLOCKED);
    }
  },

  markDaisyPicked(id) {
    if (!id) return;
    const wasUnlocked = this.isArchwayUnlocked();
    this.pickedDaisies.add(id);
    if (!wasUnlocked && this.isArchwayUnlocked()) {
      EventBus.emit(EVENTS.DOORWAY_UNLOCKED);
    }
  },

  isArchwayUnlocked() {
    return (
      this.viewedExhibits.size >= this.totalExhibits &&
      this.pickedDaisies.size >= this.totalGalleryDaisies
    );
  },

  getStatus() {
    const isUnlocked = this.isArchwayUnlocked();
    const viewedCount = this.viewedExhibits.size;
    const pickedCount = this.pickedDaisies.size;
    const exhibitsRemaining = Math.max(0, this.totalExhibits - viewedCount);
    const daisiesRemaining = Math.max(0, this.totalGalleryDaisies - pickedCount);

    return {
      isUnlocked,
      viewedCount,
      totalExhibits: this.totalExhibits,
      pickedCount,
      totalGalleryDaisies: this.totalGalleryDaisies,
      exhibitsRemaining,
      daisiesRemaining
    };
  }
};
