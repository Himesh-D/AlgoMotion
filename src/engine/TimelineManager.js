export class TimelineManager {
  constructor() {
    this.states = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.playbackInterval = null;
    this.delayMs = 800;
    this.onStateChange = null; 
    this.onPlaybackEnd = null;
  }

  loadStates(states) {
    this.states = states;
    this.currentIndex = -1;
    this.pause();
    if (states.length > 0) {
      this.goToStep(0);
    }
  }

  setSpeed(multiplier) {
    this.delayMs = 800 / multiplier;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  play() {
    if (this.states.length === 0 || this.currentIndex >= this.states.length - 1) return;
    this.isPlaying = true;
    this.next(); // Go to next immediately
    
    this.playbackInterval = setInterval(() => {
      if (!this.next()) {
        this.pause();
        if (this.onPlaybackEnd) this.onPlaybackEnd();
      }
    }, this.delayMs);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.playbackInterval);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.currentIndex >= this.states.length - 1) {
        this.goToStep(0); // Reset if at end before playing
      }
      this.play();
    }
  }

  next() {
    if (this.currentIndex < this.states.length - 1) {
      this.goToStep(this.currentIndex + 1);
      return true;
    }
    return false;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.goToStep(this.currentIndex - 1);
      return true;
    }
    return false;
  }

  goToStep(index) {
    if (index >= 0 && index < this.states.length) {
      this.currentIndex = index;
      if (this.onStateChange) {
        this.onStateChange(this.states[index], index, this.states.length);
      }
    }
  }

  reset() {
    this.pause();
    if (this.states.length > 0) {
      this.goToStep(0);
    }
  }
}
