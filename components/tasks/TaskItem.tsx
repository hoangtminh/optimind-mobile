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

const TaskCard = styled(YStack, {
	padding: "$4",
	borderRadius: 20,
	backgroundColor: "#ffffff",
	shadowColor: "#6750A4",
	shadowRadius: 15,
	shadowOpacity: 0.05,
	shadowOffset: { width: 0, height: 6 },
	pressStyle: { scale: 0.98, backgroundColor: "#fdf7ff" },
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
			return { label: "Complete", color: "#2e7d32", bg: "#e8f5e9" };
		if (isOverdue())
			return { label: "Overdue", color: "#d32f2f", bg: "#ffebee" };
		if (task.status === "in_progress")
			return { label: "On going", color: "#f57f17", bg: "#fff8e1" };
		return { label: "To do", color: "#7a7582", bg: "#f2ecf4" };
	};

	const status = getStatusInfo();

	const priorityColors = {
		high: { bg: "#ffdad6", text: "#93000a" },
		medium: { bg: "#ffdcc6", text: "#723600" },
		low: { bg: "#e9ddff", text: "#4f378a" },
	};
	const colors =
		priorityColors[task.priority as keyof typeof priorityColors] ||
		priorityColors.low;

	return (
		<TaskCard opacity={isCompleted ? 0.7 : 1}>
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
							<CheckCircle2 size={22} color="#6750A4" />
						) : (
							<Circle size={22} color="#cbc4d2" />
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
								fontWeight="700"
								color="#1d1b20"
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
								icon={<Edit2 size={16} color="#6750A4" />}
								onPress={(e) => {
									e.stopPropagation();
									onEdit?.(task);
								}}
							/>
							<Button
								circular
								size="$2"
								chromeless
								icon={<Trash2 size={16} color="#d32f2f" />}
								onPress={(e) => {
									e.stopPropagation();
									setIsDeleteDialogOpen(true);
								}}
							/>
						</XStack>
					</XStack>

					<YStack onPress={handlePress} gap="$1">
						<Text fontSize="$3" color="#494551">
							{task.note || "No note for this task"}
						</Text>

						<XStack
							marginTop="$3"
							gap="$3"
							alignItems="center"
							flexWrap="wrap"
						>
							<XStack
								backgroundColor={status.bg}
								paddingHorizontal="$2"
								paddingVertical="$0.5"
								borderRadius={6}
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
									fontSize={10}
									fontWeight="800"
									color={status.color}
									textTransform="uppercase"
								>
									{status.label}
								</Text>
							</XStack>

							<XStack
								backgroundColor={colors.bg}
								paddingHorizontal="$2"
								paddingVertical="$0.5"
								borderRadius={6}
								alignItems="center"
								gap="$1"
							>
								<Flag
									size={10}
									color={colors.text}
									fill={colors.text}
								/>
								<Text
									fontSize={10}
									fontWeight="800"
									color={colors.text}
									textTransform="uppercase"
								>
									{task.priority}
								</Text>
							</XStack>

							{task.dueDate && (
								<XStack alignItems="center" gap="$1">
									<Calendar size={12} color="#7a7582" />
									<Text fontSize={11} color="#7a7582">
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
