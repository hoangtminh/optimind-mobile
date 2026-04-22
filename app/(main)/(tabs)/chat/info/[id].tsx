import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
	ArrowLeft,
	BellOff,
	Group,
	LogOut,
	Pin,
	UserPlus,
	Verified,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Text, View, XStack, YStack } from "tamagui";

// Mock data for members since it's not in the context yet
const mockMembers = [
	{
		id: "2",
		name: "Dr. Thorne",
		role: "Lead Researcher",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5n7LUaMNkb1aJYtCwG5Z2FcSlU0DvDWA6jWHcIDa6h8Up35dQT1wiVPWVuH-N19zuk5aX_AUVrbeX9cYEUdxpf5WDHsvNnahcnSOTOxMqcbOSxxbkzxjK7LMEdzTg86EKP2fz2OMjdZbbAGjqNozt8eV2u_oqBStbZwyJKkwdbEz7ktcBxXnj8V_EtdXjjpN0PBc3ToweFg4G8SLqrvMLW0mGp50LwFM2-DSTAmSK3B-Um4Mdg0qgq4hJTcJfrUiAjQfT4c_ADg",
		isVerified: true,
	},
	{
		id: "3",
		name: "Julian",
		role: "Student Associate",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhn6Vz4Ehw0hP_FS_fuGB_wIM9diRH7sr6LQXH8a86GUakMDuQ__rTqJYSbLts_BKa2vRrmupHen_bewaALX6qXlodjsBnaI-I6CIylVmJ5wSjeGGOluByEcS5t5yKh9ImstTLiHnIpSrqm5k0OYw6Cz3MamdmQsf1cM2jzjsRy-s7GHTuJ7OOCKsTmSEJZWmkuAfcbCHk4Ym-AI_209OHjZLgaaFjgK4Ljr51YTIdrqKRSFWsNWQ8ABqhNOjwpqS8LhwcOcwEjQ",
		isVerified: false,
	},
];

export default function ChatInfoScreen() {
	const router = useRouter();
	const { user: currentUser } = useAuth();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { leaveChat: leaveRoom, chats: rooms } = useChat();

	const chatRoom = rooms.find((r) => r.id === id);
	const members = [
		{
			id: currentUser?.id,
			name: currentUser?.username || "You",
			role: "Admin",
			isVerified: true,
			avatar: "",
		},
		...mockMembers,
	];

	// State for settings toggles
	const [isMuted, setIsMuted] = useState(false);
	const [isPinned, setIsPinned] = useState(true);

	const handleLeaveChat = () => {
		Alert.alert("Leave Chat", "Are you sure you want to leave this chat?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Leave",
				onPress: async () => {
					if (id) {
						await leaveRoom(id);
						router.replace("/(main)/(tabs)/chat");
					}
				},
			},
		]);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }} // $surface
			edges={["top", "bottom"]}
		>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					headerBlurEffect: "light",
					headerTitle: () => (
						<Text
							fontSize="$5"
							fontWeight="600"
							color="$on_surface"
						>
							Chat Info
						</Text>
					),
					headerLeft: () => (
						<Button
							icon={<ArrowLeft size={24} color="#0058be" />}
							circular
							chromeless
							onPress={() => router.back()}
						/>
					),
				}}
			/>
			<ScrollView
				contentContainerStyle={{
					paddingBottom: 32,
				}}
			>
				<YStack paddingTop="$8" paddingHorizontal="$4">
					{/* Profile Header Section */}
					<YStack alignItems="center" marginBottom="$10">
						<View position="relative" marginBottom="$6">
							<Avatar
								size={128}
								borderRadius="$6"
								elevation="$2"
								borderWidth={4}
								borderColor="$surface_container_low"
							>
								<Avatar.Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG9fCYwSlzFriunomG-x1HCka0Kc6hfkDC1DXqzaie0wABfXqfG3_Rg29zrIi-gtU1Ffw6Yfy5uZ3mgTP3cjd-oY7GtqnAe9rRww1sdOIVQsRVYLXgXTbFg32z3GRFeP_JeyYWrTXB7tQAmnchbyjBopZI211N7zRsUAKamxZ-VulBpFnGeR3NiDNN9WNyci2k21xGdLBpXmV6CpU_GeRq9QFz1PZhxRUNC2JdCpGFEparPPBXNoC3HMrkKeQuz-1jiTZ9hdK8gQ" />
								<Avatar.Fallback backgroundColor="$surface_container" />
							</Avatar>
							<View
								position="absolute"
								bottom={-8}
								right={-8}
								backgroundColor="$secondary"
								padding="$1.5"
								borderRadius="$3"
								borderWidth={4}
								borderColor="$surface"
							>
								<Group size={14} color="white" />
							</View>
						</View>
						<Text
							fontSize="$7"
							fontWeight="700"
							textAlign="center"
							marginBottom="$1"
							color="$on_surface"
						>
							{chatRoom?.name || "Chat Group"}
						</Text>
						<Text
							color="$on_surface_variant"
							fontSize="$3"
							fontWeight="500"
						>
							Research Group • {members.length} Members
						</Text>
					</YStack>

					{/* Members Section */}
					<YStack marginBottom="$8">
						<XStack
							justifyContent="space-between"
							alignItems="center"
							marginBottom="$4"
							paddingHorizontal="$2"
						>
							<Text
								fontSize="$1"
								fontWeight="700"
								textTransform="uppercase"
								letterSpacing={1.5}
								color="$on_surface_variant"
							>
								Members
							</Text>
							<Text
								fontSize="$2"
								fontWeight="600"
								color="$primary"
								paddingHorizontal="$2"
								paddingVertical="$1"
								backgroundColor="$primary_fixed"
								borderRadius="$2"
							>
								Shared Workspace
							</Text>
						</XStack>
						<YStack
							backgroundColor="$surface_container_low"
							borderRadius={24}
							padding="$2"
							gap="$1"
						>
							{members.map((member) => (
								<XStack
									key={member.id}
									alignItems="center"
									justifyContent="space-between"
									padding="$3"
									backgroundColor={
										member.id === currentUser?.id
											? "$surface_container_lowest"
											: "transparent"
									}
									borderRadius="$5"
									elevation={
										member.id === currentUser?.id ? 2 : 0
									}
									hoverStyle={{
										transform: [{ translateX: 4 }],
									}}
									animationDelay="quick"
								>
									<XStack alignItems="center" gap="$4">
										<Avatar size={40} borderRadius="$3">
											<Avatar.Image
												src={
													member.avatar ||
													`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e1e2e4&color=191c1e`
												}
											/>
											<Avatar.Fallback backgroundColor="$surface_container_highest" />
										</Avatar>
										<YStack>
											<Text
												fontSize="$3"
												fontWeight="600"
											>
												{member.name}
											</Text>
											<Text
												fontSize="$1"
												color="$on_surface_variant"
												textTransform="uppercase"
												letterSpacing={0.5}
											>
												{member.role}
											</Text>
										</YStack>
									</XStack>
									{member.isVerified &&
										member.id !== currentUser?.id && (
											<Verified
												size={14}
												color="$on_surface_variant"
											/>
										)}
								</XStack>
							))}
						</YStack>
					</YStack>

					{/* Chat Settings Section */}
					<YStack marginBottom="$10">
						<Text
							fontSize="$1"
							fontWeight="700"
							textTransform="uppercase"
							letterSpacing={1.5}
							color="$on_surface_variant"
							marginBottom="$4"
							paddingHorizontal="$2"
						>
							Chat Settings
						</Text>
						<YStack
							backgroundColor="$surface_container_low"
							borderRadius={24}
							padding="$2"
							gap="$1"
						>
							<XStack
								alignItems="center"
								justifyContent="space-between"
								padding="$4"
								hoverStyle={{
									backgroundColor: "$surface_container_high",
								}}
								borderRadius="$5"
								animationDelay="quick"
							>
								<XStack alignItems="center" gap="$4">
									<View
										width={40}
										height={40}
										borderRadius="$3"
										backgroundColor="$surface_container_highest"
										alignItems="center"
										justifyContent="center"
									>
										<BellOff
											size={20}
											color="$on_surface_variant"
										/>
									</View>
									<Text fontSize="$3" fontWeight="500">
										Mute Notifications
									</Text>
								</XStack>
								<Switch
									value={isMuted}
									onValueChange={setIsMuted}
								/>
							</XStack>
							<XStack
								alignItems="center"
								justifyContent="space-between"
								padding="$4"
								hoverStyle={{
									backgroundColor: "$surface_container_high",
								}}
								borderRadius="$5"
								animationDelay="quick"
							>
								<XStack alignItems="center" gap="$4">
									<View
										width={40}
										height={40}
										borderRadius="$3"
										backgroundColor="$surface_container_highest"
										alignItems="center"
										justifyContent="center"
									>
										<Pin
											size={20}
											color="$on_surface_variant"
										/>
									</View>
									<Text fontSize="$3" fontWeight="500">
										Pin to Top
									</Text>
								</XStack>
								<Switch
									value={isPinned}
									onValueChange={setIsPinned}
								/>
							</XStack>
						</YStack>
					</YStack>

					{/* Actions */}
					<YStack gap="$3">
						<Button
							height="$6"
							borderRadius="$5"
							pressStyle={{ scale: 0.95 }}
							animationDelay="quick"
						>
							<LinearGradient
								colors={["#0058be", "#2170e4"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									top: 0,
									bottom: 0,
									borderRadius: 12,
								}}
							/>
							<UserPlus size={18} color="white" />
							<Text
								color="white"
								fontWeight="700"
								marginLeft="$2"
							>
								Add Members
							</Text>
						</Button>
						<Button
							height="$6"
							borderRadius="$5"
							borderWidth={2}
							borderColor="$error"
							backgroundColor="transparent"
							onPress={handleLeaveChat}
							pressStyle={{
								scale: 0.95,
								backgroundColor: "$error_container",
							}}
							animationDelay="quick"
							icon={<LogOut size={18} color="$error" />}
						>
							<Text
								color="$error"
								fontWeight="700"
								marginLeft="$2"
							>
								Leave Chat
							</Text>
						</Button>
					</YStack>
				</YStack>
			</ScrollView>
		</SafeAreaView>
	);
}
