import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser } from "@/lib/types/user";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";

interface StickyUserCardProps {
	visible: boolean;
	user: LeaderboardUser | undefined;
	formatDuration: (mins: number) => string;
	bottomInsets: number;
}

export function StickyUserCard({ visible, user, formatDuration, bottomInsets }: StickyUserCardProps) {
	const translateY = useSharedValue(200);

	useEffect(() => {
		translateY.value = withSpring(visible ? 0 : 220, {
			damping: 18,
			stiffness: 110,
		});
	}, [visible]);

	if (!user) return null;

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Animated.View
			style={[
				styles.overlayContainer,
				{ paddingBottom: Math.max(bottomInsets, 12) },
				animatedStyle,
			]}
		>
			<View style={styles.headerRow}>
				<Text style={[styles.headerTitle, { color: Theme.primary }]}>
					YOUR STANDING
				</Text>
				<View style={[styles.divider, { backgroundColor: Theme.border }]} />
			</View>
			<View style={[styles.cardContainer, { backgroundColor: Theme.primaryPastel, borderColor: Theme.primary }]}>
				{/* Rank Number */}
				<View style={[styles.rankBadge, { backgroundColor: Theme.primary }]}>
					<Text style={[styles.rankText, { color: Theme.primaryText }]}>
						#{user.rank}
					</Text>
				</View>

				{/* User Info */}
				<View style={styles.userInfo}>
					<View style={styles.nameRow}>
						<Text numberOfLines={1} style={[styles.nameText, { color: Theme.text }]}>
							{user.name}
						</Text>
						<View style={styles.badgeContainer}>
							<Text style={[styles.userBadge, { backgroundColor: Theme.primary, color: Theme.primaryText }]}>
								You
							</Text>
						</View>
					</View>
					<Text style={[styles.statsText, { color: Theme.textMuted }]}>
						Level {user.level} • {user.streak} day streak
					</Text>
				</View>

				{/* Study Stats */}
				<View style={styles.studyStats}>
					<Text style={[styles.durationText, { color: Theme.text }]}>
						{formatDuration(user.totalStudyTime)}
					</Text>
					<Text style={[styles.tasksText, { color: Theme.textMuted }]}>
						{user.completedTasks} tasks
					</Text>
				</View>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	overlayContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Theme.surface,
		borderTopWidth: 1,
		borderTopColor: Theme.border,
		paddingTop: 12,
		paddingHorizontal: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -6 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 12,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	headerTitle: {
		fontSize: 11,
		fontWeight: "800",
		letterSpacing: 0.8,
	},
	divider: {
		flex: 1,
		height: 1,
		marginLeft: 10,
	},
	cardContainer: {
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 14,
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	rankBadge: {
		width: 38,
		height: 38,
		borderRadius: 19,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 14,
	},
	rankText: {
		fontSize: 13,
		fontWeight: "900",
	},
	userInfo: {
		flex: 1,
	},
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	nameText: {
		fontWeight: "700",
		fontSize: 15,
		maxWidth: 140,
	},
	badgeContainer: {
		marginLeft: 6,
		borderRadius: 8,
		overflow: "hidden",
	},
	userBadge: {
		fontSize: 10,
		paddingHorizontal: 6,
		paddingVertical: 1.5,
		fontWeight: "800",
	},
	statsText: {
		fontSize: 12,
		marginTop: 2,
		fontWeight: "500",
	},
	studyStats: {
		alignItems: "flex-end",
	},
	durationText: {
		fontSize: 16,
		fontWeight: "800",
	},
	tasksText: {
		fontSize: 10,
		marginTop: 1,
	},
});

export const MemoizedStickyUserCard = React.memo(StickyUserCard);
