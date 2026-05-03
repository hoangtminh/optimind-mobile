import { AppHeader } from "@/components/common/AppHeader";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useProject } from "@/contexts/ProjectContext";
import { Task, useTask } from "@/contexts/TaskContext";
import { LinearGradient } from "expo-linear-gradient";
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

const TabButton = styled(YStack, {
	paddingVertical: "$2",
	paddingHorizontal: "$4",
	borderRadius: 100,
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "row",
	gap: "$2",
	pressStyle: { scale: 0.95 },
	variants: {
		active: {
			true: {
				backgroundColor: "#e9ddff",
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

	const handleToggleTask = (taskId: string, currentStatus: string) => {
		const newStatus = currentStatus === "complete" ? "todo" : "complete";
		updateTaskStatus(taskId, newStatus);
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setIsAddModalOpen(true);
	};

	const handleStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
		updateTaskStatus(taskId, newStatus);
	};

	const handleDeleteProject = () => {
		setDeleteDialogOpen(true);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#fdf7ff" }}
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
								icon={<Edit3 size={18} color="white" />}
								onPress={() => setIsEditProjectOpen(true)}
								pressStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
							/>
							<Button
								circular
								size="$3"
								chromeless
								icon={<Trash2 size={18} color="#ffdad6" />}
								onPress={handleDeleteProject}
								pressStyle={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
							/>
						</XStack>
					}
				/>

				{/* Tab Navigation */}
				<XStack
					paddingHorizontal="$4"
					paddingVertical="$3"
					gap="$2"
					backgroundColor="white"
					borderBottomWidth={1}
					borderBottomColor="#f2ecf4"
				>
					<TabButton
						active={activeTab === "tasks"}
						onPress={() => setActiveTab("tasks")}
					>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={
								activeTab === "tasks" ? "#6750A4" : "#7a7582"
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
							size={16}
							color={
								activeTab === "kanban" ? "#6750A4" : "#7a7582"
							}
						/>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={
								activeTab === "kanban" ? "#6750A4" : "#7a7582"
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
							size={16}
							color={activeTab === "chat" ? "#6750A4" : "#7a7582"}
						/>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={activeTab === "chat" ? "#6750A4" : "#7a7582"}
						>
							Chat
						</Text>
					</TabButton>
					<TabButton
						active={activeTab === "log"}
						onPress={() => setActiveTab("log")}
					>
						<History
							size={16}
							color={activeTab === "log" ? "#6750A4" : "#7a7582"}
						/>
						<Text
							fontSize="$3"
							fontWeight="700"
							color={activeTab === "log" ? "#6750A4" : "#7a7582"}
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
							padding: 20,
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
										marginTop="$4"
										marginBottom="$3"
										paddingHorizontal="$2"
									>
										<Text
											fontSize="$5"
											fontWeight="800"
											color="#1d1b20"
											letterSpacing={-0.5}
										>
											{item.title}
										</Text>
										<View
											backgroundColor="#f2ecf4"
											paddingHorizontal="$3"
											paddingVertical="$1"
											borderRadius={12}
										>
											<Text
												fontSize={12}
												fontWeight="700"
												color="#6750A4"
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
							return <View height={12} />;
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
						padding="$10"
					>
						<View
							backgroundColor="#f8f2fa"
							padding="$6"
							borderRadius={30}
							marginBottom="$5"
						>
							{activeTab === "chat" ? (
								<MessageSquare size={40} color="#6750A4" />
							) : (
								<History size={40} color="#6750A4" />
							)}
						</View>
						<Text
							fontSize="$6"
							fontWeight="800"
							color="#1d1b20"
							textAlign="center"
						>
							Coming Soon
						</Text>
						<Text
							fontSize="$3"
							color="#7a7582"
							textAlign="center"
							marginTop="$2"
						>
							The {activeTab} feature is currently under
							development.
						</Text>
					</YStack>
				)}

				{/* FAB */}
				<YStack position="absolute" bottom={24} right={24} zIndex={100}>
					<Button
						unstyled
						onPress={() => setIsAddModalOpen(true)}
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

			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={async () => {
					try {
						await deleteProject(projectId);
						router.replace("/(main)/(tabs)/tasks");
					} catch (e) {
						// Error handling could be improved with a toast or another dialog
					}
				}}
				title="Delete Project"
				description="Are you sure you want to delete this project and all its tasks? This action cannot be undone."
			/>
		</SafeAreaView>
	);
}
