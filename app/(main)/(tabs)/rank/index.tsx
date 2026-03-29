import GlobalHeader from "@/components/app/GlobalHeader";
import { useUser } from "@/contexts/UserContext";
import { useTimeFormatter } from "@/hooks/useUtils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
	Clock,
	Crown,
	Medal,
	Target,
	TrendingUp,
	Trophy,
} from "lucide-react-native";
import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LeaderboardUser {
	id: string;
	name: string;
	avatar?: string;
	level: number;
	totalStudyTime: number;
	completedTasks: number;
	streak: number;
	rank: number;
	isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardUser[] = [
	{
		id: "1",
		name: "Sarah Chen",
		level: 15,
		totalStudyTime: 2150,
		completedTasks: 145,
		streak: 12,
		rank: 1,
	},
	{
		id: "2",
		name: "Alex Johnson",
		level: 12,
		totalStudyTime: 1247,
		completedTasks: 89,
		streak: 7,
		rank: 2,
		isCurrentUser: true,
	},
	{
		id: "3",
		name: "Maria Garcia",
		level: 11,
		totalStudyTime: 1180,
		completedTasks: 78,
		streak: 9,
		rank: 3,
	},
	{
		id: "4",
		name: "David Kim",
		level: 10,
		totalStudyTime: 980,
		completedTasks: 67,
		streak: 5,
		rank: 4,
	},
	{
		id: "5",
		name: "Emma Wilson",
		level: 9,
		totalStudyTime: 875,
		completedTasks: 52,
		streak: 8,
		rank: 5,
	},
];

export default function Rank() {
	const navigation = useNavigation();
	const { user } = useUser();
	const { formatDuration } = useTimeFormatter();

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown size={24} color="#f59e0b" />;
			case 2:
				return <Medal size={24} color="#9ca3af" />;
			case 3:
				return <Trophy size={24} color="#a855f7" />;
			default:
				return (
					<Text className="text-lg font-bold text-slate-500">
						#{rank}
					</Text>
				);
		}
	};

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1:
				return "bg-gradient-to-r from-yellow-400 to-yellow-600";
			case 2:
				return "bg-gradient-to-r from-gray-300 to-gray-500";
			case 3:
				return "bg-gradient-to-r from-purple-400 to-purple-600";
			default:
				return "bg-slate-100";
		}
	};

	const renderLeaderboardItem = ({ item }: { item: LeaderboardUser }) => (
		<View
			className={`p-4 rounded-xl mb-3 ${
				item.isCurrentUser
					? "bg-blue-50 border-2 border-blue-200"
					: "bg-white"
			} shadow-sm`}
		>
			<View className="flex-row items-center">
				{/* Rank */}
				<View
					className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${getRankColor(item.rank)}`}
				>
					{getRankIcon(item.rank)}
				</View>

				{/* User Info */}
				<View className="flex-1">
					<View className="flex-row items-center">
						<Text
							className={`font-semibold text-lg ${
								item.isCurrentUser
									? "text-blue-900"
									: "text-slate-900"
							}`}
						>
							{item.name}
						</Text>
						{item.isCurrentUser && (
							<Text className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full ml-2">
								You
							</Text>
						)}
					</View>
					<Text className="text-slate-600 text-sm">
						Level {item.level} •{" "}
						{formatDuration(item.totalStudyTime)} total
					</Text>
				</View>

				{/* Stats */}
				<View className="items-end">
					<Text className="text-2xl font-bold text-slate-900">
						{item.completedTasks}
					</Text>
					<Text className="text-xs text-slate-500">tasks</Text>
				</View>
			</View>

			{/* Additional Stats */}
			<View className="flex-row justify-between mt-3 pt-3 border-t border-slate-100">
				<View className="flex-row items-center">
					<Clock size={14} color="#64748b" />
					<Text className="text-xs text-slate-600 ml-1">
						{formatDuration(item.totalStudyTime)}
					</Text>
				</View>
				<View className="flex-row items-center">
					<TrendingUp size={14} color="#64748b" />
					<Text className="text-xs text-slate-600 ml-1">
						{item.streak} day streak
					</Text>
				</View>
				<View className="flex-row items-center">
					<Target size={14} color="#64748b" />
					<Text className="text-xs text-slate-600 ml-1">
						{item.completedTasks} completed
					</Text>
				</View>
			</View>
		</View>
	);

	const currentUserRank =
		mockLeaderboard.find((user) => user.isCurrentUser)?.rank || 0;

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<GlobalHeader
				title="Leaderboard"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Current User Rank Card */}
				<View className="mx-6 mt-6 mb-6">
					<View className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg">
						<View className="flex-row items-center justify-between">
							<View>
								<Text className="text-white text-lg font-semibold mb-1">
									Your Rank
								</Text>
								<Text className="text-blue-100 text-sm">
									Keep climbing the leaderboard!
								</Text>
							</View>
							<View className="items-center">
								<Text className="text-4xl font-bold text-white">
									#{currentUserRank}
								</Text>
								<Text className="text-blue-100 text-sm">
									of {mockLeaderboard.length}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Leaderboard */}
				<View className="px-6 pb-6">
					<Text className="text-xl font-bold text-slate-900 mb-4">
						Top Performers
					</Text>

					<FlatList
						data={mockLeaderboard}
						renderItem={renderLeaderboardItem}
						keyExtractor={(item) => item.id}
						scrollEnabled={false}
						showsVerticalScrollIndicator={false}
					/>

					{/* Encouragement Message */}
					<View className="bg-slate-50 p-6 rounded-xl mt-6">
						<Text className="text-center text-slate-700 font-medium mb-2">
							Keep up the great work! 📈
						</Text>
						<Text className="text-center text-slate-600 text-sm">
							Consistency is key to reaching the top. Study
							regularly and complete your tasks to climb the
							ranks.
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
