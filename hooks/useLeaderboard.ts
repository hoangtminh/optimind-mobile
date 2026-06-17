import { useUser } from "@/contexts/UserContext";
import { useTimeFormatter } from "@/hooks/useUtils";
import { userActions } from "@/api/user-actions";
import { LeaderboardUser, LeaderboardResponse } from "@/lib/types/user";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

export function useLeaderboard() {
  const { user: currentUserProfile } = useUser();
  const { formatDuration } = useTimeFormatter();

  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Visibility states to trigger sticky bottom card
  const [isUserCardVisible, setIsUserCardVisible] = useState<boolean>(false);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState<number>(0);

  const fetchLeaderboard = useCallback(async (showLoader = true) => {
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
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard(false);
  }, [fetchLeaderboard]);

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

  // Computes whether to show the sticky footer reference card
  const showStickyCard = useMemo(() => {
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
  }, [data, currentUserProfile?.id, firstVisibleIndex, isUserCardVisible]);

  const userOnLeaderboard = data?.currentUser;

  return {
    data,
    loading,
    refreshing,
    onRefresh,
    showStickyCard,
    userOnLeaderboard,
    onViewableItemsChanged,
    viewabilityConfig,
    formatDuration,
  };
}
