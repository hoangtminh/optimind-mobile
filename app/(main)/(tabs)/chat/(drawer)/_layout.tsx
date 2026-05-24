import { Theme } from "@/constants/Theme";
import { Tabs } from "expo-router";
import { MessageSquare, Users } from "lucide-react-native";

export default function ChatTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.textMuted,
        tabBarStyle: {
          backgroundColor: Theme.surface,
          borderTopWidth: 1,
          borderTopColor: Theme.border,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <MessageSquare color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
