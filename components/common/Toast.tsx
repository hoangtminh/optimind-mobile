import React from "react";
import { Toaster } from "sonner-native";
import { useSettings } from "@/contexts/SettingsContext";

export { toast } from "sonner-native";

export function ToastContainer() {
	const { settings } = useSettings();
	return <Toaster theme={settings.darkMode ? "dark" : "light"} />;
}
