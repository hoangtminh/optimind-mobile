import { MaterialIcons } from "@expo/vector-icons";
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Sidebar = (props: DrawerContentComponentProps) => {
	const { navigation } = props;

	const closeDrawer = () => navigation.closeDrawer();

	return (
		<View style={styles.outerContainer}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={styles.drawerContent}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Focus Studio</Text>
					<MaterialIcons
						name="close"
						size={26}
						color="#f5f7fa"
						onPress={closeDrawer}
					/>
				</View>

				<DrawerItem
					label="Study"
					labelStyle={styles.label}
					icon={() => (
						<MaterialIcons name="book" size={24} color="#f5f7fa" />
					)}
					onPress={() => {
						navigation.navigate("study");
						closeDrawer();
					}}
				/>

				<DrawerItem
					label="Chat"
					labelStyle={styles.label}
					icon={() => (
						<MaterialIcons name="chat" size={24} color="#f5f7fa" />
					)}
					onPress={() => {
						navigation.navigate("chat");
						closeDrawer();
					}}
				/>

				<DrawerItem
					label="Task"
					labelStyle={styles.label}
					icon={() => (
						<MaterialIcons
							name="check-circle"
							size={24}
							color="#f5f7fa"
						/>
					)}
					onPress={() => {
						navigation.navigate("task");
						closeDrawer();
					}}
				/>

				<DrawerItem
					label="History"
					labelStyle={styles.label}
					icon={() => (
						<MaterialIcons
							name="history"
							size={24}
							color="#f5f7fa"
						/>
					)}
					onPress={() => {
						navigation.navigate("history");
						closeDrawer();
					}}
				/>

				<DrawerItem
					label="Profile"
					labelStyle={styles.label}
					icon={() => (
						<MaterialIcons
							name="person"
							size={24}
							color="#f5f7fa"
						/>
					)}
					onPress={() => {
						navigation.navigate("Profile");
						closeDrawer();
					}}
				/>
			</DrawerContentScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		backgroundColor: "#0f1b30",
	},
	drawerContent: {
		paddingTop: 40,
	},
	header: {
		marginBottom: 20,
		paddingHorizontal: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		color: "#f5f7fa",
		fontSize: 22,
		fontWeight: "800",
	},
	label: {
		color: "#e2e8f0",
		fontSize: 16,
		fontWeight: "600",
	},
});

export default Sidebar;
