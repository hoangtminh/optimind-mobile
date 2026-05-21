import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

// Bundled ding sound (1 s MP3)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const DING_ASSET = require("../assets/ding-sound.mp3");

// ─── Singleton ──────────────────────────────────────────────────────────────────
let soundInstance: Audio.Sound | null = null;

async function loadOnce(): Promise<void> {
  if (soundInstance) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(DING_ASSET, {
      shouldPlay: false,
    });
    soundInstance = sound;
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
    if (!soundInstance) await loadOnce();
    await soundInstance?.setPositionAsync(0);
    await soundInstance?.playAsync();
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
