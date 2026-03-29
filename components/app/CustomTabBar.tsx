import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
	BookOpen,
	Clock,
	Home,
	ListTodo,
	MessageCircle,
	Settings,
	Trophy,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	const tabs = [
		{ name: "home", icon: Home, label: "Home" },
		{ name: "study", icon: BookOpen, label: "Study" },
		{ name: "task", icon: ListTodo, label: "Task" },
		{ name: "chat", icon: MessageCircle, label: "Chat" },
		{ name: "history", icon: Clock, label: "History" },
		{ name: "rank", icon: Trophy, label: "Rank" },
		{ name: "setting", icon: Settings, label: "Setting" },
	];

	return (
		<View style={styles.container}>
			{tabs.map((tab, index) => {
				const isFocused = state.index === index;
				const IconComponent = tab.icon;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: state.routes[index].key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(state.routes[index].name);
					}
				};

				return (
					<TouchableOpacity
						key={tab.name}
						onPress={onPress}
						style={[styles.tab, isFocused && styles.activeTab]}
					>
						<IconComponent
							size={20}
							color={isFocused ? "#0058be" : "#64748b"}
						/>
						<Text
							style={[
								styles.label,
								isFocused && styles.activeLabel,
							]}
						>
							{tab.label}
						</Text>
						{isFocused && <View style={styles.indicator} />}
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#f1f5f9",
		paddingBottom: 10,
		paddingTop: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 5,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		position: "relative",
	},
	activeTab: {
		backgroundColor: "#f0f9ff",
		borderRadius: 10,
	},
	label: {
		fontSize: 10,
		fontWeight: "600",
		color: "#64748b",
		marginTop: 4,
		textAlign: "center",
	},
	activeLabel: {
		color: "#0058be",
	},
	indicator: {
		position: "absolute",
		bottom: -3,
		width: "60%",
		height: 3,
		backgroundColor: "#0058be",
		borderRadius: 2,
	},
});

export default CustomTabBar;
