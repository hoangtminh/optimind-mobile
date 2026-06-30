import type { TimerMode } from "@/components/study/PremiumPomodoro";
import type { UserSettings } from "@/contexts/SettingsContext";
import { useCallback, useEffect, useRef, useState } from "react";

// ── helpers ────────────────────────────────────────────────────────────────

/** Format seconds as mm:ss with zero-padding. */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function durationForMode(mode: TimerMode, settings: UserSettings): number {
  if (mode === "focus") return settings.focusDuration;
  if (mode === "longBreak") return settings.longBreakDuration;
  return settings.breakDuration;
}

// ── hook ───────────────────────────────────────────────────────────────────

export interface UseStudyTimerResult {
  timerRunning: boolean;
  timerMode: TimerMode;
  timerTimeLeft: number;
  timerTotalTime: number;
  timerTimeElapsed: number;
  currentCycle: number;
  sessionKey: number;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerMode: React.Dispatch<React.SetStateAction<TimerMode>>;
  setTimerTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  handleTimerTick: () => void;
  handleCycleComplete: () => void;
  handleLongBreakComplete: () => void;
  resetTimer: (settings: UserSettings) => void;
}

export function useStudyTimer(settings: UserSettings): UseStudyTimerResult {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");
  const [timerTotalTime, setTimerTotalTime] = useState(
    settings.focusDuration * 60,
  );
  const [timerTimeLeft, setTimerTimeLeft] = useState(
    settings.focusDuration * 60,
  );
  const [currentCycle, setCurrentCycle] = useState(1);
  const [sessionKey, setSessionKey] = useState(Date.now());

  // Sync total / remaining time when settings or mode changes.
  useEffect(() => {
    const duration = durationForMode(timerMode, settings);
    setTimerTotalTime(duration * 60);
    setTimerTimeLeft(duration * 60);
  }, [
    timerMode,
    settings.focusDuration,
    settings.breakDuration,
    settings.longBreakDuration,
  ]);

  // Countdown tick — use a ref so the interval callback is always fresh,
  // preventing the "ticking state" re-render cascade on the parent.
  const timerRunningRef = useRef(timerRunning);
  useEffect(() => {
    timerRunningRef.current = timerRunning;
  }, [timerRunning]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const handleCycleComplete = useCallback(() => {
    setCurrentCycle((prev) => {
      const next = prev + 1;
      return next > settings.totalCycles ? 1 : next;
    });
  }, [settings.totalCycles]);

  const handleLongBreakComplete = useCallback(() => {
    setCurrentCycle(1);
  }, []);

  // Called by tick callback (useStudySession) AND manual reset.
  const handleTimerTick = useCallback(() => {
    setTimerTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
  }, []);

  const resetTimer = useCallback(
    (currentSettings: UserSettings) => {
      const duration = durationForMode("focus", currentSettings);
      setTimerRunning(false);
      setTimerTimeLeft(duration * 60);
      setTimerTotalTime(duration * 60);
      setCurrentCycle(1);
      setTimerMode("focus");
      setSessionKey(Date.now());
    },
    [],
  );

  const timerTimeElapsed = timerTotalTime - timerTimeLeft;

  return {
    timerRunning,
    timerMode,
    timerTimeLeft,
    timerTotalTime,
    timerTimeElapsed,
    currentCycle,
    sessionKey,
    setTimerRunning,
    setTimerMode,
    setTimerTimeLeft,
    handleTimerTick,
    handleCycleComplete,
    handleLongBreakComplete,
    resetTimer,
  };
}
