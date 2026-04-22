import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Edit3, Plus } from "lucide-react-native";
import React from "react";
import { Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Text, View, XStack, YStack } from "tamagui";
import { MOCK_PROJECTS } from "../index";

const MOCK_TEAM = [
	{ id: "1", name: "Elena Vance", role: "Project Lead" },
	{ id: "2", name: "Marcus Thorne", role: "Head Researcher" },
	{ id: "3", name: "Sarah Jenkins", role: "Archivist" },
];

export default function ProjectDetailsScreen() {
	const { projectId } = useLocalSearchParams();
	const router = useRouter();
	const project =
		MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor="$background">
				<XStack
					height={64}
					alignItems="center"
					justifyContent="space-between"
					paddingHorizontal="$2"
					borderBottomWidth={1}
					borderBottomColor="$surface_variant"
					backgroundColor="rgba(248, 249, 251, 0.8)"
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(10px)" } as any)
							: {}
					}
					zIndex={10}
				>
					<Button
						circular
						chromeless
						icon={<ArrowLeft size={24} color="#0058be" />}
						onPress={() => router.back()}
					/>
					<Text fontSize="$5" fontWeight="700" color="$on_surface">
						Project Workspace
					</Text>
					<View width={44} />
				</XStack>

				<ScrollView style={{ flex: 1 }}>
					<YStack
						padding="$6"
						gap="$6"
						maxWidth={1024}
						alignSelf="center"
						width="100%"
						paddingBottom="$10"
					>
						{/* Identity */}
						<YStack gap="$4" marginBottom="$6">
							<XStack
								justifyContent="space-between"
								alignItems="flex-end"
								flexWrap="wrap"
								gap="$4"
							>
								<YStack gap="$2" flex={1} minWidth={250}>
									<Text
										color="$primary"
										fontWeight="800"
										textTransform="uppercase"
										letterSpacing={1}
										fontSize={12}
									>
										Project Archive
									</Text>
									<Text
										fontSize={40}
										fontWeight="800"
										color="$on_surface"
										letterSpacing={-1}
									>
										{project.name}
									</Text>
									<Text
										fontSize="$4"
										color="$on_surface_variant"
										lineHeight={24}
										maxWidth={600}
										marginTop="$2"
									>
										{project.description}
									</Text>
								</YStack>
								<Button
									backgroundColor="$surface_container_high"
									pressStyle={{
										backgroundColor:
											"$surface_container_highest",
									}}
									borderRadius="$4"
									icon={<Edit3 size={16} />}
								>
									<Text fontWeight="600" color="$on_surface">
										Edit Details
									</Text>
								</Button>
							</XStack>
						</YStack>

						{/* Bento Grid */}
						<XStack flexWrap="wrap" gap="$6" marginBottom="$8">
							{/* Timeline */}
							<YStack
								flex={1}
								minWidth={280}
								backgroundColor="$surface_container_low"
								padding="$6"
								borderRadius={24}
								justifyContent="space-between"
							>
								<YStack>
									<Text
										fontSize="$3"
										color="$outline"
										fontWeight="600"
										textTransform="uppercase"
										letterSpacing={0.5}
										marginBottom="$5"
									>
										Timeline
									</Text>
									<YStack gap="$4">
										<YStack>
											<Text
												fontSize={12}
												color="$on_surface_variant"
												fontWeight="500"
												marginBottom="$1"
											>
												Created on
											</Text>
											<Text
												fontSize="$5"
												fontWeight="700"
												color="$on_surface"
											>
												{project.createdAt
													? new Date(
															project.createdAt,
														).toLocaleDateString(
															undefined,
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)
													: "N/A"}
											</Text>
										</YStack>
										<YStack>
											<Text
												fontSize={12}
												color="$on_surface_variant"
												fontWeight="500"
												marginBottom="$1"
											>
												Last Updated
											</Text>
											<Text
												fontSize="$5"
												fontWeight="700"
												color="$on_surface"
											>
												{project.updatedAt
													? new Date(
															project.updatedAt,
														).toLocaleDateString(
															undefined,
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)
													: "N/A"}
											</Text>
										</YStack>
									</YStack>
								</YStack>

								<YStack
									marginTop="$8"
									paddingTop="$6"
									borderTopWidth={1}
									borderTopColor="rgba(0,0,0,0.05)"
								>
									<View
										width="100%"
										height={8}
										backgroundColor="$surface_container_highest"
										borderRadius="$full"
										overflow="hidden"
									>
										<View
											height="100%"
											backgroundColor="$secondary"
											width="65%"
											borderRadius="$full"
										/>
									</View>
									<Text
										fontSize={12}
										color="$secondary"
										fontWeight="700"
										marginTop="$2"
									>
										65% Progress
									</Text>
								</YStack>
							</YStack>
						</XStack>

						{/* Members */}
						<YStack
							flex={2}
							minWidth={300}
							backgroundColor="$surface_container_lowest"
							padding="$6"
							borderRadius={24}
							borderWidth={1}
							borderColor="rgba(0,0,0,0.05)"
						>
							<XStack
								justifyContent="space-between"
								alignItems="center"
								marginBottom="$6"
							>
								<Text
									fontSize="$3"
									color="$outline"
									fontWeight="600"
									textTransform="uppercase"
									letterSpacing={0.5}
								>
									Project Team
								</Text>
								<Text
									color="$primary"
									fontWeight="700"
									fontSize="$3"
									cursor="pointer"
								>
									Manage Team
								</Text>
							</XStack>

							<XStack flexWrap="wrap" gap="$4">
								{MOCK_TEAM.map((member) => (
									<XStack
										key={member.id}
										flexBasis="45%"
										flexGrow={1}
										minWidth={200}
										backgroundColor="$surface_container_low"
										padding="$3"
										borderRadius="$4"
										alignItems="center"
										gap="$4"
									>
										<Avatar circular size="$4">
											<Avatar.Image
												src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0058be&color=fff`}
											/>
											<Avatar.Fallback />
										</Avatar>
										<YStack>
											<Text
												fontSize="$3"
												fontWeight="700"
												color="$on_surface"
											>
												{member.name}
											</Text>
											<Text
												fontSize={12}
												color="$on_surface_variant"
											>
												{member.role}
											</Text>
										</YStack>
									</XStack>
								))}
								<Button
									flexBasis="45%"
									flexGrow={1}
									minWidth={200}
									height={64}
									backgroundColor="transparent"
									borderWidth={2}
									borderStyle="dashed"
									borderColor="$outline_variant"
									borderRadius="$4"
									icon={<Plus size={18} color="#727785" />}
								>
									<Text
										fontSize="$3"
										fontWeight="600"
										color="$outline"
									>
										Invite Member
									</Text>
								</Button>
							</XStack>
						</YStack>

						{/* Danger Zone */}
						<YStack
							marginTop="$4"
							paddingTop="$6"
							borderTopWidth={1}
							borderTopColor="rgba(0,0,0,0.05)"
						>
							<Text
								fontSize="$5"
								fontWeight="700"
								color="$error"
								marginBottom="$4"
							>
								Danger Zone
							</Text>
							<XStack
								flexWrap="wrap"
								backgroundColor="rgba(186, 26, 26, 0.05)"
								padding="$6"
								borderRadius="$5"
								borderWidth={1}
								borderColor="rgba(186, 26, 26, 0.1)"
								justifyContent="space-between"
								alignItems="center"
								gap="$4"
							>
								<YStack flex={1} minWidth={250}>
									<Text fontWeight="700" color="$on_surface">
										Delete this project
									</Text>
									<Text
										fontSize="$3"
										color="$on_surface_variant"
									>
										Once you delete a project, there is no
										going back. Please be certain.
									</Text>
								</YStack>
								<Button
									backgroundColor="$error"
									pressStyle={{ opacity: 0.8 }}
									borderRadius="$4"
									paddingHorizontal="$5"
								>
									<Text fontWeight="700" color="white">
										Delete Project
									</Text>
								</Button>
							</XStack>
						</YStack>
					</YStack>
				</ScrollView>
			</YStack>
		</SafeAreaView>
	);
}
