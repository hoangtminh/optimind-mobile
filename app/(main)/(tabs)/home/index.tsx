import GlobalHeader from "@/components/app/GlobalHeader";
import { useAuth } from "@/hooks/useAuth";
import { useProgressCalculator, useTimeFormatter } from "@/hooks/useUtils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
	Calendar,
	CheckCircle,
	Clock,
	Flame,
	Target,
	TrendingUp,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
	const navigation = useNavigation();
	const { user } = useAuth();
	const { formatDuration, formatRelativeTime } = useTimeFormatter();
	const { calculatePercentage, getProgressColor, getExperienceProgress } =
		useProgressCalculator();

	const weeklyGoal = 20; // Mock weekly goal
	console.log(user);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<GlobalHeader
				title="Dashboard"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Welcome Section */}
				<View className="px-6 py-6 bg-white mx-4 mt-4 rounded-2xl shadow-sm">
					<Text className="text-2xl font-bold text-slate-900 mb-2">
						Welcome back, {user?.username || "User"}! 👋
					</Text>
					<Text className="text-slate-600 mb-4">
						Ready to continue your productivity journey?
					</Text>

					{/* Level Progress */}
					{/* <View className="bg-slate-50 p-4 rounded-xl">
						<View className="flex-row items-center justify-between mb-2">
							<Text className="text-sm font-medium text-slate-700">
								Level {user?.level || 1}
							</Text>
							<Text className="text-sm text-slate-500">
								{experienceProgress.current}/
								{experienceProgress.needed} XP
							</Text>
						</View>
						<View className="w-full bg-slate-200 rounded-full h-2">
							<View
								className="bg-blue-500 h-2 rounded-full"
								style={{
									width: `${experienceProgress.percentage}%`,
								}}
							/>
						</View>
					</View> */}
				</View>

				{/* Today's Stats */}
				<View className="px-6 py-6">
					<Text className="text-xl font-bold text-slate-900 mb-4">
						Today's Progress
					</Text>

					<View className="grid grid-cols-2 gap-4">
						{/* Study Time */}
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<Clock size={20} color="#0058be" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Study Time
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{/* {formatDuration(totalTodayTime)} */}
							</Text>
							<Text className="text-xs text-slate-500 mt-1">
								{/* {completedTodaySessions} sessions completed */}
							</Text>
						</View>

						{/* Tasks Completed */}
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<CheckCircle size={20} color="#10b981" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Tasks Done
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{/* {todayTasks} */}
							</Text>
							<Text className="text-xs text-slate-500 mt-1">
								{/* out of {totalCount} total */}
							</Text>
						</View>

						{/* Current Streak */}
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<Flame size={20} color="#f59e0b" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Current Streak
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{user?.currentStreak || 0}
							</Text>
							<Text className="text-xs text-slate-500 mt-1">
								days in a row
							</Text>
						</View>

						{/* Weekly Goal */}
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<Target size={20} color="#8b5cf6" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Weekly Goal
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{/* {weeklyProgress}/{weeklyGoal} */}
							</Text>
							<View className="w-full bg-slate-200 rounded-full h-1 mt-2">
								{/* <View
									className="bg-purple-500 h-1 rounded-full"
									style={{
										width: `${calculatePercentage(weeklyProgress, weeklyGoal)}%`,
									}}
								/> */}
							</View>
						</View>
					</View>
				</View>

				{/* Quick Actions */}
				<View className="px-6 pb-6">
					<Text className="text-xl font-bold text-slate-900 mb-4">
						Quick Actions
					</Text>

					<View className="grid grid-cols-2 gap-4">
						<TouchableOpacity className="bg-blue-500 p-4 rounded-xl shadow-sm">
							<Clock size={24} color="white" className="mb-2" />
							<Text className="text-white font-semibold">
								Start Study
							</Text>
							<Text className="text-blue-100 text-sm">
								Begin a session
							</Text>
						</TouchableOpacity>

						<TouchableOpacity className="bg-green-500 p-4 rounded-xl shadow-sm">
							<CheckCircle
								size={24}
								color="white"
								className="mb-2"
							/>
							<Text className="text-white font-semibold">
								Add Task
							</Text>
							<Text className="text-green-100 text-sm">
								Create new task
							</Text>
						</TouchableOpacity>

						<TouchableOpacity className="bg-purple-500 p-4 rounded-xl shadow-sm">
							<TrendingUp
								size={24}
								color="white"
								className="mb-2"
							/>
							<Text className="text-white font-semibold">
								View Stats
							</Text>
							<Text className="text-purple-100 text-sm">
								Check progress
							</Text>
						</TouchableOpacity>

						<TouchableOpacity className="bg-orange-500 p-4 rounded-xl shadow-sm">
							<Calendar
								size={24}
								color="white"
								className="mb-2"
							/>
							<Text className="text-white font-semibold">
								Schedule
							</Text>
							<Text className="text-orange-100 text-sm">
								Plan your day
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
