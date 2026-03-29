import {
	Pause,
	Play,
	RotateCcw,
	Settings,
	SkipForward,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TimerCircle from "./TimerCircle";

type Mode = "focus" | "break";

interface TimerState {
	isRunning: boolean;
	mode: Mode;
	timeLeft: number;
	totalTime: number;
	timeElapsed: number;
	cycleCount: number;
}

interface TimerSettings {
	mode: "pomodoro" | "countdown";
	focusDuration: number; // in minutes
	breakDuration: number; // in minutes
	longBreakDuration: number; // in minutes
	cyclesBeforeLongBreak: number;
	totalCycles: number;
}

interface TimerComponentProps {
	settings: TimerSettings;
	onSettingsPress: () => void;
	onTimerStateChange?: (isRunning: boolean, timeElapsed: number) => void;
}

export default function TimerComponent({
	settings,
	onSettingsPress,
	onTimerStateChange,
}: TimerComponentProps) {
	const [timerState, setTimerState] = useState<TimerState>({
		isRunning: false,
		mode: "focus",
		timeLeft: settings.focusDuration * 60,
		totalTime: settings.focusDuration * 60,
		timeElapsed: 0,
		cycleCount: 0,
	});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Update timer when settings change
	useEffect(() => {
		setTimerState((prev) => ({
			...prev,
			timeLeft:
				prev.mode === "focus"
					? settings.focusDuration * 60
					: settings.breakDuration * 60,
			totalTime:
				prev.mode === "focus"
					? settings.focusDuration * 60
					: settings.breakDuration * 60,
		}));
	}, [settings]);

	// Main timer effect
	useEffect(() => {
		if (!timerState.isRunning) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		intervalRef.current = setInterval(() => {
			setTimerState((prev) => {
				const newTimeLeft = prev.timeLeft - 1;
				const newTimeElapsed = prev.timeElapsed + 1;

				if (newTimeLeft <= 0) {
					// Timer finished, switch modes
					const newMode = prev.mode === "focus" ? "break" : "focus";
					let newTotal: number;

					if (newMode === "focus") {
						newTotal = settings.focusDuration * 60;
					} else {
						// Check if it's time for a long break
						const completedCycles =
							prev.mode === "focus"
								? prev.cycleCount + 1
								: prev.cycleCount;
						const isLongBreak =
							completedCycles % settings.cyclesBeforeLongBreak ===
							0;
						newTotal = isLongBreak
							? settings.longBreakDuration * 60
							: settings.breakDuration * 60;
					}

					const newCycle =
						prev.mode === "focus"
							? prev.cycleCount + 1
							: prev.cycleCount;

					return {
						isRunning: false,
						mode: newMode,
						timeLeft: newTotal,
						totalTime: newTotal,
						timeElapsed: 0,
						cycleCount: newCycle,
					};
				}

				return {
					...prev,
					timeLeft: newTimeLeft,
					timeElapsed: newTimeElapsed,
				};
			});
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [timerState.isRunning, settings]);

	// Notify parent of timer state changes
	useEffect(() => {
		onTimerStateChange?.(timerState.isRunning, timerState.timeElapsed);
	}, [timerState.isRunning, timerState.timeElapsed, onTimerStateChange]);

	const toggleTimer = () => {
		setTimerState((prev) => ({
			...prev,
			isRunning: !prev.isRunning,
		}));
	};

	const resetTimer = () => {
		setTimerState((prev) => ({
			...prev,
			isRunning: false,
			timeLeft:
				prev.mode === "focus"
					? settings.focusDuration * 60
					: settings.breakDuration * 60,
			timeElapsed: 0,
		}));
	};

	const skipToNextPhase = () => {
		const newMode = timerState.mode === "focus" ? "break" : "focus";
		let newTotal: number;

		if (newMode === "focus") {
			newTotal = settings.focusDuration * 60;
		} else {
			const completedCycles =
				timerState.mode === "focus"
					? timerState.cycleCount + 1
					: timerState.cycleCount;
			const isLongBreak =
				completedCycles % settings.cyclesBeforeLongBreak === 0;
			newTotal = isLongBreak
				? settings.longBreakDuration * 60
				: settings.breakDuration * 60;
		}

		const newCycle =
			timerState.mode === "focus"
				? timerState.cycleCount + 1
				: timerState.cycleCount;

		setTimerState({
			isRunning: false,
			mode: newMode,
			timeLeft: newTotal,
			totalTime: newTotal,
			timeElapsed: 0,
			cycleCount: newCycle,
		});
	};

	const getCurrentCycleDisplay = () => {
		if (settings.mode === "countdown") {
			return `Countdown`;
		}
		return `Cycle ${timerState.cycleCount + 1} / ${settings.totalCycles}`;
	};

	return (
		<View className="bg-white rounded-[40px] p-8 items-center shadow-sm border border-gray-50">
			<Text className="text-[#0058be] font-bold tracking-widest uppercase text-[10px] mb-6">
				{settings.mode === "pomodoro"
					? "Deep Work Session"
					: "Countdown Timer"}
			</Text>

			{/* Timer Circle */}
			<TimerCircle
				timeLeft={timerState.timeLeft}
				totalTime={timerState.totalTime}
				mode={timerState.mode}
			/>

			{/* Cycle Counter */}
			<View className="bg-blue-50 px-3 py-1 rounded-full mb-6">
				<Text className="text-blue-600 text-xs font-semibold">
					{getCurrentCycleDisplay()}
				</Text>
			</View>

			{/* Controls */}
			<View className="flex-row items-center justify-center space-x-8 mb-8">
				<TouchableOpacity
					onPress={resetTimer}
					className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
				>
					<RotateCcw size={22} color="#424754" />
				</TouchableOpacity>

				<TouchableOpacity
					onPress={toggleTimer}
					style={styles.primaryGradient}
					className="w-20 h-20 rounded-full items-center justify-center shadow-lg"
				>
					{timerState.isRunning ? (
						<Pause size={32} color="white" fill="white" />
					) : (
						<Play size={32} color="white" fill="white" />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					onPress={skipToNextPhase}
					className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
				>
					<SkipForward size={22} color="#424754" />
				</TouchableOpacity>
			</View>

			{/* Settings Button */}
			<TouchableOpacity
				onPress={onSettingsPress}
				className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
			>
				<Settings size={16} color="#424754" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	primaryGradient: {
		backgroundColor: "#0058be",
	},
});

export type { TimerSettings };
