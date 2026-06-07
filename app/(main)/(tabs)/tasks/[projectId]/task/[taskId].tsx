import { AppHeader } from "@/components/common/AppHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import TaskModal from "@/components/tasks/TaskModal";
import { Task, useTask } from "@/contexts/TaskContext";
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
import { Theme } from "@/constants/Theme";
import { toast } from "@/components/common/Toast";

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

	const cleanErrorMessage = (errorMsg: string): string => {
		if (!errorMsg) return "An unexpected error occurred";

		if (
			errorMsg.includes("Cannot deserialize") &&
			errorMsg.includes("java.time.Instant")
		) {
			return "Invalid date/time format. Please check the due date.";
		}

		if (
			errorMsg.includes("JSON parse error") ||
			errorMsg.includes("deserialize")
		) {
			return "Unable to save task due to a formatting error.";
		}

		if (
			errorMsg.includes("Network Error") ||
			errorMsg.includes("Network request failed")
		) {
			return "Network error. Please check your internet connection.";
		}

		try {
			if (errorMsg.startsWith("{") && errorMsg.endsWith("}")) {
				const parsed = JSON.parse(errorMsg);
				if (parsed.message) return parsed.message;
			}
		} catch (e) {
			// Ignore
		}

		if (errorMsg.length > 100) {
			const firstLine = errorMsg.split("\n")[0];
			if (firstLine && firstLine.length < 100) {
				return firstLine;
			}
			return "An error occurred while saving the task.";
		}

		return errorMsg;
	};

	const getPriorityInfo = (p: string) => {
		switch (p?.toLowerCase()) {
			case "high":
				return { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" };
			case "medium":
				return { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" };
			default:
				return { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" };
		}
	};

	const getStatusColors = (statusStr: string) => {
		if (statusStr === "complete") {
			return { bg: "#DCFCE7", text: "#15803D", border: "#86EFAC" };
		}
		if (statusStr === "in_progress") {
			return { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" };
		}
		return { bg: "#F3F4F6", text: "#4B5563", border: "#D1D5DB" };
	};

	if (loading) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: Theme.background }}
				edges={["top"]}
			>
				<YStack flex={1} alignItems="center" justifyContent="center">
					<Spinner size="large" color={Theme.primary} />
				</YStack>
			</SafeAreaView>
		);
	}

	if (!task) {
		return (
			<SafeAreaView
				style={{ flex: 1, backgroundColor: Theme.background }}
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
					<AlertCircle size={48} color={Theme.textMuted} />
					<Text color={Theme.text} fontSize="$5" fontWeight="600">
						Task not found
					</Text>
					<Button
						backgroundColor={Theme.primary}
						onPress={() => router.back()}
						borderRadius={6}
					>
						<Text color={Theme.primaryText} fontWeight="700" fontSize="$4">
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
			style={{ flex: 1, backgroundColor: Theme.background }}
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
							icon={<Edit3 size={18} color={Theme.text} />}
							onPress={() => setIsEditModalOpen(true)}
							pressStyle={{
								backgroundColor: Theme.primaryPastel,
							}}
						/>
						<Button
							circular
							size="$3"
							chromeless
							icon={<Trash2 size={18} color={Theme.accentRedText} />}
							onPress={handleDeleteTask}
							pressStyle={{
								backgroundColor: Theme.accentRed,
							}}
						/>
					</XStack>
				}
			/>

			<ScrollView flex={1}>
				<YStack padding="$5" gap="$5">
					{/* Header Section */}
					<YStack gap="$3">
						<XStack
							justifyContent="space-between"
							alignItems="flex-start"
						>
							<XStack
								backgroundColor={getPriorityInfo(task.priority).bg}
								borderWidth={1}
								borderColor={getPriorityInfo(task.priority).border}
								paddingHorizontal="$2.5"
								paddingVertical="$1"
								borderRadius={4}
								gap="$2"
								alignItems="center"
							>
								<Flag
									size={12}
									color={getPriorityInfo(task.priority).text}
									fill={getPriorityInfo(task.priority).text}
								/>
								<Text
									color={getPriorityInfo(task.priority).text}
									fontWeight="700"
									fontSize="$2"
									textTransform="uppercase"
								>
									{task.priority} Priority
								</Text>
							</XStack>

							<XStack
								backgroundColor={getStatusColors(task.status).bg}
								borderWidth={1}
								borderColor={getStatusColors(task.status).border}
								paddingHorizontal="$2.5"
								paddingVertical="$1"
								borderRadius={4}
								gap="$2"
								alignItems="center"
							>
								{isCompleted ? (
									<CheckCircle2 size={12} color={getStatusColors(task.status).text} />
								) : (
									<Clock size={12} color={getStatusColors(task.status).text} />
								)}
								<Text
									color={getStatusColors(task.status).text}
									fontWeight="700"
									fontSize="$2"
									textTransform="uppercase"
								>
									{task.status.replace("_", " ")}
								</Text>
							</XStack>
						</XStack>

						<Text
							fontSize={26}
							fontWeight="700"
							color={Theme.text}
							lineHeight={30}
							letterSpacing={-0.5}
						>
							{task.title}
						</Text>
					</YStack>

					{/* Info Cards */}
					<XStack gap="$4">
						<Card
							flex={1}
							padding="$4"
							borderRadius={8}
							backgroundColor={Theme.surface}
							borderWidth={1}
							borderColor={Theme.border}
							elevation={0}
						>
							<YStack gap="$2">
								<XStack gap="$2" alignItems="center">
									<Calendar size={16} color={Theme.primary} />
									<Text
										color={Theme.textMuted}
										fontWeight="600"
										fontSize="$2"
									>
										DUE DATE
									</Text>
								</XStack>
								<Text
									fontSize="$4"
									fontWeight="700"
									color={Theme.text}
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
					<YStack gap="$2.5">
						<XStack gap="$2" alignItems="center">
							<FileText size={18} color={Theme.primary} />
							<Text
								fontSize="$4"
								fontWeight="700"
								color={Theme.text}
							>
								Notes
							</Text>
						</XStack>
						<View
							backgroundColor={Theme.surface}
							padding="$4"
							borderRadius={8}
							borderWidth={1}
							borderColor={Theme.border}
						>
							<Text color={Theme.text} lineHeight={20} fontSize="$3">
								{task.note ||
									"This task has no additional notes or descriptions."}
							</Text>
						</View>
					</YStack>

					{/* Tags Section */}
					<YStack gap="$2.5">
						<XStack gap="$2" alignItems="center">
							<Tag size={18} color={Theme.primary} />
							<Text
								fontSize="$4"
								fontWeight="700"
								color={Theme.text}
							>
								Tags
							</Text>
						</XStack>
						{task.tag && task.tag.length > 0 ? (
							<XStack gap="$2" flexWrap="wrap">
								{task.tag.map((t: any) => (
									<View
										key={t}
										backgroundColor={Theme.primaryPastel}
										paddingHorizontal="$3"
										paddingVertical="$1.5"
										borderRadius={4}
									>
										<Text
											fontSize="$3"
											fontWeight="600"
											color={Theme.primary}
										>
											#{t}
										</Text>
									</View>
								))}
							</XStack>
						) : (
							<Text color={Theme.textMuted} fontStyle="italic" fontSize="$3">
								No tags added
							</Text>
						)}
					</YStack>
				</YStack>
			</ScrollView>

			{/* Action Button */}
			<YStack
				padding="$4"
				paddingBottom="$6"
				backgroundColor={Theme.surface}
				borderTopLeftRadius={12}
				borderTopRightRadius={12}
				borderTopWidth={1}
				borderTopColor={Theme.border}
			>
				<Button
					height={48}
					borderRadius={6}
					backgroundColor={isCompleted ? Theme.primaryPastel : Theme.primary}
					borderWidth={isCompleted ? 1 : 0}
					borderColor={Theme.border}
					onPress={async () => {
						const newStatus = isCompleted ? "todo" : "complete";
						try {
							await updateTaskStatus(task.id, newStatus as any);
							toast.success(
								`Task marked as ${newStatus === "complete" ? "complete" : "active"}`,
							);
							loadTask(task.id);
						} catch (e) {
							const friendly = cleanErrorMessage(
								e instanceof Error ? e.message : "An error occurred",
							);
							toast.error(friendly);
						}
					}}
					pressStyle={{ scale: 0.98 }}
				>
					<XStack gap="$2" alignItems="center" justifyContent="center">
						{isCompleted ? (
							<Circle size={18} color={Theme.primary} />
						) : (
							<CheckCircle2 size={18} color={Theme.primaryText} />
						)}
						<Text
							color={isCompleted ? Theme.primary : Theme.primaryText}
							fontWeight="700"
							fontSize="$4"
						>
							{isCompleted
								? "Mark as Active"
								: "Mark as Complete"}
						</Text>
					</XStack>
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
							toast.success("Task deleted successfully");
							router.back();
						} catch (e) {
							const friendly = cleanErrorMessage(
								e instanceof Error ? e.message : "An error occurred",
							);
							toast.error(friendly);
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
