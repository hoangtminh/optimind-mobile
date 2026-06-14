import type { TimerMode } from "@/components/study/PremiumPomodoro";
import React from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { PremiumPomodoro } from "./PremiumPomodoro";
import { Theme } from "@/constants/Theme";

interface UnifiedStudyViewProps {
  timerSettings: {
    mode: "pomodoro" | "countdown";
    focusDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    totalCycles: number;
  };
  timerRunning: boolean;
  timerTimeLeft: number;
  timerMode: TimerMode;
  timerTotalTime: number;
  currentCycle: number;
  setTimerTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setTimerRunning: (running: boolean) => void;
  setTimerMode: (mode: TimerMode) => void;
  onTimerReset: (shouldSave?: boolean, completed?: boolean) => Promise<void> | void;
  onCycleComplete: () => void;
  onLongBreakComplete: () => void;
  onSettingsPress: () => void;
  onFinish?: () => void;
}

const UnifiedStudyViewComponent = ({
  timerSettings,
  timerRunning,
  timerTimeLeft,
  timerMode,
  timerTotalTime,
  currentCycle,
  setTimerTimeLeft,
  setTimerRunning,
  setTimerMode,
  onTimerReset,
  onCycleComplete,
  onLongBreakComplete,
  onSettingsPress,
  onFinish,
}: UnifiedStudyViewProps) => {
  const timerTimeElapsed = timerTotalTime - timerTimeLeft;
  const isCountdown = timerSettings.mode === "countdown";

  const badgeBg = Theme.primaryText === "#FFFFFF" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";

  return (
    <YStack gap="$6">
      <PremiumPomodoro
        focusDuration={timerSettings.focusDuration}
        breakDuration={timerSettings.breakDuration}
        longBreakDuration={timerSettings.longBreakDuration}
        timeLeft={timerTimeLeft}
        isRunning={timerRunning}
        mode={timerMode}
        totalTime={timerTotalTime}
        currentCycle={currentCycle}
        totalCycles={timerSettings.totalCycles}
        isCountdown={isCountdown}
        setTimeLeft={setTimerTimeLeft}
        setIsRunning={setTimerRunning}
        setMode={setTimerMode}
        onReset={onTimerReset}
        onCycleComplete={onCycleComplete}
        onLongBreakComplete={onLongBreakComplete}
        onSettingsPress={onSettingsPress}
        onFinish={onFinish}
      />

      {/* Summary Footer */}
      <XStack
        backgroundColor={Theme.primary}
        padding="$5"
        borderRadius={12}
        justifyContent="space-between"
        alignItems="center"
        borderWidth={1}
        borderColor={Theme.border}
      >
        <YStack>
          <Text color={Theme.primaryText} opacity={0.8} fontSize="$2" fontWeight="700" letterSpacing={0.5}>
            TOTAL FOCUSED
          </Text>
          <Text color={Theme.primaryText} fontSize="$6" fontWeight="900">
            {Math.floor(timerTimeElapsed / 60)}m {timerTimeElapsed % 60}s
          </Text>
        </YStack>
        <View
          backgroundColor={badgeBg}
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius={100}
        >
          <Text color={Theme.primaryText} fontWeight="800" fontSize="$2">
            Level 1
          </Text>
        </View>
      </XStack>
    </YStack>
  );
};

export const UnifiedStudyView = React.memo(UnifiedStudyViewComponent);
