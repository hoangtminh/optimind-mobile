import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser } from "@/lib/types/user";

interface StickyUserCardProps {
	visible: boolean;
	user: LeaderboardUser | undefined;
	formatDuration: (mins: number) => string;
	bottomInsets: number;
}

export function StickyUserCard({ visible, user, formatDuration, bottomInsets }: StickyUserCardProps) {
	if (!visible || !user) return null;

	return (
		<View
			style={[
				styles.overlayContainer,
				{ paddingBottom: Math.max(bottomInsets, 12) },
			]}
		>
			<View style={styles.headerRow}>
				<Text style={styles.headerTitle}>
					YOUR STANDING
				</Text>
				<View style={styles.divider} />
			</View>
			<View style={styles.cardContainer}>
				{/* Rank Number */}
				<View style={styles.rankBadge}>
					<Text style={styles.rankText}>
						#{user.rank}
					</Text>
				</View>

				{/* User Info */}
				<View style={styles.userInfo}>
					<View style={styles.nameRow}>
						<Text numberOfLines={1} style={styles.nameText}>
							{user.name}
						</Text>
						<Text style={styles.userBadge}>
							You
						</Text>
					</View>
					<Text style={styles.statsText}>
						Level {user.level} • {user.streak} day streak
					</Text>
				</View>

				{/* Study Stats */}
				<View style={styles.studyStats}>
					<Text style={styles.durationText}>
						{formatDuration(user.totalStudyTime)}
					</Text>
					<Text style={styles.tasksText}>
						{user.completedTasks} tasks
					</Text>
				</View>
			</View>
		</View>
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
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.08,
		shadowRadius: 10,
		elevation: 10,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	headerTitle: {
		fontSize: 11,
		fontWeight: "800",
		color: Theme.primary,
		letterSpacing: 0.5,
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: Theme.border,
		marginLeft: 8,
	},
	cardContainer: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 12,
		backgroundColor: Theme.primaryPastel,
		borderWidth: 1,
		borderColor: Theme.primary,
		flexDirection: "row",
		alignItems: "center",
	},
	rankBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: Theme.primary,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 14,
	},
	rankText: {
		fontSize: 13,
		fontWeight: "900",
		color: Theme.primaryText,
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
		color: Theme.text,
		maxWidth: 140,
	},
	userBadge: {
		fontSize: 10,
		backgroundColor: Theme.primary,
		color: Theme.primaryText,
		paddingHorizontal: 6,
		paddingVertical: 1.5,
		borderRadius: 8,
		marginLeft: 6,
		fontWeight: "800",
	},
	statsText: {
		color: Theme.textMuted,
		fontSize: 12,
		marginTop: 2,
	},
	studyStats: {
		alignItems: "flex-end",
	},
	durationText: {
		fontSize: 16,
		fontWeight: "800",
		color: Theme.text,
	},
	tasksText: {
		fontSize: 10,
		color: Theme.textMuted,
	},
});

export const MemoizedStickyUserCard = React.memo(StickyUserCard);
