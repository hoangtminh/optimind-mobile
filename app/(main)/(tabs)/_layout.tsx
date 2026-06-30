import { Redirect, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import RNOrientationDirector, {
  Orientation,
} from "react-native-orientation-director";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import Sidebar from "@/components/app/sidebar";
import { Image } from "tamagui";
import { useAuth } from "../../../hooks/useAuth";

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    RNOrientationDirector.lockTo(Orientation.portrait);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2D185C",
          gap: 20,
        }}
      >
        <Image
          src={require("@/assets/images/icon.png")}
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
          }}
        />
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const isChatDetail =
    segments.includes("chat" as never) && segments.includes("[id]" as never);

  return (
    <Drawer
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: !isChatDetail,
      }}
    >
      <Drawer.Screen name="study/index" />
      <Drawer.Screen name="tasks" />
      <Drawer.Screen name="chat" />
      <Drawer.Screen name="history/index" />
      <Drawer.Screen name="rank/index" />
      <Drawer.Screen name="setting" />
    </Drawer>
  );
}
