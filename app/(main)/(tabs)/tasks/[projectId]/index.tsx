import { AppHeader } from "@/components/common/AppHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { useProject } from "@/contexts/ProjectContext";
import { Task, useTask } from "@/contexts/TaskContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { History, Layout, MessageSquare, Plus, Edit3, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, styled, Text, View, XStack, YStack } from "tamagui";
import ProjectModal from "@/components/projects/CreateProjectModal";
import KanbanView from "@/components/tasks/KanbanView";
import TaskItem from "@/components/tasks/TaskItem";
import TaskModal from "@/components/tasks/TaskModal";
import { TaskStatus } from "@/lib/types/task";
import { Theme } from "@/constants/Theme";
import { toast } from "@/components/common/Toast";

const TabButton = styled(YStack, {
	paddingVertical: "$2",
	paddingHorizontal: "$4",
	borderRadius: 6, // Crisp corners
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "row",
	gap: "$2",
	pressStyle: { scale: 0.98 },
	variants: {
		active: {
			true: {
				backgroundColor: Theme.primaryPastel,
			},
			false: {
				backgroundColor: "transparent",
			},
		},
	} as const,
});

export default function ProjectTaskScreen() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const router = useRouter();
	const { getProject } = useProject();
	const {
		tasks,
		fetchTasks,
		updateTaskStatus,
		isAddModalOpen,
		setIsAddModalOpen,
	} = useTask();
	const [activeTab, setActiveTab] = useState<
		"tasks" | "chat" | "kanban" | "log"
	>("tasks");
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const { deleteProject, updateProject } = useProject();

	const project = getProject(projectId);

	useEffect(() => {
		if (projectId) {
			fetchTasks(projectId);
		}
	}, [projectId]);

	const todoTasks = tasks.filter((t) => t.status === "todo");
	const ongoingTasks = tasks.filter((t) => t.status === "in_progress");
	const completedTasks = tasks.filter((t) => t.status === "complete");

	const handleToggleTask = async (taskId: string, currentStatus: string) => {
		const newStatus = currentStatus === "complete" ? "todo" : "complete";
		try {
			await updateTaskStatus(taskId, newStatus);
			toast.success(
				`Task marked as ${newStatus === "complete" ? "complete" : "active"}`,
			);
		} catch (e) {
			const rawMsg = e instanceof Error ? e.message : "An error occurred";
			toast.error(
				rawMsg.includes("Instant")
					? "Invalid date/time format. Please check the due date."
					: rawMsg,
			);
		}
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setIsAddModalOpen(true);
	};

	const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
		try {
			await updateTaskStatus(taskId, newStatus);
			toast.success(`Task status updated to ${newStatus.replace("_", " ")}`);
		} catch (e) {
			const rawMsg = e instanceof Error ? e.message : "An error occurred";
			toast.error(
				rawMsg.includes("Instant")
					? "Invalid date/time format. Please check the due date."
					: rawMsg,
			);
		}
	};

	const handleDeleteProject = () => {
		setDeleteDialogOpen(true);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: Theme.background }}
			edges={["top"]}
		>
			<YStack flex={1}>
				<AppHeader
					title={project?.name || "Project Tasks"}
					showBackButton
					onBack={() => router.replace("/(main)/(tabs)/tasks")}
					rightElement={
						<XStack gap="$1">
							<Button
								circular
								size="$3"
								chromeless
								icon={<Edit3 size={18} color={Theme.text} />}
								onPress={() => setIsEditProjectOpen(true)}
								pressStyle={{ backgroundColor: Theme.primaryPastel }}
							/>
							<Button
								circular
								size="$3"
								chromeless
								icon={<Trash2 size={18} color={Theme.accentRedText} />}
								onPress={handleDeleteProject}
								pressStyle={{ backgroundColor: Theme.accentRed }}
							/>
						</XStack>
					}
				/>

				{/* Tab Navigation */}
				<XStack
					paddingHorizontal="$4"
					paddingVertical="$2"
					gap="$2"
					backgroundColor={Theme.surface}
					borderBottomWidth={1}
					borderBottomColor={Theme.border}
				>
					<TabButton
						active={activeTab === "tasks"}
						onPress={() => setActiveTab("tasks")}
					>
						<Text
							fontSize="$2"
							fontWeight="700"
							color={
								activeTab === "tasks" ? Theme.primary : Theme.textMuted
							}
						>
							Tasks
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "kanban"}
						onPress={() => setActiveTab("kanban")}
					>
						<Layout
							size={14}
							color={
								activeTab === "kanban" ? Theme.primary : Theme.textMuted
							}
						/>
						<Text
							fontSize="$2"
							fontWeight="700"
							color={
								activeTab === "kanban" ? Theme.primary : Theme.textMuted
							}
						>
							Kanban
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "chat"}
						onPress={() => setActiveTab("chat")}
					>
						<MessageSquare
							size={14}
							color={activeTab === "chat" ? Theme.primary : Theme.textMuted}
						/>
						<Text
							fontSize="$2"
							fontWeight="700"
							color={activeTab === "chat" ? Theme.primary : Theme.textMuted}
						>
							Chat
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "log"}
						onPress={() => setActiveTab("log")}
					>
						<History
							size={14}
							color={activeTab === "log" ? Theme.primary : Theme.textMuted}
						/>
						<Text
							fontSize="$2"
							fontWeight="700"
							color={activeTab === "log" ? Theme.primary : Theme.textMuted}
						>
							Log
						</Text>
					</TabButton>
				</XStack>

				{/* Content */}
				{activeTab === "tasks" ? (
					<FlatList
						data={[
							{
								type: "header",
								title: "To-do",
								count: todoTasks.length + ongoingTasks.length,
							},
							...todoTasks,
							...ongoingTasks,
							{
								type: "header",
								title: "Completed",
								count: completedTasks.length,
							},
							...completedTasks,
						]}
						keyExtractor={(item: any, index) =>
							item.id || `header-${index}`
						}
						contentContainerStyle={{
							padding: 16,
							paddingBottom: 100,
						}}
						renderItem={({ item }) => {
							if (item.type === "header") {
								if (
									item.count === 0 &&
									item.title === "Completed"
								)
									return null;
								return (
									<XStack
										justifyContent="space-between"
										alignItems="center"
										marginTop="$3"
										marginBottom="$2"
										paddingHorizontal="$2"
									>
										<Text
											fontSize="$4"
											fontWeight="700"
											color={Theme.text}
											letterSpacing={-0.3}
										>
											{item.title}
										</Text>
										<View
											backgroundColor={Theme.primaryPastel}
											paddingHorizontal="$2.5"
											paddingVertical="$0.5"
											borderRadius={4}
										>
											<Text
												fontSize={11}
												fontWeight="700"
												color={Theme.primaryPastelText}
											>
												{item.count}
											</Text>
										</View>
									</XStack>
								);
							}
							return (
								<TaskItem
									task={item}
									projectId={projectId}
									onToggle={handleToggleTask}
									onEdit={handleEditTask}
								/>
							);
						}}
						ItemSeparatorComponent={(props) => {
							const { leadingItem } = props as any;
							if (leadingItem?.type === "header") return null;
							return <View height={8} />;
						}}
					/>
				) : activeTab === "kanban" ? (
					<KanbanView
						tasks={tasks}
						projectId={projectId}
						onToggleTask={handleToggleTask}
						onEditTask={handleEditTask}
						onStatusUpdate={handleStatusUpdate}
					/>
				) : (
					<YStack
						flex={1}
						justifyContent="center"
						alignItems="center"
						padding="$8"
					>
						<View
							backgroundColor={Theme.surface}
							borderWidth={1}
							borderColor={Theme.border}
							padding="$5"
							borderRadius={6}
							marginBottom="$4"
						>
							{activeTab === "chat" ? (
								<MessageSquare size={32} color={Theme.primary} />
							) : (
								<History size={32} color={Theme.primary} />
							)}
						</View>
						<Text
							fontSize="$5"
							fontWeight="700"
							color={Theme.text}
							textAlign="center"
						>
							Coming Soon
						</Text>
						<Text
							fontSize="$3"
							color={Theme.textMuted}
							textAlign="center"
							marginTop="$2"
						>
							The {activeTab} feature is currently under
							development.
						</Text>
					</YStack>
				)}

				{/* FAB flat circular or crisp square */}
				<YStack position="absolute" bottom={20} right={20} zIndex={100}>
					<Button
						unstyled
						onPress={() => setIsAddModalOpen(true)}
						pressStyle={{ scale: 0.95 }}
					>
						<View
							style={{
								width: 56,
								height: 56,
								borderRadius: 6,
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

			<TaskModal
				visible={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				projectId={projectId}
				task={editingTask}
			/>

			<ProjectModal
				isOpen={isEditProjectOpen}
				onClose={() => setIsEditProjectOpen(false)}
				project={project}
				onUpdate={updateProject}
			/>

			<PremiumAlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={async () => {
					try {
						await deleteProject(projectId);
						router.replace("/(main)/(tabs)/tasks");
					} catch (e) {
						// Error handling
					}
				}}
				title="Delete Project"
				description="Are you sure you want to delete this project and all its tasks? This action cannot be undone."
				type="error"
				confirmText="Delete"
			/>
		</SafeAreaView>
	);
}
