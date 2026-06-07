import { Task } from "@/contexts/TaskContext";
import { TaskStatus } from "@/lib/types/task";
import { Dimensions, ScrollView } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Text, View, XStack, YStack } from "tamagui";
import TaskItem from "./TaskItem";
import { useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_WIDTH = SCREEN_WIDTH * 0.85;
const COLUMN_GAP = 16;

interface KanbanViewProps {
	tasks: Task[];
	projectId: string;
	onToggleTask: (taskId: string, currentStatus: string) => void;
	onEditTask: (task: Task) => void;
	onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void;
}

const DraggableTask = ({
	task,
	projectId,
	onToggleTask,
	onEditTask,
	onStatusUpdate,
	columnIndex,
}: {
	task: Task;
	projectId: string;
	onToggleTask: any;
	onEditTask: any;
	onStatusUpdate: any;
	columnIndex: number;
}) => {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const contextX = useSharedValue(0);
	const contextY = useSharedValue(0);
	const isDragging = useSharedValue(false);

	const panGesture = Gesture.Pan()
		.onStart(() => {
			contextX.value = translateX.value;
			contextY.value = translateY.value;
			isDragging.value = true;
		})
		.onUpdate((event) => {
			translateX.value = contextX.value + event.translationX;
			translateY.value = contextY.value + event.translationY;
		})
		.onEnd((event) => {
			isDragging.value = false;

			// Calculate column based on translation
			const totalX =
				columnIndex * (COLUMN_WIDTH + COLUMN_GAP) + event.translationX;
			let targetIndex = Math.round(totalX / (COLUMN_WIDTH + COLUMN_GAP));
			targetIndex = Math.max(0, Math.min(2, targetIndex));

			const statuses = ["todo", "in_progress", "complete"];
			const newStatus = statuses[targetIndex];

			if (newStatus !== task.status) {
				runOnJS(onStatusUpdate)(task.id, newStatus);
			}

			translateX.value = withSpring(0);
			translateY.value = withSpring(0);
		});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ scale: withSpring(isDragging.value ? 1.05 : 1) },
			],
			// Ensure it's above everything else while dragging
			zIndex: isDragging.value ? 1000 : 1,
			elevation: isDragging.value ? 10 : 0,
			// Make opacity less (more transparent) while dragging as requested
			opacity: isDragging.value ? 0.7 : 1,
		};
	});

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View style={animatedStyle}>
				<TaskItem
					task={task}
					projectId={projectId}
					onToggle={onToggleTask}
					onEdit={onEditTask}
				/>
			</Animated.View>
		</GestureDetector>
	);
};

const ShadowTask = ({ task }: { task: Task }) => {
	return (
		<YStack
			borderWidth={1.5}
			borderColor="#6750A4"
			borderStyle="dashed"
			backgroundColor="#F3F0FA"
			padding="$4"
			borderRadius={8}
			opacity={0.65}
			justifyContent="center"
		>
			<Text color="#6750A4" fontWeight="700" fontSize="$3" numberOfLines={1}>
				{task.title}
			</Text>
			<Text color="#7a7582" fontSize="$2" marginTop="$1">
				Moving to this column...
			</Text>
		</YStack>
	);
};

export default function KanbanView({
	tasks,
	projectId,
	onToggleTask,
	onEditTask,
	onStatusUpdate,
}: KanbanViewProps) {
	const todoTasks = tasks.filter((t) => t.status === "todo");
	const ongoingTasks = tasks.filter((t) => t.status === "in_progress");
	const completedTasks = tasks.filter((t) => t.status === "complete");
		const [activeTask, setActiveTask] = useState<Task | null>(null);
	

	const columns = [
		{ id: "todo", title: "To do", tasks: todoTasks, color: "#7a7582" },
		{
			id: "in_progress",
			title: "On going",
			tasks: ongoingTasks,
			color: "#f57f17",
		},
		{
			id: "complete",
			title: "Completed",
			tasks: completedTasks,
			color: "#2e7d32",
		},
	];

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={COLUMN_WIDTH + COLUMN_GAP}
				decelerationRate="fast"
				contentContainerStyle={{ paddingHorizontal: 16 }}
			>
				<XStack gap={COLUMN_GAP} paddingVertical="$4">
					{columns.map((col, idx) => (
						<YStack
							key={col.id}
							width={COLUMN_WIDTH}
							gap="$3"
							backgroundColor="#f8f2fa"
							borderRadius={28}
							padding="$4"
							minHeight={500}
							// Allow dragged children to overlap other columns
							zIndex={100}
						>
							<XStack
								justifyContent="space-between"
								alignItems="center"
								paddingBottom="$2"
							>
								<XStack alignItems="center" gap="$2">
									<View
										width={10}
										height={10}
										borderRadius={5}
										backgroundColor={col.color}
									/>
									<Text
										fontWeight="900"
										fontSize="$5"
										color="#1d1b20"
										letterSpacing={-0.5}
									>
										{col.title}
									</Text>
								</XStack>
								<View
									backgroundColor="white"
									paddingHorizontal="$3"
									paddingVertical="$1"
									borderRadius={12}
									borderWidth={1}
									borderColor="#f2ecf4"
									elevationAndroid={1}
								>
									<Text
										fontSize={12}
										fontWeight="800"
										color="#6750A4"
									>
										{col.tasks.length}
									</Text>
								</View>
							</XStack>

							<ScrollView
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 20 }}
							>
								<YStack gap="$3">
									{col.tasks.length > 0 ? (
										col.tasks.map((task) => (
											<DraggableTask
												key={task.id}
												task={task}
												columnIndex={idx}
												projectId={projectId}
												onToggleTask={onToggleTask}
												onEditTask={onEditTask}
												onStatusUpdate={onStatusUpdate}
											/>
										))
									) : (
										<View
											height={120}
											borderRadius={20}
											borderStyle="dashed"
											borderWidth={2}
											borderColor="#cbc4d2"
											justifyContent="center"
											alignItems="center"
											opacity={0.6}
											backgroundColor="white"
										>
											<Text
												color="#7a7582"
												fontWeight="700"
											>
												No tasks here
											</Text>
										</View>
									)}
									{activeTask && hoverColumnIndex === idx && (
																			<ShadowTask task={activeTask} />
																		)}
								</YStack>
							</ScrollView>
						</YStack>
					))}
				</XStack>
			</ScrollView>
		</GestureHandlerRootView>
	);
}
