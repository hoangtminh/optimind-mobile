import GlobalHeader from "@/components/app/GlobalHeader";
import { useUser } from "@/contexts/UserContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
	Bell,
	ChevronRight,
	HelpCircle,
	LogOut,
	Moon,
	Palette,
	Shield,
	Sun,
	Target,
	Timer,
	User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
	Alert,
	ScrollView,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItemProps {
	title: string;
	subtitle?: string;
	icon: React.ReactNode;
	onPress?: () => void;
	rightComponent?: React.ReactNode;
	showChevron?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
	title,
	subtitle,
	icon,
	onPress,
	rightComponent,
	showChevron = true,
}) => (
	<TouchableOpacity
		onPress={onPress}
		className="flex-row items-center p-4 bg-white rounded-xl shadow-sm mb-3"
		disabled={!onPress}
	>
		<View className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center mr-4">
			{icon}
		</View>
		<View className="flex-1">
			<Text className="text-slate-900 font-medium text-base">
				{title}
			</Text>
			{subtitle && (
				<Text className="text-slate-600 text-sm mt-1">{subtitle}</Text>
			)}
		</View>
		{rightComponent}
		{showChevron && onPress && <ChevronRight size={20} color="#cbd5e1" />}
	</TouchableOpacity>
);

export default function Setting() {
	const navigation = useNavigation();
	const { user } = useUser();
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [autoBreak, setAutoBreak] = useState(true);

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: () => {
					// Handle logout logic here
					console.log("User logged out");
				},
			},
		]);
	};

	const settingSections = [
		{
			title: "Account",
			items: [
				{
					title: "Profile",
					subtitle:
						user?.username || "Update your profile information",
					icon: <User size={20} color="#0058be" />,
					onPress: () => console.log("Navigate to profile"),
				},
				{
					title: "Notifications",
					subtitle: "Manage notification preferences",
					icon: <Bell size={20} color="#10b981" />,
					rightComponent: (
						<Switch
							value={notifications}
							onValueChange={setNotifications}
							trackColor={{ false: "#cbd5e1", true: "#10b981" }}
							thumbColor={notifications ? "#ffffff" : "#f4f3f4"}
						/>
					),
					showChevron: false,
				},
			],
		},
		{
			title: "Appearance",
			items: [
				{
					title: "Dark Mode",
					subtitle: "Toggle dark theme",
					icon: darkMode ? (
						<Moon size={20} color="#8b5cf6" />
					) : (
						<Sun size={20} color="#f59e0b" />
					),
					rightComponent: (
						<Switch
							value={darkMode}
							onValueChange={setDarkMode}
							trackColor={{ false: "#cbd5e1", true: "#8b5cf6" }}
							thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
						/>
					),
					showChevron: false,
				},
				{
					title: "Theme",
					subtitle: "Choose your preferred theme",
					icon: <Palette size={20} color="#f59e0b" />,
					onPress: () => console.log("Navigate to theme settings"),
				},
			],
		},
		{
			title: "Study Settings",
			items: [
				{
					title: "Timer Preferences",
					subtitle: "Customize Pomodoro settings",
					icon: <Timer size={20} color="#ef4444" />,
					onPress: () => console.log("Navigate to timer settings"),
				},
				{
					title: "Goals & Targets",
					subtitle: "Set daily and weekly goals",
					icon: <Target size={20} color="#8b5cf6" />,
					onPress: () => console.log("Navigate to goals settings"),
				},
				{
					title: "Sound Effects",
					subtitle: "Enable/disable timer sounds",
					icon: <Bell size={20} color="#06b6d4" />,
					rightComponent: (
						<Switch
							value={soundEnabled}
							onValueChange={setSoundEnabled}
							trackColor={{ false: "#cbd5e1", true: "#06b6d4" }}
							thumbColor={soundEnabled ? "#ffffff" : "#f4f3f4"}
						/>
					),
					showChevron: false,
				},
				{
					title: "Auto Break",
					subtitle: "Automatically start break after session",
					icon: <Timer size={20} color="#10b981" />,
					rightComponent: (
						<Switch
							value={autoBreak}
							onValueChange={setAutoBreak}
							trackColor={{ false: "#cbd5e1", true: "#10b981" }}
							thumbColor={autoBreak ? "#ffffff" : "#f4f3f4"}
						/>
					),
					showChevron: false,
				},
			],
		},
		{
			title: "Support",
			items: [
				{
					title: "Help & FAQ",
					subtitle: "Get help and find answers",
					icon: <HelpCircle size={20} color="#64748b" />,
					onPress: () => console.log("Navigate to help"),
				},
				{
					title: "Privacy Policy",
					subtitle: "Read our privacy policy",
					icon: <Shield size={20} color="#64748b" />,
					onPress: () => console.log("Navigate to privacy policy"),
				},
			],
		},
	];

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<GlobalHeader
				title="Settings"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				{/* User Info Card */}
				<View className="bg-white p-6 rounded-xl shadow-sm mb-6">
					<View className="items-center">
						<View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-3">
							<Text className="text-white text-2xl font-bold">
								{user?.username?.charAt(0).toUpperCase() || "U"}
							</Text>
						</View>
						<Text className="text-xl font-semibold text-slate-900 mb-1">
							{user?.username || "User"}
						</Text>
						<Text className="text-slate-600 mb-2">
							{user?.email || "user@example.com"}
						</Text>
						<View className="flex-row items-center">
							<Text className="text-sm text-slate-500">
								Level {user?.level || 1} • {user?.exp || 0} XP
							</Text>
						</View>
					</View>
				</View>

				{/* Settings Sections */}
				{settingSections.map((section, sectionIndex) => (
					<View key={sectionIndex} className="mb-6">
						<Text className="text-lg font-semibold text-slate-900 mb-3 px-1">
							{section.title}
						</Text>
						{section.items.map((item, itemIndex) => (
							<SettingItem key={itemIndex} {...item} />
						))}
					</View>
				))}

				{/* Logout Button */}
				<View className="mt-6">
					<TouchableOpacity
						onPress={handleLogout}
						className="bg-red-500 p-4 rounded-xl shadow-sm items-center"
					>
						<View className="flex-row items-center">
							<LogOut size={20} color="white" />
							<Text className="text-white font-semibold text-base ml-3">
								Logout
							</Text>
						</View>
					</TouchableOpacity>
				</View>

				{/* App Version */}
				<View className="items-center mt-8">
					<Text className="text-slate-500 text-sm">
						Optimind v1.0.0
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
