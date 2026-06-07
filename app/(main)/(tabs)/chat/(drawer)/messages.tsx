import { AppHeader } from "@/components/common/AppHeader";
import { ChatListItem } from "@/components/chat/ChatListItem";
import { CreateChatModal } from "@/components/chat/CreateChatModal";
import { SearchInput } from "@/components/chat/SearchInput";
import { useChat } from "@/contexts/ChatContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Edit3, MessageSquare } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, YStack } from "tamagui";
import { Theme } from "@/constants/Theme";

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
				backgroundColor={Theme.background}
			>
				<ActivityIndicator size="large" color={Theme.primary} />
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
			style={{ flex: 1, backgroundColor: Theme.background }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor={Theme.background}>
				<AppHeader
					title="Messages"
					showBackButton
					onBack={() => {
						navigation.dispatch(DrawerActions.openDrawer());
					}}
					rightElement={
						<Button
							icon={<MessageSquare size={18} color={Theme.text} />}
							circular
							chromeless
							pressStyle={{
								backgroundColor: Theme.primaryPastel,
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
							<Text color={Theme.textMuted} fontSize="$3">
								No chats found. Start a new conversation!
							</Text>
						</View>
					}
				/>

				<TouchableOpacity
					onPress={() => setIsCreateModalOpen(true)}
					style={{
						position: "absolute",
						right: 20,
						bottom: 20,
						zIndex: 50,
					}}
				>
					<View
						style={{
							borderRadius: 6, // Crisp corners
							width: 56,
							height: 56,
							backgroundColor: Theme.primary,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Edit3 color={Theme.primaryText} size={24} />
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
