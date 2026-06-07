import { Theme } from "@/constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import { ExpoStatusBar } from "expo-status-bar";
import React from "react";
import {
	Platform,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface GlobalHeaderProps {
	title: string;
	onMenu: () => void;
	onAction?: () => void;
	actionIconName?: React.ComponentProps<typeof MaterialIcons>["name"];
}

export default function GlobalHeader({
	title,
	onMenu,
	onAction,
	actionIconName,
}: GlobalHeaderProps) {
	return (
		<>
			<View
				style={{
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
					backgroundColor: Theme.surface,
					borderBottomWidth: 1,
					borderBottomColor: Theme.border,
					paddingHorizontal: 16,
					height: 56,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<TouchableOpacity onPress={onMenu} style={{ padding: 8 }}>
					<MaterialIcons name="menu" size={24} color={Theme.text} />
				</TouchableOpacity>

				<Text
					style={{
						color: Theme.text,
						fontSize: 18,
						fontWeight: "700",
						letterSpacing: -0.2,
					}}
				>
					{title}
				</Text>

				{onAction && actionIconName ? (
					<TouchableOpacity onPress={onAction} style={{ padding: 8 }}>
						<MaterialIcons
							name={actionIconName}
							size={24}
							color={Theme.text}
						/>
					</TouchableOpacity>
				) : (
					<View style={{ width: 40 }} />
				)}
			</View>
		</>
	);
}
