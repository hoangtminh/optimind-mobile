import { Redirect, Tabs, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import CustomTabBar from "@/components/app/CustomTabBar";
import { useAuth } from "../../../hooks/useAuth";

export default function TabLayout() {
	const { user, isLoading } = useAuth();
	const segments = useSegments();

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

	// Hide tab bar when deep inside the chat stack (e.g., chat/[id] or chat/info/[id])
	const isChatDetail =
		segments.includes("chat" as never) &&
		segments.includes("[id]" as never);

	return (
		<Tabs
			tabBar={(props) =>
				isChatDetail ? null : <CustomTabBar {...props} />
			}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen name="home/index" />
			<Tabs.Screen name="study/index" />
			<Tabs.Screen name="tasks" />
			<Tabs.Screen name="chat/index" />
			<Tabs.Screen name="history/index" />
			<Tabs.Screen name="rank/index" />
			<Tabs.Screen name="setting" />
			<Tabs.Screen name="mediapipe" />
		</Tabs>
	);
}
