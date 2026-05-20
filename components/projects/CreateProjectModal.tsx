import { LinearGradient } from "expo-linear-gradient";
import { FolderPlus, X, Edit3 } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import {
	Button,
	Input,
	Text,
	TextArea,
	View,
	XStack,
	YStack,
	styled,
} from "tamagui";

interface ProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate?: (data: { name: string; description: string }) => void;
	onUpdate?: (projectId: string, data: { name: string; description: string }) => void;
	project?: any;
}

const StyledInput = styled(Input, {
	backgroundColor: "#f8f2fa",
	borderWidth: 1.5,
	borderColor: "#f2ecf4",
	height: 52,
	borderRadius: 16,
	fontSize: "$4",
	focusStyle: {
		borderColor: "#6750A4",
		backgroundColor: "#ffffff",
	},
});

const StyledTextArea = styled(TextArea, {
	backgroundColor: "#f8f2fa",
	borderWidth: 1.5,
	borderColor: "#f2ecf4",
	borderRadius: 16,
	fontSize: "$4",
	focusStyle: {
		borderColor: "#6750A4",
		backgroundColor: "#ffffff",
	},
});

export default function ProjectModal({
	isOpen,
	onClose,
	onCreate,
	onUpdate,
	project,
}: ProjectModalProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (project) {
			setName(project.name || "");
			setDescription(project.description || "");
		} else {
			setName("");
			setDescription("");
		}
	}, [project, isOpen]);

	const handleSave = () => {
		if (name.trim()) {
			if (project && onUpdate) {
				onUpdate(project.id, { name: name.trim(), description: description.trim() });
			} else if (onCreate) {
				onCreate({ name: name.trim(), description: description.trim() });
			}
			onClose();
		}
	};

	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View
					flex={1}
					justifyContent="flex-end"
					backgroundColor="rgba(29, 27, 32, 0.6)"
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(12px)" } as any)
							: {}
					}
				>
					<YStack
						backgroundColor="white"
						width="100%"
						borderTopLeftRadius={32}
						borderTopRightRadius={32}
						padding="$6"
						paddingBottom="$10"
						shadowColor="#000"
						shadowRadius={30}
						shadowOpacity={0.2}
						gap="$5"
					>
						{/* Handle bar for visual cue */}
						<View
							width={40}
							height={4}
							backgroundColor="#e0e0e0"
							borderRadius={2}
							alignSelf="center"
							marginBottom="$2"
						/>

						<XStack
							justifyContent="space-between"
							alignItems="center"
						>
							<XStack gap="$3" alignItems="center">
								<View
									backgroundColor="#e9ddff"
									padding="$2"
									borderRadius={12}
								>
									{project ? <Edit3 size={24} color="#6750A4" /> : <FolderPlus size={24} color="#6750A4" />}
								</View>
								<YStack>
									<Text
										fontSize="$6"
										fontWeight="800"
										color="#1d1b20"
									>
										{project ? "Edit Project" : "Create Project"}
									</Text>
									<Text fontSize="$2" color="#7a7582">
										{project ? "Update your workspace details" : "Set up your new academic module"}
									</Text>
								</YStack>
							</XStack>
							<Button
								circular
								size="$3"
								chromeless
								icon={<X size={20} color="#494551" />}
								onPress={onClose}
								pressStyle={{ backgroundColor: "#f2ecf4" }}
							/>
						</XStack>

						<YStack gap="$4">
							<YStack gap="$2">
								<Text
									fontSize="$3"
									color="#494551"
									fontWeight="700"
									marginLeft="$1"
								>
									Project Title
								</Text>
								<StyledInput
									placeholder="e.g., Computer Science 101"
									value={name}
									onChangeText={setName}
								/>
							</YStack>

							<YStack gap="$2">
								<Text
									fontSize="$3"
									color="#494551"
									fontWeight="700"
									marginLeft="$1"
								>
									Description (Optional)
								</Text>
								<StyledTextArea
									placeholder="What is this project about?"
									numberOfLines={4}
									height={120}
									textAlignVertical="top"
									paddingTop="$3"
									value={description}
									onChangeText={setDescription}
								/>
							</YStack>
						</YStack>

						<XStack gap="$3" marginTop="$2">
							<Button
								flex={1}
								height={56}
								borderRadius={16}
								backgroundColor="#f2ecf4"
								onPress={onClose}
								pressStyle={{
									backgroundColor: "#e9ddff",
									scale: 0.98,
								}}
							>
								<Text
									color="#6750A4"
									fontWeight="700"
									fontSize="$4"
								>
									Cancel
								</Text>
							</Button>

							<YStack flex={2}>
								<Button
									unstyled
									onPress={handleSave}
									disabled={!name.trim()}
									opacity={!name.trim() ? 0.5 : 1}
								>
									<LinearGradient
										colors={["#6750A4", "#4F378A"]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										style={{
											height: 56,
											borderRadius: 16,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text
											color="white"
											fontWeight="800"
											fontSize="$4"
										>
											{project ? "Update Project" : "Create Project"}
										</Text>
									</LinearGradient>
								</Button>
							</YStack>
						</XStack>
					</YStack>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
