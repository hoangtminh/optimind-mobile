import { AppHeader } from "@/components/common/AppHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import ProjectModal from "@/components/projects/CreateProjectModal";
import { useProject } from "@/contexts/ProjectContext";
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
import { Theme } from "@/constants/Theme";

const ProjectCard = styled(YStack, {
	padding: "$5",
	borderRadius: 8, // Crisp corners
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	elevation: 0,
	pressStyle: { scale: 0.98, backgroundColor: Theme.primaryPastel },
});

const CreateNewCard = styled(YStack, {
	padding: "$5",
	borderRadius: 8, // Crisp corners
	borderWidth: 1.5,
	borderStyle: "dashed",
	borderColor: Theme.border,
	backgroundColor: "transparent",
	alignItems: "center",
	justifyContent: "center",
	pressStyle: {
		backgroundColor: Theme.primaryPastel,
		borderColor: Theme.primary,
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
			style={{ flex: 1, backgroundColor: Theme.background }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor={Theme.background} position="relative">
				<AppHeader
					title="StudyFlow"
					rightElement={
						<Button
							circular
							size="$3"
							chromeless
							icon={<MessageSquare size={18} color={Theme.text} />}
							onPress={() => router.push("/(main)/(tabs)/chat")}
							pressStyle={{
								backgroundColor: Theme.primaryPastel,
							}}
						/>
					}
				/>

				<FlatList
					data={projects}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
					ItemSeparatorComponent={() => <View height={12} />}
					ListHeaderComponent={
						<YStack paddingBottom="$4" paddingTop="$2">
							<Text
								fontSize={28}
								fontWeight="700"
								color={Theme.text}
								letterSpacing={-0.5}
								marginBottom="$1"
							>
								Your Projects
							</Text>
							<Text fontSize="$3" color={Theme.textMuted} lineHeight={20}>
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
									marginBottom="$3"
								>
									<View
										paddingHorizontal="$2.5"
										paddingVertical="$1"
										borderRadius={4}
										backgroundColor={Theme.primaryPastel}
									>
										<Text
											fontSize={10}
											fontWeight="700"
											color={Theme.primaryPastelText}
											letterSpacing={0.5}
										>
											ACTIVE MODULE
										</Text>
									</View>
									<Timer size={16} color={Theme.primary} />
								</XStack>

								<Text
									fontWeight="700"
									fontSize="$5"
									color={Theme.text}
									marginBottom="$1.5"
								>
									{item.name}
								</Text>

								<Text
									fontSize="$3"
									color={Theme.textMuted}
									numberOfLines={2}
									marginBottom="$4"
									lineHeight={18}
								>
									{item.description}
								</Text>
							</YStack>

							<XStack
								paddingTop="$3"
								borderTopWidth={1}
								borderTopColor={Theme.border}
								justifyContent="space-between"
								alignItems="center"
							>
								<XStack alignItems="center" gap="$2">
									<CheckCircle2 size={15} color={Theme.primary} />
									<Text
										fontSize={12}
										fontWeight="600"
										color={Theme.textMuted}
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
											<Trash2 size={16} color={Theme.accentRedText} />
										}
										onPress={(e) => {
											e.stopPropagation();
											setProjectToDelete(item.id);
											setDeleteDialogOpen(true);
										}}
										pressStyle={{
											backgroundColor: Theme.accentRed,
										}}
									/>
									<Button
										circular
										size="$2"
										chromeless
										icon={
											<Plus size={16} color={Theme.textMuted} />
										}
										onPress={() => setIsModalOpen(true)}
										pressStyle={{
											backgroundColor: Theme.background,
										}}
									/>
								</XStack>
							</XStack>
						</ProjectCard>
					)}
					ListFooterComponent={
						<CreateNewCard
							onPress={() => setIsModalOpen(true)}
							marginTop="$3"
						>
							<View
								width={40}
								height={40}
								borderRadius={6}
								backgroundColor={Theme.primaryPastel}
								alignItems="center"
								justifyContent="center"
								marginBottom="$2"
							>
								<Plus color={Theme.primary} size={20} />
							</View>
							<Text fontWeight="600" fontSize="$4" color={Theme.text}>
								Start New Project
							</Text>
							<Text fontSize="$2" color={Theme.textMuted} marginTop="$1">
								Expand your academic horizon
							</Text>
						</CreateNewCard>
					}
				/>

				{/* FAB button matching Theme.primary and radius-6 */}
				<YStack position="absolute" bottom={20} right={20} zIndex={100}>
					<Button
						unstyled
						onPress={() => setIsModalOpen(true)}
						pressStyle={{ scale: 0.95 }}
					>
						<View
							style={{
								width: 56,
								height: 56,
								borderRadius: 6, // Crisp corners
								backgroundColor: Theme.primary,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Plus color={Theme.primaryText} size={24} />
						</View>
					</Button>
				</YStack>
			</YStack>

			<ProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreate={handleCreateProject}
			/>

			<PremiumAlertDialog
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
				type="error"
				confirmText="Delete"
			/>
		</SafeAreaView>
	);
}
