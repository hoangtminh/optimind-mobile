import { AppHeader } from "@/components/common/AppHeader";
import { FriendListItem } from "@/components/chat/FriendListItem";
import { SearchInput } from "@/components/chat/SearchInput";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Check, MessageSquare, Users, X } from "lucide-react-native";
import React from "react";
import { FlatList, Modal, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Circle, Text, View, XStack, YStack, styled } from "tamagui";


// --- Mock Data ---
const MOCK_FRIENDS = [
	{ id: "u2", name: "Emily Carter", isOnline: true },
	{ id: "u3", name: "David Chen", isOnline: false },
	{ id: "u4", name: "Sophia Rodriguez", isOnline: true },
	{ id: "u5", name: "Michael Johnson", isOnline: false },
	{ id: "u6", name: "Olivia Williams", isOnline: true },
	{ id: "u7", name: "Daniel Brown", isOnline: false },
	{ id: "u8", name: "Ava Garcia", isOnline: true },
	{ id: "u9", name: "James Miller", isOnline: false },
	{ id: "u10", name: "Isabella Davis", isOnline: true },
	{ id: "u11", name: "Liam Wilson", isOnline: false },
];

const MOCK_INCOMING_REQUESTS = [
	{ id: "req1", name: "Alex Riverstone", role: "Ph.D. Architecture" },
	{ id: "req2", name: "Elena Vance", role: "M.Sc. Data Ethics" },
];

const MOCK_SENT_REQUESTS = [
	{ id: "s1", name: "Julian Thorne", role: "Digital Humanities" },
	{ id: "s2", name: "Sarah Chen", role: "B.A. Urban Planning" },
	{ id: "s3", name: "Alex Riverstone", role: "Ph.D. Architecture" },
	{ id: "s4", name: "Elena Vance", role: "M.Sc. Data Ethics" },
];

// --- Sent Requests Modal Component (based on HTML) ---
function SentRequestsModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor="rgba(0,0,0,0.4)"
				padding="$4"
			>
				<View
					backgroundColor="white"
					width="100%"
					maxWidth={500}
					maxHeight="80%"
					borderRadius={32}
					shadowColor="#000"
					shadowRadius={30}
					shadowOpacity={0.1}
					overflow="hidden"
				>
					<XStack
						padding="$6"
						justifyContent="space-between"
						alignItems="center"
						borderBottomWidth={1}
						borderBottomColor="#f2ecf4"
					>
						<YStack>
							<Text fontSize="$6" fontWeight="800" color="#1d1b20">
								Sent Requests
							</Text>
							<Text fontSize="$2" color="#7a7582">
								Manage your pending invitations
							</Text>
						</YStack>
						<Button
							circular
							chromeless
							icon={<X size={20} color="#1d1b20" />}
							onPress={onClose}
							pressStyle={{ backgroundColor: "#f2ecf4" }}
						/>
					</XStack>

					<ScrollView contentContainerStyle={{ padding: 24 }}>
						<YStack gap="$3">
							{MOCK_SENT_REQUESTS.map((req) => (
								<XStack
									key={req.id}
									padding="$3"
									backgroundColor="#fdf7ff"
									borderRadius={20}
									alignItems="center"
									justifyContent="space-between"
								>
									<XStack alignItems="center" gap="$3">
										<Avatar circular size={48}>
											<Avatar.Image
												src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
													req.name,
												)}&background=6750A4&color=fff`}
											/>
											<Avatar.Fallback backgroundColor="#e9ddff" />
										</Avatar>
										<YStack>
											<Text
												fontWeight="700"
												color="#1d1b20"
											>
												{req.name}
											</Text>
											<Button
												size="$1"
												backgroundColor="#ffdad6"
												borderRadius={8}
												marginTop="$1"
												onPress={() => {}}
											>
												<Text
													fontSize={10}
													fontWeight="700"
													color="#93000a"
												>
													Withdraw
												</Text>
											</Button>
										</YStack>
									</XStack>
								</XStack>
							))}
						</YStack>
					</ScrollView>

					<View
						padding="$4"
						backgroundColor="#f2ecf4"
						alignItems="center"
					>
						<Text
							fontSize={10}
							fontWeight="700"
							color="#7a7582"
							textTransform="uppercase"
						>
							Pending requests expire in 30 days
						</Text>
					</View>
				</View>
			</View>
		</Modal>
	);
}

export default function FriendsScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const [search, setSearch] = React.useState("");
	const [isSentModalOpen, setIsSentModalOpen] = React.useState(false);

	const filteredFriends = MOCK_FRIENDS.filter((f) =>
		f.name.toLowerCase().includes(search.toLowerCase()),
	);

	// Only show first 5 friends if not searching, to allow the "See all friends" preview logic
	const displayedFriends = search
		? filteredFriends
		: filteredFriends.slice(0, 5);

	const handleStartChat = (friendId: string) => {
		// Logic to start a chat, maybe navigate to a new chat screen or an existing one
		console.log("Start chat with friend:", friendId);
	};
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor="#fdf7ff">
				<AppHeader
					title="Friends"
					showBackButton
					onBack={() => {
						navigation.dispatch(DrawerActions.openDrawer());
					}}
					rightElement={
						<Button
							icon={<Users size={20} color="white" />}
							circular
							chromeless
							pressStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.1)",
							}}
						/>
					}
				/>

				<SearchInput
					value={search}
					onChangeText={setSearch}
					placeholder="Search friends..."
				/>

				{/* Friends List */}
				<FlatList
					data={displayedFriends}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
					ItemSeparatorComponent={() => <View height={12} />}
					ListHeaderComponent={
						<YStack marginBottom="$4" gap="$3">
							{/* Incoming Requests Section */}
							<XStack
								justifyContent="space-between"
								alignItems="center"
								marginBottom="$1"
							>
								<Text
									fontWeight="800"
									fontSize="$5"
									color="#1d1b20"
								>
									Incoming Requests
								</Text>
								<Button
									size="$2"
									backgroundColor="#f2ecf4"
									onPress={() => setIsSentModalOpen(true)}
									pressStyle={{ backgroundColor: "#e9ddff" }}
								>
									<Text color="#6750A4" fontWeight="700">
										Sent Requests
									</Text>
								</Button>
							</XStack>

							{MOCK_INCOMING_REQUESTS.map((req) => (
								<XStack
									key={req.id}
									padding="$3"
									borderRadius={24}
									alignItems="center"
									gap="$3"
									backgroundColor="white"
									shadowColor="#000"
									shadowRadius={10}
									shadowOpacity={0.03}
								>
									<Avatar circular size="$5">
										<Avatar.Image
											src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
												req.name,
											)}&background=e9ddff&color=6750A4&bold=true`}
										/>
										<Avatar.Fallback />
									</Avatar>
									<YStack flex={1}>
										<Text
											fontWeight="700"
											color="#1d1b20"
											fontSize="$4"
										>
											{req.name}
										</Text>
										<Text
											fontSize={12}
											color="#7a7582"
											fontWeight="600"
										>
											{req.role}
										</Text>
									</YStack>
									<XStack gap="$2">
										<Button
											size="$3"
											circular
											backgroundColor="#6750A4"
											icon={
												<Check
													size={18}
													color="white"
												/>
											}
											pressStyle={{ opacity: 0.8 }}
										/>
										<Button
											size="$3"
											circular
											backgroundColor="#f2ecf4"
											icon={
												<X
													size={18}
													color="#6750A4"
												/>
											}
											pressStyle={{ backgroundColor: "#e9ddff" }}
										/>
									</XStack>
								</XStack>
							))}

							<View height={12} />
							<Text
								fontWeight="800"
								fontSize="$5"
								color="#1d1b20"
								marginTop="$2"
							>
								Your Friends
							</Text>
						</YStack>
					}
					renderItem={({ item }) => (
						<FriendListItem
							friend={item}
							onPress={() => handleStartChat(item.id)}
							onMessagePress={() => handleStartChat(item.id)}
						/>
					)}
					ListFooterComponent={
						!search && filteredFriends.length > 5 ? (
							<Button
								marginTop="$5"
								backgroundColor="$surface_container_high"
								onPress={() =>
									router.push(
										"/(main)/(tabs)/chat/all-friends",
									)
								}
							>
								<Button.Text fontWeight="600">
									See All Friends
								</Button.Text>
							</Button>
						) : null
					}
					ListEmptyComponent={
						<View
							flex={1}
							justifyContent="center"
							alignItems="center"
							marginTop="$10"
						>
							<Text color="$on_surface_variant">
								No friends found.
							</Text>
						</View>
					}
				/>
			</YStack>

			<SentRequestsModal
				isOpen={isSentModalOpen}
				onClose={() => setIsSentModalOpen(false)}
			/>
		</SafeAreaView>
	);
}
