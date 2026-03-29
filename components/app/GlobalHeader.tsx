import { MaterialIcons } from "@expo/vector-icons";
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
		<View
			style={{
				paddingTop:
					Platform.OS === "android" ? StatusBar.currentHeight : 0,
				backgroundColor: "#071b2e",
				paddingHorizontal: 16,
				paddingBottom: 12,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<TouchableOpacity onPress={onMenu} style={{ padding: 8 }}>
				<MaterialIcons name="menu" size={26} color="#f5f7fa" />
			</TouchableOpacity>

			<Text
				style={{
					color: "#f5f7fa",
					fontSize: 20,
					fontWeight: "700",
					letterSpacing: 0.5,
				}}
			>
				{title}
			</Text>

			{onAction && actionIconName ? (
				<TouchableOpacity onPress={onAction} style={{ padding: 8 }}>
					<MaterialIcons
						name={actionIconName}
						size={24}
						color="#f5f7fa"
					/>
				</TouchableOpacity>
			) : (
				<View style={{ width: 32 }} />
			)}
		</View>
	);
}
