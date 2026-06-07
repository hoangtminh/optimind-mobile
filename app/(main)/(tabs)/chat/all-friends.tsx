import { friendActions, FriendResponse } from "@/api/friend-actions";
import { chatActions } from "@/api/chat-actions";
import { FriendListItem } from "@/components/chat/FriendListItem";
import { SearchInput } from "@/components/chat/SearchInput";
import { AppHeader } from "@/components/common/AppHeader";
import { useRouter } from "expo-router";
import { Users } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, YStack } from "tamagui";

export default function AllFriendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<FriendResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFriends = async () => {
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
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleStartChat = async (email: string, username: string) => {
    try {
      const res = await chatActions.createChat(`Chat with ${username}`, [email], false);
      if (res.success && res.data) {
        router.push(`/(main)/(tabs)/chat/${res.data.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFriends = friends.filter((f) =>
    f.friend.username.toLowerCase().includes(search.toLowerCase()) ||
    f.friend.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8f9fb" }}
      edges={["top"]}
    >
      <YStack flex={1} backgroundColor="#fdf7ff">
        <AppHeader
          title="All Friends"
          showBackButton
          onBack={() => {
            router.replace("/(main)/(tabs)/chat/friends");
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
          placeholder="Search friends by name or email..."
        />

        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.friendshipId}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View height={16} />}
          renderItem={({ item }) => (
            <FriendListItem
              friend={{
                id: item.friend.id,
                name: item.friend.username,
                isOnline: false,
              }}
              onPress={() => handleStartChat(item.friend.email, item.friend.username)}
              onMessagePress={() => handleStartChat(item.friend.email, item.friend.username)}
            />
          )}
          ListEmptyComponent={
            <View
              flex={1}
              justifyContent="center"
              alignItems="center"
              marginTop="$10"
            >
              <Text color="$on_surface_variant" fontWeight="500">
                {isLoading ? "Loading..." : "No friends found matching your criteria."}
              </Text>
            </View>
          }
        />
      </YStack>
    </SafeAreaView>
  );
}
