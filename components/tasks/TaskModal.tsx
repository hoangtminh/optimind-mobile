import { Task, useTask } from "@/contexts/TaskContext";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
	Calendar,
	CheckCircle2,
	Circle,
	Clock,
	Edit,
	ListPlus,
	X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	TouchableOpacity,
} from "react-native";
import {
	Button,
	Input,
	Text,
	TextArea,
	View,
	XStack,
	YStack,
	styled,
} from "tamagui";
import { Theme } from "@/constants/Theme";
import { toast } from "@/components/common/Toast";

interface TaskModalProps {
	visible: boolean;
	onClose: () => void;
	projectId: string;
	task?: Task | null; // If provided, we are in edit mode
	onTaskSaved?: () => void;
}

const StyledInput = styled(Input, {
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	height: 48,
	borderRadius: 6,
	fontSize: "$4",
	color: Theme.text,
	focusStyle: {
		borderColor: Theme.primary,
		backgroundColor: Theme.surface,
	},
});

const StyledTextArea = styled(TextArea, {
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	borderRadius: 6,
	fontSize: "$4",
	color: Theme.text,
	focusStyle: {
		borderColor: Theme.primary,
		backgroundColor: Theme.surface,
	},
});

export default function TaskModal({
	visible,
	onClose,
	projectId,
	task,
	onTaskSaved,
}: TaskModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
	const [status, setStatus] = useState<"todo" | "in_progress" | "complete">(
		"todo",
	);
	const [dueDate, setDueDate] = useState<Date | null>(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [loading, setLoading] = useState(false);

	const { createTask, updateTask } = useTask();

	useEffect(() => {
		if (task) {
			setTitle(task.title || "");
			setDescription(task.note || "");
			setPriority(task.priority || "low");
			setStatus((task.status as any) || "todo");
			setDueDate(task.dueDate ? new Date(task.dueDate) : null);
		} else {
			resetForm();
		}
	}, [task, visible]);

	const resetForm = () => {
		setTitle("");
		setDescription("");
		setPriority("low");
		setStatus("todo");
		setDueDate(null);
	};

	const handleDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date,
	) => {
		setShowDatePicker(Platform.OS === "ios");
		if (selectedDate) {
			const current = dueDate ? new Date(dueDate) : new Date();
			current.setFullYear(
				selectedDate.getFullYear(),
				selectedDate.getMonth(),
				selectedDate.getDate(),
			);
			setDueDate(current);
		}
	};

	const handleTimeChange = (
		event: DateTimePickerEvent,
		selectedTime?: Date,
	) => {
		setShowTimePicker(Platform.OS === "ios");
		if (selectedTime) {
			const current = dueDate ? new Date(dueDate) : new Date();
			current.setHours(
				selectedTime.getHours(),
				selectedTime.getMinutes(),
				0,
				0,
			);
			setDueDate(current);
		}
	};

	const formatDateOnly = (date: Date) => {
		return date.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTimeOnly = (date: Date) => {
		return date.toLocaleTimeString(undefined, {
			hour: "2-digit",
			minute: "2-digit",
		});
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

	const handleSaveTask = async () => {
		if (!title.trim()) {
			toast.error("Task title is required");
			return;
		}

		setLoading(true);

		try {
			const taskData = {
				title: title.trim(),
				note: description.trim(),
				priority,
				status,
				dueDate: dueDate ? dueDate.toISOString() : undefined,
				projectId,
				tag: [],
				repeated: "none",
			};

			if (task) {
				await updateTask(task.id, taskData);
				toast.success("Task updated successfully");
			} else {
				await createTask(taskData);
				toast.success("Task created successfully");
			}

			handleClose();
			if (onTaskSaved) onTaskSaved();
		} catch (err) {
			const rawMsg = err instanceof Error ? err.message : "An error occurred";
			console.error("Task action failed:", err);
			toast.error(cleanErrorMessage(rawMsg));
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View
					flex={1}
					justifyContent="flex-end"
					backgroundColor="rgba(29, 27, 32, 0.4)"
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(4px)" } as any)
							: {}
					}
				>
					<YStack
						backgroundColor={Theme.surface}
						width="100%"
						borderTopLeftRadius={12}
						borderTopRightRadius={12}
						borderWidth={1}
						borderColor={Theme.border}
						padding="$5"
						paddingBottom="$8"
						gap="$4"
					>
						<View
							width={32}
							height={4}
							backgroundColor={Theme.border}
							borderRadius={2}
							alignSelf="center"
							marginBottom="$1"
						/>

						<XStack
							justifyContent="space-between"
							alignItems="center"
						>
							<XStack gap="$3" alignItems="center">
								<View
									backgroundColor={Theme.primaryPastel}
									padding="$2.5"
									borderRadius={6}
								>
									{task ? (
										<Edit size={18} color={Theme.primary} />
									) : (
										<ListPlus size={18} color={Theme.primary} />
									)}
								</View>
								<YStack>
									<Text
										fontSize="$5"
										fontWeight="700"
										color={Theme.text}
									>
										{task ? "Edit Task" : "New Task"}
									</Text>
									<Text fontSize="$2" color={Theme.textMuted}>
										{task
											? "Update your task details"
											: "Add a step to your project"}
									</Text>
								</YStack>
							</XStack>
							<Button
								circular
								size="$3"
								chromeless
								icon={<X size={18} color={Theme.textMuted} />}
								onPress={handleClose}
								pressStyle={{ backgroundColor: Theme.background }}
							/>
						</XStack>

						<YStack gap="$3">
							{/* Errors are handled via Toast alerts */}

							<YStack gap="$1.5">
								<Text
									fontSize="$3"
									color={Theme.text}
									fontWeight="600"
									marginLeft="$1"
								>
									Task Title
								</Text>
								<StyledInput
									placeholder="What needs to be done?"
									placeholderTextColor={Theme.textMuted as any}
									value={title}
									onChangeText={setTitle}
								/>
							</YStack>

							<YStack gap="$1.5">
								<Text
									fontSize="$3"
									color={Theme.text}
									fontWeight="600"
									marginLeft="$1"
								>
									Notes (Optional)
								</Text>
								<StyledTextArea
									placeholder="Add more details..."
									placeholderTextColor={Theme.textMuted as any}
									numberOfLines={3}
									height={80}
									textAlignVertical="top"
									paddingTop="$3"
									value={description}
									onChangeText={setDescription}
								/>
							</YStack>

							<YStack gap="$1.5">
								<Text
									fontSize="$3"
									color={Theme.text}
									fontWeight="600"
									marginLeft="$1"
								>
									Priority
								</Text>
								<XStack
									backgroundColor={Theme.background}
									borderRadius={6}
									height={48}
									alignItems="center"
									paddingHorizontal="$3"
									justifyContent="space-between"
									borderWidth={1}
									borderColor={Theme.border}
								>
									<XStack gap="$1">
										{["low", "medium", "high"].map(
											(p) => (
												<View
													key={p}
													onPress={() =>
														setPriority(
															p as any,
														)
													}
													pressStyle={{
														scale: 0.95,
													}}
													padding="$1"
												>
													<View
														width={18}
														height={18}
														borderRadius={9}
														backgroundColor={
															priority === p
																? Theme.primary
																: Theme.border
														}
														borderWidth={
															priority === p
																? 0
																: 1
														}
														borderColor={Theme.border}
													/>
												</View>
											),
										)}
									</XStack>
									<Text
										color={Theme.text}
										fontWeight="600"
										fontSize="$3"
										textTransform="capitalize"
									>
										{priority}
									</Text>
								</XStack>
							</YStack>

							<XStack gap="$4">
								<YStack flex={1} gap="$1.5">
									<Text
										fontSize="$3"
										color={Theme.text}
										fontWeight="600"
										marginLeft="$1"
									>
										Due Date
									</Text>
									<TouchableOpacity
										onPress={() => setShowDatePicker(true)}
										activeOpacity={0.7}
									>
										<XStack
											backgroundColor={Theme.background}
											borderRadius={6}
											height={48}
											alignItems="center"
											paddingHorizontal="$3"
											borderWidth={1}
											borderColor={Theme.border}
										>
											<Calendar
												size={16}
												color={Theme.primary}
												style={{ marginRight: 6 }}
											/>
											<Text
												flex={1}
												color={
													dueDate
														? Theme.text
														: Theme.textMuted
												}
												fontSize="$3"
												fontWeight="600"
											>
												{dueDate
													? formatDateOnly(dueDate)
													: "Pick Date"}
											</Text>
										</XStack>
									</TouchableOpacity>
									{showDatePicker && (
										<DateTimePicker
											value={dueDate || new Date()}
											mode="date"
											display={
												Platform.OS === "ios"
													? "spinner"
													: "default"
											}
											onChange={handleDateChange}
											minimumDate={new Date()}
										/>
									)}
								</YStack>

								<YStack flex={1} gap="$1.5">
									<Text
										fontSize="$3"
										color={Theme.text}
										fontWeight="600"
										marginLeft="$1"
									>
										Time
									</Text>
									<TouchableOpacity
										onPress={() => setShowTimePicker(true)}
										activeOpacity={0.7}
									>
										<XStack
											backgroundColor={Theme.background}
											borderRadius={6}
											height={48}
											alignItems="center"
											paddingHorizontal="$3"
											borderWidth={1}
											borderColor={Theme.border}
										>
											<Clock
												size={16}
												color={Theme.primary}
												style={{ marginRight: 6 }}
											/>
											<Text
												flex={1}
												color={
													dueDate
														? Theme.text
														: Theme.textMuted
												}
												fontSize="$3"
												fontWeight="600"
											>
												{dueDate
													? formatTimeOnly(dueDate)
													: "Pick Time"}
											</Text>
										</XStack>
									</TouchableOpacity>
									{showTimePicker && (
										<DateTimePicker
											value={dueDate || new Date()}
											mode="time"
											display={
												Platform.OS === "ios"
													? "spinner"
													: "default"
											}
											onChange={handleTimeChange}
										/>
									)}
								</YStack>
							</XStack>

							<YStack gap="$1.5">
								<Text
									fontSize="$3"
									color={Theme.text}
									fontWeight="600"
									marginLeft="$1"
								>
									Status
								</Text>
								<XStack gap="$2" flexWrap="wrap">
									{[
										{
											id: "todo",
											label: "To do",
											icon: Circle,
										},
										{
											id: "in_progress",
											label: "On going",
											icon: Clock,
										},
										{
											id: "complete",
											label: "Complete",
											icon: CheckCircle2,
										},
									].map((s) => (
										<Button
											key={s.id}
											flex={1}
											height={40}
											borderRadius={6}
											backgroundColor={
												status === s.id
													? Theme.primaryPastel
													: Theme.background
											}
											borderColor={
												status === s.id
													? Theme.primary
													: Theme.border
											}
											borderWidth={status === s.id ? 1.5 : 1}
											onPress={() =>
												setStatus(s.id as any)
											}
											pressStyle={{ scale: 0.98 }}
										>
											<XStack
												gap="$2"
												alignItems="center"
											>
												<s.icon
													size={14}
													color={
														status === s.id
															? Theme.primary
															: Theme.textMuted
													}
												/>
												<Text
													fontSize="$2"
													fontWeight="700"
													color={
														status === s.id
															? Theme.primary
															: Theme.textMuted
													}
												>
													{s.label}
												</Text>
											</XStack>
										</Button>
									))}
								</XStack>
							</YStack>
						</YStack>

						<XStack gap="$3" marginTop="$3">
							<Button
								flex={1}
								height={48}
								borderRadius={6}
								backgroundColor={Theme.background}
								onPress={handleClose}
								pressStyle={{
									backgroundColor: Theme.border,
									scale: 0.98,
								}}
							>
								<Text color={Theme.textMuted} fontWeight="600" fontSize="$4">
									Cancel
								</Text>
							</Button>

							<Button
								flex={2}
								height={48}
								borderRadius={6}
								backgroundColor={Theme.primary}
								onPress={handleSaveTask}
								disabled={loading || !title.trim()}
								opacity={loading || !title.trim() ? 0.55 : 1}
								pressStyle={{
									backgroundColor: Theme.primary,
									opacity: 0.9,
									scale: 0.98,
								}}
							>
								<Text
									color={Theme.primaryText}
									fontWeight="700"
									fontSize="$4"
								>
									{loading
										? task
											? "Updating..."
											: "Creating..."
										: task
											? "Update Task"
											: "Create Task"}
								</Text>
							</Button>
						</XStack>
					</YStack>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
