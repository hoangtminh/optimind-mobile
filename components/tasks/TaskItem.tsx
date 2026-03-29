import { useColorGenerator, useTimeFormatter } from "@/hooks/useUtils";
import { CheckCircle, Circle, Edit, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskItemProps {
	task: any;
	onPress: () => void;
	onToggle: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function TaskItem({
	task,
	onPress,
	onToggle,
	onEdit,
	onDelete,
}: TaskItemProps) {
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
}

const styles = StyleSheet.create({
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
});
