import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser } from "@/lib/types/user";
import { Crown, Medal, Trophy } from "lucide-react-native";

interface PodiumProps {
	top3: LeaderboardUser[];
	formatDuration: (mins: number) => string;
}

export function Podium({ top3, formatDuration }: PodiumProps) {
	const user1 = top3[0];
	const user2 = top3[1];
	const user3 = top3[2];

	const renderPod = (user: LeaderboardUser | undefined, rank: 1 | 2 | 3) => {
		if (!user) {
			return (
				<View style={[styles.podWrapper, styles.placeholderPod]}>
					<View style={styles.placeholderAvatar} />
					<Text style={styles.placeholderText}>-</Text>
				</View>
			);
		}

		let height = 0;
		let blockBg = "";
		let borderClr = "";
		let badgeIcon = null;
		let avatarSize = 50;

		if (rank === 1) {
			height = 100;
			blockBg = Theme.accentYellow;
			borderClr = "#f59e0b";
			avatarSize = 64;
			badgeIcon = <Crown size={22} color="#f59e0b" style={styles.badge1} />;
		} else if (rank === 2) {
			height = 75;
			blockBg = Theme.border;
			borderClr = "#9ca3af";
			avatarSize = 54;
			badgeIcon = <Medal size={18} color="#9ca3af" style={styles.badge2} />;
		} else {
			height = 55;
			blockBg = Theme.primaryPastel;
			borderClr = Theme.primary;
			avatarSize = 54;
			badgeIcon = <Trophy size={18} color={Theme.primary} style={styles.badge3} />;
		}

		return (
			<View style={styles.podWrapper}>
				{badgeIcon}
				<View
					style={[
						styles.avatarContainer,
						{
							width: avatarSize,
							height: avatarSize,
							borderRadius: avatarSize / 2,
							borderWidth: rank === 1 ? 3 : 2,
							borderColor: borderClr,
							shadowColor: borderClr,
						},
					]}
				>
					<Text
						style={[
							styles.avatarText,
							{ fontSize: rank === 1 ? 16 : 14 },
						]}
					>
						{user.name.substring(0, 2).toUpperCase()}
					</Text>
				</View>
				<Text numberOfLines={1} style={[styles.nameText, { fontSize: rank === 1 ? 13 : 11 }]}>
					{user.name}
				</Text>
				<Text style={styles.durationText}>
					{formatDuration(user.totalStudyTime)}
				</Text>

				{/* Physical Podium Block */}
				<View
					style={[
						styles.block,
						{
							height: height,
							backgroundColor: blockBg,
							borderColor: borderClr,
						},
					]}
				>
					<Text
						style={[
							styles.rankNumber,
							{
								fontSize: rank === 1 ? 28 : 20,
								color: rank === 3 ? Theme.primary : borderClr,
							},
						]}
					>
						{rank}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{renderPod(user2, 2)}
			{renderPod(user1, 1)}
			{renderPod(user3, 3)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-end",
		height: 220,
		paddingHorizontal: 16,
		marginTop: 8,
		marginBottom: 24,
	},
	podWrapper: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	placeholderPod: {
		opacity: 0.25,
	},
	placeholderAvatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: Theme.border,
		marginBottom: 8,
	},
	placeholderText: {
		fontSize: 12,
		color: Theme.textMuted,
	},
	badge1: {
		marginBottom: -4,
		zIndex: 5,
	},
	badge2: {
		marginBottom: -4,
		zIndex: 5,
	},
	badge3: {
		marginBottom: -4,
		zIndex: 5,
	},
	avatarContainer: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Theme.surface,
		marginBottom: 6,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	avatarText: {
		fontWeight: "800",
		color: Theme.text,
	},
	nameText: {
		fontWeight: "700",
		color: Theme.text,
		textAlign: "center",
		maxWidth: 85,
		marginBottom: 2,
	},
	durationText: {
		fontSize: 10,
		color: Theme.textMuted,
		marginBottom: 8,
	},
	block: {
		width: "90%",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 1,
	},
	rankNumber: {
		fontWeight: "900",
	},
});

export const MemoizedPodium = React.memo(Podium);
