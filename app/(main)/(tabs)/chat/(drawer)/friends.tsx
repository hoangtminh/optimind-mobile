import { chatActions } from "@/api/chat-actions";
import {
	friendActions,
	FriendRequestResponse,
	FriendResponse,
	SearchFriendResult,
} from "@/api/friend-actions";
import { AppHeader } from "@/components/app/AppHeader";
import FriendListItem from "@/components/chat/FriendListItem";
import FriendSearchBar from "@/components/chat/FriendSearchBar";
import { IncomingRequestItem } from "@/components/chat/IncomingRequestItem";
import { SearchResultCard } from "@/components/chat/SearchResultCard";
import { SentRequestsModal } from "@/components/chat/SentRequestsModal";
import { Theme } from "@/constants/Theme";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Users } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack } from "tamagui";

export default function FriendsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);
  const [friends, setFriends] = React.useState<FriendResponse[]>([]);
  const [incomingRequests, setIncomingRequests] = React.useState<
    FriendRequestResponse[]
  >([]);
  const [sentRequests, setSentRequests] = React.useState<
    FriendRequestResponse[]
  >([]);
  const [searchResult, setSearchResult] =
    React.useState<SearchFriendResult | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSentModalOpen, setIsSentModalOpen] = React.useState(false);

  const uniqueFriendsList = React.useMemo(() => {
    const seen = new Set<string>();
    return friends.filter((f) => {
      if (!f.friend?.id) return false;
      if (seen.has(f.friend.id)) {
        return false;
      }
      seen.add(f.friend.id);
      return true;
    });
  }, [friends]);

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
    if (searchQuery === "") {
      setSearchResult(null);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const handleSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setIsSearching(true);
    setSearchResult(null);
    setHasSearched(true);
    try {
      const res = await friendActions.searchFriendByEmail(query.trim());
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
  }, []);

  const handleClearSearch = React.useCallback(() => {
    setSearchQuery("");
    setSearchResult(null);
    setHasSearched(false);
  }, []);

  const handleAcceptRequest = React.useCallback(
    async (requestId: string) => {
      try {
        const res = await friendActions.acceptFriendRequest(requestId);
        if (res.success) {
          await loadData();
          if (searchResult) {
            const updated = await friendActions.searchFriendByEmail(
              searchResult.email,
            );
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
    },
    [loadData, searchResult],
  );

  const handleDeclineRequest = React.useCallback(
    async (requestId: string) => {
      try {
        const res = await friendActions.declineFriendRequest(requestId);
        if (res.success) {
          await loadData();
          if (searchResult) {
            const updated = await friendActions.searchFriendByEmail(
              searchResult.email,
            );
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
    },
    [loadData, searchResult],
  );

  const handleWithdrawRequest = React.useCallback(
    async (requestId: string) => {
      try {
        const res = await friendActions.withdrawFriendRequest(requestId);
        if (res.success) {
          await loadData();
          if (searchResult) {
            const updated = await friendActions.searchFriendByEmail(
              searchResult.email,
            );
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
    },
    [loadData, searchResult],
  );

  const handleAddFriend = React.useCallback(
    async (email: string) => {
      // Guard: check if friendship already exists
      const isAlreadyFriend = uniqueFriendsList.some(
        (f) => f.friend.email.toLowerCase() === email.toLowerCase(),
      );
      if (isAlreadyFriend) {
        alert("You are already friends with this user.");
        return;
      }

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
    },
    [loadData, searchResult, uniqueFriendsList],
  );

  const handleStartChat = React.useCallback(
    async (email: string, username: string) => {
      try {
        const res = await chatActions.createChat(
          `Chat with ${username}`,
          [email],
          false,
        );
        if (res.success && res.data) {
          router.push(`/(main)/(tabs)/chat/${res.data.id}`);
        } else {
          alert(res.error || "Failed to start chat");
        }
      } catch (error) {
        console.error("Start chat failed:", error);
      }
    },
    [router],
  );

  const renderFriendItem = React.useCallback(
    ({ item }: { item: FriendResponse }) => {
      return (
        <FriendListItem
          friend={{
            id: item.friend.id,
            name: item.friend.username,
            email: item.friend.email,
            isOnline: false,
          }}
          onPress={handleStartChat}
          onMessagePress={handleStartChat}
        />
      );
    },
    [handleStartChat],
  );

  const displayedFriends = React.useMemo(() => {
    return uniqueFriendsList.slice(0, 5);
  }, [uniqueFriendsList]);

  const isSearchingMode = searchQuery.trim() !== "" || hasSearched;
  const handleCloseSentModal = React.useCallback(
    () => setIsSentModalOpen(false),
    [],
  );

  // Show a full-screen loader while initial data is being fetched
  const showInitialLoader =
    isLoading &&
    friends.length === 0 &&
    incomingRequests.length === 0 &&
    sentRequests.length === 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top"]}
    >
      {showInitialLoader ? (
        <View flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={Theme.primary} />
        </View>
      ) : (
        <YStack flex={1} backgroundColor={Theme.background}>
          <AppHeader
            title="Friends"
            showBackButton
            onBack={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            rightElement={
              <Button
                icon={<Users size={20} color={Theme.text} />}
                circular
                chromeless
                pressStyle={{
                  backgroundColor: Theme.isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                }}
              />
            }
          />

          {/* Search Field & Search Button */}
          <FriendSearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isSearching={isSearching}
          />

          {/* Sent Requests Button - Always Visible */}
          <XStack
            paddingHorizontal="$4"
            paddingBottom="$3"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              fontSize="$2"
              color={Theme.textMuted}
              fontWeight="600"
              letterSpacing={0.5}
              textTransform="uppercase"
            >
              {isSearchingMode ? "Searching Network" : "Connections"}
            </Text>
            <Button
              size="$2"
              backgroundColor={Theme.primaryPastel}
              borderRadius={6}
              height={32}
              onPress={async () => {
                await loadData();
                setIsSentModalOpen(true);
              }}
              pressStyle={{ opacity: 0.8 }}
            >
              <Button.Text color={Theme.primaryPastelText} fontWeight="700">
                Sent Requests ({sentRequests.length})
              </Button.Text>
            </Button>
          </XStack>

          {isSearchingMode ? (
            <YStack flex={1} paddingHorizontal="$4" gap="$3">
              {isSearching ? (
                <View
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  marginTop="$8"
                >
                  <ActivityIndicator size="large" color={Theme.primary} />
                  <Text color={Theme.textMuted} marginTop="$2">
                    Searching user...
                  </Text>
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
                <View
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  marginTop="$8"
                >
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
                  <Text fontWeight="800" fontSize="$4" color={Theme.text}>
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
                    <ScrollView
                      nestedScrollEnabled
                      contentContainerStyle={{ gap: 8 }}
                    >
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
                <Text fontWeight="800" fontSize="$4" color={Theme.text}>
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
                    uniqueFriendsList.length > 5 ? (
                      <Button
                        marginTop="$3"
                        backgroundColor={Theme.surfaceMuted}
                        borderWidth={1}
                        borderColor={Theme.border}
                        borderRadius={6}
                        onPress={() =>
                          router.push("/(main)/(tabs)/chat/all-friends")
                        }
                      >
                        <Button.Text color={Theme.text} fontWeight="600">
                          See All Friends ({uniqueFriendsList.length})
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
                      <Text color={Theme.textMuted}>No friends found.</Text>
                    </View>
                  }
                />
              </YStack>
            </YStack>
          )}
        </YStack>
      )}

      <SentRequestsModal
        isOpen={isSentModalOpen}
        onClose={handleCloseSentModal}
        sentRequests={sentRequests}
        onWithdraw={handleWithdrawRequest}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}
