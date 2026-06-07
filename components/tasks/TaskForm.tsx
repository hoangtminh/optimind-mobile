import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Theme } from "@/constants/Theme";

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
				placeholderTextColor={Theme.textMuted}
				value={title}
				onChangeText={setTitle}
				maxLength={100}
				selectionColor={Theme.primary}
			/>

			<TextInput
				style={[styles.input, styles.textArea]}
				placeholder="Task description (optional)"
				placeholderTextColor={Theme.textMuted}
				value={description}
				onChangeText={setDescription}
				multiline
				numberOfLines={3}
				maxLength={500}
				selectionColor={Theme.primary}
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
				placeholderTextColor={Theme.textMuted}
				value={dueDate}
				onChangeText={setDueDate}
				selectionColor={Theme.primary}
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
		fontSize: 18,
		fontWeight: "700",
		color: Theme.text,
		marginBottom: 16,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: Theme.border,
		borderRadius: 6,
		padding: 12,
		fontSize: 15,
		marginBottom: 14,
		backgroundColor: Theme.surface,
		color: Theme.text,
	},
	textArea: {
		height: 80,
		textAlignVertical: "top",
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: Theme.text,
		marginBottom: 6,
	},
	priorityButtons: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 14,
	},
	priorityButton: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: Theme.border,
		alignItems: "center",
		backgroundColor: Theme.background,
	},
	priorityButtonActive: {
		backgroundColor: Theme.primary,
		borderColor: Theme.primary,
	},
	priorityButtonText: {
		fontSize: 13,
		fontWeight: "600",
		color: Theme.textMuted,
	},
	priorityButtonTextActive: {
		color: Theme.primaryText,
	},
	formActions: {
		flexDirection: "row",
		gap: 12,
		marginTop: 16,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: Theme.border,
		backgroundColor: Theme.background,
		alignItems: "center",
	},
	cancelButtonText: {
		fontSize: 15,
		fontWeight: "600",
		color: Theme.textMuted,
	},
	saveButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 6,
		backgroundColor: Theme.primary,
		alignItems: "center",
	},
	saveButtonText: {
		fontSize: 15,
		fontWeight: "600",
		color: Theme.primaryText,
	},
});
