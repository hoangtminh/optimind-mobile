import GlobalHeader from "@/components/app/GlobalHeader";
import { useStudySessions } from "@/contexts/StudySessionContext";
import { useUser } from "@/contexts/UserContext";
import { useTimeFormatter } from "@/hooks/useUtils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
	BarChart3,
	Calendar,
	Clock,
	Target,
	TrendingUp,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
	const navigation = useNavigation();
	const { user } = useUser();
	const { studySessions } = useStudySessions();
	const { formatDuration, formatDate } = useTimeFormatter();

	const stats = useMemo(() => {
		const totalSessions = studySessions.length;
		const totalTime = studySessions.reduce(
			(sum, session) => sum + session.duration,
			0,
		);
		const completedSessions = studySessions.filter(
			(s) => s.completed,
		).length;
		const avgSessionTime =
			totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

		// Group by date for the last 7 days
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date.toISOString().split("T")[0];
		}).reverse();

		const sessionsByDate = last7Days.map((date) => {
			const daySessions = studySessions.filter((s) => s.date === date);
			return {
				date,
				sessions: daySessions.length,
				time: daySessions.reduce((sum, s) => sum + s.duration, 0),
			};
		});

		return {
			totalSessions,
			totalTime,
			completedSessions,
			avgSessionTime,
			completionRate:
				totalSessions > 0
					? Math.round((completedSessions / totalSessions) * 100)
					: 0,
			sessionsByDate,
		};
	}, [studySessions]);

	const recentSessions = studySessions
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 10);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<GlobalHeader
				title="Study History"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Overview Stats */}
				<View className="px-6 py-6">
					<Text className="text-xl font-bold text-slate-900 mb-4">
						Your Progress
					</Text>

					<View className="grid grid-cols-2 gap-4 mb-6">
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<Clock size={20} color="#0058be" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Total Time
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{formatDuration(stats.totalTime)}
							</Text>
						</View>

						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<Target size={20} color="#10b981" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Sessions
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{stats.totalSessions}
							</Text>
							<Text className="text-xs text-slate-500 mt-1">
								{stats.completedSessions} completed
							</Text>
						</View>

						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<TrendingUp size={20} color="#f59e0b" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Avg Session
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{formatDuration(stats.avgSessionTime)}
							</Text>
						</View>

						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-2">
								<BarChart3 size={20} color="#8b5cf6" />
								<Text className="text-sm font-medium text-slate-700 ml-2">
									Success Rate
								</Text>
							</View>
							<Text className="text-2xl font-bold text-slate-900">
								{stats.completionRate}%
							</Text>
						</View>
					</View>

					{/* Weekly Chart Placeholder */}
					<View className="bg-white p-4 rounded-xl shadow-sm">
						<Text className="text-lg font-semibold text-slate-900 mb-4">
							Last 7 Days Activity
						</Text>
						<View className="flex-row justify-between items-end h-32">
							{stats.sessionsByDate.map((day, index) => (
								<View
									key={day.date}
									className="items-center flex-1"
								>
									<View
										className="bg-blue-500 rounded-t w-6 mb-2"
										style={{
											height: Math.max(
												4,
												(day.time / 60) * 20,
											), // Scale height based on hours
										}}
									/>
									<Text className="text-xs text-slate-500">
										{new Date(day.date).toLocaleDateString(
											"en-US",
											{ weekday: "short" },
										)}
									</Text>
									<Text className="text-xs text-slate-700 font-medium">
										{formatDuration(day.time)}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				{/* Recent Sessions */}
				<View className="px-6 pb-6">
					<Text className="text-xl font-bold text-slate-900 mb-4">
						Recent Sessions
					</Text>

					{recentSessions.length > 0 ? (
						<View className="space-y-3">
							{recentSessions.map((session) => (
								<View
									key={session.id}
									className="bg-white p-4 rounded-xl shadow-sm"
								>
									<View className="flex-row items-center justify-between">
										<View className="flex-row items-center">
											<View
												className={`w-3 h-3 rounded-full mr-3 ${
													session.completed
														? "bg-green-500"
														: "bg-red-500"
												}`}
											/>
											<View>
												<Text className="font-semibold text-slate-900 capitalize">
													{session.type} Session
												</Text>
												<Text className="text-sm text-slate-600">
													{formatDate(session.date)}
												</Text>
											</View>
										</View>
										<View className="items-end">
											<Text className="font-semibold text-slate-900">
												{formatDuration(
													session.duration,
												)}
											</Text>
											<Text
												className={`text-xs ${
													session.completed
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{session.completed
													? "Completed"
													: "Incomplete"}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>
					) : (
						<View className="bg-white p-8 rounded-xl shadow-sm items-center">
							<Calendar size={48} color="#cbd5e1" />
							<Text className="text-slate-600 mt-4 text-center">
								No study sessions recorded yet. Start your first
								session to see your history here!
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
