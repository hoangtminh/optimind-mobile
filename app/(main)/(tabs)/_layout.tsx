import { Redirect, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";

import Sidebar from "@/components/app/sidebar";
import { useAuth } from "../../../hooks/useAuth";

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E1040",
          gap: 20,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: "#4F378A",
            justifyContent: "center",
            alignItems: "center",
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
