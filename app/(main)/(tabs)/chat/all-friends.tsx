import { chatActions } from "@/api/chat-actions";
import { friendActions, FriendResponse } from "@/api/friend-actions";
import { AppHeader } from "@/components/app/AppHeader";
import FriendListItem from "@/components/chat/FriendListItem";
import { SearchInput } from "@/components/chat/SearchInput";
import { Theme } from "@/constants/Theme";
import { useRouter } from "expo-router";
import { Users } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, YStack } from "tamagui";

export default function AllFriendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<FriendResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFriends = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await friendActions.getFriends();
      if (res.success && res.data) {
        setFriends(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleStartChat = useCallback(
    async (email: string, username: string) => {
      try {
        const res = await chatActions.createChat(
          `Chat with ${username}`,
          [email],
          false,
        );
        if (res.success && res.data) {
          router.push(`/(main)/(tabs)/chat/${res.data.id}`);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [router],
  );

  const uniqueFriendsList = useMemo(() => {
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

  const filteredFriends = useMemo(() => {
    return uniqueFriendsList.filter(
      (f) =>
        f.friend.username.toLowerCase().includes(search.toLowerCase()) ||
        f.friend.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [uniqueFriendsList, search]);

  const renderFriendItem = useCallback(
    ({ item }: { item: FriendResponse }) => (
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
    ),
    [handleStartChat],
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top"]}
    >
      <YStack flex={1} backgroundColor={Theme.background}>
        <AppHeader
          title="All Friends"
          showBackButton
          onBack={() => {
            router.replace("/(main)/(tabs)/chat/friends");
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

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search friends by name or email..."
        />

        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.friendshipId}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View height={16} />}
          renderItem={renderFriendItem}
          ListEmptyComponent={
            <View
              flex={1}
              justifyContent="center"
              alignItems="center"
              marginTop="$10"
            >
              <Text color={Theme.textMuted} fontWeight="500">
                {isLoading
                  ? "Loading..."
                  : "No friends found matching your criteria."}
              </Text>
            </View>
          }
        />
      </YStack>
    </SafeAreaView>
  );
}
