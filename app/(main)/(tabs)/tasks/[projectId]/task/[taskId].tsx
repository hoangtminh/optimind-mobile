import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { MOCK_TASKS } from "..";

export default function TaskDetailsScreen() {
	const { taskId, projectId } = useLocalSearchParams();
	const router = useRouter();

	const task = MOCK_TASKS.find((t) => t.id === taskId) || MOCK_TASKS[0];

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor="$background">
				<XStack
					height={64}
					alignItems="center"
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
						marginLeft="$2"
					>
						Task Details
					</Text>
				</XStack>

				<YStack padding="$6" gap="$4">
					<View
						alignSelf="flex-start"
						backgroundColor="$primary_container"
						paddingHorizontal="$3"
						paddingVertical="$1"
						borderRadius="$4"
					>
						<Text color="$primary" fontWeight="600" fontSize="$2">
							{task.status.replace("_", " ").toUpperCase()}
						</Text>
					</View>

					<Text fontSize="$7" fontWeight="800" color="$on_surface">
						{task.title}
					</Text>

					<XStack gap="$4" flexWrap="wrap">
						<YStack gap="$1">
							<Text
								fontSize={12}
								color="$on_surface_variant"
								fontWeight="600"
								textTransform="uppercase"
							>
								Priority
							</Text>
							<Text
								fontSize="$3"
								color="$on_surface"
								textTransform="capitalize"
							>
								{task.priority}
							</Text>
						</YStack>
						<YStack gap="$1">
							<Text
								fontSize={12}
								color="$on_surface_variant"
								fontWeight="600"
								textTransform="uppercase"
							>
								Due Date
							</Text>
							<Text fontSize="$3" color="$on_surface">
								{task.due_date
									? new Date(
											task.due_date,
										).toLocaleDateString()
									: "No date"}
							</Text>
						</YStack>
					</XStack>

					<YStack
						backgroundColor="$surface_container_lowest"
						padding="$4"
						borderRadius="$4"
						borderWidth={1}
						borderColor="$surface_variant"
						gap="$2"
					>
						<Text fontWeight="600" color="$on_surface_variant">
							Notes & Description
						</Text>
						<Text color="$on_surface">
							{task.note || "No additional notes provided."}
						</Text>
					</YStack>

					{task.tag && task.tag.length > 0 && (
						<XStack gap="$2" flexWrap="wrap">
							{task.tag.map((t) => (
								<View
									key={t}
									backgroundColor="$surface_container_high"
									paddingHorizontal="$3"
									paddingVertical="$1"
									borderRadius="$full"
								>
									<Text
										fontSize={12}
										color="$on_surface_variant"
									>
										#{t}
									</Text>
								</View>
							))}
						</XStack>
					)}

					<Button size="$4" backgroundColor="$primary" marginTop="$4">
						<Button.Text fontWeight="600">
							{task.status === "complete"
								? "Mark as Incomplete"
								: "Mark as Complete"}
						</Button.Text>
					</Button>
				</YStack>
			</YStack>
		</SafeAreaView>
	);
}
