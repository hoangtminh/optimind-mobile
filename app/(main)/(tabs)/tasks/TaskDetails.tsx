import { useTask } from "@/contexts/TaskContext";
import { useTimeFormatter } from "@/hooks/useUtils";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	Circle,
	Clock,
	Edit,
	Flag,
	Trash2,
} from "lucide-react-native";
import React from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TaskDetailsProps {
	taskId: string;
}

export default function TaskDetails({ taskId }: TaskDetailsProps) {
	const navigation = useNavigation();
	const route = useRoute<{
		key: string;
		name: string;
		params: { taskId: string };
	}>();
	const routeTaskId = route.params?.taskId;
	const actualTaskId = taskId || routeTaskId;

	const { tasks, updateTask, deleteTask } = useTask();
	const { formatRelativeTime, formatDate } = useTimeFormatter();

	const task = tasks.find((t) => t.id === actualTaskId);

	if (!task) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<ArrowLeft size={24} color="#0058be" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Task Not Found</Text>
				</View>
				<View style={styles.centerContent}>
					<Text style={styles.errorText}>Task not found</Text>
				</View>
			</SafeAreaView>
		);
	}

	const handleToggleComplete = () => {
		updateTask(task.id, { completed: !task.completed });
	};

	const handleEdit = () => {
		// Navigate back to project tasks with edit mode
		navigation.goBack();
		// Could pass edit parameters here
	};

	const handleDelete = () => {
		Alert.alert(
			"Delete Task",
			`Are you sure you want to delete "${task.title}"?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						deleteTask(task.id);
						navigation.goBack();
					},
				},
			],
		);
	};

	const getPriorityInfo = (priority: string) => {
		switch (priority) {
			case "high":
				return { label: "High Priority", color: "#ef4444" };
			case "medium":
				return { label: "Medium Priority", color: "#f59e0b" };
			case "low":
				return { label: "Low Priority", color: "#10b981" };
			default:
				return { label: "Medium Priority", color: "#f59e0b" };
		}
	};

	const priorityInfo = getPriorityInfo(task.priority);

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<ArrowLeft size={24} color="#0058be" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Task Details</Text>
				<View style={styles.headerActions}>
					<TouchableOpacity
						onPress={handleEdit}
						style={styles.headerButton}
					>
						<Edit size={20} color="#0058be" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleDelete}
						style={styles.headerButton}
					>
						<Trash2 size={20} color="#ef4444" />
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Task Status Card */}
				<View style={styles.statusCard}>
					<View style={styles.statusHeader}>
						<TouchableOpacity
							onPress={handleToggleComplete}
							style={styles.statusCheckbox}
						>
							{task.completed ? (
								<CheckCircle size={24} color="#10b981" />
							) : (
								<Circle size={24} color="#cbd5e1" />
							)}
						</TouchableOpacity>
						<View style={styles.statusText}>
							<Text
								style={[
									styles.statusLabel,
									task.completed &&
										styles.statusLabelCompleted,
								]}
							>
								{task.completed ? "Completed" : "In Progress"}
							</Text>
							<Text style={styles.statusSubtext}>
								Tap to{" "}
								{task.completed
									? "mark as incomplete"
									: "mark as complete"}
							</Text>
						</View>
					</View>
				</View>

				{/* Task Title */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Title</Text>
					<Text
						style={[
							styles.taskTitle,
							task.completed && styles.taskTitleCompleted,
						]}
					>
						{task.title}
					</Text>
				</View>

				{/* Task Description */}
				{task.description && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Description</Text>
						<Text
							style={[
								styles.taskDescription,
								task.completed &&
									styles.taskDescriptionCompleted,
							]}
						>
							{task.description}
						</Text>
					</View>
				)}

				{/* Task Metadata */}
				<View style={styles.metadataContainer}>
					{/* Priority */}
					<View style={styles.metadataItem}>
						<Flag size={20} color={priorityInfo.color} />
						<View style={styles.metadataContent}>
							<Text style={styles.metadataLabel}>Priority</Text>
							<Text
								style={[
									styles.metadataValue,
									{ color: priorityInfo.color },
								]}
							>
								{priorityInfo.label}
							</Text>
						</View>
					</View>

					{/* Due Date */}
					{task.dueDate && (
						<View style={styles.metadataItem}>
							<Calendar size={20} color="#ef4444" />
							<View style={styles.metadataContent}>
								<Text style={styles.metadataLabel}>
									Due Date
								</Text>
								<Text style={styles.metadataValue}>
									{formatDate(task.dueDate)}
								</Text>
							</View>
						</View>
					)}

					{/* Created Date */}
					<View style={styles.metadataItem}>
						<Clock size={20} color="#64748b" />
						<View style={styles.metadataContent}>
							<Text style={styles.metadataLabel}>Created</Text>
							<Text style={styles.metadataValue}>
								{formatRelativeTime(task.createdAt)}
							</Text>
						</View>
					</View>
				</View>

				{/* Task Progress */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Progress</Text>
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View
								style={[
									styles.progressFill,
									{
										width: task.completed ? "100%" : "0%",
										backgroundColor: task.completed
											? "#10b981"
											: "#e2e8f0",
									},
								]}
							/>
						</View>
						<Text style={styles.progressText}>
							{task.completed ? "100%" : "0%"} Complete
						</Text>
					</View>
				</View>

				{/* Task Actions */}
				<View style={styles.actionsContainer}>
					<TouchableOpacity
						onPress={handleToggleComplete}
						style={[
							styles.actionButton,
							task.completed
								? styles.actionButtonSecondary
								: styles.actionButtonPrimary,
						]}
					>
						{task.completed ? (
							<Circle size={20} color="#64748b" />
						) : (
							<CheckCircle size={20} color="#ffffff" />
						)}
						<Text
							style={[
								// styles.actionButtonText,
								task.completed
									? styles.actionButtonTextSecondary
									: styles.actionButtonTextPrimary,
							]}
						>
							{task.completed
								? "Mark Incomplete"
								: "Mark Complete"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleEdit}
						style={[
							styles.actionButton,
							styles.actionButtonSecondary,
						]}
					>
						<Edit size={20} color="#0058be" />
						<Text style={styles.actionButtonTextSecondary}>
							Edit Task
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fb",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	backButton: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1e293b",
		flex: 1,
		textAlign: "center",
	},
	headerActions: {
		flexDirection: "row",
		gap: 8,
	},
	headerButton: {
		padding: 8,
	},
	centerContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
		color: "#64748b",
	},
	content: {
		flex: 1,
		padding: 16,
	},
	statusCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	statusHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusCheckbox: {
		marginRight: 12,
	},
	statusText: {
		flex: 1,
	},
	statusLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 4,
	},
	statusLabelCompleted: {
		color: "#10b981",
	},
	statusSubtext: {
		fontSize: 14,
		color: "#64748b",
	},
	section: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 12,
	},
	taskTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1e293b",
		lineHeight: 28,
	},
	taskTitleCompleted: {
		textDecorationLine: "line-through",
		color: "#94a3b8",
	},
	taskDescription: {
		fontSize: 16,
		color: "#4b5563",
		lineHeight: 24,
	},
	taskDescriptionCompleted: {
		color: "#9ca3af",
	},
	metadataContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	metadataItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f3f4f6",
	},
	metadataItemLast: {
		borderBottomWidth: 0,
	},
	metadataContent: {
		flex: 1,
		marginLeft: 12,
	},
	metadataLabel: {
		fontSize: 14,
		color: "#6b7280",
		marginBottom: 2,
	},
	metadataValue: {
		fontSize: 16,
		fontWeight: "500",
		color: "#1e293b",
	},
	progressContainer: {
		alignItems: "center",
	},
	progressBar: {
		width: "100%",
		height: 8,
		backgroundColor: "#e2e8f0",
		borderRadius: 4,
		marginBottom: 8,
	},
	progressFill: {
		height: "100%",
		borderRadius: 4,
	},
	progressText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#64748b",
	},
	actionsContainer: {
		gap: 12,
		marginBottom: 20,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		gap: 8,
	},
	actionButtonPrimary: {
		backgroundColor: "#0058be",
	},
	actionButtonSecondary: {
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	actionButtonTextPrimary: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ffffff",
	},
	actionButtonTextSecondary: {
		fontSize: 16,
		fontWeight: "600",
		color: "#0058be",
	},
});
