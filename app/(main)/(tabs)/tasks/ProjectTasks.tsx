import AddTaskModal from "@/components/tasks/AddTaskModal";
import { useProject } from "@/contexts/ProjectContext";
import { useTask } from "@/contexts/TaskContext";
import { useColorGenerator, useTimeFormatter } from "@/hooks/useUtils";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	ArrowLeft,
	CheckCircle,
	Circle,
	Clock,
	Edit,
	Plus,
	Target,
	Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TaskItemProps {
	task: any;
	onPress: () => void;
	onToggle: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
	task,
	onPress,
	onToggle,
	onEdit,
	onDelete,
}) => {
	const { formatRelativeTime } = useTimeFormatter();
	const { getPriorityColor } = useColorGenerator();

	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.taskItem}
			activeOpacity={0.7}
		>
			<View style={styles.taskLeft}>
				<TouchableOpacity onPress={onToggle} style={styles.checkbox}>
					{task.completed ? (
						<CheckCircle size={20} color="#10b981" />
					) : (
						<Circle size={20} color="#cbd5e1" />
					)}
				</TouchableOpacity>

				<View style={styles.taskContent}>
					<Text
						style={[
							styles.taskTitle,
							task.completed && styles.taskCompleted,
						]}
					>
						{task.title}
					</Text>
					{task.description && (
						<Text
							style={[
								styles.taskDescription,
								task.completed &&
									styles.taskDescriptionCompleted,
							]}
						>
							{task.description}
						</Text>
					)}
					<View style={styles.taskMeta}>
						<View
							style={[
								styles.priorityBadge,
								{
									backgroundColor: getPriorityColor(
										task.priority,
									),
								},
							]}
						>
							<Text style={styles.priorityText}>
								{task.priority.toUpperCase()}
							</Text>
						</View>
						{task.dueDate && (
							<Text style={styles.dueDate}>
								Due:{" "}
								{new Date(task.dueDate).toLocaleDateString()}
							</Text>
						)}
						<Text style={styles.createdDate}>
							{formatRelativeTime(task.createdAt)}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.taskActions}>
				<TouchableOpacity onPress={onEdit} style={styles.actionButton}>
					<Edit size={16} color="#64748b" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onDelete}
					style={styles.actionButton}
				>
					<Trash2 size={16} color="#ef4444" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

interface TaskFormProps {
	task?: any;
	projectId: string;
	onSave: (task: any) => void;
	onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
	task,
	projectId,
	onSave,
	onCancel,
}) => {
	const [title, setTitle] = useState(task?.title || "");
	const [description, setDescription] = useState(task?.description || "");
	const [priority, setPriority] = useState(task?.priority || "medium");
	const [dueDate, setDueDate] = useState(task?.dueDate || "");

	const handleSave = () => {
		if (!title.trim()) return;

		const taskData = {
			...task,
			title: title.trim(),
			description: description.trim(),
			priority,
			dueDate: dueDate || undefined,
			projectId,
			completed: task?.completed || false,
			createdAt: task?.createdAt || new Date().toISOString(),
		};

		onSave(taskData);
	};

	return (
		<View style={styles.formContainer}>
			<Text style={styles.formTitle}>
				{task ? "Edit Task" : "New Task"}
			</Text>

			<TextInput
				style={styles.input}
				placeholder="Task title"
				value={title}
				onChangeText={setTitle}
				maxLength={100}
			/>

			<TextInput
				style={[styles.input, styles.textArea]}
				placeholder="Task description (optional)"
				value={description}
				onChangeText={setDescription}
				multiline
				numberOfLines={3}
				maxLength={500}
			/>

			<Text style={styles.label}>Priority</Text>
			<View style={styles.priorityButtons}>
				{["low", "medium", "high"].map((p) => (
					<TouchableOpacity
						key={p}
						onPress={() => setPriority(p)}
						style={[
							styles.priorityButton,
							priority === p && styles.priorityButtonActive,
						]}
					>
						<Text
							style={[
								styles.priorityButtonText,
								priority === p &&
									styles.priorityButtonTextActive,
							]}
						>
							{p.charAt(0).toUpperCase() + p.slice(1)}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<Text style={styles.label}>Due Date (optional)</Text>
			<TextInput
				style={styles.input}
				placeholder="YYYY-MM-DD"
				value={dueDate}
				onChangeText={setDueDate}
			/>

			<View style={styles.formActions}>
				<TouchableOpacity
					onPress={onCancel}
					style={styles.cancelButton}
				>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleSave}
					style={styles.saveButton}
				>
					<Text style={styles.saveButtonText}>
						{task ? "Update" : "Create"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

interface ProjectTasksProps {
	projectId?: string;
}

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
	const navigation = useNavigation();
	const route = useRoute<{
		key: string;
		name: string;
		params: { projectId: string };
	}>();
	const routeProjectId = route.params?.projectId as string;
	const actualProjectId = projectId || routeProjectId;

	const {
		tasks,

		fetchTasks,
		createTask,
		updateTask,
		deleteTask,
	} = useTask();
	const { projects, getProject } = useProject();
	const [showForm, setShowForm] = useState(false);
	const [editingTask, setEditingTask] = useState<any>(null);
	const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);

	const project = actualProjectId ? getProject(actualProjectId) : undefined;
	const projectTasks = tasks.filter(
		(task) => task.projectId === actualProjectId,
	);

	if (!project) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Project not found</Text>
			</SafeAreaView>
		);
	}

	const handleTaskPress = (task: any) => {
		// Navigate to task details
		navigation.navigate(["TaskDetails", { taskId: task.id }] as never);
	};

	const handleTaskToggle = (task: any) => {
		updateTask(task.id, { completed: !task.completed });
	};

	const handleTaskEdit = (task: any) => {
		setEditingTask(task);
		setShowForm(true);
	};

	const handleTaskDelete = (task: any) => {
		Alert.alert(
			"Delete Task",
			`Are you sure you want to delete "${task.title}"?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => deleteTask(task.id),
				},
			],
		);
	};

	const handleSaveTask = (taskData: any) => {
		if (editingTask) {
			updateTask(editingTask.id, taskData);
		} else {
			createTask(taskData);
		}
		setShowForm(false);
		setEditingTask(null);
	};

	const completedTasks = projectTasks.filter((t) => t.completed);
	const pendingTasks = projectTasks.filter((t) => !t.completed);

	return (
		<SafeAreaView style={styles.container}>
			{" "}
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.backButton}
				>
					<ArrowLeft size={24} color="#0058be" />
				</TouchableOpacity>
				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>{project.name}</Text>
					<Text style={styles.headerSubtitle}>Tasks Management</Text>
				</View>
				<TouchableOpacity
					onPress={() => setIsAddTaskVisible(true)}
					style={styles.addButton}
				>
					<Plus size={24} color="#0058be" />
				</TouchableOpacity>
			</View>
			{/* Stats */}
			<View style={styles.statsContainer}>
				<View style={styles.statCard}>
					<CheckCircle size={20} color="#10b981" />
					<Text style={styles.statNumber}>
						{completedTasks.length}
					</Text>
					<Text style={styles.taskStatLabel}>Completed</Text>
				</View>
				<View style={styles.statCard}>
					<Clock size={20} color="#f59e0b" />
					<Text style={styles.statNumber}>{pendingTasks.length}</Text>
					<Text style={styles.taskStatLabel}>Pending</Text>
				</View>
				<View style={styles.statCard}>
					<Target size={20} color="#0058be" />
					<Text style={styles.statNumber}>{tasks.length}</Text>
					<Text style={styles.taskStatLabel}>Total</Text>
				</View>
			</View>
			{/* Task Form Modal */}
			{showForm && (
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<TaskForm
							task={editingTask}
							projectId={actualProjectId}
							onSave={handleSaveTask}
							onCancel={() => {
								setShowForm(false);
								setEditingTask(null);
							}}
						/>
					</View>
				</View>
			)}
			{/* Tasks List */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{pendingTasks.length > 0 && (
					<>
						<Text style={styles.sectionTitle}>Pending Tasks</Text>
						{pendingTasks.map((task) => (
							<TaskItem
								key={task.id}
								task={task}
								onPress={() => handleTaskPress(task)}
								onToggle={() => handleTaskToggle(task)}
								onEdit={() => handleTaskEdit(task)}
								onDelete={() => handleTaskDelete(task)}
							/>
						))}
					</>
				)}

				{completedTasks.length > 0 && (
					<>
						<Text style={styles.sectionTitle}>Completed Tasks</Text>
						{completedTasks.map((task) => (
							<TaskItem
								key={task.id}
								task={task}
								onPress={() => handleTaskPress(task)}
								onToggle={() => handleTaskToggle(task)}
								onEdit={() => handleTaskEdit(task)}
								onDelete={() => handleTaskDelete(task)}
							/>
						))}
					</>
				)}

				{tasks.length === 0 && (
					<View style={styles.emptyState}>
						<Target size={48} color="#cbd5e1" />
						<Text style={styles.emptyTitle}>No tasks yet</Text>
						<Text style={styles.emptySubtitle}>
							Create your first task to get started
						</Text>
					</View>
				)}
			</ScrollView>
			<AddTaskModal
				visible={isAddTaskVisible}
				onClose={() => setIsAddTaskVisible(false)}
				projectId={actualProjectId}
			/>
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
	headerContent: {
		flex: 1,
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1e293b",
	},
	headerSubtitle: {
		fontSize: 14,
		color: "#64748b",
		marginTop: 2,
	},
	addButton: {
		padding: 8,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: "#ffffff",
		marginHorizontal: 16,
		marginTop: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1e293b",
		marginTop: 8,
	},
	taskStatLabel: {
		fontSize: 12,
		color: "#64748b",
		marginTop: 4,
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1e293b",
		marginTop: 24,
		marginBottom: 16,
	},
	taskItem: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	taskLeft: {
		flexDirection: "row",
		flex: 1,
	},
	checkbox: {
		marginRight: 12,
		marginTop: 2,
	},
	taskContent: {
		flex: 1,
	},
	taskTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: "#1e293b",
		marginBottom: 4,
	},
	taskCompleted: {
		textDecorationLine: "line-through",
		color: "#94a3b8",
	},
	taskDescription: {
		fontSize: 14,
		color: "#64748b",
		lineHeight: 20,
		marginBottom: 8,
	},
	taskDescriptionCompleted: {
		color: "#cbd5e1",
	},
	taskMeta: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 8,
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	priorityText: {
		fontSize: 10,
		fontWeight: "600",
		color: "#ffffff",
	},
	dueDate: {
		fontSize: 12,
		color: "#ef4444",
		fontWeight: "500",
	},
	createdDate: {
		fontSize: 12,
		color: "#94a3b8",
	},
	taskActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	actionButton: {
		padding: 8,
		borderRadius: 6,
		backgroundColor: "#f8f9fb",
	},
	modalOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000,
	},
	modalContent: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 24,
		width: "90%",
		maxWidth: 400,
		maxHeight: "80%",
	},
	formContainer: {
		width: "100%",
	},
	formTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		marginBottom: 16,
		backgroundColor: "#ffffff",
	},
	textArea: {
		height: 80,
		textAlignVertical: "top",
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "#374151",
		marginBottom: 8,
	},
	priorityButtons: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 16,
	},
	priorityButton: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		alignItems: "center",
	},
	priorityButtonActive: {
		backgroundColor: "#0058be",
		borderColor: "#0058be",
	},
	priorityButtonText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#64748b",
	},
	priorityButtonTextActive: {
		color: "#ffffff",
	},
	formActions: {
		flexDirection: "row",
		gap: 12,
		marginTop: 20,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		alignItems: "center",
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#64748b",
	},
	saveButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		backgroundColor: "#0058be",
		alignItems: "center",
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#ffffff",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#64748b",
		marginTop: 16,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: "#94a3b8",
		textAlign: "center",
		lineHeight: 20,
	},
});
