import { AppHeader } from "@/components/app/AppHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { FocusCamera } from "@/components/study/FocusCamera";
import { Task, TaskManager } from "@/components/study/TaskManager";
import { TimerSettingsModal } from "@/components/study/TimerSettingsModal";
import { UnifiedStudyView } from "@/components/study/UnifiedStudyView";
import { Theme } from "@/constants/Theme";
import { useSettings } from "@/contexts/SettingsContext";
import { activeSessionTracker } from "@/utils/activeSession";
import {
  Brain,
  Camera,
  ListTodo,
  Pause,
  Play,
  RotateCcw,
  Settings,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack, styled } from "tamagui";

import { useStudySession } from "@/hooks/useStudySession";
import { formatTime, useStudyTimer } from "@/hooks/useStudyTimer";
import RNOrientationDirector, {
  Orientation,
} from "react-native-orientation-director";

export interface SessionStats {
  startTime: string;
  endTime: string;
  totalTime: number;
  focusTime: number;
  breakTime: number;
  cycles: number;
  sessionType: string;
}

const TabButton = styled(YStack, {
  paddingVertical: "$2",
  paddingHorizontal: "$4",
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: "$2",
  pressStyle: { scale: 0.98 },
});

export default function StudyScreen() {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "camera" | "tasks">(
    "pomodoro",
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [currentFocusScore, setCurrentFocusScore] = useState(0);

  const { settings, updateSettings } = useSettings();

  const timer = useStudyTimer(settings);
  const session = useStudySession(settings);

  useEffect(() => {
    RNOrientationDirector.lockTo(Orientation.portrait);
  }, []);

  useEffect(() => {
    activeSessionTracker.setRunning(timer.timerRunning);
  }, [timer.timerRunning]);
  useEffect(() => {
    activeSessionTracker.registerPauseCallback(() => {
      timer.setTimerRunning(false);
      setCameraActive(false);
    });
    return () => activeSessionTracker.unregisterPauseCallback();
  }, []);

  useEffect(() => {
    session.initSessionIfNeeded(
      timer.timerRunning,
      timer.currentCycle,
      settings.mode,
    );
  }, [timer.timerRunning, timer.currentCycle, settings.mode]);

  useEffect(() => {
    if (!timer.timerRunning) return;
    const id = setInterval(() => {
      session.tickSession(timer.timerMode, cameraActive, currentFocusScore);
    }, 1000);
    return () => clearInterval(id);
  }, [timer.timerRunning, timer.timerMode, cameraActive, currentFocusScore]);

  const handleTimerReset = useCallback(
    async (shouldSave?: boolean, completed?: boolean) => {
      if (shouldSave) await session.handleSaveSession(completed ?? false);
      timer.resetTimer(settings);
      session.resetSession();
    },
    [session, timer, settings],
  );

  const handleSessionFinish = useCallback(async () => {
    await session.handleSessionFinish();
  }, [session]);

  const handleCongratsConfirm = useCallback(() => {
    session.handleCongratsConfirm(() => handleTimerReset(false));
  }, [session, handleTimerReset]);

  const handleAddTask = useCallback(
    (task: Task) => setTasks((prev) => [...prev, task]),
    [],
  );

  const handleDeleteTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const formattedTimeLeft = useMemo(
    () => formatTime(timer.timerTimeLeft),
    [timer.timerTimeLeft],
  );

  const showMiniBanner = activeTab === "camera" || activeTab === "tasks";

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
        {/* ── Tab Navigation ─────────────────────────────────── */}
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$2"
          gap="$2"
          backgroundColor={Theme.surface}
          borderBottomWidth={1}
          borderBottomColor={Theme.border}
        >
          <TabButton
            backgroundColor={
              activeTab === "pomodoro" ? Theme.primaryPastel : "transparent"
            }
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
            backgroundColor={
              activeTab === "camera" ? Theme.primaryPastel : "transparent"
            }
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
            backgroundColor={
              activeTab === "tasks" ? Theme.primaryPastel : "transparent"
            }
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

        {/* ── Mini Timer Banner (Camera / Tasks tabs) ─────────── */}
        {showMiniBanner && (
          <XStack
            backgroundColor={Theme.surface}
            marginHorizontal="$4"
            marginTop="$3"
            paddingVertical="$2"
            paddingHorizontal="$4"
            borderRadius={6}
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
                  {timer.timerMode === "focus" ? "Focus Session" : "Break Time"}
                </Text>
                <Text fontSize="$4" fontWeight="700" color={Theme.text}>
                  {formattedTimeLeft}
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$2" alignItems="center">
              <Button
                circular
                size={32}
                backgroundColor={
                  timer.timerRunning ? Theme.accentRed : Theme.primary
                }
                onPress={() => timer.setTimerRunning((prev) => !prev)}
                pressStyle={{ scale: 0.95 }}
                icon={
                  timer.timerRunning ? (
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
              timerSettings={settings}
              timerRunning={timer.timerRunning}
              timerTimeLeft={timer.timerTimeLeft}
              timerMode={timer.timerMode}
              timerTotalTime={timer.timerTotalTime}
              currentCycle={timer.currentCycle}
              setTimerTimeLeft={timer.setTimerTimeLeft}
              setTimerRunning={timer.setTimerRunning}
              setTimerMode={timer.setTimerMode}
              onTimerReset={handleTimerReset}
              onCycleComplete={timer.handleCycleComplete}
              onLongBreakComplete={timer.handleLongBreakComplete}
              onSettingsPress={() => setSettingsModalOpen(true)}
              onFinish={handleSessionFinish}
            />
          </YStack>

          <YStack style={{ display: activeTab === "camera" ? "flex" : "none" }}>
            <FocusCamera
              timerRunning={timer.timerRunning}
              setTimerRunning={timer.setTimerRunning}
              isActive={cameraActive}
              setIsActive={setCameraActive}
              sessionKey={timer.sessionKey}
              onFocusScoreChange={setCurrentFocusScore}
              focusHistory={session.focusHistory}
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
        settings={settings}
        onSave={updateSettings}
      />

      <PremiumAlertDialog
        open={session.showCongratsModal}
        onOpenChange={session.setShowCongratsModal}
        title="Congratulations! 🎉"
        description="You have successfully finished all study cycles! Your session has been completed and saved."
        type="success"
        confirmText="Finish"
        onConfirm={handleCongratsConfirm}
      />
    </SafeAreaView>
  );
}
