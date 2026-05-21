import { playLongBreakTing, playTing } from "@/utils/tingSound";
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
import React, { useEffect, useRef } from "react";
import { View as RNView, StyleSheet } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import { Button, Progress, Text, View, XStack, YStack } from "tamagui";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  primary: "#6750A4",
  primaryDark: "#4F378A",
  primaryContainer: "#EADDFF",
  primaryFixed: "#F3EDF7",
  onPrimary: "#ffffff",
  surface: "#1D1B20",
  surfaceVariant: "#7A7582",
  outline: "#49454F",
  focusColor: "#6750A4",
  breakColor: "#7B5EA7",
  longBreakColor: "#3B5998",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────
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
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setIsRunning: (running: boolean) => void;
  setMode: (mode: TimerMode) => void;
  onFinish?: () => void;
  onReset?: () => void;
  onSettingsPress?: () => void;
  onCycleComplete?: () => void;
  /** Called when a full set (all cycles + long break) completes, so the parent can reset currentCycle to 1. */
  onLongBreakComplete?: () => void;
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

/** Renders N dots showing completed/current/remaining cycles. */
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
              isCompleted && styles.cycleDotCompleted,
              isCurrent && styles.cycleDotCurrent,
              isLongBreakCycle && styles.cycleDotLongBreak,
            ]}
          />
        );
      })}
      {mode === "longBreak" && (
        <Moon size={14} color={C.longBreakColor} strokeWidth={2} />
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
      backgroundColor={isActive ? C.primary : "transparent"}
      onPress={onPress}
      chromeless={!isActive}
      pressStyle={{ scale: 0.95 }}
    >
      <XStack gap="$2" alignItems="center">
        {icon}
        <Text
          fontWeight="700"
          color={isActive ? "white" : C.primary}
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
      ? C.longBreakColor
      : mode === "break"
        ? C.breakColor
        : C.primary;

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
        stroke="#F3EDF7"
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
        color="#1D1B20"
        lineHeight={72}
        letterSpacing={-2}
      >
        {formatted}
      </Text>
      <Text
        fontSize="$3"
        fontWeight="700"
        color="#7A7582"
        textTransform="uppercase"
        letterSpacing={2}
      >
        {modeLabel}
      </Text>
    </YStack>
  );
}

/** Control row: Reset, Play/Pause, Settings. */
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
        backgroundColor={C.primaryFixed}
        onPress={onReset}
        pressStyle={{ scale: 0.9, backgroundColor: C.primaryContainer }}
        icon={<RotateCcw size={24} color={C.primary} />}
      />
      <Button unstyled onPress={onToggle} pressStyle={{ scale: 0.92 }}>
        <LinearGradient
          colors={[C.primary, C.primaryDark]}
          style={styles.playButtonGradient}
        >
          {isRunning ? (
            <Pause size={36} color="white" fill="white" />
          ) : (
            <Play size={36} color="white" fill="white" x={2} />
          )}
        </LinearGradient>
      </Button>
      <Button
        circular
        size="$5"
        backgroundColor={C.primaryFixed}
        onPress={onSettingsPress}
        pressStyle={{ scale: 0.9, backgroundColor: C.primaryContainer }}
        icon={<Settings2 size={24} color={C.primary} />}
      />
    </XStack>
  );
}

/** Session progress bar + label row. */
function SessionProgress({
  progress,
  mode,
  currentCycle,
  totalCycles,
}: {
  progress: number;
  mode: TimerMode;
  currentCycle: number;
  totalCycles: number;
}) {
  const modeTag =
    mode === "focus" ? "FOCUS" : mode === "break" ? "BREAK" : "LONG BREAK";

  return (
    <YStack width="100%" gap="$3" paddingHorizontal="$2">
      <XStack justifyContent="space-between" alignItems="flex-end">
        <YStack>
          <Text
            fontSize="$2"
            fontWeight="800"
            color="#49454F"
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Session
          </Text>
          <Text fontSize="$5" fontWeight="900" color="#1D1B20">
            {Math.round(progress)}% Complete
          </Text>
        </YStack>
        <XStack gap="$2" alignItems="center">
          <View
            backgroundColor={C.primaryContainer}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius={100}
          >
            <Text fontSize="$1" fontWeight="900" color="#21005D">
              {modeTag}
            </Text>
          </View>
          <View
            backgroundColor="#F0EAFF"
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius={100}
          >
            <Text fontSize="$1" fontWeight="900" color={C.primary}>
              {currentCycle}/{totalCycles}
            </Text>
          </View>
        </XStack>
      </XStack>
      <Progress
        value={progress}
        height={12}
        backgroundColor={C.primaryFixed}
        borderRadius={100}
      >
        <Progress.Indicator backgroundColor={C.primary} />
      </Progress>
    </YStack>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────────
function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────────
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
  setTimeLeft,
  setIsRunning,
  setMode,
  onReset,
  onSettingsPress,
  onCycleComplete,
  onLongBreakComplete,
}: PomodoroProps) => {
  const sessionEndedRef = useRef(false);

  // Reset the "already fired" guard whenever a new session starts
  useEffect(() => {
    if (timeLeft === totalTime) {
      sessionEndedRef.current = false;
    }
  }, [timeLeft, totalTime]);

  // Auto-advance to next mode when timer hits zero
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning || sessionEndedRef.current) return;

    sessionEndedRef.current = true;

    const advanceToNextMode = async () => {
      if (mode === "focus") {
        const isLastCycleOfSet = currentCycle >= totalCycles;
        if (isLastCycleOfSet) {
          // Focus → Long Break
          await playLongBreakTing();
          setMode("longBreak");
          setTimeLeft((longBreakDuration ?? 15) * 60);
        } else {
          // Focus → Short Break
          await playTing();
          onCycleComplete?.();
          setMode("break");
          setTimeLeft(breakDuration * 60);
        }
      } else {
        // Break or Long Break → Focus
        await playTing();
        if (mode === "longBreak") {
          onLongBreakComplete?.(); // signal parent to reset currentCycle → 1
        }
        setMode("focus");
        setTimeLeft(focusDuration * 60);
      }
      // Keep the timer running — auto-continue into the next mode
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

  return (
    <YStack
      padding="$6"
      borderRadius={40}
      backgroundColor="white"
      shadowColor={C.primary}
      shadowRadius={40}
      shadowOpacity={0.15}
      gap="$6"
      alignItems="center"
    >
      {/* Mode toggle tab bar */}
      <XStack
        gap="$2"
        backgroundColor="#F7F2FA"
        padding="$1.5"
        borderRadius={100}
        alignSelf="center"
      >
        <ModeToggleChip
          label="Focus"
          icon={
            <Brain size={16} color={mode === "focus" ? "white" : C.primary} />
          }
          isActive={mode === "focus"}
          onPress={() => setMode("focus")}
        />
        <ModeToggleChip
          label="Break"
          icon={
            <Coffee size={16} color={mode === "break" ? "white" : C.primary} />
          }
          isActive={mode === "break"}
          onPress={() => setMode("break")}
        />
        <ModeToggleChip
          label="Long Break"
          icon={
            <Moon
              size={16}
              color={mode === "longBreak" ? "white" : C.primary}
            />
          }
          isActive={mode === "longBreak"}
          onPress={() => setMode("longBreak")}
        />
      </XStack>

      {/* Cycle dots above the ring */}
      <CycleDotsIndicator
        currentCycle={currentCycle}
        totalCycles={totalCycles}
        mode={mode}
      />

      {/* SVG Ring + Time display */}
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

      {/* Play/Pause + Reset + Settings */}
      <TimerControls
        isRunning={isRunning}
        onToggle={() => setIsRunning(!isRunning)}
        onReset={onReset}
        onSettingsPress={onSettingsPress}
      />

      {/* Progress bar footer */}
      <SessionProgress
        progress={progress}
        mode={mode}
        currentCycle={currentCycle}
        totalCycles={totalCycles}
      />
    </YStack>
  );
};

export const PremiumPomodoro = React.memo(PremiumPomodoroComponent);

// ─── Styles ───────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  playButtonGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  cycleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E8DEF8",
  },
  cycleDotCompleted: {
    backgroundColor: C.primary,
  },
  cycleDotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.primary,
    // Pulse ring via box-shadow not available in RN — use border instead
    borderWidth: 2,
    borderColor: "#C4B5FD",
  },
  cycleDotLongBreak: {
    backgroundColor: C.longBreakColor,
  },
});
