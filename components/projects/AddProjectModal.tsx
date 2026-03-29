import React, { useState } from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
} from "react-native";
import { AlertCircle } from "lucide-react-native";
import { useProject } from "@/contexts/ProjectContext";

interface AddProjectModalProps {
	visible: boolean;
	onClose: () => void;
	onProjectAdded?: () => void;
}

export default function AddProjectModal({
	visible,
	onClose,
	onProjectAdded,
}: AddProjectModalProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { createProject } = useProject();

	const handleAddProject = async () => {
		// Validation
		if (!name.trim()) {
			setError("Project name is required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await createProject({
				name: name.trim(),
				description: description.trim(),
			});

			// Reset form
			setName("");
			setDescription("");

			// Call callback if provided
			if (onProjectAdded) {
				onProjectAdded();
			}

			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setName("");
		setDescription("");
		setError("");
		onClose();
	};

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
							Create Project
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

						{/* Project Name Input */}
						<View className="mb-4">
							<Text className="text-white/80 text-sm font-medium mb-2">
								Project Name *
							</Text>
							<TextInput
								className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-base"
								placeholder="Enter project name"
								placeholderTextColor="#888888"
								value={name}
								onChangeText={setName}
								editable={!loading}
							/>
						</View>

						{/* Description Input */}
						<View className="mb-6">
							<Text className="text-white/80 text-sm font-medium mb-2">
								Description
							</Text>
							<TextInput
								className="bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-base"
								placeholder="Enter project description"
								placeholderTextColor="#888888"
								value={description}
								onChangeText={setDescription}
								multiline={true}
								numberOfLines={4}
								textAlignVertical="top"
								editable={!loading}
							/>
						</View>

						{/* Action Buttons */}
						<View className="flex-row gap-3 pb-6">
							<TouchableOpacity
								className={`flex-1 rounded-lg py-3 flex-row justify-center items-center ${
									loading ? "bg-blue-600/50" : "bg-blue-600"
								}`}
								onPress={handleAddProject}
								disabled={loading}
							>
								<Text className="text-white font-semibold text-base">
									{loading ? "Creating..." : "Create Project"}
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
