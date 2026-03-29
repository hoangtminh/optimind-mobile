import ProductivityChart from "@/components/study/ProductivityChart";
import TaskManager, { Task } from "@/components/study/TaskManager";
import TimerComponent, {
	TimerSettings,
} from "@/components/study/TimerComponent";
import TimerSettingsModal from "@/components/study/TimerSettingsModal";
import { Eye, EyeOff, LayoutDashboard } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudyScreen() {
	const [contentVisible, setContentVisible] = useState(true);
	const [activeTab, setActiveTab] = useState<"chart" | "tasks">("chart");
	const [tasks, setTasks] = useState<Task[]>([]);
	const [settingsModalVisible, setSettingsModalVisible] = useState(false);

	const [timerSettings, setTimerSettings] = useState<TimerSettings>({
		mode: "pomodoro",
		focusDuration: 25,
		breakDuration: 5,
		longBreakDuration: 15,
		cyclesBeforeLongBreak: 4,
		totalCycles: 4,
	});

	const [timerRunning, setTimerRunning] = useState(false);
	const [timerTimeElapsed, setTimerTimeElapsed] = useState(0);

	const handleAddTask = (task: Task) => {
		setTasks((prev) => [...prev, task]);
	};

	const handleDeleteTask = (id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
	};

	const handleSettingsSave = (newSettings: TimerSettings) => {
		setTimerSettings(newSettings);
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
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			{/* Header */}
			<View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
				<View className="flex-row items-center">
					<TouchableOpacity className="p-2 mr-2">
						<LayoutDashboard size={24} color="#0058be" />
					</TouchableOpacity>
					<Text className="text-xl font-bold text-slate-900">
						Study Mode
					</Text>
				</View>
			</View>

			<ScrollView
				contentContainerStyle={{ paddingBottom: 120 }}
				className="flex-1 px-4 pt-6"
				showsVerticalScrollIndicator={false}
			>
				{/* Pomodoro Timer Section */}
				<TimerComponent
					settings={timerSettings}
					onSettingsPress={() => setSettingsModalVisible(true)}
					onTimerStateChange={handleTimerStateChange}
				/>

				{/* Visibility & Switcher Toggle */}
				<View className="flex-row items-center bg-gray-100 p-1.5 rounded-full border border-gray-200 mt-6">
					<TouchableOpacity
						onPress={() => setContentVisible(!contentVisible)}
						className="flex-row items-center px-4 py-2 rounded-full bg-white shadow-sm"
					>
						{contentVisible ? (
							<Eye size={14} color="#191c1e" />
						) : (
							<EyeOff size={14} color="#191c1e" />
						)}
						<Text className="ml-2 text-[10px] font-bold">
							{contentVisible ? "Hide" : "Show"}
						</Text>
					</TouchableOpacity>

					<View className="w-[1px] h-4 bg-gray-300 mx-2" />

					<View className="flex-row bg-gray-200 rounded-full p-1">
						<TouchableOpacity
							onPress={() => setActiveTab("chart")}
							className={`px-4 py-1.5 rounded-full ${activeTab === "chart" ? "bg-[#0058be]" : ""}`}
						>
							<Text
								className={`text-[9px] font-bold uppercase ${activeTab === "chart" ? "text-white" : "text-gray-500"}`}
							>
								Chart
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setActiveTab("tasks")}
							className={`px-4 py-1.5 rounded-full ${activeTab === "tasks" ? "bg-[#0058be]" : ""}`}
						>
							<Text
								className={`text-[9px] font-bold uppercase ${activeTab === "tasks" ? "text-white" : "text-gray-500"}`}
							>
								Tasks ({tasks.length})
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Dynamic Content Area */}
				{contentVisible && (
					<View className="mt-6 pb-6">
						{activeTab === "chart" ? (
							<ProductivityChart
								isRunning={timerRunning}
								timeElapsed={timerTimeElapsed}
							/>
						) : (
							<TaskManager
								tasks={tasks}
								onAddTask={handleAddTask}
								onDeleteTask={handleDeleteTask}
							/>
						)}
					</View>
				)}
			</ScrollView>

			{/* Timer Settings Modal */}
			<TimerSettingsModal
				visible={settingsModalVisible}
				settings={timerSettings}
				onSave={handleSettingsSave}
				onClose={() => setSettingsModalVisible(false)}
			/>
		</SafeAreaView>
	);
}
