import React from "react";
import { YStack, Text, XStack, View } from "tamagui";
import { PremiumPomodoro } from "./PremiumPomodoro";
import ProductivityChart from "./ProductivityChart";
import { Brain, TrendingUp } from "lucide-react-native";

interface UnifiedStudyViewProps {
  timerSettings: {
    focusDuration: number;
    breakDuration: number;
  };
  timerRunning: boolean;
  timerTimeElapsed: number;
  onTimerStateChange: (isRunning: boolean, timeElapsed: number) => void;
  onSettingsPress: () => void;
}

export const UnifiedStudyView = ({
  timerSettings,
  timerRunning,
  timerTimeElapsed,
  onTimerStateChange,
  onSettingsPress,
}: UnifiedStudyViewProps) => {
  return (
    <YStack gap="$6">
      <YStack gap="$2">
        <XStack alignItems="center" gap="$2">
          <View backgroundColor="#6750A4" padding="$2" borderRadius={12}>
            <Brain size={20} color="white" />
          </View>
          <YStack>
            <Text fontSize="$6" fontWeight="900" color="#1D1B20">
              Study Hub
            </Text>
            <Text fontSize="$2" fontWeight="700" color="#7A7582" textTransform="uppercase">
              Deep Work Session
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <PremiumPomodoro
        focusDuration={timerSettings.focusDuration}
        breakDuration={timerSettings.breakDuration}
        onStateChange={onTimerStateChange}
        onSettingsPress={onSettingsPress}
      />

      <YStack gap="$4">
        <XStack alignItems="center" gap="$2" paddingLeft="$2">
          <TrendingUp size={18} color="#6750A4" />
          <Text fontSize="$4" fontWeight="800" color="#1D1B20">
            Performance Analytics
          </Text>
        </XStack>
        <ProductivityChart
          isRunning={timerRunning}
          timeElapsed={timerTimeElapsed}
        />
      </YStack>

      {/* Summary Footer */}
      <XStack 
        backgroundColor="#6750A4" 
        padding="$5" 
        borderRadius={24} 
        justifyContent="space-between" 
        alignItems="center"
      >
        <YStack>
          <Text color="white" opacity={0.7} fontSize="$2" fontWeight="700">TOTAL FOCUSED</Text>
          <Text color="white" fontSize="$6" fontWeight="900">
            {Math.floor(timerTimeElapsed / 60)}m {timerTimeElapsed % 60}s
          </Text>
        </YStack>
        <View backgroundColor="rgba(255,255,255,0.2)" paddingHorizontal="$3" paddingVertical="$1" borderRadius={100}>
          <Text color="white" fontWeight="800" fontSize="$2">Level 1</Text>
        </View>
      </XStack>
    </YStack>
  );
};
