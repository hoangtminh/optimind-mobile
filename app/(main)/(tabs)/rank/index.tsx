import GlobalHeader from "@/components/app/GlobalHeader";
import { useUser } from "@/contexts/UserContext";
import { useTimeFormatter } from "@/hooks/useUtils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { userActions } from "@/api/user-actions";
import { LeaderboardUser, LeaderboardResponse } from "@/lib/types/user";

// Separated Subcomponents
import { MemoizedPodium } from "@/components/rank/Podium";
import { MemoizedLeaderboardRow } from "@/components/rank/LeaderboardRow";
import { MemoizedStickyUserCard } from "@/components/rank/StickyUserCard";
import { LeaderboardSkeletons } from "@/components/rank/LeaderboardSkeletons";

export default function Rank() {
	const navigation = useNavigation();
	const { user: currentUserProfile } = useUser();
	const { formatDuration } = useTimeFormatter();
	const insets = useSafeAreaInsets();

	const [data, setData] = useState<LeaderboardResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [refreshing, setRefreshing] = useState<boolean>(false);

	// Visibility states to trigger sticky bottom card
	const [isUserCardVisible, setIsUserCardVisible] = useState<boolean>(false);
	const [firstVisibleIndex, setFirstVisibleIndex] = useState<number>(0);

	const fetchLeaderboard = async (showLoader = true) => {
		if (showLoader) setLoading(true);
		try {
			const res = await userActions.getLeaderboard();
			if (res.success && res.data) {
				setData(res.data);
			}
		} catch (error) {
			console.error("Failed to fetch leaderboard", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		fetchLeaderboard(false);
	};

	// Stable viewability tracking to avoid FlatList recreation issues
	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems && viewableItems.length > 0) {
			const isVisible = viewableItems.some(
				(vItem: any) => vItem.item && vItem.item.isCurrentUser
			);
			setIsUserCardVisible(isVisible);
			setFirstVisibleIndex(viewableItems[0].index ?? 0);
		}
	}).current;

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 10,
	}).current;

	// Render row helper for users rank 4+ (uses memoized subcomponent)
	const renderLeaderboardItem = useCallback(
		({ item }: { item: LeaderboardUser }) => (
			<MemoizedLeaderboardRow item={item} formatDuration={formatDuration} />
		),
		[formatDuration]
	);

	// Computes whether to show the sticky footer reference card
	const getStickyCardVisibility = () => {
		if (!data) return false;
		const userIndex = data.topUsers.findIndex((u) => u.id === currentUserProfile?.id);

		// If user is not in top 100, they are never visible in the list -> always sticky at the bottom
		if (userIndex === -1) return true;

		// If user is in top 3, they are in the podium header -> never sticky at the bottom
		if (userIndex < 3) return false;

		// User is in ranks 4-100. Their index in the FlatList is userIndex - 3.
		// Show sticky card if their row is NOT visible on screen AND we haven't scrolled past them.
		const listIndex = userIndex - 3;
		const hasNotScrolledPast = firstVisibleIndex <= listIndex;

		return !isUserCardVisible && hasNotScrolledPast;
	};

	const showStickyCard = getStickyCardVisibility();
	const userOnLeaderboard = data?.currentUser;

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
						data={data?.topUsers.slice(3) ?? []}
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
				</View>
			)}
		</SafeAreaView>
	);
}
