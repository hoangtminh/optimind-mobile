import { CreateChatModal } from "@/components/chat/CreateChatModal";
import { useChat } from "@/contexts/ChatContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Edit3, Menu, MessageSquare, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Platform,
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
	ZStack,
	styled,
} from "tamagui";

// --- Styled Components based on Design System ---

const SanctuaryCard = styled(XStack, {
	padding: "$3",
	borderRadius: "$2",
	alignItems: "center",
	gap: "$3",
	pressStyle: { scale: 0.98 },
	transition: "quick",
});

const GlassHeader = styled(XStack, {
	height: 64,
	alignItems: "center",
	justifyContent: "space-between",
	paddingHorizontal: "$4",
	backgroundColor: "rgba(255, 255, 255, 0.8)", // Glassmorphism
	zIndex: 100,
});

export default function ChatListScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const { chats, fetchChats, isLoadingHistory, createChat } = useChat();
	const [search, setSearch] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			fetchChats();
		});
		return unsubscribe;
	}, [navigation]);

	const filteredRooms = chats.filter((r) =>
		r.name.toLowerCase().includes(search.toLowerCase()),
	);

	if (isLoadingHistory && chats.length === 0) {
		return (
			<View
				flex={1}
				justifyContent="center"
				alignContent="center"
				backgroundColor="$background"
			>
				<ActivityIndicator size="large" color="#0058be" />
			</View>
		);
	}

	const handleCreateNewChat = async (data: {
		name: string;
		userIds: string[];
	}) => {
		const newChatId = await createChat(data.name, data.userIds, true);
		if (newChatId) {
			router.push(`/(main)/(tabs)/chat/${newChatId}`);
		}
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
						Messages
					</Text>
					<Button
						icon={<MessageSquare size={24} color="#0058be" />}
						circular
						chromeless
					/>
				</GlassHeader>

				{/* Search - Soft Tactile Input */}
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
						placeholder="Search academic conversations..."
						placeholderTextColor="$on_surface"
						value={search}
						onChangeText={setSearch}
					/>
				</YStack>

				{/* Messaging Sanctuary List */}
				<FlatList
					data={filteredRooms}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
					ItemSeparatorComponent={() => <View height={12} />}
					renderItem={({ item }) => {
						const hasUnread = false; // Add unread logic here based on your backend later

						return (
							<TouchableOpacity className="flex-row items-center rounded-3xl bg-white shadow-sm">
								<SanctuaryCard
									backgroundColor={
										hasUnread
											? "$surface_container_lowest"
											: "$surface_container_low"
									}
									elevation={hasUnread ? 2 : 0}
									onPress={() =>
										router.push(
											`/(main)/(tabs)/chat/${item.id}`,
										)
									}
								>
									<ZStack width={56} height={56}>
										<Avatar circular size="$5">
											<Avatar.Image
												src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0058be&color=fff`}
											/>
											<Avatar.Fallback backgroundColor="lightgreen" />
										</Avatar>
										{hasUnread && (
											<Circle
												size={14}
												backgroundColor="$secondary"
												position="absolute"
												bottom={0}
												right={0}
												borderWidth={2}
												borderColor="white"
											/>
										)}
									</ZStack>

									<YStack flex={1}>
										<XStack
											justifyContent="space-between"
											alignItems="baseline"
											marginBottom={2}
										>
											<Text
												flex={1}
												fontWeight={
													hasUnread ? "700" : "600"
												}
												color="$on_surface"
												numberOfLines={1}
											>
												{item.name}
											</Text>
											<Text
												fontSize={11}
												color={
													hasUnread
														? "$primary"
														: "$on_surface"
												}
												fontWeight={
													hasUnread ? "800" : "500"
												}
												textTransform={
													hasUnread
														? "uppercase"
														: "none"
												}
											>
												{item.lastMessage?.createdAt
													? new Date(
															item.lastMessage
																.createdAt,
														).toLocaleTimeString(
															[],
															{
																hour: "2-digit",
																minute: "2-digit",
															},
														)
													: ""}
											</Text>
										</XStack>
										<XStack
											justifyContent="space-between"
											alignItems="center"
										>
											<Text
												flex={1}
												color="$on_surface"
												fontStyle={
													hasUnread
														? "italic"
														: "normal"
												}
												numberOfLines={1}
											>
												{item.lastMessage?.content ||
													"No messages yet"}
											</Text>
											{hasUnread && (
												<Circle
													size={18}
													backgroundColor="$primary"
												>
													<Text
														color="white"
														fontSize={10}
														fontWeight="800"
													>
														1
													</Text>
												</Circle>
											)}
										</XStack>
									</YStack>
								</SanctuaryCard>
							</TouchableOpacity>
						);
					}}
					ListEmptyComponent={
						<View
							flex={1}
							justifyContent="center"
							alignItems="center"
							marginTop="$10"
						>
							<Text color="$on_surface">
								No chats found. Start a new conversation!
							</Text>
						</View>
					}
				/>

				{/* FAB - Glass & Gradient Rule */}
				<TouchableOpacity>
					<View
						position="absolute"
						right={24}
						bottom={24}
						zIndex={50}
					>
						<LinearGradient
							colors={["#0058be", "#2170e4"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								borderRadius: 16,
								width: 56,
								height: 56,
								justifyContent: "center",
								alignItems: "center",
								elevation: 8,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.06,
								shadowRadius: 24,
							}}
						>
							<Button
								unstyled
								onPress={() => setIsCreateModalOpen(true)}
								width="100%"
								height="100%"
								justifyContent="center"
								alignItems="center"
							>
								<Edit3 color="white" size={24} />
							</Button>
						</LinearGradient>
					</View>
				</TouchableOpacity>
			</YStack>

			<CreateChatModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreate={handleCreateNewChat}
			/>
		</SafeAreaView>
	);
}
