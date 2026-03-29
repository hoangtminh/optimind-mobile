import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import CustomTabBar from "@/components/app/CustomTabBar";
import { useAuth } from "../../../hooks/useAuth";

export default function TabLayout() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color="#0058be" />
			</View>
		);
	}

	if (!user) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	return (
		<Tabs
			tabBar={(props) => <CustomTabBar {...props} />}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen name="home/index" />
			<Tabs.Screen name="study/index" />
			<Tabs.Screen name="tasks/index" />
			<Tabs.Screen name="chat/index" />
			<Tabs.Screen name="history/index" />
			<Tabs.Screen name="rank/index" />
			<Tabs.Screen name="setting" />
		</Tabs>
	);
}
