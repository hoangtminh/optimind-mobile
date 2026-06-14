import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser } from "@/lib/types/user";

interface LeaderboardRowProps {
	item: LeaderboardUser;
	formatDuration: (mins: number) => string;
}

export function LeaderboardRow({ item, formatDuration }: LeaderboardRowProps) {
	const isMe = item.isCurrentUser;
	return (
		<View
			style={[
				styles.container,
				isMe ? styles.currentUserContainer : styles.normalContainer,
			]}
		>
			{/* Rank Number */}
			<View
				style={[
					styles.rankBadge,
					isMe ? styles.currentUserRankBadge : styles.normalRankBadge,
				]}
			>
				<Text
					style={[
						styles.rankText,
						isMe ? styles.currentUserRankText : styles.normalRankText,
					]}
				>
					#{item.rank}
				</Text>
			</View>

			{/* User Info */}
			<View style={styles.userInfo}>
				<View style={styles.nameRow}>
					<Text numberOfLines={1} style={styles.nameText}>
						{item.name}
					</Text>
					{isMe && (
						<Text style={styles.currentUserLabel}>
							You
						</Text>
					)}
				</View>
				<Text style={styles.statsText}>
					Level {item.level} • {item.streak} day streak
				</Text>
			</View>

			{/* Study Stats */}
			<View style={styles.studyStats}>
				<Text style={styles.durationText}>
					{formatDuration(item.totalStudyTime)}
				</Text>
				<Text style={styles.tasksText}>
					{item.completedTasks} tasks
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
	},
	currentUserContainer: {
		backgroundColor: Theme.primaryPastel,
		borderColor: Theme.primary,
	},
	normalContainer: {
		backgroundColor: Theme.surface,
		borderColor: Theme.border,
	},
	rankBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 14,
		borderWidth: 1,
	},
	currentUserRankBadge: {
		backgroundColor: Theme.primary,
		borderColor: Theme.primary,
	},
	normalRankBadge: {
		backgroundColor: Theme.surfaceMuted,
		borderColor: Theme.border,
	},
	rankText: {
		fontSize: 14,
		fontWeight: "800",
	},
	currentUserRankText: {
		color: Theme.primaryText,
	},
	normalRankText: {
		color: Theme.textMuted,
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
	currentUserLabel: {
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

export const MemoizedLeaderboardRow = React.memo(LeaderboardRow);
