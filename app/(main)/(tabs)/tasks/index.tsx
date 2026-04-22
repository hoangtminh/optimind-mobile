import { useProject } from "@/contexts/ProjectContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CheckCircle2, Folder, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Text, View, XStack, YStack, styled } from "tamagui";

const ProjectCard = styled(YStack, {
	padding: "$5",
	borderRadius: "$5",
	backgroundColor: "$surface_container_lowest",
	borderWidth: 1,
	borderColor: "$surface_variant",
	shadowColor: "$on_surface",
	shadowRadius: 12,
	shadowOpacity: 0.04,
	shadowOffset: { width: 0, height: 4 },
	pressStyle: { scale: 0.98, backgroundColor: "$surface_container_low" },
});

const CreateNewCard = styled(YStack, {
	padding: "$6",
	borderRadius: "$5",
	borderWidth: 2,
	borderStyle: "dashed",
	borderColor: "$outline_variant",
	backgroundColor: "transparent",
	alignItems: "center",
	justifyContent: "center",
	pressStyle: {
		backgroundColor: "$surface_container_lowest",
		borderColor: "$primary",
	},
});

export const MOCK_PROJECTS = [
	{
		id: "p1",
		name: "Quantum Physics Research",
		description:
			"Exploring the fundamentals of quantum entanglement and its applications in modern computing.",
		taskCount: 12,
		createdAt: "2023-10-01T12:00:00Z",
		updatedAt: "2023-10-15T12:00:00Z",
	},
	{
		id: "p2",
		name: "Architecture Thesis",
		description:
			"Designing sustainable urban housing solutions for the 21st century.",
		taskCount: 5,
		createdAt: "2023-09-15T09:30:00Z",
		updatedAt: "2023-10-10T14:20:00Z",
	},
	{
		id: "p3",
		name: "Data Ethics Presentation",
		description:
			"Preparing slides and research on the ethical implications of AI and big data.",
		taskCount: 8,
		createdAt: "2023-10-20T10:00:00Z",
		updatedAt: "2023-10-21T11:00:00Z",
	},
];

// --- Create Project Modal Component ---
function CreateProjectModal({
	isOpen,
	onClose,
	onCreate,
}: {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (data: { name: string; description: string }) => void;
}) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const handleCreate = () => {
		if (name.trim()) {
			onCreate({ name: name.trim(), description: description.trim() });
			setName("");
			setDescription("");
			onClose();
		}
	};

	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor="rgba(25, 28, 30, 0.4)"
				style={
					Platform.OS === "web"
						? ({ backdropFilter: "blur(8px)" } as any)
						: {}
				}
				padding="$4"
			>
				<View
					backgroundColor="white"
					width="100%"
					maxWidth={450}
					borderRadius={24}
					padding="$6"
					shadowColor="#000"
					shadowRadius={30}
					shadowOpacity={0.15}
					shadowOffset={{ width: 0, height: 10 }}
				>
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom="$6"
					>
						<Text
							fontSize="$6"
							fontWeight="700"
							color="$on_surface"
						>
							Start New Project
						</Text>
						<Button
							circular
							chromeless
							icon={<X size={24} color="$on_surface_variant" />}
							onPress={onClose}
						/>
					</XStack>

					<YStack gap="$4" marginBottom="$6">
						<YStack gap="$2">
							<Text
								fontSize="$3"
								color="$on_surface_variant"
								fontWeight="600"
							>
								Project Name
							</Text>
							<Input
								backgroundColor="$surface_container_high"
								borderWidth={0}
								height={52}
								borderRadius={12}
								placeholder="e.g., Thesis Research"
								value={name}
								onChangeText={setName}
							/>
						</YStack>
						<YStack gap="$2">
							<Text
								fontSize="$3"
								color="$on_surface_variant"
								fontWeight="600"
							>
								Description
							</Text>
							<Input
								backgroundColor="$surface_container_high"
								borderWidth={0}
								borderRadius={12}
								placeholder="Brief overview of your project..."
								multiline
								numberOfLines={3}
								height={100}
								textAlignVertical="top"
								paddingTop="$3"
								value={description}
								onChangeText={setDescription}
							/>
						</YStack>
					</YStack>

					<XStack justifyContent="flex-end" gap="$3">
						<Button chromeless onPress={onClose}>
							Cancel
						</Button>
						<LinearGradient
							colors={["#0058be", "#2170e4"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{ borderRadius: 12 }}
						>
							<Button
								unstyled
								paddingHorizontal="$5"
								height={44}
								justifyContent="center"
								alignItems="center"
								pressStyle={{ scale: 0.98 }}
								disabled={!name.trim()}
								onPress={handleCreate}
								opacity={!name.trim() ? 0.5 : 1}
							>
								<Text color="white" fontWeight="600">
									Create
								</Text>
							</Button>
						</LinearGradient>
					</XStack>
				</View>
			</View>
		</Modal>
	);
}

export default function ProjectsListScreen() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { projects, createProject } = useProject();

	const handleCreateProject = (data: {
		name: string;
		description: string;
	}) => {
		console.log("Create project triggered:", data);
		createProject(data);
	};
	console.log(projects);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor="$background" position="relative">
				{/* Floating Header */}
				<XStack
					height={64}
					alignItems="center"
					paddingHorizontal="$4"
					backgroundColor="rgba(248, 249, 251, 0.8)"
					zIndex={10}
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(10px)" } as any)
							: {}
					}
				>
					<Text fontSize="$5" fontWeight="600" color="$on_surface">
						Project Workspace
					</Text>
				</XStack>

				<FlatList
					data={MOCK_PROJECTS}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
					ItemSeparatorComponent={() => <View height={16} />}
					ListHeaderComponent={
						<YStack paddingBottom="$6" paddingTop="$2">
							<Text
								fontSize={36}
								fontWeight="800"
								color="$on_surface"
								letterSpacing={-1}
								marginBottom="$2"
							>
								Active Research
							</Text>
							<Text
								fontSize="$4"
								color="$on_surface_variant"
								lineHeight={24}
							>
								Manage your academic pursuits with surgical
								precision. Each project is a sanctuary for
								thought.
							</Text>
						</YStack>
					}
					renderItem={({ item }) => (
						<ProjectCard
							onPress={() =>
								router.push(`/(main)/(tabs)/tasks/${item.id}`)
							}
						>
							<XStack
								alignItems="center"
								gap="$3"
								marginBottom="$4"
							>
								<View
									width={40}
									height={40}
									borderRadius="$3"
									backgroundColor="$primary_fixed"
									alignItems="center"
									justifyContent="center"
								>
									<Folder color="#0058be" size={20} />
								</View>
								<Text
									fontSize={11}
									fontWeight="800"
									textTransform="uppercase"
									letterSpacing={1}
									color="$on_surface_variant"
								>
									Workspace
								</Text>
							</XStack>

							<Text
								fontWeight="800"
								fontSize="$6"
								color="$on_surface"
								marginBottom="$2"
							>
								{item.name}
							</Text>

							<Text
								fontSize="$3"
								color="$on_surface_variant"
								numberOfLines={2}
								marginBottom="$5"
							>
								{item.description}
							</Text>

							<XStack
								paddingTop="$4"
								borderTopWidth={1}
								borderTopColor="$surface_variant"
								justifyContent="space-between"
								alignItems="center"
							>
								<XStack alignItems="center" gap="$2">
									<CheckCircle2 size={16} color="#727785" />
									<Text
										fontSize={12}
										fontWeight="600"
										color="$on_surface_variant"
									>
										{item.taskCount} Tasks
									</Text>
								</XStack>
								{/* Mock Avatars Container */}
								<XStack>
									<View
										width={24}
										height={24}
										borderRadius="$full"
										backgroundColor="$surface_dim"
										borderWidth={2}
										borderColor="$surface_container_lowest"
										zIndex={2}
									/>
									<View
										width={24}
										height={24}
										borderRadius="$full"
										backgroundColor="$outline_variant"
										borderWidth={2}
										borderColor="$surface_container_lowest"
										marginLeft={-8}
										zIndex={1}
									/>
								</XStack>
							</XStack>
						</ProjectCard>
					)}
					ListFooterComponent={
						<CreateNewCard
							onPress={() => setIsModalOpen(true)}
							marginTop="$4"
						>
							<View
								width={48}
								height={48}
								borderRadius="$full"
								backgroundColor="$surface_container_high"
								alignItems="center"
								justifyContent="center"
								marginBottom="$3"
							>
								<Plus color="#727785" size={24} />
							</View>
							<Text fontWeight="700" color="$on_surface_variant">
								Start New Project
							</Text>
							<Text fontSize="$2" color="$outline" marginTop="$1">
								Begin a new academic journey
							</Text>
						</CreateNewCard>
					}
				/>

				{/* FAB */}
				<View position="absolute" bottom={24} right={24} zIndex={100}>
					<TouchableOpacity
						onPress={() => setIsModalOpen(true)}
						activeOpacity={0.8}
					>
						<LinearGradient
							colors={["#0058be", "#2170e4"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								width: 64,
								height: 64,
								borderRadius: 24,
								justifyContent: "center",
								alignItems: "center",
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 8 },
								shadowOpacity: 0.15,
								shadowRadius: 24,
								elevation: 8,
							}}
						>
							<Plus color="white" size={32} />
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</YStack>

			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreate={handleCreateProject}
			/>
		</SafeAreaView>
	);
}
