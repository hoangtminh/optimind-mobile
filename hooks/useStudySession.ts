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
  const { saveDetailedSession, addSession, updateSession } = useStudySessions();

  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [focusHistory, setFocusHistory] = useState<
    { score: number; timeElapsed: number }[]
  >([]);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Refs so the tick/save closures always have fresh values without being re-created.
  const sessionStatsRef = useRef(sessionStats);
  const focusHistoryRef = useRef(focusHistory);
  const currentSessionIdRef = useRef(currentSessionId);

  useEffect(() => {
    sessionStatsRef.current = sessionStats;
  }, [sessionStats]);
  useEffect(() => {
    focusHistoryRef.current = focusHistory;
  }, [focusHistory]);
  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  /** Asynchronously save the current session progress to the database */
  const saveProgress = useCallback(async () => {
    const sessionId = currentSessionIdRef.current;
    const stats = sessionStatsRef.current;
    if (!sessionId || !stats) return;

    const history = focusHistoryRef.current;
    const averageFocus =
      history.length > 0
        ? history.reduce((acc, curr) => acc + curr.score, 0) / history.length
        : 0;

    const focusData = history.map((item) => {
      const startMs = new Date(stats.startTime).getTime();
      return {
        timestamp: new Date(startMs + item.timeElapsed * 1000).toISOString(),
        focusLevel: item.score,
      };
    });

    const updatedData = {
      ...stats,
      endTime: new Date().toISOString(),
      averageFocus,
      focusData,
    };

    try {
      await updateSession(sessionId, updatedData);
    } catch (err) {
      console.error("Failed to auto-save study session progress", err);
    }
  }, [updateSession]);

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

      // Auto-save progress every 15 seconds (about 10-20 seconds range)
      const nextTotalTime = (sessionStatsRef.current?.totalTime ?? 0) + 1;
      if (nextTotalTime > 0 && nextTotalTime % 15 === 0) {
        saveProgress();
      }
    },
    [saveProgress],
  );

  /** Create a new session object in the database when the timer starts for the first time. */
  const initSessionIfNeeded = useCallback(
    (timerRunning: boolean, currentCycle: number, sessionMode: string) => {
      if (!timerRunning || sessionStatsRef.current) return;
      
      const initialStats = {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalTime: 0,
        focusTime: 0,
        breakTime: 0,
        cycles: currentCycle,
        sessionType: sessionMode,
        completed: false,
      };

      setSessionStats(initialStats);
      
      addSession(initialStats).then((createdSession) => {
        if (createdSession?.id) {
          setCurrentSessionId(createdSession.id);
        }
      });
    },
    [addSession],
  );

  const handleSaveSession = useCallback(
    async (isCompletedSet: boolean) => {
      const stats = sessionStatsRef.current;
      const sessionId = currentSessionIdRef.current;
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

      if (sessionId) {
        await updateSession(sessionId, { ...finalStats, averageFocus, focusData });
      } else {
        await saveDetailedSession({ ...finalStats, averageFocus, focusData });
      }
    },
    [updateSession, saveDetailedSession, settings.totalCycles],
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
    setCurrentSessionId(null);
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
