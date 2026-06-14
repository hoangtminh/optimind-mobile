import { playLongBreakTing, playTing } from "@/utils/tingSound";
import { Theme } from "@/constants/Theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  Brain,
  Coffee,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Settings2,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { View as RNView, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import {
  AlertDialog,
  Button,
  Progress,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export type TimerMode = "focus" | "break" | "longBreak";

export interface PomodoroProps {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  totalTime: number;
  currentCycle: number;
  totalCycles: number;
  isCountdown?: boolean;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setIsRunning: (running: boolean) => void;
  setMode: (mode: TimerMode) => void;
  onFinish?: () => void;
  onReset?: (shouldSave?: boolean, completed?: boolean) => void;
  onSettingsPress?: () => void;
  onCycleComplete?: () => void;
  onLongBreakComplete?: () => void;
}

function CycleDotsIndicator({
  currentCycle,
  totalCycles,
  mode,
}: {
  currentCycle: number;
  totalCycles: number;
  mode: TimerMode;
}) {
  return (
    <XStack gap={8} alignItems="center" justifyContent="center">
      {Array.from({ length: totalCycles }, (_, index) => {
        const isCompleted = index < currentCycle - 1;
        const isCurrent = index === currentCycle - 1;
        const isLongBreakCycle =
          index === totalCycles - 1 && mode === "longBreak";

        return (
          <RNView
            key={index}
            style={[
              styles.cycleDot,
              { backgroundColor: Theme.border },
              isCompleted && { backgroundColor: Theme.primary },
              isCurrent && {
                backgroundColor: Theme.primary,
                borderWidth: 2,
                borderColor: Theme.primaryPastelText,
              },
              isLongBreakCycle && { backgroundColor: Theme.accentBlueText },
            ]}
          />
        );
      })}
      {mode === "longBreak" && (
        <Moon size={14} color={Theme.accentBlueText} strokeWidth={2} />
      )}
    </XStack>
  );
}

function ModeToggleChip({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      size="$3"
      borderRadius={100}
      backgroundColor={isActive ? Theme.primary : "transparent"}
      onPress={onPress}
      chromeless={!isActive}
      pressStyle={{ scale: 0.95 }}
    >
      <XStack gap="$2" alignItems="center">
        {icon}
        <Text
          fontWeight="700"
          color={isActive ? Theme.primaryText : Theme.primary}
          fontSize="$2"
        >
          {label}
        </Text>
      </XStack>
    </Button>
  );
}

function ProgressRing({
  size,
  strokeWidth,
  progress,
  mode,
}: {
  size: number;
  strokeWidth: number;
  progress: number;
  mode: TimerMode;
}) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const ringColor =
    mode === "longBreak"
      ? Theme.accentBlueText
      : mode === "break"
        ? Theme.accentGreenText
        : Theme.primary;

  return (
    <Svg
      width={size}
      height={size}
      style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
    >
      <SvgCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={Theme.background}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <SvgCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function TimerDisplay({
  timeLeft,
  mode,
}: {
  timeLeft: number;
  mode: TimerMode;
}) {
  const formatted = formatSeconds(timeLeft);
  const modeLabel =
    mode === "focus"
      ? "Deep Work"
      : mode === "break"
        ? "Rest Up"
        : "Long Break";

  return (
    <YStack alignItems="center" gap="$0">
      <Text
        fontSize={64}
        fontWeight="900"
        color={Theme.text}
        lineHeight={72}
        letterSpacing={-2}
      >
        {formatted}
      </Text>
      <Text
        fontSize="$3"
        fontWeight="700"
        color={Theme.textMuted}
        textTransform="uppercase"
        letterSpacing={2}
      >
        {modeLabel}
      </Text>
    </YStack>
  );
}

function TimerControls({
  isRunning,
  onToggle,
  onReset,
  onSettingsPress,
}: {
  isRunning: boolean;
  onToggle: () => void;
  onReset?: () => void;
  onSettingsPress?: () => void;
}) {
  return (
    <XStack gap="$5" alignItems="center">
      <Button
        circular
        size="$5"
        backgroundColor={Theme.primaryPastel}
        onPress={onReset}
        pressStyle={{ scale: 0.9, backgroundColor: Theme.border }}
        icon={<RotateCcw size={24} color={Theme.primary} />}
      />
      <Button unstyled onPress={onToggle} pressStyle={{ scale: 0.92 }}>
        <LinearGradient
          colors={[Theme.primary, Theme.primary]}
          style={[styles.playButtonGradient, { backgroundColor: Theme.primary }]}
        >
          {isRunning ? (
            <Pause size={36} color={Theme.primaryText} fill={Theme.primaryText} />
          ) : (
            <Play size={36} color={Theme.primaryText} fill={Theme.primaryText} x={2} />
          )}
        </LinearGradient>
      </Button>
      <Button
        circular
        size="$5"
        backgroundColor={Theme.primaryPastel}
        onPress={onSettingsPress}
        pressStyle={{ scale: 0.9, backgroundColor: Theme.border }}
        icon={<Settings2 size={24} color={Theme.primary} />}
      />
    </XStack>
  );
}

function SessionProgress({
  progress,
  mode,
  currentCycle,
  totalCycles,
  isCountdown,
}: {
  progress: number;
  mode: TimerMode;
  currentCycle: number;
  totalCycles: number;
  isCountdown: boolean;
}) {
  const modeTag =
    mode === "focus" ? "FOCUS" : mode === "break" ? "BREAK" : "LONG BREAK";

  const modeBadgeBg =
    mode === "longBreak"
      ? Theme.accentBlue
      : mode === "break"
        ? Theme.accentGreen
        : Theme.primaryPastel;

  const modeBadgeText =
    mode === "longBreak"
      ? Theme.accentBlueText
      : mode === "break"
        ? Theme.accentGreenText
        : Theme.primaryPastelText;

  return (
    <YStack width="100%" gap="$3" paddingHorizontal="$2">
      <XStack justifyContent="space-between" alignItems="flex-end">
        <YStack>
          <Text
            fontSize="$2"
            fontWeight="800"
            color={Theme.textMuted}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Session
          </Text>
          <Text fontSize="$5" fontWeight="900" color={Theme.text}>
            {Math.round(progress)}% Complete
          </Text>
        </YStack>
        <XStack gap="$2" alignItems="center">
          <View
            backgroundColor={modeBadgeBg}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius={100}
          >
            <Text fontSize="$1" fontWeight="900" color={modeBadgeText}>
              {modeTag}
            </Text>
          </View>
          {!isCountdown && (
            <View
              backgroundColor={Theme.primaryPastel}
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius={100}
            >
              <Text fontSize="$1" fontWeight="900" color={Theme.primaryPastelText}>
                {currentCycle}/{totalCycles}
              </Text>
            </View>
          )}
        </XStack>
      </XStack>
      <Progress
        value={progress}
        height={10}
        backgroundColor={Theme.surfaceMuted}
        borderRadius={100}
      >
        <Progress.Indicator backgroundColor={Theme.primary} />
      </Progress>
    </YStack>
  );
}

function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const RING_SIZE = 240;
const RING_STROKE = 10;

const PremiumPomodoroComponent = ({
  focusDuration = 25,
  breakDuration = 5,
  longBreakDuration = 15,
  timeLeft,
  isRunning,
  mode,
  totalTime,
  currentCycle,
  totalCycles,
  isCountdown = false,
  setTimeLeft,
  setIsRunning,
  setMode,
  onReset,
  onSettingsPress,
  onCycleComplete,
  onLongBreakComplete,
  onFinish,
}: PomodoroProps) => {
  const sessionEndedRef = useRef(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    if (timeLeft === totalTime) {
      sessionEndedRef.current = false;
    }
  }, [timeLeft, totalTime]);

  useEffect(() => {
    if (timeLeft !== 0 || !isRunning || sessionEndedRef.current) return;

    sessionEndedRef.current = true;

    const advanceToNextMode = async () => {
      if (mode === "focus") {
        if (isCountdown) {
          await playLongBreakTing();
          setIsRunning(false);
          onFinish?.();
          return;
        }
        const isLastFocus = currentCycle >= totalCycles;
        if (isLastFocus) {
          await playLongBreakTing();
          setMode("longBreak");
          setTimeLeft((longBreakDuration ?? 15) * 60);
        } else {
          await playTing();
          setMode("break");
          setTimeLeft(breakDuration * 60);
        }
      } else {
        await playTing();
        if (mode === "longBreak") {
          onLongBreakComplete?.();
          setIsRunning(false);
          onFinish?.();
          return;
        } else {
          const wasLastCycle = currentCycle >= totalCycles;
          onCycleComplete?.();
          if (wasLastCycle) {
            setIsRunning(false);
            onFinish?.();
            return;
          }
        }
        setMode("focus");
        setTimeLeft(focusDuration * 60);
      }
      setIsRunning(true);
    };

    advanceToNextMode();
  }, [
    timeLeft,
    isRunning,
    mode,
    currentCycle,
    totalCycles,
    focusDuration,
    breakDuration,
    longBreakDuration,
    setMode,
    setTimeLeft,
    setIsRunning,
    onCycleComplete,
    onLongBreakComplete,
  ]);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const isSessionStarted = currentCycle > 1 || timeLeft < totalTime;

  const handleResetPress = () => {
    if (isSessionStarted) {
      setIsRunning(false);
      setShowResetDialog(true);
    } else {
      onReset?.(false);
    }
  };

  return (
    <YStack
      padding="$6"
      borderRadius={12}
      backgroundColor={Theme.surface}
      borderColor={Theme.border}
      borderWidth={1}
      gap="$6"
      alignItems="center"
    >
      <XStack
        gap="$2"
        backgroundColor={Theme.surfaceMuted}
        padding="$1.5"
        borderRadius={100}
        alignSelf="center"
      >
        <ModeToggleChip
          label="Focus"
          icon={
            <Brain size={16} color={mode === "focus" ? Theme.primaryText : Theme.primary} />
          }
          isActive={mode === "focus"}
          onPress={() => setMode("focus")}
        />
        <ModeToggleChip
          label="Break"
          icon={
            <Coffee size={16} color={mode === "break" ? Theme.primaryText : Theme.primary} />
          }
          isActive={mode === "break"}
          onPress={() => setMode("break")}
        />
        <ModeToggleChip
          label="Long Break"
          icon={
            <Moon
              size={16}
              color={mode === "longBreak" ? Theme.primaryText : Theme.primary}
            />
          }
          isActive={mode === "longBreak"}
          onPress={() => setMode("longBreak")}
        />
      </XStack>

      {!isCountdown && (
        <CycleDotsIndicator
          currentCycle={currentCycle}
          totalCycles={totalCycles}
          mode={mode}
        />
      )}

      <View
        position="relative"
        width={RING_SIZE}
        height={RING_SIZE}
        alignItems="center"
        justifyContent="center"
      >
        <ProgressRing
          size={RING_SIZE}
          strokeWidth={RING_STROKE}
          progress={progress}
          mode={mode}
        />
        <TimerDisplay timeLeft={timeLeft} mode={mode} />
      </View>

      <TimerControls
        isRunning={isRunning}
        onToggle={() => setIsRunning(!isRunning)}
        onReset={handleResetPress}
        onSettingsPress={onSettingsPress}
      />

      <SessionProgress
        progress={progress}
        mode={mode}
        currentCycle={currentCycle}
        totalCycles={totalCycles}
        isCountdown={isCountdown}
      />

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            opacity={0.5}
            backgroundColor="rgba(0,0,0,0.5)"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            key="content"
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            y={0}
            scale={1}
            opacity={1}
            backgroundColor={Theme.surface}
            borderColor={Theme.border}
            borderWidth={1}
            borderRadius={12}
            padding="$5"
            width="90%"
            maxWidth={400}
            alignSelf="center"
            justifyContent="center"
          >
            <YStack gap="$4" alignItems="center">
              <YStack gap="$2" alignItems="center">
                <AlertDialog.Title
                  fontSize="$5"
                  fontWeight="700"
                  color={Theme.text}
                  textAlign="center"
                >
                  Reset Timer?
                </AlertDialog.Title>
                <AlertDialog.Description
                  color={Theme.textMuted}
                  textAlign="center"
                  fontSize={14}
                  lineHeight={20}
                >
                  You are currently in a study session. Has this study session been completed?
                </AlertDialog.Description>
              </YStack>

              <XStack gap="$2" width="100%">
                <Button
                  flex={1}
                  height={40}
                  borderRadius={6}
                  backgroundColor={Theme.surfaceMuted}
                  borderColor={Theme.border}
                  borderWidth={1}
                  onPress={() => {
                    setShowResetDialog(false);
                    onReset?.(false);
                  }}
                  pressStyle={{ scale: 0.98 }}
                >
                  <Text fontSize={11} fontWeight="600" color={Theme.text}>
                    Discard
                  </Text>
                </Button>

                <Button
                  flex={1}
                  height={40}
                  borderRadius={6}
                  backgroundColor={Theme.surfaceMuted}
                  borderColor={Theme.border}
                  borderWidth={1}
                  onPress={() => {
                    setShowResetDialog(false);
                    onReset?.(true, false);
                  }}
                  pressStyle={{ scale: 0.98 }}
                >
                  <Text fontSize={11} fontWeight="600" color={Theme.text}>
                    Incomplete
                  </Text>
                </Button>

                <Button
                  flex={1}
                  height={40}
                  borderRadius={6}
                  backgroundColor={Theme.primary}
                  onPress={() => {
                    setShowResetDialog(false);
                    onReset?.(true, true);
                  }}
                  pressStyle={{ scale: 0.98 }}
                >
                  <Text fontSize={11} fontWeight="600" color={Theme.primaryText}>
                    Completed
                  </Text>
                </Button>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
};

export const PremiumPomodoro = React.memo(PremiumPomodoroComponent);

const styles = StyleSheet.create({
  playButtonGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  cycleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
