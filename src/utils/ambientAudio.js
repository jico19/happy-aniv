// src/utils/ambientAudio.js
// Dual audio engine: plays custom MP3 if present in public, or procedural Web Audio synth as fallback

class AmbientAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.audioElement = null;
    this.useCustomAudio = false;

    // Nostalgic Pentatonic chord frequencies (in Hz)
    this.chords = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [220.00, 261.63, 329.63, 440.00], // A minor
      [174.61, 220.00, 261.63, 349.23], // F major
      [196.00, 246.94, 293.66, 392.00]  // G major
    ];
    this.chordIndex = 0;
  }

  init() {
    if (typeof window === 'undefined') return;

    if (!this.audioElement) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.4;

      // Check if custom file exists
      audio.src = '/bgm.mp3';
      audio.addEventListener('error', () => {
        // Fall back to Web Audio synth
        this.useCustomAudio = false;
        this.audioElement = null;
      });
      this.audioElement = audio;
    }

    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  play() {
    this.init();
    this.isPlaying = true;

    // Try custom audio first
    if (this.audioElement && this.audioElement.src) {
      this.audioElement
        .play()
        .then(() => {
          this.useCustomAudio = true;
        })
        .catch(() => {
          // Autoplay blocked or file not found, use procedural synth
          this.useCustomAudio = false;
          this.startSynth();
        });
    } else {
      this.startSynth();
    }
  }

  startSynth() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.scheduleNotes();
  }

  scheduleNotes() {
    if (!this.isPlaying || this.useCustomAudio || !this.ctx) return;

    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    chord.forEach((freq, i) => {
      setTimeout(() => {
        if (this.isPlaying && !this.useCustomAudio) {
          this.playBellTone(freq);
        }
      }, i * 600);
    });

    this.timer = setTimeout(() => {
      this.scheduleNotes();
    }, 3200);
  }

  playBellTone(freq) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);
    } catch {
      // Ignore audio scheduling errors
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {
        // Ignore pause errors
      }
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const ambientAudio = new AmbientAudioPlayer();
