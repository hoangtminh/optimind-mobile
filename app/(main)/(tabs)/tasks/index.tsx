import { AppHeader } from "@/components/common/AppHeader";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import ProjectModal from "@/components/projects/CreateProjectModal";
import { useProject } from "@/contexts/ProjectContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
	CheckCircle2,
	MessageSquare,
	Plus,
	Timer,
	Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack, styled } from "tamagui";

const ProjectCard = styled(YStack, {
	padding: "$5",
	borderRadius: 24,
	backgroundColor: "#ffffff",
	shadowColor: "#6750A4",
	shadowRadius: 20,
	shadowOpacity: 0.05,
	shadowOffset: { width: 0, height: 8 },
	pressStyle: { scale: 0.98, backgroundColor: "#f8f2fa" },
});

const CreateNewCard = styled(YStack, {
	padding: "$6",
	borderRadius: 24,
	borderWidth: 2,
	borderStyle: "dashed",
	borderColor: "#cbc4d2",
	backgroundColor: "transparent",
	alignItems: "center",
	justifyContent: "center",
	pressStyle: {
		backgroundColor: "#fdf7ff",
		borderColor: "#6750A4",
	},
});

export default function ProjectsListScreen() {
	const router = useRouter();
	const { projects, createProject, fetchProjects, deleteProject } =
		useProject();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

	useEffect(() => {
		fetchProjects();
	}, [router]);

	const handleCreateProject = (data: {
		name: string;
		description: string;
	}) => {
		createProject(data);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#fdf7ff" }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor="#fdf7ff" position="relative">
				<AppHeader
					title="StudyFlow"
					rightElement={
						<Button
							circular
							size="$3"
							chromeless
							icon={<MessageSquare size={20} color="white" />}
							onPress={() => router.push("/(main)/(tabs)/chat")}
							pressStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.1)",
							}}
						/>
					}
				/>

				<FlatList
					data={projects}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
					ItemSeparatorComponent={() => <View height={20} />}
					ListHeaderComponent={
						<YStack paddingBottom="$6" paddingTop="$2">
							<Text
								fontSize={32}
								fontWeight="800"
								color="#1d1b20"
								letterSpacing={-1}
								marginBottom="$1"
							>
								Your Projects
							</Text>
							<Text fontSize="$4" color="#494551" lineHeight={24}>
								Manage active modules and deadlines with ease.
							</Text>
						</YStack>
					}
					renderItem={({ item }) => (
						<ProjectCard>
							<YStack
								onPress={() =>
									router.push(
										`/(main)/(tabs)/tasks/${item.id}`,
									)
								}
							>
								<XStack
									alignItems="center"
									justifyContent="space-between"
									marginBottom="$4"
								>
									<View
										paddingHorizontal="$3"
										paddingVertical="$1"
										borderRadius={100}
										backgroundColor="#e9ddff"
									>
										<Text
											fontSize={11}
											fontWeight="700"
											color="#4f378a"
										>
											ACTIVE MODULE
										</Text>
									</View>
									<Timer size={18} color="#6750A4" />
								</XStack>

								<Text
									fontWeight="800"
									fontSize="$6"
									color="#1d1b20"
									marginBottom="$2"
								>
									{item.name}
								</Text>

								<Text
									fontSize="$3"
									color="#494551"
									numberOfLines={2}
									marginBottom="$5"
									lineHeight={20}
								>
									{item.description}
								</Text>
							</YStack>

							<XStack
								paddingTop="$4"
								borderTopWidth={1}
								borderTopColor="#f2ecf4"
								justifyContent="space-between"
								alignItems="center"
							>
								<XStack alignItems="center" gap="$2">
									<CheckCircle2 size={16} color="#6750A4" />
									<Text
										fontSize={13}
										fontWeight="600"
										color="#494551"
									>
										{item.taskCount || 0} Tasks
									</Text>
								</XStack>

								<XStack gap="$1">
									<Button
										circular
										size="$2"
										chromeless
										icon={
											<MessageSquare
												size={18}
												color="#7a7582"
											/>
										}
										pressStyle={{
											backgroundColor: "#f2ecf4",
										}}
									/>
									<Button
										circular
										size="$2"
										chromeless
										icon={
											<Trash2 size={18} color="#ffdad6" />
										}
										onPress={(e) => {
											e.stopPropagation();
											setProjectToDelete(item.id);
											setDeleteDialogOpen(true);
										}}
										pressStyle={{
											backgroundColor: "#ffdad6",
										}}
									/>
									<Button
										circular
										size="$2"
										chromeless
										icon={
											<Plus size={18} color="#7a7582" />
										}
										pressStyle={{
											backgroundColor: "#f2ecf4",
										}}
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
								borderRadius={24}
								backgroundColor="#f2ecf4"
								alignItems="center"
								justifyContent="center"
								marginBottom="$3"
							>
								<Plus color="#6750A4" size={24} />
							</View>
							<Text fontWeight="700" color="#494551">
								Start New Project
							</Text>
							<Text fontSize="$2" color="#7a7582" marginTop="$1">
								Expand your academic horizon
							</Text>
						</CreateNewCard>
					}
				/>

				{/* FAB */}
				<YStack position="absolute" bottom={24} right={24} zIndex={100}>
					<Button
						unstyled
						onPress={() => setIsModalOpen(true)}
						pressStyle={{ scale: 0.95 }}
					>
						<LinearGradient
							colors={["#6750A4", "#4F378A"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								width: 64,
								height: 64,
								borderRadius: 24,
								justifyContent: "center",
								alignItems: "center",
								shadowColor: "#6750A4",
								shadowOffset: { width: 0, height: 8 },
								shadowOpacity: 0.2,
								shadowRadius: 16,
								elevation: 8,
							}}
						>
							<Plus color="white" size={32} />
						</LinearGradient>
					</Button>
				</YStack>
			</YStack>

			<ProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreate={handleCreateProject}
			/>

			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={() => {
					if (projectToDelete) {
						deleteProject(projectToDelete);
						setProjectToDelete(null);
					}
				}}
				title="Delete Project"
				description="Are you sure you want to delete this project? This action cannot be undone."
			/>
		</SafeAreaView>
	);
}
