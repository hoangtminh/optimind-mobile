import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { MessageSquare, Users } from "lucide-react-native";
import React from "react";
import { Text, View } from "tamagui";

function CustomDrawerContent(props: any) {
	return (
		<DrawerContentScrollView {...props}>
			<View padding="$4" paddingBottom="$2">
				<Text fontSize="$6" fontWeight="700" color="$on_surface">
					Social Drawer
				</Text>
			</View>
			<DrawerItemList {...props} />
		</DrawerContentScrollView>
	);
}

export default function ChatDrawerLayout() {
	return (
		<Drawer
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerActiveTintColor: "#0058be",
				drawerInactiveTintColor: "#424754",
				drawerLabelStyle: { fontWeight: "600", marginLeft: -20 },
			}}
		>
			<Drawer.Screen
				name="messages"
				options={{
					title: "Messages",
					drawerIcon: ({ color, size }) => (
						<MessageSquare color={color} size={size} />
					),
				}}
			/>
			<Drawer.Screen
				name="friends"
				options={{
					title: "Friends",
					drawerIcon: ({ color, size }) => (
						<Users color={color} size={size} />
					),
				}}
			/>
		</Drawer>
	);
}
