import { useLocalSearchParams, useRouter } from "expo-router";
import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	Info,
	LayoutGrid,
	List,
	MoreVertical,
} from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, styled, Text, Theme, View, XStack, YStack } from "tamagui";
import { MOCK_PROJECTS } from "..";

const TaskCard = styled(YStack, {
	padding: "$4",
	borderRadius: "$5", // Slightly more rounded
	backgroundColor: "$surface_container_lowest",
	borderWidth: 1,
	borderColor: "$surface_variant",
	shadowColor: "$on_surface",
	shadowRadius: 10,
	shadowOpacity: 0.04,
	shadowOffset: { width: 0, height: 4 },
	pressStyle: { scale: 0.98, backgroundColor: "$surface_container_low" },
});

export const MOCK_TASKS = [
	{
		id: "t1",
		title: "Review literature on entanglement",
		note: "Read the latest papers from Nature Physics and summarize key findings.",
		status: "in_progress",
		priority: "high",
		due_date: "2023-11-01T23:59:59Z",
		tag: ["research", "reading"],
		project_id: "p1",
	},
	{
		id: "t2",
		title: "Draft introduction chapter",
		note: "Write the first draft focusing on the historical context.",
		status: "todo",
		priority: "medium",
		due_date: "2023-11-15T23:59:59Z",
		tag: ["writing"],
		project_id: "p1",
	},
	{
		id: "t3",
		title: "Compile dataset",
		note: "Gather all experimental data into a single clean CSV file.",
		status: "complete",
		priority: "low",
		due_date: "2023-10-10T23:59:59Z",
		tag: ["data"],
		project_id: "p1",
	},
];

const KANBAN_COLUMNS = [
	{ label: "To Do", value: "todo" },
	{ label: "In Progress", value: "in_progress" },
	{ label: "Review", value: "review" },
	{ label: "Done", value: "complete" },
];

export default function TaskScreen() {
	const { projectId } = useLocalSearchParams();
	const router = useRouter();
	const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

	const project =
		MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
	const isWeb = Platform.OS === "web";

	// Helper for Task Card priority colors
	const getPriorityStyles = (priority: string) => {
		switch (priority) {
			case "high":
				return { bg: "#ffdad6", text: "#93000a", border: "#ba1a1a" }; // Error scheme
			case "medium":
				return { bg: "#ffdcc6", text: "#723600", border: "#b75b00" }; // Tertiary/Warning scheme
			case "low":
				return { bg: "#d8e2ff", text: "#001a42", border: "#0058be" }; // Primary scheme
			default:
				return { bg: "#e7e8ea", text: "#424754", border: "#727785" }; // Outline/Surface scheme
		}
	};

	// Enhanced Task Item Renderer
	const renderTaskItem = (item: (typeof MOCK_TASKS)[0]) => {
		const isDone = item.status === "complete";
		const styles = getPriorityStyles(item.priority);

		return (
			<TaskCard
				key={item.id}
				borderLeftWidth={4}
				borderLeftColor={isDone ? "$secondary" : styles.border}
				opacity={isDone ? 0.65 : 1}
				onPress={() =>
					router.push(
						`/(main)/(tabs)/tasks/${projectId}/task/${item.id}`,
					)
				}
			>
				{/* Top Row: Badges & Options */}
				<XStack
					justifyContent="space-between"
					alignItems="flex-start"
					marginBottom="$3"
				>
					<XStack gap="$2" alignItems="center">
						{isDone && <CheckCircle2 size={16} color="#006c49" />}
						<View
							backgroundColor={styles.bg}
							paddingHorizontal="$2"
							paddingVertical="$1"
							borderRadius="$2"
						>
							<Text
								fontSize={10}
								fontWeight="800"
								textTransform="uppercase"
								letterSpacing={0.5}
								color={styles.text}
							>
								{item.priority} Priority
							</Text>
						</View>
					</XStack>
					<MoreVertical size={18} color="#727785" />
				</XStack>

				{/* Title and Description */}
				<Text
					fontWeight="700"
					fontSize="$4"
					color="$on_surface"
					marginBottom="$2"
					textDecorationLine={isDone ? "line-through" : "none"}
				>
					{item.title}
				</Text>
				{item.note && (
					<Text
						fontSize="$3"
						color="$on_surface_variant"
						numberOfLines={2}
						marginBottom="$4"
					>
						{item.note}
					</Text>
				)}

				{/* Bottom Row: Dates & Tags */}
				<XStack
					justifyContent="space-between"
					alignItems="center"
					marginTop="auto"
				>
					<XStack alignItems="center" gap="$1.5">
						<Calendar size={14} color="#727785" />
						<Text
							fontSize={11}
							fontWeight="600"
							color="$on_surface_variant"
						>
							{item.due_date
								? new Date(item.due_date).toLocaleDateString(
										undefined,
										{ month: "short", day: "numeric" },
									)
								: "No date"}
						</Text>
					</XStack>
					{item.tag && item.tag.length > 0 && (
						<View
							backgroundColor="$surface_container"
							paddingHorizontal="$2"
							paddingVertical="$1"
							borderRadius="$full"
						>
							<Text
								fontSize={10}
								fontWeight="700"
								color="$on_surface_variant"
								textTransform="uppercase"
							>
								#{item.tag[0]}
							</Text>
						</View>
					)}
				</XStack>
			</TaskCard>
		);
	};

	const renderContent = () => (
		<YStack flex={1}>
			{/* Custom Header */}
			<XStack
				height={64}
				alignItems="center"
				justifyContent="space-between"
				paddingHorizontal="$2"
				borderBottomWidth={1}
				borderBottomColor="$surface_variant"
			>
				<Button
					circular
					chromeless
					icon={<ArrowLeft size={24} color="#0058be" />}
					onPress={() => router.back()}
				/>
				<Text
					fontSize="$5"
					fontWeight="700"
					color="$on_surface"
					numberOfLines={1}
					flex={1}
					textAlign="center"
					paddingHorizontal="$2"
				>
					{project.name}
				</Text>
				<Button
					circular
					chromeless
					icon={<Info size={24} color="#0058be" />}
					onPress={() =>
						router.push(`/(main)/(tabs)/tasks/${projectId}/details`)
					}
				/>
			</XStack>

			{/* View Toggle (List vs Kanban) */}
			<XStack padding="$4" gap="$2">
				<Theme name={viewMode === "list" ? "active" : null}>
					<Button
						flex={1}
						size="$3"
						backgroundColor={
							viewMode === "list"
								? "$primary_container"
								: "$surface_container_low"
						}
						icon={<List size={18} />}
						onPress={() => setViewMode("list")}
					>
						List View
					</Button>
				</Theme>
				<Theme name={viewMode === "kanban" ? "active" : null}>
					<Button
						flex={1}
						size="$3"
						backgroundColor={
							viewMode === "kanban"
								? "$primary_container"
								: "$surface_container_low"
						}
						icon={<LayoutGrid size={18} />}
						onPress={() => setViewMode("kanban")}
					>
						Kanban
					</Button>
				</Theme>
			</XStack>

			{/* Task List */}
			{viewMode === "list" ? (
				<FlatList
					data={MOCK_TASKS}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16 }}
					ItemSeparatorComponent={() => <View height={12} />}
					renderItem={({ item }) => renderTaskItem(item)}
				/>
			) : (
				<ScrollView
					horizontal
					contentContainerStyle={{ padding: 16, gap: 24 }}
				>
					{/* Basic Kanban Placeholder */}
					{KANBAN_COLUMNS.map((col) => {
						const columnTasks = MOCK_TASKS.filter(
							(t) => t.status === col.value,
						);
						return (
							<YStack key={col.value} width={300} gap="$3">
								{/* Column Header */}
								<XStack
									alignItems="center"
									justifyContent="space-between"
									paddingHorizontal="$2"
									marginBottom="$2"
								>
									<XStack alignItems="center" gap="$2">
										<Text
											fontWeight="800"
											fontSize="$3"
											textTransform="uppercase"
											color="$outline"
											letterSpacing={1}
										>
											{col.label}
										</Text>
										<View
											backgroundColor="$surface_container_highest"
											paddingHorizontal="$2"
											paddingVertical="$1"
											borderRadius="$full"
											minWidth={24}
											alignItems="center"
										>
											<Text
												fontSize={11}
												fontWeight="800"
												color="$on_surface_variant"
											>
												{columnTasks.length}
											</Text>
										</View>
									</XStack>
								</XStack>

								{/* Column Cards */}
								<YStack gap="$3">
									{columnTasks.map((task) =>
										renderTaskItem(task),
									)}
								</YStack>
							</YStack>
						);
					})}
				</ScrollView>
			)}
		</YStack>
	);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			{isWeb ? (
				<XStack flex={1} backgroundColor="$background">
					{/* Web Split View: Projects Left, Tasks Right */}
					<YStack
						width={320}
						borderRightWidth={1}
						borderRightColor="$surface_variant"
						backgroundColor="$surface_container_lowest"
					>
						<XStack
							height={64}
							alignItems="center"
							paddingHorizontal="$4"
							borderBottomWidth={1}
							borderBottomColor="$surface_variant"
						>
							<Text fontSize="$5" fontWeight="700">
								Projects
							</Text>
						</XStack>
						<FlatList
							data={MOCK_PROJECTS}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() =>
										router.replace(
											`/(main)/(tabs)/tasks/${item.id}`,
										)
									}
									style={{
										padding: 16,
										backgroundColor:
											item.id === projectId
												? "#f0f4ff"
												: "transparent",
									}}
								>
									<Text
										fontWeight={
											item.id === projectId
												? "700"
												: "500"
										}
										color={
											item.id === projectId
												? "$primary"
												: "$on_surface"
										}
									>
										{item.name}
									</Text>
								</TouchableOpacity>
							)}
						/>
					</YStack>
					<YStack flex={1}>{renderContent()}</YStack>
				</XStack>
			) : (
				// Mobile Standard View
				<YStack flex={1} backgroundColor="$background">
					{renderContent()}
				</YStack>
			)}
		</SafeAreaView>
	);
}
