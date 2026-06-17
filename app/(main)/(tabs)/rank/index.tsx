import GlobalHeader from "@/components/app/GlobalHeader";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import React, { useCallback, useState } from "react";
import {
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LeaderboardUser } from "@/lib/types/user";
import { useLeaderboard } from "@/hooks/useLeaderboard";

// Separated Subcomponents
import { MemoizedPodium } from "@/components/rank/Podium";
import { MemoizedLeaderboardRow } from "@/components/rank/LeaderboardRow";
import { MemoizedStickyUserCard } from "@/components/rank/StickyUserCard";
import { LeaderboardSkeletons } from "@/components/rank/LeaderboardSkeletons";
import UserDetailModal from "@/components/rank/UserDetailModal";

export default function Rank() {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		data,
		loading,
		refreshing,
		onRefresh,
		showStickyCard,
		userOnLeaderboard,
		onViewableItemsChanged,
		viewabilityConfig,
		formatDuration,
	} = useLeaderboard();

	const handleUserPress = useCallback((user: LeaderboardUser) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	}, []);

	// Render row helper for users (uses memoized subcomponent)
	const renderLeaderboardItem = useCallback(
		({ item }: { item: LeaderboardUser }) => (
			<MemoizedLeaderboardRow
				item={item}
				formatDuration={formatDuration}
				onPress={handleUserPress}
			/>
		),
		[formatDuration, handleUserPress]
	);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Theme.background }} edges={["top"]}>
			<GlobalHeader
				title="Leaderboard"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			{loading ? (
				<LeaderboardSkeletons />
			) : (
				<View style={{ flex: 1 }}>
					<FlatList
						data={data?.topUsers.slice(0, 100) ?? []}
						renderItem={renderLeaderboardItem}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingBottom: showStickyCard ? 150 : 40,
							paddingTop: 12,
						}}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								colors={[Theme.primary]}
								tintColor={Theme.primary}
							/>
						}
						onViewableItemsChanged={onViewableItemsChanged}
						viewabilityConfig={viewabilityConfig}
						ListHeaderComponent={
							<View>
								{/* Top 3 Podium component */}
								{data?.topUsers && data.topUsers.length > 0 && (
									<MemoizedPodium
										top3={data.topUsers.slice(0, 3)}
										formatDuration={formatDuration}
										onPress={handleUserPress}
									/>
								)}

								{/* Title Label */}
								<Text
									style={{
										fontSize: 18,
										fontWeight: "800",
										color: Theme.text,
										marginHorizontal: 24,
										marginBottom: 14,
										letterSpacing: -0.2,
									}}
								>
									Rankings
								</Text>

								{/* Empty State */}
								{(!data || data.topUsers.length === 0) && (
									<View
										style={{
											alignItems: "center",
											justifyContent: "center",
											paddingVertical: 40,
											marginHorizontal: 24,
										}}
									>
										<Text style={{ fontSize: 16, fontWeight: "600", color: Theme.textMuted }}>
											No study records yet! 📚
										</Text>
										<Text style={{ fontSize: 13, color: Theme.textMuted, textAlign: "center", marginTop: 6 }}>
											Start studying to become the first on the leaderboard.
										</Text>
									</View>
								)}
							</View>
						}
					/>

					{/* Bottom sticky card overlay */}
					<MemoizedStickyUserCard
						visible={showStickyCard}
						user={userOnLeaderboard}
						formatDuration={formatDuration}
						bottomInsets={insets.bottom}
					/>

					{/* Detailed User Information Modal */}
					<UserDetailModal
						visible={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						user={selectedUser}
					/>
				</View>
			)}
		</SafeAreaView>
	);
}
