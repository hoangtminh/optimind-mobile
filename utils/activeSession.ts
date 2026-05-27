class ActiveSessionTracker {
  private isRunning: boolean = false;
  private onPauseCallback: (() => void) | null = null;

  setRunning(running: boolean) {
    this.isRunning = running;
  }

  getRunning() {
    return this.isRunning;
  }

  registerPauseCallback(callback: () => void) {
    this.onPauseCallback = callback;
  }

  unregisterPauseCallback() {
    this.onPauseCallback = null;
  }

  pauseSession() {
    if (this.onPauseCallback) {
      this.onPauseCallback();
    }
  }
}

export const activeSessionTracker = new ActiveSessionTracker();
