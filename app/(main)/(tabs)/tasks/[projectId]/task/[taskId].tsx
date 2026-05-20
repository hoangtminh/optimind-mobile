import { AppHeader } from "@/components/common/AppHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import TaskModal from "@/components/tasks/TaskModal";
import { Task, useTask } from "@/contexts/TaskContext";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Circle,
	Clock,
	Edit3,
	FileText,
	Flag,
	Tag,
	Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	Button,
	Card,
	ScrollView,
	Spinner,
	Text,
	View,
	XStack,
	YStack,
} from "tamagui";

export default function TaskDetailsScreen() {
	const { taskId, projectId } = useLocalSearchParams();
	const router = useRouter();
	const { fetchTaskById, updateTaskStatus, deleteTask } = useTask();

	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	useEffect(() => {
		if (taskId && typeof taskId === "string") {
			loadTask(taskId);
		}
	}, [taskId]);

	const loadTask = async (id: string) => {
		setLoading(true);
		const data = await fetchTaskById(id);
		setTask(data);
		setLoading(false);
	};

	const handleDeleteTask = () => {
		setIsDeleteDialogOpen(true);
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "high":
				return "#ffdad6";
			case "medium":
				return "#fff1d6";
			case "low":
				return "#e9ddff";
			default:
				return "#f2ecf4";
		}
	};

	const getPriorityTextColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "high":
				return "#93000a";
			case "medium":
				return "#695100";
			case "low":
				return "#6750A4";
			default:
				return "#494551";
		}
	};

	if (loading) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: "#fdf7ff" }}
				edges={["top"]}
			>
				<YStack flex={1} alignItems="center" justifyContent="center">
					<Spinner size="large" color="#6750A4" />
				</YStack>
			</SafeAreaView>
		);
	}

	if (!task) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: "#fdf7ff" }}
				edges={["top"]}
			>
				<AppHeader title="Task Details" showBackButton />
				<YStack
					flex={1}
					alignItems="center"
					justifyContent="center"
					padding="$6"
					gap="$4"
				>
					<AlertCircle size={48} color="#7a7582" />
					<Text color="#494551" fontSize="$5" fontWeight="600">
						Task not found
					</Text>
					<Button
						backgroundColor="#6750A4"
						onPress={() => router.back()}
						borderRadius={12}
					>
						<Text color="white" fontWeight="700" fontSize="$4">
							Go Back
						</Text>
					</Button>
				</YStack>
			</SafeAreaView>
		);
	}

	const isCompleted = task.status === "complete";

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#fdf7ff" }}
			edges={["top"]}
		>
			<AppHeader
				title="Task Details"
				showBackButton
				rightElement={
					<XStack gap="$1">
						<Button
							circular
							size="$3"
							chromeless
							icon={<Edit3 size={18} color="white" />}
							onPress={() => setIsEditModalOpen(true)}
							pressStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.1)",
							}}
						/>
						<Button
							circular
							size="$3"
							chromeless
							icon={<Trash2 size={18} color="#ffdad6" />}
							onPress={handleDeleteTask}
							pressStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.1)",
							}}
						/>
					</XStack>
				}
			/>

			<ScrollView flex={1}>
				<YStack padding="$5" gap="$6">
					{/* Header Section */}
					<YStack gap="$3">
						<XStack
							justifyContent="space-between"
							alignItems="flex-start"
						>
							<XStack
								backgroundColor={getPriorityColor(
									task.priority,
								)}
								paddingHorizontal="$3"
								paddingVertical="$1.5"
								borderRadius={12}
								gap="$2"
								alignItems="center"
							>
								<Flag
									size={14}
									color={getPriorityTextColor(task.priority)}
									fill={getPriorityTextColor(task.priority)}
								/>
								<Text
									color={getPriorityTextColor(task.priority)}
									fontWeight="700"
									fontSize="$2"
									textTransform="uppercase"
								>
									{task.priority} Priority
								</Text>
							</XStack>

							<XStack
								backgroundColor={
									isCompleted ? "#e8f5e9" : "#fff8e1"
								}
								paddingHorizontal="$3"
								paddingVertical="$1.5"
								borderRadius={12}
								gap="$2"
								alignItems="center"
							>
								{isCompleted ? (
									<CheckCircle2 size={14} color="#2e7d32" />
								) : (
									<Clock size={14} color="#f57f17" />
								)}
								<Text
									color={isCompleted ? "#2e7d32" : "#f57f17"}
									fontWeight="700"
									fontSize="$2"
									textTransform="uppercase"
								>
									{task.status.replace("_", " ")}
								</Text>
							</XStack>
						</XStack>

						<Text
							fontSize={28}
							fontWeight="900"
							color="#1d1b20"
							lineHeight={34}
						>
							{task.title}
						</Text>
					</YStack>

					{/* Info Cards */}
					<XStack gap="$4">
						<Card
							flex={1}
							padding="$4"
							borderRadius={20}
							backgroundColor="white"
							elevation={2}
						>
							<YStack gap="$2">
								<XStack gap="$2" alignItems="center">
									<Calendar size={18} color="#6750A4" />
									<Text
										color="#7a7582"
										fontWeight="600"
										fontSize="$2"
									>
										DUE DATE
									</Text>
								</XStack>
								<Text
									fontSize="$4"
									fontWeight="800"
									color="#1d1b20"
								>
									{task.dueDate
										? new Date(
												task.dueDate,
											).toLocaleDateString(undefined, {
												month: "short",
												day: "numeric",
												year: "numeric",
											})
										: "No deadline"}
								</Text>
							</YStack>
						</Card>
					</XStack>

					{/* Notes Section */}
					<YStack gap="$3">
						<XStack gap="$2" alignItems="center">
							<FileText size={20} color="#6750A4" />
							<Text
								fontSize="$4"
								fontWeight="800"
								color="#1d1b20"
							>
								Notes
							</Text>
						</XStack>
						<View
							backgroundColor="white"
							padding="$5"
							borderRadius={20}
							borderWidth={1.5}
							borderColor="#f2ecf4"
						>
							<Text color="#494551" lineHeight={24} fontSize="$4">
								{task.note ||
									"This task has no additional notes or descriptions."}
							</Text>
						</View>
					</YStack>

					{/* Tags Section */}
					<YStack gap="$3">
						<XStack gap="$2" alignItems="center">
							<Tag size={20} color="#6750A4" />
							<Text
								fontSize="$4"
								fontWeight="800"
								color="#1d1b20"
							>
								Tags
							</Text>
						</XStack>
						{task.tag && task.tag.length > 0 ? (
							<XStack gap="$2" flexWrap="wrap">
								{task.tag.map((t: any) => (
									<View
										key={t}
										backgroundColor="#f2ecf4"
										paddingHorizontal="$4"
										paddingVertical="$2"
										borderRadius={12}
									>
										<Text
											fontSize="$3"
											fontWeight="600"
											color="#6750A4"
										>
											#{t}
										</Text>
									</View>
								))}
							</XStack>
						) : (
							<Text color="#7a7582" fontStyle="italic">
								No tags added
							</Text>
						)}
					</YStack>
				</YStack>
			</ScrollView>

			{/* Action Button */}
			<YStack
				padding="$5"
				paddingBottom="$8"
				backgroundColor="white"
				borderTopLeftRadius={32}
				borderTopRightRadius={32}
				shadowColor="#000"
				shadowRadius={20}
				shadowOpacity={0.05}
			>
				<Button
					unstyled
					onPress={async () => {
						const newStatus = isCompleted ? "todo" : "complete";
						await updateTaskStatus(task.id, newStatus as any);
						loadTask(task.id);
					}}
				>
					<LinearGradient
						colors={
							isCompleted
								? ["#f2ecf4", "#e9ddff"]
								: ["#6750A4", "#4F378A"]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{
							height: 60,
							borderRadius: 20,
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row",
						}}
					>
						<XStack gap="$3" alignItems="center">
							{isCompleted ? (
								<Circle size={24} color="#6750A4" />
							) : (
								<CheckCircle2 size={24} color="white" />
							)}
							<Text
								color={isCompleted ? "#6750A4" : "white"}
								fontWeight="800"
								fontSize="$5"
							>
								{isCompleted
									? "Mark as Active"
									: "Mark as Complete"}
							</Text>
						</XStack>
					</LinearGradient>
				</Button>
			</YStack>

			<TaskModal
				visible={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					if (taskId && typeof taskId === "string") {
						loadTask(taskId);
					}
				}}
				projectId={projectId as string}
				task={task || undefined}
			/>

			<PremiumAlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={async () => {
					if (task) {
						try {
							await deleteTask(task.id);
							router.back();
						} catch (e) {
							// Error handling
						}
					}
				}}
				title="Delete Task"
				description="Are you sure you want to delete this task? This action cannot be undone."
				type="error"
				confirmText="Delete"
			/>
		</SafeAreaView>
	);
}
