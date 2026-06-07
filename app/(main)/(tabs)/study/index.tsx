import { AppHeader } from "@/components/common/AppHeader";
import { FocusCamera } from "@/components/study/FocusCamera";
import type { TimerMode } from "@/components/study/PremiumPomodoro";
import { Task, TaskManager } from "@/components/study/TaskManager";
import {
	TimerSettings,
	TimerSettingsModal,
} from "@/components/study/TimerSettingsModal";
import { UnifiedStudyView } from "@/components/study/UnifiedStudyView";
import { useStudySessions } from "@/contexts/StudySessionContext";
import { activeSessionTracker } from "@/utils/activeSession";
import { Theme } from "@/constants/Theme";
import {
	Brain,
	Camera,
	ListTodo,
	Pause,
	Play,
	RotateCcw,
	Settings,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack, styled } from "tamagui";

import * as ScreenOrientation from "expo-screen-orientation";

const TabButton = styled(YStack, {
  paddingVertical: "$2",
  paddingHorizontal: "$4",
  borderRadius: 6, // Crisp corners
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: "$2",
  pressStyle: { scale: 0.98 },
  variants: {
    active: {
      true: {
        backgroundColor: Theme.primaryPastel,
      },
      false: {
        backgroundColor: "transparent",
      },
    },
  } as const,
});

export interface SessionStats {
  startTime: string;
  endTime: string;
  totalTime: number;
  focusTime: number;
  breakTime: number;
  cycles: number;
  sessionType: string;
}

export default function StudyScreen() {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "camera" | "tasks">(
    "pomodoro",
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { saveDetailedSession } = useStudySessions();

  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    mode: "pomodoro",
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
    totalCycles: 4,
  });

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");
  const [timerTotalTime, setTimerTotalTime] = useState(
    timerSettings.focusDuration * 60,
  );
  const [timerTimeLeft, setTimerTimeLeft] = useState(
    timerSettings.focusDuration * 60,
  );
  const [currentCycle, setCurrentCycle] = useState(1);
  const [sessionKey, setSessionKey] = useState(Date.now());

  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [focusHistory, setFocusHistory] = useState<
    { score: number; timeElapsed: number }[]
  >([]);
  const [currentFocusScore, setCurrentFocusScore] = useState(0);

  useEffect(() => {
    if (activeTab === "camera") {
      ScreenOrientation.unlockAsync();
    } else {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    }
  }, [activeTab]);

  useEffect(() => {
    activeSessionTracker.setRunning(timerRunning);
  }, [timerRunning]);

  useEffect(() => {
    activeSessionTracker.registerPauseCallback(() => {
      setTimerRunning(false);
      setCameraActive(false);
    });
    return () => {
      activeSessionTracker.unregisterPauseCallback();
    };
  }, []);

  // Sync totalTime when settings or mode changes
  useEffect(() => {
    let duration: number;
    if (timerMode === "focus") duration = timerSettings.focusDuration;
    else if (timerMode === "longBreak")
      duration = timerSettings.longBreakDuration;
    else duration = timerSettings.breakDuration;
    setTimerTotalTime(duration * 60);
    setTimerTimeLeft(duration * 60);
  }, [
    timerSettings.focusDuration,
    timerSettings.breakDuration,
    timerSettings.longBreakDuration,
    timerMode,
  ]);

  // Countdown tick — mode advancement is handled inside PremiumPomodoro
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });

      // Track stats and history
      setSessionStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          totalTime: prev.totalTime + 1,
          focusTime:
            timerMode === "focus" ? prev.focusTime + 1 : prev.focusTime,
          breakTime:
            timerMode !== "focus" ? prev.breakTime + 1 : prev.breakTime,
        };
      });

      setFocusHistory((prev) => {
        const timeElapsed = sessionStats ? sessionStats.totalTime + 1 : 0;
        const score = cameraActive ? currentFocusScore : 0;
        return [...prev, { score, timeElapsed }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerMode, sessionStats, currentFocusScore, cameraActive]);

  // Initialize session stats when starting the timer
  useEffect(() => {
    if (timerRunning && !sessionStats) {
      setSessionStats({
        startTime: new Date().toISOString(),
        endTime: "",
        totalTime: 0,
        focusTime: 0,
        breakTime: 0,
        cycles: currentCycle,
        sessionType: timerSettings.mode,
      });
    }
  }, [timerRunning, sessionStats, currentCycle, timerSettings.mode]);

  const handleSaveSession = useCallback(async () => {
    if (!sessionStats) return;

    const finalStats = {
      ...sessionStats,
      endTime: new Date().toISOString(),
      cycles: currentCycle,
    };

    const averageFocus =
      focusHistory.length > 0
        ? focusHistory.reduce((acc, curr) => acc + curr.score, 0) /
          focusHistory.length
        : 0;

    const focusData = focusHistory.map((item) => {
      const startTimeMs = new Date(finalStats.startTime).getTime();
      const ts = new Date(startTimeMs + item.timeElapsed * 1000);
      return {
        timestamp: ts.toISOString(),
        focusLevel: item.score,
      };
    });

    const sessionData = {
      ...finalStats,
      averageFocus,
      focusData,
    };

    await saveDetailedSession(sessionData);
  }, [sessionStats, focusHistory, currentCycle, saveDetailedSession]);

  const timerTimeElapsed = timerTotalTime - timerTimeLeft;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleTimerReset = useCallback(
    async (shouldSave?: boolean) => {
      if (shouldSave) {
        await handleSaveSession();
      }
      setTimerRunning(false);
      setTimerTimeLeft(timerTotalTime);
      setCurrentCycle(1);
      setTimerMode("focus");
      setSessionKey(Date.now());
      setSessionStats(null);
      setFocusHistory([]);
    },
    [timerTotalTime, handleSaveSession],
  );

  /** Called by PremiumPomodoro when a focus session completes (before long break). */
  const handleCycleComplete = useCallback(() => {
    setCurrentCycle((prev) => {
      const next = prev + 1;
      return next > timerSettings.totalCycles ? 1 : next;
    });
  }, [timerSettings.totalCycles]);

  /** Called when a full set (all cycles + long break) finishes — resets to cycle 1. */
  const handleLongBreakComplete = useCallback(() => {
    setCurrentCycle(1);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top"]}
    >
      <AppHeader
        title="Study Center"
        rightElement={
          <Button
            circular
            size="$3"
            chromeless
            icon={<Settings size={18} color={Theme.text} />}
            onPress={() => setSettingsModalOpen(true)}
          />
        }
      />

      <YStack flex={1}>
        {/* Tab Navigation */}
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$2"
          gap="$2"
          backgroundColor={Theme.surface}
          borderBottomWidth={1}
          borderBottomColor={Theme.border}
        >
          <TabButton
            active={activeTab === "pomodoro"}
            onPress={() => setActiveTab("pomodoro")}
          >
            <Brain
              size={15}
              color={activeTab === "pomodoro" ? Theme.primary : Theme.textMuted}
            />
            <Text
              fontSize="$2"
              fontWeight="700"
              color={activeTab === "pomodoro" ? Theme.primary : Theme.textMuted}
            >
              Timer
            </Text>
          </TabButton>
          <TabButton
            active={activeTab === "camera"}
            onPress={() => setActiveTab("camera")}
          >
            <Camera
              size={15}
              color={activeTab === "camera" ? Theme.primary : Theme.textMuted}
            />
            <Text
              fontSize="$2"
              fontWeight="700"
              color={activeTab === "camera" ? Theme.primary : Theme.textMuted}
            >
              Camera
            </Text>
          </TabButton>
          <TabButton
            active={activeTab === "tasks"}
            onPress={() => setActiveTab("tasks")}
          >
            <ListTodo
              size={15}
              color={activeTab === "tasks" ? Theme.primary : Theme.textMuted}
            />
            <Text
              fontSize="$2"
              fontWeight="700"
              color={activeTab === "tasks" ? Theme.primary : Theme.textMuted}
            >
              Tasks
            </Text>
          </TabButton>
        </XStack>

        {/* Mini Timer Banner when in Camera or Tasks tab */}
        {(activeTab === "camera" || activeTab === "tasks") && (
          <XStack
            backgroundColor={Theme.surface}
            marginHorizontal="$4"
            marginTop="$3"
            paddingVertical="$2"
            paddingHorizontal="$4"
            borderRadius={6} // Crisp corners
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            borderColor={Theme.border}
          >
            <XStack alignItems="center" gap={10}>
              <Brain size={16} color={Theme.text} />
              <YStack>
                <Text
                  fontSize="$1"
                  fontWeight="700"
                  color={Theme.textMuted}
                  textTransform="uppercase"
                >
                  {timerMode === "focus" ? "Focus Session" : "Break Time"}
                </Text>
                <Text fontSize="$4" fontWeight="700" color={Theme.text}>
                  {formatTime(timerTimeLeft)}
                </Text>
              </YStack>
            </XStack>
            <XStack gap="$2" alignItems="center">
              <Button
                circular
                size={32}
                backgroundColor={timerRunning ? Theme.accentRed : Theme.primary}
                onPress={() => setTimerRunning(!timerRunning)}
                pressStyle={{ scale: 0.95 }}
                icon={
                  timerRunning ? (
                    <Pause size={14} color={Theme.accentRedText} />
                  ) : (
                    <Play size={14} color={Theme.primaryText} />
                  )
                }
              />
              <Button
                circular
                size={32}
                backgroundColor={Theme.surface}
                borderWidth={1}
                borderColor={Theme.border}
                onPress={() => handleTimerReset()}
                pressStyle={{ scale: 0.95 }}
                icon={<RotateCcw size={14} color={Theme.text} />}
              />
            </XStack>
          </XStack>
        )}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack
            style={{ display: activeTab === "pomodoro" ? "flex" : "none" }}
          >
            <UnifiedStudyView
              timerSettings={timerSettings}
              timerRunning={timerRunning}
              timerTimeLeft={timerTimeLeft}
              timerMode={timerMode}
              timerTotalTime={timerTotalTime}
              currentCycle={currentCycle}
              setTimerTimeLeft={setTimerTimeLeft}
              setTimerRunning={setTimerRunning}
              setTimerMode={setTimerMode}
              onTimerReset={handleTimerReset}
              onCycleComplete={handleCycleComplete}
              onLongBreakComplete={handleLongBreakComplete}
              onSettingsPress={() => setSettingsModalOpen(true)}
            />
          </YStack>

          <YStack style={{ display: activeTab === "camera" ? "flex" : "none" }}>
            <FocusCamera
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
              isActive={cameraActive}
              setIsActive={setCameraActive}
              sessionKey={sessionKey}
              onFocusScoreChange={setCurrentFocusScore}
              focusHistory={focusHistory}
            />
          </YStack>

          <YStack style={{ display: activeTab === "tasks" ? "flex" : "none" }}>
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          </YStack>
        </ScrollView>
      </YStack>

      <TimerSettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        settings={timerSettings}
        onSave={setTimerSettings}
      />
    </SafeAreaView>
  );
}
