import {
  studyActions,
  StudySessionDetailsResponse,
} from "@/api/study-session-action";
import { useStudySessions } from "@/contexts/StudySessionContext";
import { StudySession } from "@/lib/types/study";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler } from "react-native";
import {
  formatSecondsDuration,
  getChartLabels,
  getSecondsChartLabels,
} from "../_utils/historyUtils";

export interface SessionMetrics {
  focusTime: number;
  breakTime: number;
  cycles: number;
  prodScore: number;
  chartPoints: number[];
  labels: string[];
  focusTimeText: string;
  breakTimeText: string;
  totalTimeText: string;
}

export interface ListStats {
  totalSessions: number;
  completedSessions: number;
  displayTotalTime: string;
}

export interface GroupedSession {
  title: string;
  data: StudySession[];
}

export function useHistory() {
  const { studySessions, isLoading, refreshSessions } = useStudySessions();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [selectedSessionDetails, setSelectedSessionDetails] =
    useState<StudySessionDetailsResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch session history on mount only if there are no sessions loaded
  useEffect(() => {
    if (studySessions.length === 0) {
      refreshSessions();
    }
  }, [refreshSessions, studySessions.length]);

  // Fetch session details when a session is selected
  useEffect(() => {
    if (!selectedSessionId) {
      setSelectedSessionDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const response = await studyActions.getSessionDetails(
          selectedSessionId,
        );
        if (response.success && response.data) {
          setSelectedSessionDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch session details:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedSessionId]);

  // Navigation back handling for Details view
  useEffect(() => {
    const onBackPress = () => {
      if (selectedSessionId !== null) {
        setSelectedSessionId(null);
        return true; // prevent default back press behavior (exiting app)
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [selectedSessionId]);

  // Extract active session details
  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return (
      selectedSessionDetails?.session ||
      studySessions.find((s) => s.id === selectedSessionId) ||
      null
    );
  }, [selectedSessionId, studySessions, selectedSessionDetails]);

  // Derived metrics for the details view
  const selectedSessionMetrics = useMemo<SessionMetrics | null>(() => {
    if (!selectedSession) return null;

    const logs = selectedSessionDetails?.logs || [];

    const durationInSeconds =
      selectedSession.duration > 200
        ? selectedSession.duration
        : selectedSession.duration * 60;
    const durationInMinutes = Math.round(durationInSeconds / 60);

    // Focus time
    const focusTimeSecs =
      selectedSession.focusTime !== undefined
        ? selectedSession.focusTime
        : selectedSession.completed
          ? durationInSeconds
          : durationInSeconds * 0.6;
    const focusTimeText = formatSecondsDuration(focusTimeSecs);

    // Break time
    const breakTimeSecs =
      selectedSession.breakTime !== undefined
        ? selectedSession.breakTime
        : selectedSession.completed
          ? Math.max(300, durationInSeconds * 0.1)
          : 0;
    const breakTimeText = formatSecondsDuration(breakTimeSecs);

    // Total time
    const totalTimeSecs =
      selectedSession.totalTime !== undefined
        ? selectedSession.totalTime
        : durationInSeconds;
    const totalTimeText = formatSecondsDuration(totalTimeSecs);

    // Cycles
    const cycles = selectedSession.cycles
      ? selectedSession.cycles
      : selectedSession.completed
        ? Math.max(2, Math.round(durationInMinutes / 25))
        : 1;

    // Productivity Score
    const prodScore = selectedSession.averageFocus
      ? Math.round(selectedSession.averageFocus)
      : selectedSession.completed
        ? 88
        : 45;

    // Focus scores chart points calculated from actual log data from backend
    let chartPoints = logs.map((log) => log.focus);
    let labels: string[] = [];

    const startTimeMs = new Date(
      selectedSession.startTime ||
        selectedSession.date ||
        new Date().toISOString(),
    ).getTime();

    if (chartPoints.length === 0) {
      chartPoints = [0, 0];
      labels = ["0s", "0s"];
    } else if (chartPoints.length === 1) {
      chartPoints = [chartPoints[0], chartPoints[0]];
      const offset = Math.max(
        0,
        Math.round(
          (new Date(logs[0].timestamp).getTime() - startTimeMs) / 1000,
        ),
      );
      labels = ["0s", `${offset}s` || "0s"];
    } else {
      const offsets = logs.map((log) =>
        Math.max(
          0,
          Math.round(
            (new Date(log.timestamp).getTime() - startTimeMs) / 1000,
          ),
        ),
      );
      labels = getSecondsChartLabels(offsets);
    }

    return {
      focusTime: Math.round(focusTimeSecs / 60),
      breakTime: Math.round(breakTimeSecs / 60),
      cycles,
      prodScore,
      chartPoints,
      labels,
      focusTimeText,
      breakTimeText,
      totalTimeText,
    };
  }, [selectedSession, selectedSessionDetails]);

  // List overview stats calculation
  const listStats = useMemo<ListStats>(() => {
    const totalSessions = studySessions.length;
    const completedSessions = studySessions.filter((s) => s.completed).length;

    const totalSeconds = studySessions.reduce((sum, s) => {
      const secs =
        s.totalTime !== undefined
          ? s.totalTime
          : s.duration > 200
            ? s.duration
            : s.duration * 60;
      return sum + secs;
    }, 0);

    const displayTotalTime = formatSecondsDuration(totalSeconds);

    return {
      totalSessions,
      completedSessions,
      displayTotalTime,
    };
  }, [studySessions]);

  // Group sessions chronologically: This Week, Last Week, Older
  const groupedSessions = useMemo<GroupedSession[]>(() => {
    const sorted = [...studySessions].sort((a, b) => {
      const aTime = new Date(
        a.date || a.startTime || a.endTime || 0,
      ).getTime();
      const bTime = new Date(
        b.date || b.startTime || b.endTime || 0,
      ).getTime();
      return bTime - aTime;
    });

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfThisWeek = new Date(startOfDay);
    startOfThisWeek.setDate(startOfDay.getDate() - startOfDay.getDay()); // Sunday as start of week

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const thisWeek: StudySession[] = [];
    const lastWeek: StudySession[] = [];
    const older: StudySession[] = [];

    sorted.forEach((session) => {
      const sessionDateStr =
        session.date || session.startTime || session.endTime;
      const sessionDate = sessionDateStr
        ? new Date(sessionDateStr)
        : new Date();
      if (sessionDate >= startOfThisWeek) {
        thisWeek.push(session);
      } else if (sessionDate >= startOfLastWeek) {
        lastWeek.push(session);
      } else {
        older.push(session);
      }
    });

    return [
      { title: "This Week", data: thisWeek },
      { title: "Last Week", data: lastWeek },
      { title: "Older", data: older },
    ].filter((group) => group.data.length > 0);
  }, [studySessions]);

  const handleSessionSelect = useCallback((id: string) => {
    setSelectedSessionId(id);
  }, []);

  const handleGoBack = useCallback(() => {
    setSelectedSessionId(null);
  }, []);

  return {
    selectedSessionId,
    selectedSession,
    selectedSessionMetrics,
    listStats,
    groupedSessions,
    handleSessionSelect,
    handleGoBack,
    isLoading,
    refreshSessions,
    isLoadingDetails,
  };
}
