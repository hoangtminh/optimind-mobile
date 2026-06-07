import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Edit3, Plus } from "lucide-react-native";
import React from "react";
import { Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Text, View, XStack, YStack } from "tamagui";
import { Theme } from "@/constants/Theme";

const MOCK_TEAM = [
	{ id: "1", name: "Elena Vance", role: "Project Lead" },
	{ id: "2", name: "Marcus Thorne", role: "Head Researcher" },
	{ id: "3", name: "Sarah Jenkins", role: "Archivist" },
];

export default function ProjectDetailsScreen() {
	const { projectId } = useLocalSearchParams();
	const router = useRouter();

	const project = {
		name: "Project Workspace",
		description: "Details and team workspace for this module.",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: Theme.background }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor={Theme.background}>
				<XStack
					height={56}
					alignItems="center"
					justifyContent="space-between"
					paddingHorizontal="$2"
					borderBottomWidth={1}
					borderBottomColor={Theme.border}
					backgroundColor={Theme.surface}
					zIndex={10}
				>
					<Button
						circular
						chromeless
						icon={<ArrowLeft size={20} color={Theme.text} />}
						onPress={() => router.back()}
					/>
					<Text fontSize="$4" fontWeight="700" color={Theme.text}>
						Project Workspace
					</Text>
					<View width={44} />
				</XStack>

				<ScrollView style={{ flex: 1 }}>
					<YStack
						padding="$5"
						gap="$5"
						maxWidth={1024}
						alignSelf="center"
						width="100%"
						paddingBottom="$10"
					>
						{/* Identity */}
						<YStack gap="$3" marginBottom="$4">
							<XStack
								justifyContent="space-between"
								alignItems="flex-end"
								flexWrap="wrap"
								gap="$3"
							>
								<YStack gap="$1.5" flex={1} minWidth={250}>
									<Text
										color={Theme.primary}
										fontWeight="700"
										textTransform="uppercase"
										letterSpacing={0.5}
										fontSize={11}
									>
										Project Archive
									</Text>
									<Text
										fontSize={32}
										fontWeight="700"
										color={Theme.text}
										letterSpacing={-0.5}
									>
										{project.name}
									</Text>
									<Text
										fontSize="$3"
										color={Theme.textMuted}
										lineHeight={20}
										maxWidth={600}
										marginTop="$1"
									>
										{project.description}
									</Text>
								</YStack>
								<Button
									backgroundColor={Theme.surface}
									borderWidth={1}
									borderColor={Theme.border}
									pressStyle={{
										backgroundColor: Theme.background,
									}}
									borderRadius={6}
									icon={<Edit3 size={14} color={Theme.text} />}
								>
									<Text fontWeight="600" fontSize="$3" color={Theme.text}>
										Edit Details
									</Text>
								</Button>
							</XStack>
						</YStack>

						{/* Bento Grid */}
						<XStack flexWrap="wrap" gap="$4" marginBottom="$6">
							{/* Timeline */}
							<YStack
								flex={1}
								minWidth={280}
								backgroundColor={Theme.surface}
								padding="$5"
								borderRadius={8}
								borderWidth={1}
								borderColor={Theme.border}
								justifyContent="space-between"
							>
								<YStack>
									<Text
										fontSize="$2"
										color={Theme.textMuted}
										fontWeight="600"
										textTransform="uppercase"
										letterSpacing={0.5}
										marginBottom="$4"
									>
										Timeline
									</Text>
									<YStack gap="$3">
										<YStack>
											<Text
												fontSize={11}
												color={Theme.textMuted}
												fontWeight="500"
												marginBottom="$0.5"
											>
												Created on
											</Text>
											<Text
												fontSize="$4"
												fontWeight="600"
												color={Theme.text}
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
												fontSize={11}
												color={Theme.textMuted}
												fontWeight="500"
												marginBottom="$0.5"
											>
												Last Updated
											</Text>
											<Text
												fontSize="$4"
												fontWeight="600"
												color={Theme.text}
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
									marginTop="$6"
									paddingTop="$4"
									borderTopWidth={1}
									borderTopColor={Theme.border}
								>
									<View
										width="100%"
										height={6}
										backgroundColor={Theme.primaryPastel}
										borderRadius={3}
										overflow="hidden"
									>
										<View
											height="100%"
											backgroundColor={Theme.primary}
											width="65%"
											borderRadius={3}
										/>
									</View>
									<Text
										fontSize={11}
										color={Theme.primary}
										fontWeight="700"
										marginTop="$1.5"
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
							backgroundColor={Theme.surface}
							padding="$5"
							borderRadius={8}
							borderWidth={1}
							borderColor={Theme.border}
						>
							<XStack
								justifyContent="space-between"
								alignItems="center"
								marginBottom="$5"
							>
								<Text
									fontSize="$2"
									color={Theme.textMuted}
									fontWeight="600"
									textTransform="uppercase"
									letterSpacing={0.5}
								>
									Project Team
								</Text>
								<Text
									color={Theme.primary}
									fontWeight="600"
									fontSize="$3"
								>
									Manage Team
								</Text>
							</XStack>

							<XStack flexWrap="wrap" gap="$3">
								{MOCK_TEAM.map((member) => (
									<XStack
										key={member.id}
										flexBasis="45%"
										flexGrow={1}
										minWidth={200}
										backgroundColor={Theme.background}
										padding="$3"
										borderRadius={6}
										alignItems="center"
										gap="$3"
										borderWidth={1}
										borderColor={Theme.border}
									>
										<Avatar circular size="$3.5">
											<Avatar.Image
												src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F2EDFA&color=4F378A&bold=true`}
											/>
											<Avatar.Fallback />
										</Avatar>
										<YStack>
											<Text
												fontSize="$3"
												fontWeight="600"
												color={Theme.text}
											>
												{member.name}
											</Text>
											<Text
												fontSize={12}
												color={Theme.textMuted}
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
									height={54}
									backgroundColor="transparent"
									borderWidth={1.5}
									borderStyle="dashed"
									borderColor={Theme.border}
									borderRadius={6}
									icon={<Plus size={16} color={Theme.textMuted} />}
									pressStyle={{
										backgroundColor: Theme.primaryPastel,
										borderColor: Theme.primary,
									}}
								>
									<Text
										fontSize="$3"
										fontWeight="600"
										color={Theme.textMuted}
									>
										Invite Member
									</Text>
								</Button>
							</XStack>
						</YStack>

						{/* Danger Zone */}
						<YStack
							marginTop="$3"
							paddingTop="$4"
							borderTopWidth={1}
							borderTopColor={Theme.border}
						>
							<Text
								fontSize="$5"
								fontWeight="700"
								color={Theme.accentRedText}
								marginBottom="$3"
							>
								Danger Zone
							</Text>
							<XStack
								flexWrap="wrap"
								backgroundColor={Theme.accentRed}
								padding="$4"
								borderRadius={8}
								borderWidth={1}
								borderColor={Theme.border}
								justifyContent="space-between"
								alignItems="center"
								gap="$3"
							>
								<YStack flex={1} minWidth={250}>
									<Text fontWeight="600" fontSize="$4" color={Theme.text}>
										Delete this project
									</Text>
									<Text
										fontSize="$3"
										color={Theme.textMuted}
										marginTop="$1"
									>
										Once you delete a project, there is no
										going back. Please be certain.
									</Text>
								</YStack>
								<Button
									backgroundColor={Theme.accentRedText}
									pressStyle={{ opacity: 0.9 }}
									borderRadius={6}
									paddingHorizontal="$4"
									height={40}
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
