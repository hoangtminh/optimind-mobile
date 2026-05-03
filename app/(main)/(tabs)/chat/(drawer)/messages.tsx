import { AppHeader } from "@/components/common/AppHeader";
import { ChatListItem } from "@/components/chat/ChatListItem";
import { CreateChatModal } from "@/components/chat/CreateChatModal";
import { SearchInput } from "@/components/chat/SearchInput";
import { useChat } from "@/contexts/ChatContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Edit3, MessageSquare } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, YStack } from "tamagui";

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
				backgroundColor="#fdf7ff"
			>
				<ActivityIndicator size="large" color="#6750A4" />
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
			<YStack flex={1} backgroundColor="#fdf7ff">
				<AppHeader
					title="Messages"
					showBackButton
					onBack={() => {
						// Logic to open drawer if needed, but AppHeader handleBack usually handles history
						// If the user specifically wants drawer, we might need to adjust AppHeader
						navigation.dispatch(DrawerActions.openDrawer());
					}}
					rightElement={
						<Button
							icon={<MessageSquare size={20} color="white" />}
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
					placeholder="Search academic conversations..."
				/>

				<FlatList
					data={filteredRooms}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
					ItemSeparatorComponent={() => <View height={12} />}
					renderItem={({ item }) => (
						<ChatListItem chat={item} hasUnread={false} />
					)}
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

				<TouchableOpacity
					onPress={() => setIsCreateModalOpen(true)}
					style={{
						position: "absolute",
						right: 24,
						bottom: 24,
						zIndex: 50,
					}}
				>
					<LinearGradient
						colors={["#6750A4", "#4F378A"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{
							borderRadius: 20,
							width: 64,
							height: 64,
							justifyContent: "center",
							alignItems: "center",
							elevation: 8,
							shadowColor: "#6750A4",
							shadowOffset: { width: 0, height: 8 },
							shadowOpacity: 0.2,
							shadowRadius: 16,
						}}
					>
						<Edit3 color="white" size={28} />
					</LinearGradient>
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
