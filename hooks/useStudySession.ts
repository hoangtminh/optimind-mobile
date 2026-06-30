import type { TimerMode } from "@/components/study/PremiumPomodoro";
import type { UserSettings } from "@/contexts/SettingsContext";
import { useStudySessions } from "@/contexts/StudySessionContext";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SessionStats } from "../app/(main)/(tabs)/study/index";

// ── hook ───────────────────────────────────────────────────────────────────

export interface UseStudySessionResult {
  sessionStats: SessionStats | null;
  focusHistory: { score: number; timeElapsed: number }[];
  showCongratsModal: boolean;
  setShowCongratsModal: React.Dispatch<React.SetStateAction<boolean>>;
  tickSession: (timerMode: TimerMode, cameraActive: boolean, currentFocusScore: number) => void;
  initSessionIfNeeded: (timerRunning: boolean, currentCycle: number, sessionMode: string) => void;
  handleSaveSession: (isCompletedSet: boolean) => Promise<void>;
  handleSessionFinish: () => Promise<void>;
  handleCongratsConfirm: (resetFn: () => void) => void;
  resetSession: () => void;
}

export function useStudySession(
  settings: UserSettings,
): UseStudySessionResult {
  const { saveDetailedSession } = useStudySessions();

  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [focusHistory, setFocusHistory] = useState<
    { score: number; timeElapsed: number }[]
  >([]);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  // Ref so the tick closure always has fresh values without being re-created.
  const sessionStatsRef = useRef(sessionStats);
  const focusHistoryRef = useRef(focusHistory);
  useEffect(() => {
    sessionStatsRef.current = sessionStats;
  }, [sessionStats]);
  useEffect(() => {
    focusHistoryRef.current = focusHistory;
  }, [focusHistory]);

  /** Accumulate stats and focus history on each 1-second timer tick. */
  const tickSession = useCallback(
    (timerMode: TimerMode, cameraActive: boolean, currentFocusScore: number) => {
      setSessionStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          totalTime: prev.totalTime + 1,
          focusTime: timerMode === "focus" ? prev.focusTime + 1 : prev.focusTime,
          breakTime: timerMode !== "focus" ? prev.breakTime + 1 : prev.breakTime,
        };
      });

      setFocusHistory((prev) => {
        const timeElapsed = (sessionStatsRef.current?.totalTime ?? 0) + 1;
        const score = cameraActive ? currentFocusScore : 0;
        return [...prev, { score, timeElapsed }];
      });
    },
    [],
  );

  /** Create a new session object when the timer starts for the first time. */
  const initSessionIfNeeded = useCallback(
    (timerRunning: boolean, currentCycle: number, sessionMode: string) => {
      if (!timerRunning || sessionStatsRef.current) return;
      setSessionStats({
        startTime: new Date().toISOString(),
        endTime: "",
        totalTime: 0,
        focusTime: 0,
        breakTime: 0,
        cycles: currentCycle,
        sessionType: sessionMode,
      });
    },
    [],
  );

  const handleSaveSession = useCallback(
    async (isCompletedSet: boolean) => {
      const stats = sessionStatsRef.current;
      if (!stats) return;

      const finalStats = {
        ...stats,
        endTime: new Date().toISOString(),
        cycles: isCompletedSet ? settings.totalCycles : stats.cycles,
        completed: isCompletedSet,
      };

      const history = focusHistoryRef.current;
      const averageFocus =
        history.length > 0
          ? history.reduce((acc, curr) => acc + curr.score, 0) / history.length
          : 0;

      const focusData = history.map((item) => {
        const startMs = new Date(finalStats.startTime).getTime();
        return {
          timestamp: new Date(startMs + item.timeElapsed * 1000).toISOString(),
          focusLevel: item.score,
        };
      });

      await saveDetailedSession({ ...finalStats, averageFocus, focusData });
    },
    [saveDetailedSession, settings.totalCycles],
  );

  const handleSessionFinish = useCallback(async () => {
    await handleSaveSession(true);
    setShowCongratsModal(true);
  }, [handleSaveSession]);

  const handleCongratsConfirm = useCallback((resetFn: () => void) => {
    setShowCongratsModal(false);
    resetFn();
  }, []);

  const resetSession = useCallback(() => {
    setSessionStats(null);
    setFocusHistory([]);
  }, []);

  return {
    sessionStats,
    focusHistory,
    showCongratsModal,
    setShowCongratsModal,
    tickSession,
    initSessionIfNeeded,
    handleSaveSession,
    handleSessionFinish,
    handleCongratsConfirm,
    resetSession,
  };
}
