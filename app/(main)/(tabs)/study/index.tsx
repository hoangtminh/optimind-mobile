import { AppHeader } from "@/components/common/AppHeader";
import ProductivityChart from "@/components/study/ProductivityChart";
import TaskManager, { Task } from "@/components/study/TaskManager";
import { PremiumPomodoro } from "@/components/study/PremiumPomodoro";
import { FocusCamera } from "@/components/study/FocusCamera";
import { TimerSettingsModal, TimerSettings } from "@/components/study/TimerSettingsModal";
import { Brain, Camera, LayoutDashboard, ListTodo, Settings } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Button, View, styled, AnimatePresence } from "tamagui";

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
	const [activeTab, setActiveTab] = useState<"pomodoro" | "camera" | "tasks">("pomodoro");
	const [tasks, setTasks] = useState<Task[]>([]);
	const [timerRunning, setTimerRunning] = useState(false);
	const [timerTimeElapsed, setTimerTimeElapsed] = useState(0);
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    
    const [timerSettings, setTimerSettings] = useState<TimerSettings>({
		mode: "pomodoro",
		focusDuration: 25,
		breakDuration: 5,
		longBreakDuration: 15,
		cyclesBeforeLongBreak: 4,
		totalCycles: 4,
	});

	const handleAddTask = (task: Task) => {
		setTasks((prev) => [...prev, task]);
	};

	const handleDeleteTask = (id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	};

	const handleTimerStateChange = (
		isRunning: boolean,
		timeElapsed: number,
	) => {
		setTimerRunning(isRunning);
		setTimerTimeElapsed(timeElapsed);
	};

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
						<Brain size={16} color={activeTab === "pomodoro" ? "#6750A4" : "#7a7582"} />
						<Text
							fontSize="$3"
							fontWeight="700"
							color={activeTab === "pomodoro" ? "#6750A4" : "#7a7582"}
						>
							Timer
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "camera"}
						onPress={() => setActiveTab("camera")}
					>
						<Camera size={16} color={activeTab === "camera" ? "#6750A4" : "#7a7582"} />
						<Text
							fontSize="$3"
							fontWeight="700"
							color={activeTab === "camera" ? "#6750A4" : "#7a7582"}
						>
							Camera
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "tasks"}
						onPress={() => setActiveTab("tasks")}
					>
						<ListTodo size={16} color={activeTab === "tasks" ? "#6750A4" : "#7a7582"} />
						<Text
							fontSize="$3"
							fontWeight="700"
							color={activeTab === "tasks" ? "#6750A4" : "#7a7582"}
						>
							Tasks
						</Text>
					</TabButton>
				</XStack>

				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
				>
					<AnimatePresence mode="wait">
						<YStack key={activeTab} animation="quick" enterStyle={{ opacity: 0, y: 10 }} exitStyle={{ opacity: 0, y: -10 }}>
							{activeTab === "pomodoro" && (
								<YStack gap="$6">
									<PremiumPomodoro
										focusDuration={timerSettings.focusDuration}
										breakDuration={timerSettings.breakDuration}
										onStateChange={handleTimerStateChange}
                                        onSettingsPress={() => setSettingsModalOpen(true)}
									/>
									<ProductivityChart
										isRunning={timerRunning}
										timeElapsed={timerTimeElapsed}
									/>
								</YStack>
							)}

							{activeTab === "camera" && (
								<FocusCamera />
							)}

							{activeTab === "tasks" && (
								<TaskManager
									tasks={tasks}
									onAddTask={handleAddTask}
									onDeleteTask={handleDeleteTask}
								/>
							)}
						</YStack>
					</AnimatePresence>
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
