import { Task, useTask } from "@/contexts/TaskContext";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import {
	AlertCircle,
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

interface TaskModalProps {
	visible: boolean;
	onClose: () => void;
	projectId: string;
	task?: Task | null; // If provided, we are in edit mode
	onTaskSaved?: () => void;
}

const StyledInput = styled(Input, {
	backgroundColor: "#f8f2fa",
	borderWidth: 1.5,
	borderColor: "#f2ecf4",
	height: 52,
	borderRadius: 16,
	fontSize: "$4",
	focusStyle: {
		borderColor: "#6750A4",
		backgroundColor: "#ffffff",
	},
});

const StyledTextArea = styled(TextArea, {
	backgroundColor: "#f8f2fa",
	borderWidth: 1.5,
	borderColor: "#f2ecf4",
	borderRadius: 16,
	fontSize: "$4",
	focusStyle: {
		borderColor: "#6750A4",
		backgroundColor: "#ffffff",
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
	const [showPicker, setShowPicker] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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
		setError("");
	};

	const handleDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date,
	) => {
		setShowPicker(Platform.OS === "ios");
		if (selectedDate) {
			setDueDate(selectedDate);
		}
	};

	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const handleSaveTask = async () => {
		if (!title.trim()) {
			setError("Task title is required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const taskData = {
				title: title.trim(),
				note: description.trim(),
				priority,
				status,
				dueDate: dueDate ? formatDate(dueDate) : undefined,
				projectId,
				tag: [],
				repeated: "none",
			};

			if (task) {
				await updateTask(task.id, taskData);
			} else {
				await createTask(taskData);
			}

			handleClose();
			if (onTaskSaved) onTaskSaved();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
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
					backgroundColor="rgba(29, 27, 32, 0.6)"
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(12px)" } as any)
							: {}
					}
				>
					<YStack
						backgroundColor="white"
						width="100%"
						borderTopLeftRadius={32}
						borderTopRightRadius={32}
						padding="$6"
						paddingBottom="$10"
						shadowColor="#000"
						shadowRadius={30}
						shadowOpacity={0.2}
						gap="$5"
					>
						<View
							width={40}
							height={4}
							backgroundColor="#e0e0e0"
							borderRadius={2}
							alignSelf="center"
							marginBottom="$2"
						/>

						<XStack
							justifyContent="space-between"
							alignItems="center"
						>
							<XStack gap="$3" alignItems="center">
								<View
									backgroundColor="#e9ddff"
									padding="$2"
									borderRadius={12}
								>
									{task ? (
										<Edit size={24} color="#6750A4" />
									) : (
										<ListPlus size={24} color="#6750A4" />
									)}
								</View>
								<YStack>
									<Text
										fontSize="$6"
										fontWeight="800"
										color="#1d1b20"
									>
										{task ? "Edit Task" : "New Task"}
									</Text>
									<Text fontSize="$2" color="#7a7582">
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
								icon={<X size={20} color="#494551" />}
								onPress={handleClose}
								pressStyle={{ backgroundColor: "#f2ecf4" }}
							/>
						</XStack>

						<YStack gap="$4">
							{error ? (
								<XStack
									backgroundColor="#ffdad6"
									padding="$3"
									borderRadius={12}
									gap="$2"
									alignItems="center"
								>
									<AlertCircle size={18} color="#93000a" />
									<Text
										color="#93000a"
										fontSize="$2"
										fontWeight="600"
									>
										{error}
									</Text>
								</XStack>
							) : null}

							<YStack gap="$2">
								<Text
									fontSize="$3"
									color="#494551"
									fontWeight="700"
									marginLeft="$1"
								>
									Task Title
								</Text>
								<StyledInput
									placeholder="What needs to be done?"
									value={title}
									onChangeText={setTitle}
								/>
							</YStack>

							<YStack gap="$2">
								<Text
									fontSize="$3"
									color="#494551"
									fontWeight="700"
									marginLeft="$1"
								>
									Notes (Optional)
								</Text>
								<StyledTextArea
									placeholder="Add more details..."
									numberOfLines={3}
									height={100}
									textAlignVertical="top"
									paddingTop="$3"
									value={description}
									onChangeText={setDescription}
								/>
							</YStack>

							<XStack gap="$4">
								<YStack flex={1} gap="$2">
									<Text
										fontSize="$3"
										color="#494551"
										fontWeight="700"
										marginLeft="$1"
									>
										Priority
									</Text>
									<XStack
										backgroundColor="#f8f2fa"
										borderRadius={16}
										height={52}
										alignItems="center"
										paddingHorizontal="$3"
										justifyContent="space-between"
										borderWidth={1.5}
										borderColor="#f2ecf4"
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
															scale: 0.9,
														}}
														padding="$1"
													>
														<View
															width={24}
															height={24}
															borderRadius={12}
															backgroundColor={
																priority === p
																	? "#6750A4"
																	: "#cbc4d2"
															}
															borderWidth={
																priority === p
																	? 0
																	: 1
															}
															borderColor="#7a7582"
														/>
													</View>
												),
											)}
										</XStack>
										<Text
											color="#1d1b20"
											fontWeight="600"
											textTransform="capitalize"
										>
											{priority}
										</Text>
									</XStack>
								</YStack>

								<YStack flex={1} gap="$2">
									<Text
										fontSize="$3"
										color="#494551"
										fontWeight="700"
										marginLeft="$1"
									>
										Due Date
									</Text>
									<TouchableOpacity
										onPress={() => setShowPicker(true)}
										activeOpacity={0.7}
									>
										<XStack
											backgroundColor="#f8f2fa"
											borderRadius={16}
											height={52}
											alignItems="center"
											paddingHorizontal="$3"
											borderWidth={1.5}
											borderColor="#f2ecf4"
										>
											<Calendar
												size={18}
												color="#6750A4"
												style={{ marginRight: 8 }}
											/>
											<Text
												flex={1}
												color={
													dueDate
														? "#1d1b20"
														: "#7a7582"
												}
												fontSize="$3"
												fontWeight="600"
											>
												{dueDate
													? formatDate(dueDate)
													: "YYYY-MM-DD"}
											</Text>
										</XStack>
									</TouchableOpacity>
									{showPicker && (
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
							</XStack>

							<YStack gap="$2">
								<Text
									fontSize="$3"
									color="#494551"
									fontWeight="700"
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
											height={44}
											borderRadius={12}
											backgroundColor={
												status === s.id
													? "#e9ddff"
													: "#f8f2fa"
											}
											borderColor={
												status === s.id
													? "#6750A4"
													: "#f2ecf4"
											}
											borderWidth={1.5}
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
													size={16}
													color={
														status === s.id
															? "#6750A4"
															: "#7a7582"
													}
												/>
												<Text
													fontSize="$2"
													fontWeight="700"
													color={
														status === s.id
															? "#6750A4"
															: "#494551"
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

						<XStack gap="$3" marginTop="$2">
							<Button
								flex={1}
								height={56}
								borderRadius={16}
								backgroundColor="#f2ecf4"
								onPress={handleClose}
								pressStyle={{
									backgroundColor: "#e9ddff",
									scale: 0.98,
								}}
							>
								<Text color="#6750A4" fontWeight="700">
									Cancel
								</Text>
							</Button>

							<YStack flex={2}>
								<Button
									unstyled
									onPress={handleSaveTask}
									disabled={loading || !title.trim()}
									opacity={loading || !title.trim() ? 0.5 : 1}
								>
									<LinearGradient
										colors={["#6750A4", "#4F378A"]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										style={{
											height: 56,
											borderRadius: 16,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text
											color="white"
											fontWeight="800"
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
									</LinearGradient>
								</Button>
							</YStack>
						</XStack>
					</YStack>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
