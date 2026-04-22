import { Delegate } from "@/components/faceLandmarkDetection/types";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { AppSettings, SettingsContext } from "./app-settings";

export default function MediapipeLayout() {
	const [settings, setSettings] = React.useState<AppSettings>({
		maxResults: 5,
		threshold: 20,
		processor: Delegate.GPU,
		model: "efficientdet-lite0",
	});
	return (
		<SettingsContext.Provider value={{ settings, setSettings }}>
			<Drawer screenOptions={{ headerShown: true }}>
				<Drawer.Screen
					name="index"
					options={{
						drawerLabel: "Camera Stream",
						title: "Camera Stream",
					}}
				/>
				<Drawer.Screen
					name="Photo"
					options={{
						drawerLabel: "Photo",
						title: "Photo",
					}}
				/>
			</Drawer>
		</SettingsContext.Provider>
	);
}
