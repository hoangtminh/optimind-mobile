import { FriendListItem } from "@/components/chat/FriendListItem";
import { SearchInput } from "@/components/chat/SearchInput";
import { AppHeader } from "@/components/common/AppHeader";
import { useRouter } from "expo-router";
import { Users } from "lucide-react-native";
import { useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View, YStack } from "tamagui";

// --- Extended Mock Data ---
const MOCK_ALL_FRIENDS = [
  {
    id: "u2",
    name: "Emily Carter",
    isOnline: true,
    role: "Ph.D. Architecture",
  },
  {
    id: "u3",
    name: "David Chen",
    isOnline: false,
    role: "M.Sc. Data Ethics",
  },
  {
    id: "u4",
    name: "Sophia Rodriguez",
    isOnline: true,
    role: "Digital Humanities",
  },
  {
    id: "u5",
    name: "Michael Johnson",
    isOnline: false,
    role: "B.A. Urban Planning",
  },
  {
    id: "u6",
    name: "Olivia Williams",
    isOnline: true,
    role: "Computer Science",
  },
  { id: "u7", name: "Daniel Brown", isOnline: false, role: "Physics" },
  { id: "u8", name: "Ava Garcia", isOnline: true, role: "Mathematics" },
  { id: "u9", name: "James Miller", isOnline: false, role: "Biology" },
  { id: "u10", name: "Isabella Davis", isOnline: true, role: "Chemistry" },
  { id: "u11", name: "Liam Wilson", isOnline: false, role: "Literature" },
  { id: "u12", name: "Noah Martinez", isOnline: true, role: "Economics" },
  { id: "u13", name: "Emma Taylor", isOnline: false, role: "Psychology" },
];

export default function AllFriendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredFriends = MOCK_ALL_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8f9fb" }}
      edges={["top"]}
    >
      <YStack flex={1} backgroundColor="#fdf7ff">
        <AppHeader
          title="Academic Network"
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
          placeholder="Search scholars and peers..."
        />

        {/* Breathable List (No dividers, generous spacing) */}
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View height={16} />}
          renderItem={({ item }) => (
            <FriendListItem
              friend={item}
              onPress={() => console.log("Open profile:", item.id)}
              onMessagePress={() => console.log("Open chat:", item.id)}
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
                No peers found matching your criteria.
              </Text>
            </View>
          }
        />
      </YStack>
    </SafeAreaView>
  );
}
