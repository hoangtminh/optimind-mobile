import { FolderPlus, X, Edit3 } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import { Theme } from "@/constants/Theme";
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
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	height: 48,
	borderRadius: 6,
	fontSize: "$4",
	color: Theme.text,
	focusStyle: {
		borderColor: Theme.primary,
		backgroundColor: Theme.surface,
	},
});

const StyledTextArea = styled(TextArea, {
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	borderRadius: 6,
	fontSize: "$4",
	color: Theme.text,
	focusStyle: {
		borderColor: Theme.primary,
		backgroundColor: Theme.surface,
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
					backgroundColor="rgba(29, 27, 32, 0.4)"
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(4px)" } as any)
							: {}
					}
				>
					<YStack
						backgroundColor={Theme.surface}
						width="100%"
						borderTopLeftRadius={12}
						borderTopRightRadius={12}
						borderWidth={1}
						borderColor={Theme.border}
						padding="$5"
						paddingBottom="$8"
						gap="$4"
					>
						{/* Handle bar for visual cue */}
						<View
							width={32}
							height={4}
							backgroundColor={Theme.border}
							borderRadius={2}
							alignSelf="center"
							marginBottom="$1"
						/>

						<XStack
							justifyContent="space-between"
							alignItems="center"
						>
							<XStack gap="$3" alignItems="center">
								<View
									backgroundColor={Theme.primaryPastel}
									padding="$2.5"
									borderRadius={6}
								>
									{project ? <Edit3 size={18} color={Theme.primary} /> : <FolderPlus size={18} color={Theme.primary} />}
								</View>
								<YStack>
									<Text
										fontSize="$5"
										fontWeight="700"
										color={Theme.text}
									>
										{project ? "Edit Project" : "Create Project"}
									</Text>
									<Text fontSize="$2" color={Theme.textMuted}>
										{project ? "Update your workspace details" : "Set up your new academic module"}
									</Text>
								</YStack>
							</XStack>
							<Button
								circular
								size="$3"
								chromeless
								icon={<X size={18} color={Theme.textMuted} />}
								onPress={onClose}
								pressStyle={{ backgroundColor: Theme.background }}
							/>
						</XStack>

						<YStack gap="$3" marginTop="$2">
							<YStack gap="$1">
								<Text
									fontSize="$3"
									color={Theme.text}
									fontWeight="600"
									marginLeft="$1"
								>
									Project Title
								</Text>
								<StyledInput
									placeholder="e.g., Computer Science 101"
									placeholderTextColor={Theme.textMuted as any}
									value={name}
									onChangeText={setName}
								/>
							</YStack>

							<YStack gap="$1">
								<Text
									fontSize="$3"
									color={Theme.text}
									fontWeight="600"
									marginLeft="$1"
								>
									Description (Optional)
								</Text>
								<StyledTextArea
									placeholder="What is this project about?"
									placeholderTextColor={Theme.textMuted as any}
									numberOfLines={4}
									height={100}
									textAlignVertical="top"
									paddingTop="$3"
									value={description}
									onChangeText={setDescription}
								/>
							</YStack>
						</YStack>

						<XStack gap="$3" marginTop="$3">
							<Button
								flex={1}
								height={48}
								borderRadius={6}
								backgroundColor={Theme.background}
								onPress={onClose}
								pressStyle={{
									backgroundColor: Theme.border,
									scale: 0.98,
								}}
							>
								<Text
									color={Theme.textMuted}
									fontWeight="600"
									fontSize="$4"
								>
									Cancel
								</Text>
							</Button>

							<Button
								flex={2}
								height={48}
								borderRadius={6}
								backgroundColor={Theme.primary}
								onPress={handleSave}
								disabled={!name.trim()}
								opacity={!name.trim() ? 0.55 : 1}
								pressStyle={{
									backgroundColor: Theme.primary,
									opacity: 0.9,
									scale: 0.98,
								}}
							>
								<Text
									color={Theme.primaryText}
									fontWeight="700"
									fontSize="$4"
								>
									{project ? "Update Project" : "Create Project"}
								</Text>
							</Button>
						</XStack>
					</YStack>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
