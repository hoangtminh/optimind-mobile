import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface TaskFormProps {
	task?: any;
	projectId: string;
	onSave: (task: any) => void;
	onCancel: () => void;
}

export default function TaskForm({
	task,
	projectId,
	onSave,
	onCancel,
}: TaskFormProps) {
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
}

const styles = StyleSheet.create({
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
});
