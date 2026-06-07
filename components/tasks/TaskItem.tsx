import { Task, useTask } from "@/contexts/TaskContext";
import { useRouter } from "expo-router";
import {
	Calendar,
	CheckCircle2,
	Circle,
	Clock,
	Edit2,
	Flag,
	Trash2,
} from "lucide-react-native";
import { useState } from "react";
import { Button, styled, Text, XStack, YStack } from "tamagui";
import { PremiumAlertDialog } from "../common/PremiumAlertDialog";
import { Theme } from "@/constants/Theme";

const TaskCard = styled(YStack, {
	padding: "$4",
	borderRadius: 8, // Crisp corners
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	elevation: 0,
	pressStyle: { scale: 0.98, backgroundColor: Theme.primaryPastel },
});

interface TaskItemProps {
	task: Task;
	projectId: string;
	onToggle: (taskId: string, currentStatus: string) => void;
	onEdit?: (task: Task) => void;
}

export default function TaskItem({
	task,
	projectId,
	onToggle,
	onEdit,
}: TaskItemProps) {
	const router = useRouter();
	const { deleteTask } = useTask();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const isCompleted = task.status === "complete";

	const handlePress = () => {
		router.push(`/(main)/(tabs)/tasks/${projectId}/task/${task.id}`);
	};

	const isOverdue = () => {
		if (!task.dueDate || isCompleted) return false;
		return new Date(task.dueDate) < new Date();
	};

	const getStatusInfo = () => {
		if (isCompleted)
			return {
				label: "Complete",
				color: "#15803D",
				bg: "#DCFCE7",
				border: "#86EFAC",
			};
		if (isOverdue())
			return {
				label: "Overdue",
				color: "#DC2626",
				bg: "#FEE2E2",
				border: "#FCA5A5",
			};
		if (task.status === "in_progress")
			return {
				label: "On going",
				color: "#4F46E5",
				bg: "#EEF2FF",
				border: "#C7D2FE",
			};
		return {
			label: "To do",
			color: "#4B5563",
			bg: "#F3F4F6",
			border: "#D1D5DB",
		};
	};

	const status = getStatusInfo();

	const priorityColors = {
		high: { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" },
		medium: { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" },
		low: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
	};
	const colors =
		priorityColors[task.priority as keyof typeof priorityColors] ||
		priorityColors.low;

	return (
		<TaskCard opacity={isCompleted ? 0.75 : 1}>
			<XStack gap="$3" alignItems="flex-start">
				<Button
					circular
					size="$2"
					chromeless
					onPress={(e) => {
						e.stopPropagation();
						onToggle(task.id, task.status);
					}}
					icon={
						isCompleted ? (
							<CheckCircle2 size={20} color={Theme.primary} />
						) : (
							<Circle size={20} color={Theme.border} />
						)
					}
				/>
				<YStack flex={1} gap="$1" paddingTop="$1">
					<XStack
						justifyContent="space-between"
						alignItems="flex-start"
					>
						<YStack flex={1} onPress={handlePress}>
							<Text
								fontSize="$4"
								fontWeight="600"
								color={Theme.text}
								textDecorationLine={
									isCompleted ? "line-through" : "none"
								}
							>
								{task.title}
							</Text>
						</YStack>
						<XStack gap="$1">
							<Button
								circular
								size="$2"
								chromeless
								icon={<Edit2 size={14} color={Theme.primary} />}
								onPress={(e) => {
									e.stopPropagation();
									onEdit?.(task);
								}}
							/>
							<Button
								circular
								size="$2"
								chromeless
								icon={<Trash2 size={14} color={Theme.accentRedText} />}
								onPress={(e) => {
									e.stopPropagation();
									setIsDeleteDialogOpen(true);
								}}
							/>
						</XStack>
					</XStack>

					<YStack onPress={handlePress} gap="$1">
						<Text fontSize="$3" color={Theme.textMuted} numberOfLines={2}>
							{task.note || "No note for this task"}
						</Text>

						<XStack
							marginTop="$2.5"
							gap="$3.5"
							alignItems="center"
							flexWrap="wrap"
						>
							<XStack
								backgroundColor={status.bg}
								borderWidth={1}
								borderColor={status.border}
								paddingHorizontal="$2"
								paddingVertical="$0.5"
								borderRadius={4}
								alignItems="center"
								gap="$1"
							>
								{isCompleted ? (
									<CheckCircle2
										size={10}
										color={status.color}
									/>
								) : (
									<Clock size={10} color={status.color} />
								)}
								<Text
									fontSize={9}
									fontWeight="800"
									color={status.color}
									textTransform="uppercase"
								>
									{status.label}
								</Text>
							</XStack>

							<XStack
								backgroundColor={colors.bg}
								borderWidth={1}
								borderColor={colors.border}
								paddingHorizontal="$2"
								paddingVertical="$0.5"
								borderRadius={4}
								alignItems="center"
								gap="$1"
							>
								<Flag
									size={10}
									color={colors.text}
									fill={colors.text}
								/>
								<Text
									fontSize={9}
									fontWeight="800"
									color={colors.text}
									textTransform="uppercase"
								>
									{task.priority}
								</Text>
							</XStack>

							{task.dueDate && (
								<XStack alignItems="center" gap="$1">
									<Calendar size={12} color={Theme.textMuted} />
									<Text fontSize={11} color={Theme.textMuted}>
										{new Date(
											task.dueDate,
										).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
										})}
									</Text>
								</XStack>
							)}
						</XStack>
					</YStack>
				</YStack>
			</XStack>

			<PremiumAlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={() => deleteTask(task.id)}
				title="Delete Task"
				description="Are you sure you want to delete this task? This action cannot be undone."
				type="error"
				confirmText="Delete"
			/>
		</TaskCard>
	);
}
