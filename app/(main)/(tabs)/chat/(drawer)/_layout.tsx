import { Theme } from "@/constants/Theme";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { MessageSquare, Users } from "lucide-react-native";
import { Text, View } from "tamagui";

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: Theme.surface }}
    >
      <View padding="$4" paddingBottom="$2">
        <Text fontSize="$6" fontWeight="700" color={Theme.text}>
          Social Drawer
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function ChatDrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Theme.primary,
        drawerInactiveTintColor: Theme.textMuted,
        drawerLabelStyle: { fontWeight: "600", marginLeft: 20 },
        drawerStyle: { backgroundColor: Theme.surface },
      }}
    >
      <Drawer.Screen
        name="messages"
        options={{
          title: "Messages",
          drawerIcon: ({ color, size }) => (
            <MessageSquare color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="friends"
        options={{
          title: "Friends",
          drawerIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}
