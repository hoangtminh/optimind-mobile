import type { TimerMode } from "@/components/study/PremiumPomodoro";
import React from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { PremiumPomodoro } from "./PremiumPomodoro";

interface UnifiedStudyViewProps {
  timerSettings: {
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
  onTimerReset: () => void;
  onCycleComplete: () => void;
  onLongBreakComplete: () => void;
  onSettingsPress: () => void;
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
}: UnifiedStudyViewProps) => {
  const timerTimeElapsed = timerTotalTime - timerTimeLeft;

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
        setTimeLeft={setTimerTimeLeft}
        setIsRunning={setTimerRunning}
        setMode={setTimerMode}
        onReset={onTimerReset}
        onCycleComplete={onCycleComplete}
        onLongBreakComplete={onLongBreakComplete}
        onSettingsPress={onSettingsPress}
      />

      {/* Summary Footer */}
      <XStack
        backgroundColor="#6750A4"
        padding="$5"
        borderRadius={24}
        justifyContent="space-between"
        alignItems="center"
      >
        <YStack>
          <Text color="white" opacity={0.7} fontSize="$2" fontWeight="700">
            TOTAL FOCUSED
          </Text>
          <Text color="white" fontSize="$6" fontWeight="900">
            {Math.floor(timerTimeElapsed / 60)}m {timerTimeElapsed % 60}s
          </Text>
        </YStack>
        <View
          backgroundColor="rgba(255,255,255,0.2)"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius={100}
        >
          <Text color="white" fontWeight="800" fontSize="$2">
            Level 1
          </Text>
        </View>
      </XStack>
    </YStack>
  );
};

export const UnifiedStudyView = React.memo(UnifiedStudyViewComponent);
