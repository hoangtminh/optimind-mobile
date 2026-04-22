import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
	Check,
	Menu,
	MessageSquare,
	Search,
	Users,
	X,
} from "lucide-react-native";
import React from "react";
import {
	FlatList,
	Modal,
	Platform,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	Avatar,
	Button,
	Circle,
	Input,
	Text,
	View,
	XStack,
	YStack,
	styled,
} from "tamagui";

// --- Styled Components ---
const GlassHeader = styled(XStack, {
	height: 64,
	alignItems: "center",
	justifyContent: "space-between",
	paddingHorizontal: "$4",
	backgroundColor: "rgba(248, 249, 251, 0.8)", // background color with opacity
	zIndex: 100,
});

const FriendCard = styled(TouchableOpacity, {
	padding: "$3",
	borderRadius: "$4",
	alignItems: "center",
	gap: "$3",
	backgroundColor: "$surface_container_low",
	flexDirection: "row",
	pressStyle: { scale: 0.98, backgroundColor: "$surface_container" },
	transition: "quick",
});

const RequestCard = styled(View, {
	padding: "$3",
	borderRadius: "$4",
	alignItems: "center",
	gap: "$3",
	backgroundColor: "$surface_container_low",
	flexDirection: "row",
});

const SentRequestItem = styled(View, {
	padding: "$4", // p-4
	borderRadius: "$xl", // rounded-xl
	flexDirection: "row",
	alignItems: "center",
	gap: "$4",
	backgroundColor: "$surface_container_low",
});

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
				backgroundColor="rgba(25, 28, 30, 0.2)" // bg-on-background/20
				style={
					Platform.OS === "web"
						? ({ backdropFilter: "blur(4px)" } as any)
						: {}
				}
				padding="$4"
			>
				<View
					backgroundColor="white"
					width="100%"
					maxWidth={512} // max-w-lg
					maxHeight="90%" // to be safe
					borderRadius={30} // rounded-2xl
					shadowColor="#000"
					shadowRadius={30}
					shadowOpacity={0.15}
					shadowOffset={{ width: 0, height: 10 }}
					overflow="hidden"
					display="flex"
					flexDirection="column"
				>
					{/* Modal Header */}
					<XStack
						paddingHorizontal="$6" // px-8
						paddingVertical="$4" // py-6
						justifyContent="space-between"
						alignItems="center"
						borderBottomWidth={1}
					>
						<YStack>
							<Text
								fontSize="$7" // text-2xl
								fontWeight="800" // font-extrabold
								color="$on_surface"
								letterSpacing={-0.5} // tracking-tight
							>
								Sent Requests
							</Text>
							<Text fontSize="$2" color="$on_surface_variant">
								Manage your pending invitations
							</Text>
						</YStack>
						<Button
							circular
							chromeless
							icon={<X size={24} color="black" />}
							onPress={onClose}
							pressStyle={{
								backgroundColor: "lightgray",
							}}
						/>
					</XStack>

					{/* Modal Content (Scrollable List) */}
					<ScrollView
						contentContainerStyle={{
							paddingHorizontal: 32, // px-8
							paddingVertical: 18, // pb-8
						}}
					>
						<YStack gap="$3">
							{MOCK_SENT_REQUESTS.map((req) => (
								<XStack
									key={req.id}
									paddingVertical="$2" // p-4
									backgroundColor="$surface_container_low"
									borderRadius="$xl" // rounded-xl
									alignItems="center"
									justifyContent="space-between"
									hoverStyle={{
										backgroundColor:
											"$surface_container_high",
									}}
								>
									<XStack alignItems="center" gap="$4">
										<Avatar circular size={56}>
											<Avatar.Image
												src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=0058be&color=fff`}
											/>
											<Avatar.Fallback backgroundColor="$surface_variant" />
										</Avatar>
										<YStack>
											<Text
												fontWeight="700"
												color="$on_surface"
											>
												{req.name}
											</Text>
											{/* <Text
												fontSize="$2"
												color="$on_surface_variant"
												fontWeight="500"
											>
												{req.role}
											</Text> */}
											<Button
												backgroundColor="$primary_fixed"
												borderRadius="$lg" // rounded-lg
												pressStyle={{
													backgroundColor:
														"$primary_container",
												}}
												hoverStyle={{
													backgroundColor:
														"$primary_container",
												}}
												// The text color change on hover is complex in Tamagui
												width={"fit-content"}
											>
												<Text fontSize={12}>
													Withdraw
												</Text>
											</Button>
										</YStack>
									</XStack>
								</XStack>
							))}
						</YStack>
					</ScrollView>

					{/* Modal Footer */}
					<View
						paddingHorizontal="$8"
						paddingVertical="$6"
						backgroundColor="$surface_container"
						marginTop="auto"
					>
						<Text
							fontSize={11}
							fontWeight="700"
							textTransform="uppercase"
							letterSpacing={1.5}
							color="$on_surface_variant"
							opacity={0.6}
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
			<YStack flex={1} backgroundColor="$background">
				{/* Editorial Header */}
				<GlassHeader>
					<Button
						icon={<Menu size={24} color="#0058be" />}
						circular
						chromeless
						onPress={() => {
							if (Platform.OS === "web") {
								(
									document.activeElement as HTMLElement
								)?.blur?.();
							}
							navigation.dispatch(DrawerActions.openDrawer());
						}}
						pressStyle={{
							scale: 0.95,
							backgroundColor: "$surface_container_low",
						}}
					/>
					<Text fontSize="$6" fontWeight="600" color="$on_surface">
						Friends
					</Text>
					<Button
						icon={<Users size={24} color="#0058be" />}
						circular
						chromeless
					/>
				</GlassHeader>

				{/* Search Input */}
				<YStack
					paddingHorizontal="$4"
					paddingTop="$4"
					paddingBottom="$2"
					position="relative"
				>
					<View position="absolute" left={32} top={30} zIndex={10}>
						<Search size={20} color="#94a3b8" />
					</View>
					<Input
						backgroundColor="$surface_container_high"
						borderWidth={0}
						borderBottomWidth={2}
						borderBottomColor="transparent"
						focusStyle={{ borderBottomColor: "#0058be" }}
						paddingLeft={48}
						height={52}
						borderRadius={12}
						placeholder="Search friends..."
						placeholderTextColor="$on_surface_variant"
						value={search}
						onChangeText={setSearch}
					/>
				</YStack>

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
									fontWeight="700"
									fontSize="$5"
									color="$on_surface"
								>
									Incoming Requests
								</Text>
								<Button
									size="$2"
									chromeless
									backgroundColor="$primary"
									onPress={() => setIsSentModalOpen(true)}
								>
									<Button.Text fontWeight="600">
										Sent Requests
									</Button.Text>
								</Button>
							</XStack>

							{MOCK_INCOMING_REQUESTS.map((req) => (
								<RequestCard key={req.id}>
									<Avatar circular size="$5">
										<Avatar.Image
											src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=0058be&color=fff`}
										/>
										<Avatar.Fallback />
									</Avatar>
									<YStack flex={1}>
										<Text
											fontWeight="600"
											color="$on_surface"
										>
											{req.name}
										</Text>
										<Text
											fontSize={12}
											color="$on_surface_variant"
											fontWeight="500"
										>
											{req.role}
										</Text>
									</YStack>
									<XStack gap="$2">
										<Button
											size="$3"
											circular
											backgroundColor="$primary"
											icon={
												<Check
													size={18}
													color="white"
												/>
											}
											pressStyle={{ scale: 0.95 }}
										/>
										<Button
											size="$3"
											circular
											backgroundColor="$surface_variant"
											icon={
												<X
													size={18}
													color="$on_surface_variant"
												/>
											}
											pressStyle={{ scale: 0.95 }}
										/>
									</XStack>
								</RequestCard>
							))}

							<View height={12} />
							<Text
								fontWeight="700"
								fontSize="$5"
								color="$on_surface"
								marginTop="$2"
							>
								Your Friends
							</Text>
						</YStack>
					}
					renderItem={({ item }) => (
						<FriendCard onPress={() => handleStartChat(item.id)}>
							<Avatar circular size="$5">
								<Avatar.Image
									src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0058be&color=fff`}
								/>
								<Avatar.Fallback backgroundColor="lightgreen" />
								{item.isOnline && (
									<Circle
										size={14}
										backgroundColor="$primary"
										position="absolute"
										bottom={0}
										right={0}
										borderWidth={2}
										borderColor="$surface_container_low"
									/>
								)}
							</Avatar>
							<YStack flex={1}>
								<Text fontWeight="600" color="$on_surface">
									{item.name}
								</Text>
								<Text
									fontSize={12}
									color={
										item.isOnline
											? "$primary"
											: "$on_surface_variant"
									}
								>
									{item.isOnline ? "Online" : "Offline"}
								</Text>
							</YStack>
							<Button
								icon={
									<MessageSquare
										size={20}
										color="$on_surface_variant"
									/>
								}
								circular
								chromeless
							/>
						</FriendCard>
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
