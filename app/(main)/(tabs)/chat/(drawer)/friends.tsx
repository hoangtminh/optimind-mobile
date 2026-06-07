import { AppHeader } from "@/components/common/AppHeader";
import { FriendListItem } from "@/components/chat/FriendListItem";
import { SentRequestsModal } from "@/components/chat/SentRequestsModal";
import { IncomingRequestItem } from "@/components/chat/IncomingRequestItem";
import { SearchResultCard } from "@/components/chat/SearchResultCard";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Users, Search } from "lucide-react-native";
import React from "react";
import { FlatList, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack, Input } from "tamagui";
import { Theme } from "@/constants/Theme";
import { friendActions, FriendResponse, FriendRequestResponse, SearchFriendResult } from "@/api/friend-actions";
import { chatActions } from "@/api/chat-actions";

export default function FriendsScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const [search, setSearch] = React.useState("");
	const [friends, setFriends] = React.useState<FriendResponse[]>([]);
	const [incomingRequests, setIncomingRequests] = React.useState<FriendRequestResponse[]>([]);
	const [sentRequests, setSentRequests] = React.useState<FriendRequestResponse[]>([]);
	const [searchResult, setSearchResult] = React.useState<SearchFriendResult | null>(null);
	const [isSearching, setIsSearching] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSentModalOpen, setIsSentModalOpen] = React.useState(false);

	const loadData = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const [friendsRes, incomingRes, sentRes] = await Promise.all([
				friendActions.getFriends(),
				friendActions.getIncomingRequests(),
				friendActions.getSentRequests(),
			]);
			if (friendsRes.success && friendsRes.data) {
				setFriends(friendsRes.data);
			}
			if (incomingRes.success && incomingRes.data) {
				setIncomingRequests(incomingRes.data);
			}
			if (sentRes.success && sentRes.data) {
				setSentRequests(sentRes.data);
			}
		} catch (error) {
			console.error("Failed to load friends data:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		loadData();
	}, [loadData]);

	React.useEffect(() => {
		if (search === "") {
			setSearchResult(null);
		}
	}, [search]);

	const handleSearch = React.useCallback(async () => {
		if (!search.trim()) return;
		setIsSearching(true);
		setSearchResult(null);
		try {
			const res = await friendActions.searchFriendByEmail(search.trim());
			if (res.success && res.data) {
				setSearchResult(res.data);
			} else {
				setSearchResult(null);
				alert(res.error || "User not found");
			}
		} catch (error) {
			console.error("Search failed:", error);
			alert("Search failed. Please check the email and try again.");
		} finally {
			setIsSearching(false);
		}
	}, [search]);

	const handleAcceptRequest = React.useCallback(async (requestId: string) => {
		try {
			const res = await friendActions.acceptFriendRequest(requestId);
			if (res.success) {
				await loadData();
				if (searchResult) {
					const updated = await friendActions.searchFriendByEmail(searchResult.email);
					if (updated.success && updated.data) {
						setSearchResult(updated.data);
					}
				}
			} else {
				alert(res.error || "Failed to accept request");
			}
		} catch (error) {
			console.error("Accept request failed:", error);
		}
	}, [loadData, searchResult]);

	const handleDeclineRequest = React.useCallback(async (requestId: string) => {
		try {
			const res = await friendActions.declineFriendRequest(requestId);
			if (res.success) {
				await loadData();
				if (searchResult) {
					const updated = await friendActions.searchFriendByEmail(searchResult.email);
					if (updated.success && updated.data) {
						setSearchResult(updated.data);
					}
				}
			} else {
				alert(res.error || "Failed to decline request");
			}
		} catch (error) {
			console.error("Decline request failed:", error);
		}
	}, [loadData, searchResult]);

	const handleWithdrawRequest = React.useCallback(async (requestId: string) => {
		try {
			const res = await friendActions.withdrawFriendRequest(requestId);
			if (res.success) {
				await loadData();
				if (searchResult) {
					const updated = await friendActions.searchFriendByEmail(searchResult.email);
					if (updated.success && updated.data) {
						setSearchResult(updated.data);
					}
				}
			} else {
				alert(res.error || "Failed to withdraw request");
			}
		} catch (error) {
			console.error("Withdraw request failed:", error);
		}
	}, [loadData, searchResult]);

	const handleAddFriend = React.useCallback(async (email: string) => {
		try {
			const res = await friendActions.sendFriendRequest(email);
			if (res.success) {
				await loadData();
				if (searchResult) {
					const updated = await friendActions.searchFriendByEmail(email);
					if (updated.success && updated.data) {
						setSearchResult(updated.data);
					}
				}
			} else {
				alert(res.error || "Failed to send friend request");
			}
		} catch (error) {
			console.error("Send friend request failed:", error);
		}
	}, [loadData, searchResult]);

	const handleStartChat = React.useCallback(async (email: string, username: string) => {
		try {
			const res = await chatActions.createChat(
				`Chat with ${username}`,
				[email],
				false
			);
			if (res.success && res.data) {
				router.push(`/(main)/(tabs)/chat/${res.data.id}`);
			} else {
				alert(res.error || "Failed to start chat");
			}
		} catch (error) {
			console.error("Start chat failed:", error);
		}
	}, [router]);

	const renderFriendItem = React.useCallback(({ item }: { item: FriendResponse }) => {
		return (
			<FriendListItem
				friend={{
					id: item.friend.id,
					name: item.friend.username,
					isOnline: false,
				}}
				onPress={() => handleStartChat(item.friend.email, item.friend.username)}
				onMessagePress={() => handleStartChat(item.friend.email, item.friend.username)}
			/>
		);
	}, [handleStartChat]);

	const filteredFriends = React.useMemo(() => {
		return friends.filter((f) =>
			f.friend.username.toLowerCase().includes(search.toLowerCase()) ||
			f.friend.email.toLowerCase().includes(search.toLowerCase())
		);
	}, [friends, search]);

	const displayedFriends = React.useMemo(() => {
		return search ? filteredFriends : filteredFriends.slice(0, 5);
	}, [search, filteredFriends]);

	const isSearchingMode = search.trim() !== "";
	const handleCloseSentModal = React.useCallback(() => setIsSentModalOpen(false), []);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: Theme.background }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor={Theme.background}>
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

				{/* Search Field & Search Button */}
				<XStack
					paddingHorizontal="$4"
					paddingTop="$4"
					paddingBottom="$2"
					gap="$2"
					alignItems="center"
				>
					<View flex={1} position="relative">
						<View position="absolute" left={12} top={14} zIndex={10}>
							<Search size={16} color={Theme.primary} />
						</View>
						<Input
							placeholder="Search friends by email..."
							backgroundColor={Theme.surface}
							borderWidth={1}
							borderColor={Theme.border}
							height={44}
							borderRadius={8}
							paddingLeft={40}
							fontSize="$3"
							color={Theme.text}
							value={search}
							onChangeText={setSearch}
							onSubmitEditing={handleSearch}
							returnKeyType="search"
						/>
					</View>
					<Button
						backgroundColor={Theme.primary}
						height={44}
						borderRadius={8}
						onPress={handleSearch}
						pressStyle={{ opacity: 0.8 }}
					>
						{isSearching ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<Button.Text color="white" fontWeight="700">Search</Button.Text>
						)}
					</Button>
				</XStack>

				{/* Sent Requests Button - Always Visible */}
				<XStack
					paddingHorizontal="$4"
					paddingBottom="$3"
					justifyContent="space-between"
					alignItems="center"
				>
					<Text fontSize="$2" color={Theme.textMuted} fontWeight="600" letterSpacing={0.5} textTransform="uppercase">
						{isSearchingMode ? "Searching Network" : "Connections"}
					</Text>
					<Button
						size="$2"
						backgroundColor={Theme.primaryPastel}
						borderRadius={6}
						height={32}
						onPress={() => setIsSentModalOpen(true)}
						pressStyle={{ opacity: 0.8 }}
					>
						<Button.Text color={Theme.primaryPastelText} fontWeight="700">
							Sent Requests ({sentRequests.length})
						</Button.Text>
					</Button>
				</XStack>

				{/* Conditionally Render Search Results (Searching Mode) OR Incoming & Connections (Default Mode) */}
				{isSearchingMode ? (
					<YStack flex={1} paddingHorizontal="$4" gap="$3">
						{isSearching ? (
							<View flex={1} justifyContent="center" alignItems="center" marginTop="$8">
								<ActivityIndicator size="large" color={Theme.primary} />
								<Text color={Theme.textMuted} marginTop="$2">Searching user...</Text>
							</View>
						) : searchResult ? (
							<SearchResultCard
								searchResult={searchResult}
								sentRequests={sentRequests}
								incomingRequests={incomingRequests}
								onAddFriend={handleAddFriend}
								onWithdrawRequest={handleWithdrawRequest}
								onAcceptRequest={handleAcceptRequest}
								onDeclineRequest={handleDeclineRequest}
								onStartChat={handleStartChat}
							/>
						) : (
							<View flex={1} justifyContent="center" alignItems="center" marginTop="$8">
								<Text color={Theme.textMuted} fontSize="$3">
									No user found with that email.
								</Text>
							</View>
						)}
					</YStack>
				) : (
					<YStack flex={1} gap="$4">
						{/* Incoming Requests Section (Limited Height) */}
						{incomingRequests.length > 0 && (
							<YStack paddingHorizontal="$4" gap="$2">
								<Text
									fontWeight="800"
									fontSize="$4"
									color={Theme.text}
								>
									Incoming Requests
								</Text>
								<View
									maxHeight={160}
									borderWidth={1}
									borderColor={Theme.border}
									borderRadius={8}
									backgroundColor={Theme.surfaceMuted}
									padding="$2"
								>
									<ScrollView nestedScrollEnabled contentContainerStyle={{ gap: 8 }}>
										{incomingRequests.map((req) => (
											<IncomingRequestItem
												key={req.id}
												request={req}
												onAccept={handleAcceptRequest}
												onDecline={handleDeclineRequest}
											/>
										))}
									</ScrollView>
								</View>
							</YStack>
						)}

						{/* Your Friends Section */}
						<YStack flex={1} paddingHorizontal="$4" gap="$2">
							<Text
								fontWeight="800"
								fontSize="$4"
								color={Theme.text}
							>
								Your Friends
							</Text>
							<FlatList
								data={displayedFriends}
								keyExtractor={(item) => item.friendshipId}
								contentContainerStyle={{ paddingBottom: 40 }}
								ItemSeparatorComponent={() => <View height={12} />}
								refreshing={isLoading}
								onRefresh={loadData}
								renderItem={renderFriendItem}
								ListFooterComponent={
									friends.length > 5 ? (
										<Button
											marginTop="$3"
											backgroundColor={Theme.surfaceMuted}
											borderWidth={1}
											borderColor={Theme.border}
											borderRadius={6}
											onPress={() => router.push("/(main)/(tabs)/chat/all-friends")}
										>
											<Button.Text color={Theme.text} fontWeight="600">
												See All Friends ({friends.length})
											</Button.Text>
										</Button>
									) : null
								}
								ListEmptyComponent={
									<View
										flex={1}
										justifyContent="center"
										alignItems="center"
										marginTop="$8"
									>
										<Text color={Theme.textMuted}>
											No friends found.
										</Text>
									</View>
								}
							/>
						</YStack>
					</YStack>
				)}
			</YStack>

			<SentRequestsModal
				isOpen={isSentModalOpen}
				onClose={handleCloseSentModal}
				sentRequests={sentRequests}
				onWithdraw={handleWithdrawRequest}
			/>
		</SafeAreaView>
	);
}
