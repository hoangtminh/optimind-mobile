import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";

// Bundled ding sound (1 s MP3)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const DING_ASSET = require("../assets/ding-sound.mp3");

// ─── Singleton ──────────────────────────────────────────────────────────────────
let player: any = null;

async function loadOnce(): Promise<void> {
  if (player) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });
    player = createAudioPlayer(DING_ASSET);
  } catch {
    // Silently ignore — haptics will still fire
  }
}

// Pre-load on first import
loadOnce();

// ─── Public API ─────────────────────────────────────────────────────────────────

/** Plays the 1 s ding sound + haptic on a mode transition. */
export async function playTing(): Promise<void> {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  try {
    if (!player) await loadOnce();
    if (player) {
      player.seekTo(0);
      player.play();
    }
  } catch {
    // Haptics already fired — silently ignore audio failure
  }
}

/**
 * Plays the ding twice (350 ms apart) to mark the long-break transition.
 * Total audible duration ≈ 1 s ding + 0.35 s gap + 1 s ding.
 */
export async function playLongBreakTing(): Promise<void> {
  await playTing();
  setTimeout(() => playTing(), 350);
}
