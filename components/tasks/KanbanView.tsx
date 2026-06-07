import { Task } from "@/contexts/TaskContext";
import { TaskStatus } from "@/lib/types/task";
import { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, View as RNView } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Portal, Text, View, XStack, YStack } from "tamagui";
import { scheduleOnRN } from "react-native-worklets";
import TaskItem from "./TaskItem";
import { Theme } from "@/constants/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_WIDTH = SCREEN_WIDTH * 0.85;
const COLUMN_GAP = 12;

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
	onDragStart,
	onDragUpdate,
	onDragEnd,
	columnIndex,
	scrollX,
}: {
	task: Task;
	projectId: string;
	onToggleTask: any;
	onEditTask: any;
	onDragStart: (task: Task, event: any) => void;
	onDragUpdate: (absoluteX: number) => void;
	onDragEnd: (absoluteX: number, task: Task, success: boolean) => void;
	columnIndex: number;
	scrollX: SharedValue<number>;
}) => {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const contextX = useSharedValue(0);
	const contextY = useSharedValue(0);
	const startScrollX = useSharedValue(0);
	const isDragging = useSharedValue(false);
	const lastUpdateTime = useSharedValue(0);

	const panGesture = useMemo(() => {
		return Gesture.Pan()
			.onStart((event) => {
				contextX.value = translateX.value;
				contextY.value = translateY.value;
				startScrollX.value = scrollX.value;
				isDragging.value = true;
				
				scheduleOnRN(onDragStart, task, {
					x: event.x,
					y: event.y,
					absoluteX: event.absoluteX,
					absoluteY: event.absoluteY,
				});
			})
			.onUpdate((event) => {
				// Adjust for ScrollView scroll delta since drag started to prevent task card drifting
				translateX.value = contextX.value + event.translationX + (scrollX.value - startScrollX.value);
				translateY.value = contextY.value + event.translationY;
				
				// Throttle updates to the JS thread to prevent lag
				const now = Date.now();
				if (now - lastUpdateTime.value > 100) {
					lastUpdateTime.value = now;
					scheduleOnRN(onDragUpdate, event.absoluteX);
				}
			})
			.onFinalize((event, success) => {
				isDragging.value = false;
				scheduleOnRN(onDragEnd, event.absoluteX, task, success);
				
				// Spring back to local (0, 0) since parent state will update
				translateX.value = withSpring(0);
				translateY.value = withSpring(0);
			});
	}, [
		task,
		columnIndex,
		onDragStart,
		onDragUpdate,
		onDragEnd,
		scrollX,
	]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ scale: withSpring(isDragging.value ? 1.05 : 1) },
			],
			zIndex: isDragging.value ? 1000 : 1,
			elevation: isDragging.value ? 10 : 0,
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
	const scrollViewRef = useRef<ScrollView>(null);
	const lastScrollTime = useRef(0);
	const lastAbsoluteX = useRef(0);

	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [hoverColumnIndex, setHoverColumnIndex] = useState<number | null>(null);

	const scrollX = useSharedValue(0);

	const handleScroll = (event: any) => {
		scrollX.value = event.nativeEvent.contentOffset.x;
		
		// If we are currently dragging a task, recalculate target column index dynamically
		// as the container scrolls under the still finger
		if (activeTask) {
			const totalX = lastAbsoluteX.current - 16 + scrollX.value;
			let targetIndex = Math.round(totalX / (COLUMN_WIDTH + COLUMN_GAP));
			targetIndex = Math.max(0, Math.min(2, targetIndex));
			setHoverColumnIndex(targetIndex);
		}
	};

	const checkAutoScroll = useCallback((absoluteX: number) => {
		const now = Date.now();
		if (now - lastScrollTime.current < 800) return;

		const edgeThreshold = 60;
		const currentColumn = Math.round(
			scrollX.value / (COLUMN_WIDTH + COLUMN_GAP),
		);

		if (absoluteX > SCREEN_WIDTH - edgeThreshold) {
			if (currentColumn < 2) {
				const nextX = (currentColumn + 1) * (COLUMN_WIDTH + COLUMN_GAP);
				scrollViewRef.current?.scrollTo({ x: nextX, animated: true });
				lastScrollTime.current = now;
			}
		} else if (absoluteX < edgeThreshold) {
			if (currentColumn > 0) {
				const prevX = (currentColumn - 1) * (COLUMN_WIDTH + COLUMN_GAP);
				scrollViewRef.current?.scrollTo({ x: prevX, animated: true });
				lastScrollTime.current = now;
			}
		}
	}, []);

	const handleDragStart = useCallback((task: Task, event: any) => {
		lastAbsoluteX.current = event.absoluteX;
		setActiveTask(task);
		const statuses = ["todo", "in_progress", "complete"];
		const idx = statuses.indexOf(task.status);
		setHoverColumnIndex(idx >= 0 ? idx : 0);
	}, []);

	const handleDragUpdate = useCallback((absoluteX: number) => {
		lastAbsoluteX.current = absoluteX;
		const totalX = absoluteX - 16 + scrollX.value;
		let targetIndex = Math.round(totalX / (COLUMN_WIDTH + COLUMN_GAP));
		targetIndex = Math.max(0, Math.min(2, targetIndex));
		setHoverColumnIndex(targetIndex);

		checkAutoScroll(absoluteX);
	}, [checkAutoScroll]);

	const handleDragEnd = useCallback((absoluteX: number, task: Task, success: boolean) => {
		if (success) {
			const totalX = absoluteX - 16 + scrollX.value;
			let targetIndex = Math.round(totalX / (COLUMN_WIDTH + COLUMN_GAP));
			targetIndex = Math.max(0, Math.min(2, targetIndex));

			const statuses = ["todo", "in_progress", "complete"];
			const newStatus = statuses[targetIndex];

			if (newStatus !== task.status) {
				onStatusUpdate(task.id, newStatus as any);
			}
		}

		setActiveTask(null);
		setHoverColumnIndex(null);
	}, [onStatusUpdate]);

	const todoTasks = tasks.filter((t) => t.status === "todo");
	const ongoingTasks = tasks.filter((t) => t.status === "in_progress");
	const completedTasks = tasks.filter((t) => t.status === "complete");

	const columns = [
		{
			id: "todo",
			title: "To do",
			tasks: todoTasks,
			color: "#4B5563",
			bg: "#F3F4F6",
			borderColor: "#D1D5DB",
		},
		{
			id: "in_progress",
			title: "On going",
			tasks: ongoingTasks,
			color: "#4F46E5",
			bg: "#EEF2FF",
			borderColor: "#C7D2FE",
		},
		{
			id: "complete",
			title: "Completed",
			tasks: completedTasks,
			color: "#15803D",
			bg: "#DCFCE7",
			borderColor: "#86EFAC",
		},
	];

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<RNView style={{ flex: 1, overflow: "visible" }}>
				<ScrollView
					horizontal
					ref={scrollViewRef}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					showsHorizontalScrollIndicator={false}
					snapToInterval={COLUMN_WIDTH + COLUMN_GAP}
					decelerationRate="fast"
					contentContainerStyle={{
						paddingHorizontal: 16,
					}}
					scrollEnabled={!activeTask}
					style={{ overflow: "visible" }}
				>
					<XStack gap={COLUMN_GAP} paddingVertical="$3" style={{ overflow: "visible" }}>
						{columns.map((col, idx) => (
							<YStack
								key={col.id}
								width={COLUMN_WIDTH}
								gap="$3"
								backgroundColor={Theme.surfaceMuted}
								borderWidth={1}
								borderColor={Theme.border}
								borderTopWidth={4}
								borderTopColor={col.color}
								borderRadius={8}
								padding="$4"
								minHeight={500}
								zIndex={activeTask?.id && col.tasks.some(t => t.id === activeTask.id) ? 100 : 1}
								style={{ overflow: "visible" }}
							>
								<XStack
									justifyContent="space-between"
									alignItems="center"
									paddingBottom="$2"
									borderBottomWidth={1}
									borderBottomColor={Theme.border}
								>
									<XStack alignItems="center" gap="$2">
										<Text
											fontWeight="800"
											fontSize="$4"
											color={col.color}
											letterSpacing={-0.3}
										>
											{col.title}
										</Text>
									</XStack>
									<View
										backgroundColor={col.bg}
										borderWidth={1}
										borderColor={col.borderColor}
										paddingHorizontal="$2.5"
										paddingVertical="$0.5"
										borderRadius={4}
									>
										<Text
											fontSize={11}
											fontWeight="800"
											color={col.color}
										>
											{col.tasks.length}
										</Text>
									</View>
								</XStack>

								<ScrollView
									showsVerticalScrollIndicator={false}
									contentContainerStyle={{
										paddingBottom: 20,
									}}
									scrollEnabled={!activeTask}
									style={{ overflow: "visible" }}
								>
									<YStack gap="$2.5" style={{ overflow: "visible" }}>
										{col.tasks.length > 0 ? (
											col.tasks.map((task) => (
												<DraggableTask
													key={task.id}
													task={task}
													projectId={projectId}
													onToggleTask={onToggleTask}
													onEditTask={onEditTask}
													onDragStart={handleDragStart}
													onDragUpdate={handleDragUpdate}
													onDragEnd={handleDragEnd}
													columnIndex={idx}
													scrollX={scrollX}
												/>
											))
										) : (
											!(activeTask && hoverColumnIndex === idx) && (
												<View
													height={120}
													borderRadius={8}
													borderStyle="dashed"
													borderWidth={1.5}
													borderColor={Theme.border}
													justifyContent="center"
													alignItems="center"
													opacity={0.7}
													backgroundColor={Theme.surface}
												>
													<Text
														color={Theme.textMuted}
														fontWeight="600"
														fontSize="$3"
													>
														No tasks here
													</Text>
												</View>
											)
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
			</RNView>
		</GestureHandlerRootView>
	);
}
