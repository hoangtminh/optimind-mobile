import { Stack } from "expo-router";
import React from "react";

export default function ChatLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="(drawer)" />
			<Stack.Screen name="[id]" />
			<Stack.Screen name="all-friends" />
			<Stack.Screen name="info/[id]" />
		</Stack>
	);
}
