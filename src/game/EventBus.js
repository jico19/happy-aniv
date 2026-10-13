// src/game/EventBus.js
// Decoupled publish-subscribe bridge between React and Phaser

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].slice().forEach(listener => {
      try {
        listener(...args);
      } catch (err) {
        console.error(`Error in EventBus listener for ${event}:`, err);
      }
    });
  }
}

export const EventBus = new EventEmitter();

export const EVENTS = {
  GAME_READY: 'GAME_READY',
  PLAYER_NEAR_EXHIBIT: 'PLAYER_NEAR_EXHIBIT',
  PLAYER_LEFT_EXHIBIT: 'PLAYER_LEFT_EXHIBIT',
  OPEN_EXHIBIT: 'OPEN_EXHIBIT',
  CLOSE_EXHIBIT: 'CLOSE_EXHIBIT',
  ENTER_FINAL_ROOM: 'ENTER_FINAL_ROOM',
  RETURN_TO_GALLERY: 'RETURN_TO_GALLERY',
  OPEN_LETTER: 'OPEN_LETTER',
  CLOSE_LETTER: 'CLOSE_LETTER',
  JOYSTICK_MOVE: 'JOYSTICK_MOVE',
  JOYSTICK_STOP: 'JOYSTICK_STOP',
  ACTION_PRESS: 'ACTION_PRESS',
  PICK_DAISY: 'PICK_DAISY'
};
