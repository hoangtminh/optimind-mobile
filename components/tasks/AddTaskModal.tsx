import { useTask } from "@/contexts/TaskContext";
import { AlertCircle, Calendar, ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface AddTaskModalProps {
	visible: boolean;
	onClose: () => void;
	projectId?: string;
	onTaskAdded?: () => void;
}

export default function AddTaskModal({
	visible,
	onClose,
	projectId,
	onTaskAdded,
}: AddTaskModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
	const [status, setStatus] = useState<
		"todo" | "in_progress" | "review" | "complete"
	>("todo");
	const [dueDate, setDueDate] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPriorityMenu, setShowPriorityMenu] = useState(false);
	const [showStatusMenu, setShowStatusMenu] = useState(false);

	const { createTask } = useTask();

	const handleAddTask = async () => {
		// Validation
		if (!title.trim()) {
			setError("Task title is required");
			return;
		}

		if (!projectId) {
			setError("Project ID is required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await createTask({
				title: title.trim(),
				note: description.trim(),
				priority,
				status,
				due_date: dueDate || undefined,
				projectId,
				tag: [],
				repeated: "none",
			});

			// Reset form
			setTitle("");
			setDescription("");
			setPriority("low");
			setStatus("todo");
			setDueDate("");

			// Call callback if provided
			if (onTaskAdded) {
				onTaskAdded();
			}

			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setTitle("");
		setDescription("");
		setPriority("low");
		setStatus("todo");
		setDueDate("");
		setError("");
		setShowPriorityMenu(false);
		setShowStatusMenu(false);
		onClose();
	};

	const priorityOptions = [
		{ label: "Low", value: "low" as const },
		{ label: "Medium", value: "medium" as const },
		{ label: "High", value: "high" as const },
	];

	const statusOptions = [
		{ label: "To Do", value: "todo" as const },
		{ label: "In Progress", value: "in_progress" as const },
		{ label: "Review", value: "review" as const },
		{ label: "Complete", value: "complete" as const },
	];

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={handleClose}
		>
			<View className="flex-1 bg-black/70">
				<View className="flex-1 bg-black/80 mt-12 rounded-t-2xl overflow-hidden">
					{/* Header */}
					<View className="bg-slate-900 p-4 border-b border-white/20 flex-row justify-between items-center">
						<Text className="text-white text-xl font-bold">
							Create Task
						</Text>
						<TouchableOpacity onPress={handleClose} className="p-2">
							<Text className="text-white text-lg">✕</Text>
						</TouchableOpacity>
					</View>

					<ScrollView
						className="flex-1 p-4"
						showsVerticalScrollIndicator={false}
					>
						{/* Error Message */}
						{error ? (
							<View className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 flex-row items-start">
								<AlertCircle
									size={20}
									color="#ff6b6b"
									style={{ marginRight: 8 }}
								/>
								<Text className="text-red-200 flex-1">
									{error}
								</Text>
							</View>
						) : null}

						{/* Title Input */}
						<View className="mb-4">
							<Text className="text-white/80 text-sm font-medium mb-2">
								Task Title *
							</Text>
							<TextInput
								className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-base"
								placeholder="Enter task title"
								placeholderTextColor="#888888"
								value={title}
								onChangeText={setTitle}
								editable={!loading}
							/>
						</View>

						{/* Description Input */}
						<View className="mb-4">
							<Text className="text-white/80 text-sm font-medium mb-2">
								Description
							</Text>
							<TextInput
								className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-base"
								placeholder="Add task description or notes"
								placeholderTextColor="#888888"
								value={description}
								onChangeText={setDescription}
								multiline={true}
								numberOfLines={4}
								textAlignVertical="top"
								editable={!loading}
							/>
						</View>

						{/* Priority And Status Row */}
						<View className="flex-row gap-4 mb-4">
							{/* Priority Dropdown */}
							<View className="flex-1">
								<Text className="text-white/80 text-sm font-medium mb-2">
									Priority
								</Text>
								<TouchableOpacity
									className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 flex-row justify-between items-center"
									onPress={() =>
										setShowPriorityMenu(!showPriorityMenu)
									}
									disabled={loading}
								>
									<Text className="text-white capitalize">
										{priority.charAt(0).toUpperCase() +
											priority.slice(1)}
									</Text>
									<ChevronDown size={20} color="#ffffff" />
								</TouchableOpacity>

								{showPriorityMenu && (
									<View className="bg-slate-800 border border-white/30 rounded-lg mt-2 overflow-hidden">
										{priorityOptions.map((option) => (
											<TouchableOpacity
												key={option.value}
												className={`px-4 py-3 border-b border-white/10 ${
													priority === option.value
														? "bg-blue-600/30"
														: ""
												}`}
												onPress={() => {
													setPriority(option.value);
													setShowPriorityMenu(false);
												}}
											>
												<Text className="text-white">
													{option.label}
												</Text>
											</TouchableOpacity>
										))}
									</View>
								)}
							</View>

							{/* Status Dropdown */}
							<View className="flex-1">
								<Text className="text-white/80 text-sm font-medium mb-2">
									Status
								</Text>
								<TouchableOpacity
									className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 flex-row justify-between items-center"
									onPress={() =>
										setShowStatusMenu(!showStatusMenu)
									}
									disabled={loading}
								>
									<Text
										className="text-white text-xs"
										numberOfLines={1}
									>
										{
											statusOptions.find(
												(o) => o.value === status,
											)?.label
										}
									</Text>
									<ChevronDown size={20} color="#ffffff" />
								</TouchableOpacity>

								{showStatusMenu && (
									<View className="bg-slate-800 border border-white/30 rounded-lg mt-2 overflow-hidden">
										{statusOptions.map((option) => (
											<TouchableOpacity
												key={option.value}
												className={`px-4 py-3 border-b border-white/10 ${
													status === option.value
														? "bg-blue-600/30"
														: ""
												}`}
												onPress={() => {
													setStatus(option.value);
													setShowStatusMenu(false);
												}}
											>
												<Text className="text-white text-sm">
													{option.label}
												</Text>
											</TouchableOpacity>
										))}
									</View>
								)}
							</View>
						</View>

						{/* Due Date Input */}
						<View className="mb-6">
							<Text className="text-white/80 text-sm font-medium mb-2">
								Due Date
							</Text>
							<View className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 flex-row items-center">
								<Calendar
									size={20}
									color="#888888"
									style={{ marginRight: 8 }}
								/>
								<TextInput
									className="flex-1 text-white text-base"
									placeholder="YYYY-MM-DD"
									placeholderTextColor="#888888"
									value={dueDate}
									onChangeText={setDueDate}
									editable={!loading}
								/>
							</View>
						</View>

						{/* Action Buttons */}
						<View className="flex-row gap-3 pb-6">
							<TouchableOpacity
								className={`flex-1 rounded-lg py-3 flex-row justify-center items-center ${
									loading ? "bg-blue-600/50" : "bg-blue-600"
								}`}
								onPress={handleAddTask}
								disabled={loading}
							>
								<Text className="text-white font-semibold text-base">
									{loading ? "Creating..." : "Create Task"}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-1 bg-white/10 border border-white/30 rounded-lg py-3 flex-row justify-center items-center"
								onPress={handleClose}
								disabled={loading}
							>
								<Text className="text-white font-semibold text-base">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}
