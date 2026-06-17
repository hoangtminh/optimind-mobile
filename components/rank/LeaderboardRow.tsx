import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser } from "@/lib/types/user";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Crown, Medal, Trophy } from "lucide-react-native";

interface LeaderboardRowProps {
	item: LeaderboardUser;
	formatDuration: (mins: number) => string;
	onPress?: (user: LeaderboardUser) => void;
}

export function LeaderboardRow({ item, formatDuration, onPress }: LeaderboardRowProps) {
	const isMe = item.isCurrentUser;
	const isDark = Theme.isDark;

	const rank = item.rank;
	const isTop3 = rank <= 3;
	const isTopRank = rank === 4 || rank === 5;

	// Dynamic values for top 3 rows styling
	let containerBg: string = Theme.surface;
	let containerBorder: string = Theme.border;
	let borderWidth = 1;
	let rankIcon = null;
	let studyTimeBg: string = "transparent";
	let studyTimeTextColor: string = Theme.text;
	let studyTimeTextWeight: "800" | "900" = "800";
	let studyTimeFontSize = 15;

	if (isTop3) {
		borderWidth = 1.5;
		studyTimeTextWeight = "900";
		
		if (rank === 1) {
			containerBg = isDark ? "#2A200A" : "#FFFDF2";
			containerBorder = isDark ? "#F59E0B" : "#F59E0B";
			rankIcon = <Crown size={20} color={isDark ? "#FBBF24" : "#F59E0B"} />;
			studyTimeBg = isDark ? "#451A03" : "#FEF3C7";
			studyTimeTextColor = isDark ? "#FBBF24" : "#D97706";
			studyTimeFontSize = 17;
		} else if (rank === 2) {
			containerBg = isDark ? "#1E2022" : "#FAFAFB";
			containerBorder = isDark ? "#9CA3AF" : "#9CA3AF";
			rankIcon = <Medal size={18} color={isDark ? "#D1D5DB" : "#6B7280"} />;
			studyTimeBg = isDark ? "#1F2937" : "#F3F4F6";
			studyTimeTextColor = isDark ? "#E5E7EB" : "#4B5563";
			studyTimeFontSize = 16.5;
		} else if (rank === 3) {
			containerBg = isDark ? "#1A1428" : "#FAF8FF";
			containerBorder = isDark ? "#A78BFA" : "#A78BFA";
			rankIcon = <Trophy size={18} color={isDark ? "#C084FC" : "#8B5CF6"} />;
			studyTimeBg = isDark ? "#2E1065" : "#F3E8FF";
			studyTimeTextColor = isDark ? "#DDD6FE" : "#6D28D9";
			studyTimeFontSize = 16;
		}
	}

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => onPress?.(item)}
		>
			<Animated.View
				entering={FadeInDown.duration(350).springify().damping(15)}
				style={[
					styles.container,
					{
						backgroundColor: isMe ? Theme.primaryPastel : containerBg,
						borderColor: isMe ? Theme.primary : containerBorder,
						borderWidth: borderWidth,
					},
					isTopRank && !isMe && styles.topRankContainer,
				]}
			>
				{/* Rank Badge / Icon */}
				<View
					style={[
						styles.rankBadge,
						isMe
							? styles.currentUserRankBadge
							: isTop3
							? {
									backgroundColor: studyTimeBg,
									borderColor: containerBorder,
							  }
							: isTopRank
							? styles.topRankBadge
							: styles.normalRankBadge,
					]}
				>
					{rankIcon ? (
						rankIcon
					) : (
						<Text
							style={[
								styles.rankText,
								isMe
									? styles.currentUserRankText
									: isTopRank
									? styles.topRankText
									: styles.normalRankText,
							]}
						>
							#{rank}
						</Text>
					)}
				</View>

				{/* User Info */}
				<View style={styles.userInfo}>
					<View style={styles.nameRow}>
						<Text
							numberOfLines={isTop3 ? undefined : 1}
							style={[
								styles.nameText,
								{ color: Theme.text },
								isTop3 && styles.top3NameText,
							]}
						>
							{item.name}
						</Text>
						{isMe && (
							<View style={styles.badgeContainer}>
								<Text style={styles.currentUserLabel}>You</Text>
							</View>
						)}
					</View>
					<Text style={[styles.statsText, { color: Theme.textMuted }]}>
						Lvl {item.level} • {item.streak} day streak
					</Text>
				</View>

				{/* Study Stats / Study Time */}
				<View style={styles.studyStats}>
					<View
						style={[
							styles.durationBadge,
							isTop3 && {
								backgroundColor: studyTimeBg,
								paddingHorizontal: 8,
								paddingVertical: 4,
								borderRadius: 8,
							},
						]}
					>
						<Text
							style={[
								styles.durationText,
								{
									color: studyTimeTextColor,
									fontSize: studyTimeFontSize,
									fontWeight: studyTimeTextWeight,
								},
							]}
						>
							{formatDuration(item.totalStudyTime)}
						</Text>
					</View>
					<Text style={[styles.tasksText, { color: Theme.textMuted }]}>
						{item.completedTasks} tasks
					</Text>
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 14,
		marginBottom: 8,
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.02,
		shadowRadius: 2,
		elevation: 1,
	},
	topRankContainer: {
		borderColor: Theme.border,
		backgroundColor: Theme.surfaceMuted,
	},
	rankBadge: {
		width: 38,
		height: 38,
		borderRadius: 19,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
		borderWidth: 1,
	},
	currentUserRankBadge: {
		backgroundColor: Theme.primary,
		borderColor: Theme.primary,
	},
	topRankBadge: {
		backgroundColor: Theme.primaryPastel,
		borderColor: Theme.border,
	},
	normalRankBadge: {
		backgroundColor: Theme.surfaceMuted,
		borderColor: Theme.border,
	},
	rankText: {
		fontSize: 13,
		fontWeight: "800",
	},
	currentUserRankText: {
		color: Theme.primaryText,
	},
	topRankText: {
		color: Theme.primaryPastelText,
	},
	normalRankText: {
		color: Theme.textMuted,
	},
	userInfo: {
		flex: 1,
		paddingRight: 8,
	},
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	nameText: {
		fontWeight: "700",
		fontSize: 15,
		maxWidth: 140,
	},
	top3NameText: {
		maxWidth: undefined,
		fontSize: 16,
		fontWeight: "800",
	},
	badgeContainer: {
		marginLeft: 6,
		borderRadius: 8,
		overflow: "hidden",
	},
	currentUserLabel: {
		fontSize: 10,
		backgroundColor: Theme.primary,
		color: Theme.primaryText,
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
		justifyContent: "center",
	},
	durationBadge: {
		alignItems: "center",
		justifyContent: "center",
	},
	durationText: {
		fontSize: 15,
		fontWeight: "800",
	},
	tasksText: {
		fontSize: 10,
		marginTop: 2,
	},
});

export const MemoizedLeaderboardRow = React.memo(LeaderboardRow);
