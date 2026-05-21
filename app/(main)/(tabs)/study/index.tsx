import { AppHeader } from "@/components/common/AppHeader";
import { FocusCamera } from "@/components/study/FocusCamera";
import type { TimerMode } from "@/components/study/PremiumPomodoro";
import { Task, TaskManager } from "@/components/study/TaskManager";
import {
	TimerSettings,
	TimerSettingsModal,
} from "@/components/study/TimerSettingsModal";
import { UnifiedStudyView } from "@/components/study/UnifiedStudyView";
import { activeSessionTracker } from "@/utils/activeSession";
import { Brain, Camera, ListTodo, Pause, Play, RotateCcw, Settings } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack, styled } from "tamagui";

import * as ScreenOrientation from "expo-screen-orientation";

const TabButton = styled(YStack, {
	paddingVertical: "$2",
	paddingHorizontal: "$4",
	borderRadius: 100,
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "row",
	gap: "$2",
	pressStyle: { scale: 0.95 },
	variants: {
		active: {
			true: {
				backgroundColor: "#e9ddff",
			},
			false: {
				backgroundColor: "transparent",
			},
		},
	} as const,
});

export default function StudyScreen() {
	const [activeTab, setActiveTab] = useState<"pomodoro" | "camera" | "tasks">(
		"pomodoro",
	);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [cameraActive, setCameraActive] = useState(false);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);

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
	const [timerTotalTime, setTimerTotalTime] = useState(timerSettings.focusDuration * 60);
	const [timerTimeLeft, setTimerTimeLeft] = useState(timerSettings.focusDuration * 60);
	const [currentCycle, setCurrentCycle] = useState(1);
	const [sessionKey, setSessionKey] = useState(Date.now());

	useEffect(() => {
		if (activeTab === "camera") {
			ScreenOrientation.unlockAsync();
		} else {
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
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
		else if (timerMode === "longBreak") duration = timerSettings.longBreakDuration;
		else duration = timerSettings.breakDuration;
		setTimerTotalTime(duration * 60);
		setTimerTimeLeft(duration * 60);
	}, [timerSettings.focusDuration, timerSettings.breakDuration, timerSettings.longBreakDuration, timerMode]);

	// Countdown tick — mode advancement is handled inside PremiumPomodoro
	useEffect(() => {
		if (!timerRunning || timerTimeLeft <= 0) return;

		const interval = setInterval(() => {
			setTimerTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timerRunning, timerTimeLeft]);

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

	const handleTimerReset = useCallback(() => {
		setTimerRunning(false);
		setTimerTimeLeft(timerTotalTime);
		setCurrentCycle(1);
		setTimerMode("focus");
		setSessionKey(Date.now());
	}, [timerTotalTime]);

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
			style={{ flex: 1, backgroundColor: "#fdf7ff" }}
			edges={["top"]}
		>
			<AppHeader
				title="Study Center"
				rightElement={
					<Button
						circular
						size="$3"
						chromeless
						icon={<Settings size={20} color="white" />}
						onPress={() => setSettingsModalOpen(true)}
					/>
				}
			/>

			<YStack flex={1}>
				{/* Tab Navigation */}
				<XStack
					paddingHorizontal="$4"
					paddingVertical="$3"
					gap="$2"
					backgroundColor="white"
					borderBottomWidth={1}
					borderBottomColor="#f2ecf4"
				>
					<TabButton
						active={activeTab === "pomodoro"}
						onPress={() => setActiveTab("pomodoro")}
					>
						<Brain
							size={16}
							color={
								activeTab === "pomodoro" ? "#6750A4" : "#7a7582"
							}
						/>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={
								activeTab === "pomodoro" ? "#6750A4" : "#7a7582"
							}
						>
							Timer
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "camera"}
						onPress={() => setActiveTab("camera")}
					>
						<Camera
							size={16}
							color={
								activeTab === "camera" ? "#6750A4" : "#7a7582"
							}
						/>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={
								activeTab === "camera" ? "#6750A4" : "#7a7582"
							}
						>
							Camera
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "tasks"}
						onPress={() => setActiveTab("tasks")}
					>
						<ListTodo
							size={16}
							color={
								activeTab === "tasks" ? "#6750A4" : "#7a7582"
							}
						/>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={
								activeTab === "tasks" ? "#6750A4" : "#7a7582"
							}
						>
							Tasks
						</Text>
					</TabButton>
				</XStack>

				{/* Mini Timer Banner when in Camera or Tasks tab */}
				{(activeTab === "camera" || activeTab === "tasks") && (
					<XStack
						backgroundColor="#F3EDF7"
						marginHorizontal="$4"
						marginTop="$3"
						paddingVertical="$2"
						paddingHorizontal="$4"
						borderRadius={16}
						alignItems="center"
						justifyContent="space-between"
						borderWidth={1}
						borderColor="#EADDFF"
					>
						<XStack alignItems="center" gap={10}>
							<Brain size={16} color="#6750A4" />
							<YStack>
								<Text fontSize="$1" fontWeight="700" color="#7A7582" textTransform="uppercase">
									{timerMode === "focus" ? "Focus Session" : "Break Time"}
								</Text>
								<Text fontSize="$4" fontWeight="900" color="#1D1B20">
									{formatTime(timerTimeLeft)}
								</Text>
							</YStack>
						</XStack>
						<XStack gap="$2" alignItems="center">
							<Button
								circular
								size={36}
								backgroundColor={timerRunning ? "#FFD8E4" : "#6750A4"}
								onPress={() => setTimerRunning(!timerRunning)}
								pressStyle={{ scale: 0.9 }}
								icon={timerRunning ? <Pause size={14} color="#8C1D18" /> : <Play size={14} color="white" />}
							/>
							<Button
								circular
								size={36}
								backgroundColor="white"
								borderWidth={1}
								borderColor="#6750A4"
								onPress={handleTimerReset}
								pressStyle={{ scale: 0.9 }}
								icon={<RotateCcw size={14} color="#6750A4" />}
							/>
						</XStack>
					</XStack>
				)}

				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
				>
					<YStack style={{ display: activeTab === "pomodoro" ? "flex" : "none" }}>
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
						onSettingsPress={() =>
							setSettingsModalOpen(true)
						}
					/>
					</YStack>

					<YStack style={{ display: activeTab === "camera" ? "flex" : "none" }}>
						<FocusCamera
							timerRunning={timerRunning}
							setTimerRunning={setTimerRunning}
							isActive={cameraActive}
							setIsActive={setCameraActive}
							sessionKey={sessionKey}
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
