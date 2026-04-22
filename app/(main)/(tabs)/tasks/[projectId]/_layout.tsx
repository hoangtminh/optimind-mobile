import { Stack } from "expo-router";
import React from "react";

export default function ProjectLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="details" />
			<Stack.Screen name="task/[taskId]" />
		</Stack>
	);
}
