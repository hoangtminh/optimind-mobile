import { Clock, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export interface Task {
	id: string;
	title: string;
	note: string;
	priority: "high" | "medium" | "low";
	estimatedTime: number; // in minutes
}

interface TaskManagerProps {
	tasks: Task[];
	onAddTask: (task: Task) => void;
	onDeleteTask: (id: string) => void;
}

const TaskManagerComponent = ({
	tasks,
	onAddTask,
	onDeleteTask,
}: TaskManagerProps) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [title, setTitle] = useState("");
	const [note, setNote] = useState("");
	const [priority, setPriority] = useState<"high" | "medium" | "low">(
		"medium",
	);
	const [time, setTime] = useState("25");

	const handleAddTask = () => {
		if (title.trim()) {
			const newTask: Task = {
				id: Date.now().toString(),
				title,
				note,
				priority,
				estimatedTime: parseInt(time) || 25,
			};
			onAddTask(newTask);
			resetForm();
			setModalVisible(false);
		}
	};

	const resetForm = () => {
		setTitle("");
		setNote("");
		setPriority("medium");
		setTime("25");
	};

	const getPriorityColor = (p: string) => {
		switch (p) {
			case "high":
				return "bg-red-50";
			case "medium":
				return "bg-yellow-50";
			case "low":
				return "bg-green-50";
			default:
				return "bg-gray-50";
		}
	};

	const getPriorityTextColor = (p: string) => {
		switch (p) {
			case "high":
				return "text-red-600";
			case "medium":
				return "text-yellow-600";
			case "low":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<View className="space-y-4">
			<View className="flex-row justify-between items-center px-2">
				<Text className="text-lg font-bold text-slate-900">
					Active Tasks
				</Text>
				<TouchableOpacity
					onPress={() => setModalVisible(true)}
					className="flex-row items-center"
				>
					<Plus size={16} color="#0058be" />
					<Text className="text-blue-600 font-bold text-xs ml-1">
						New Task
					</Text>
				</TouchableOpacity>
			</View>

			{tasks.length === 0 ? (
				<View className="bg-white p-6 rounded-3xl border border-gray-100 items-center justify-center">
					<Text className="text-gray-400 text-center text-sm">
						No tasks yet. Add one to get started!
					</Text>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					{tasks.map((task) => (
						<View
							key={task.id}
							className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-row mb-3"
						>
							<View className="w-6 h-6 rounded-lg border-2 border-blue-200 mr-4 mt-1" />
							<View className="flex-1">
								<View className="flex-row justify-between items-start">
									<Text className="font-bold text-slate-900 text-sm flex-1 mr-2">
										{task.title}
									</Text>
									<TouchableOpacity
										onPress={() => onDeleteTask(task.id)}
										className="p-1"
									>
										<X size={16} color="#ef4444" />
									</TouchableOpacity>
								</View>
								{task.note && (
									<Text className="text-xs text-gray-500 mt-1">
										{task.note}
									</Text>
								)}
								<View className="flex-row mt-3 items-center">
									<View
										className={`px-2 py-1 rounded-md mr-2 ${getPriorityColor(task.priority)}`}
									>
										<Text
											className={`text-[9px] font-bold uppercase ${getPriorityTextColor(task.priority)}`}
										>
											{task.priority}
										</Text>
									</View>
									<View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-md">
										<Clock size={10} color="#0058be" />
										<Text className="text-[9px] font-bold text-blue-600 ml-1">
											{task.estimatedTime}m
										</Text>
									</View>
								</View>
							</View>
						</View>
					))}
				</ScrollView>
			)}

			{/* Add Task Modal */}
			<Modal
				animationType="fade"
				transparent
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<Pressable
					className="flex-1 bg-black/40 justify-center items-center"
					onPress={() => setModalVisible(false)}
				>
					<Pressable
						className="bg-white rounded-[28px] p-6 w-5/6 max-w-sm"
						onPress={(e) => e.stopPropagation()}
					>
						<View className="flex-row justify-between items-center mb-6">
							<Text className="text-xl font-bold text-slate-900">
								New Task
							</Text>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
							>
								<X size={24} color="#0f172a" />
							</TouchableOpacity>
						</View>

						<View className="mb-4">
							<Text className="text-xs font-bold text-gray-600 mb-2">
								Task Title *
							</Text>
							<TextInput
								className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
								placeholder="e.g., Review chapter 5"
								value={title}
								onChangeText={setTitle}
								placeholderTextColor="#9ca3af"
							/>
						</View>

						<View className="mb-4">
							<Text className="text-xs font-bold text-gray-600 mb-2">
								Notes
							</Text>
							<TextInput
								className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
								placeholder="Additional notes..."
								value={note}
								onChangeText={setNote}
								placeholderTextColor="#9ca3af"
								multiline
								numberOfLines={3}
							/>
						</View>

						<View className="flex-row gap-4 mb-4">
							<View className="flex-1">
								<Text className="text-xs font-bold text-gray-600 mb-2">
									Priority
								</Text>
								<View className="flex-row gap-2">
									{(["high", "medium", "low"] as const).map(
										(p) => (
											<TouchableOpacity
												key={p}
												onPress={() => setPriority(p)}
												className={`flex-1 py-2 rounded-lg items-center ${priority === p ? `${getPriorityColor(p)} border-2 border-blue-400` : "bg-gray-100"}`}
											>
												<Text
													className={`text-xs font-bold uppercase ${priority === p ? getPriorityTextColor(p) : "text-gray-500"}`}
												>
													{p}
												</Text>
											</TouchableOpacity>
										),
									)}
								</View>
							</View>
						</View>

						<View className="mb-6">
							<Text className="text-xs font-bold text-gray-600 mb-2">
								Estimated Time (minutes)
							</Text>
							<TextInput
								className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
								placeholder="25"
								value={time}
								onChangeText={setTime}
								keyboardType="number-pad"
								placeholderTextColor="#9ca3af"
							/>
						</View>

						<View className="flex-row gap-3">
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								className="flex-1 py-3 rounded-lg border border-gray-300 items-center"
							>
								<Text className="font-bold text-gray-700">
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleAddTask}
								className="flex-1 py-3 rounded-lg bg-blue-600 items-center"
							>
								<Text className="font-bold text-white">
									Add Task
								</Text>
							</TouchableOpacity>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</View>
	);
};

export const TaskManager = React.memo(TaskManagerComponent);
