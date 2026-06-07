import React from "react";
import { Toaster } from "sonner-native";

export { toast } from "sonner-native";

export function ToastContainer() {
	return <Toaster theme="light" />;
}
