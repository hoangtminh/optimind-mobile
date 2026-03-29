import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Header({
	title,
	showBack,
	showSearch,
	showCart,
	showMenu,
	showLogo,
}: {
	title?: string;
	showBack?: boolean;
	showSearch?: boolean;
	showCart?: boolean;
	showMenu?: boolean;
	showLogo?: boolean;
}) {
	const router = useRouter();

	return (
		<View className="flex-row items-center justify-between px-4 py-3 bg-white">
			{/* Left */}
			<View className="flex-row items-center flex-1">
				{showBack && (
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
						className="mr-3"
					>
						<Ionicons name="arrow-back" size={24} />
					</TouchableOpacity>
				)}
				{showMenu && (
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
						className="mr-3"
					>
						<Ionicons name="menu-outline" size={24} />
					</TouchableOpacity>
				)}
				{showLogo ? (
					<View className="flex-1"></View>
				) : (
					title && (
						<Text className="text-xl font-bold text-primary">
							{title}
						</Text>
					)
				)}
				{!title && !showSearch && <View className="flex-1" />}
			</View>

			{/* Right */}
			<View className="flex-row items-center gap-4">
				{showSearch && (
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
					>
						<Ionicons name="search-outline" size={24} />
					</TouchableOpacity>
				)}
				{showCart && (
					<TouchableOpacity
						onPress={() => {
							router.push("/(tabs)/setting");
						}}
					>
						<Ionicons name="bag-outline" size={24} />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
