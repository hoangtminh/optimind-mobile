import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser } from "@/lib/types/user";
import { Crown, Medal, Trophy } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withDelay,
	withTiming,
} from "react-native-reanimated";

interface PodiumProps {
	top3: LeaderboardUser[];
	formatDuration: (mins: number) => string;
	onPress?: (user: LeaderboardUser) => void;
}

interface AnimatedColumnProps {
	children: React.ReactNode;
	delay: number;
}

function AnimatedColumn({ children, delay }: AnimatedColumnProps) {
	const translateY = useSharedValue(60);
	const opacity = useSharedValue(0);

	useEffect(() => {
		translateY.value = withDelay(
			delay,
			withSpring(0, { damping: 14, stiffness: 90 })
		);
		opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
	}, [delay]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
	}));

	return (
		<Animated.View style={[styles.podWrapper, animatedStyle]}>
			{children}
		</Animated.View>
	);
}

export function Podium({ top3, formatDuration, onPress }: PodiumProps) {
	const user1 = top3[0];
	const user2 = top3[1];
	const user3 = top3[2];

	const renderPod = (user: LeaderboardUser | undefined, rank: 1 | 2 | 3) => {
		const isDark = Theme.isDark;

		if (!user) {
			return (
				<View style={[styles.podWrapper, styles.placeholderPod]}>
					<View style={styles.placeholderAvatar} />
					<Text style={styles.placeholderText}>-</Text>
				</View>
			);
		}

		let height = 0;
		let gradientColors: [string, string] = ["", ""];
		let borderClr = "";
		let badgeIcon = null;
		let avatarSize = 52;
		let textHighlight = "";

		if (rank === 1) {
			height = 110;
			gradientColors = isDark ? ["#451A03", "#D97706"] : ["#FEF3C7", "#F59E0B"];
			borderClr = isDark ? "#F59E0B" : "#D97706";
			avatarSize = 68;
			textHighlight = isDark ? "#FFE082" : "#956400";
			badgeIcon = <Crown size={24} color={isDark ? "#FBBF24" : "#F59E0B"} style={styles.badge1} />;
		} else if (rank === 2) {
			height = 80;
			gradientColors = isDark ? ["#1F2937", "#4B5563"] : ["#F3F4F6", "#9CA3AF"];
			borderClr = isDark ? "#9CA3AF" : "#6B7280";
			avatarSize = 56;
			textHighlight = isDark ? "#E5E7EB" : "#4B5563";
			badgeIcon = <Medal size={20} color={isDark ? "#D1D5DB" : "#9CA3AF"} style={styles.badge2} />;
		} else {
			height = 60;
			gradientColors = isDark ? ["#2E1065", "#6D28D9"] : ["#F3E8FF", "#8B5CF6"];
			borderClr = isDark ? "#A78BFA" : "#6D28D9";
			avatarSize = 56;
			textHighlight = isDark ? "#DDD6FE" : "#5C4596";
			badgeIcon = <Trophy size={20} color={isDark ? "#C084FC" : "#8B5CF6"} style={styles.badge3} />;
		}

		const delay = rank === 1 ? 250 : rank === 2 ? 100 : 400;

		return (
			<AnimatedColumn delay={delay}>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => onPress?.(user)}
					style={{ alignItems: "center", width: "100%", justifyContent: "flex-end" }}
				>
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
						<LinearGradient
							colors={isDark ? ["#2A2A2A", "#1A1A1A"] : ["#FFFFFF", "#F9F9F8"]}
							style={[styles.avatarGradient, { borderRadius: avatarSize / 2 }]}
						>
							<Text
								style={[
									styles.avatarText,
									{ fontSize: rank === 1 ? 16 : 14, color: Theme.text },
								]}
							>
								{user.name.substring(0, 2).toUpperCase()}
							</Text>
						</LinearGradient>
					</View>
					<Text numberOfLines={1} style={[styles.nameText, { fontSize: rank === 1 ? 14 : 12, color: Theme.text }]}>
						{user.name}
					</Text>
					<Text style={[styles.durationText, { color: Theme.textMuted }]}>
						{formatDuration(user.totalStudyTime)}
					</Text>

					{/* Physical Podium Block */}
					<LinearGradient
						colors={gradientColors}
						style={[
							styles.block,
							{
								height: height,
								borderColor: borderClr,
							},
						]}
					>
						<Text
							style={[
								styles.rankNumber,
								{
									fontSize: rank === 1 ? 32 : 24,
									color: textHighlight,
								},
							]}
						>
							{rank}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</AnimatedColumn>
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
		height: 245,
		paddingHorizontal: 16,
		marginTop: 16,
		marginBottom: 20,
	},
	podWrapper: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	placeholderPod: {
		opacity: 0.25,
		alignItems: "center",
		justifyContent: "flex-end",
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
		marginBottom: -6,
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
		marginBottom: 6,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 4,
	},
	avatarGradient: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontWeight: "800",
	},
	nameText: {
		fontWeight: "800",
		textAlign: "center",
		maxWidth: 90,
		marginBottom: 2,
		letterSpacing: -0.1,
	},
	durationText: {
		fontSize: 11,
		fontWeight: "600",
		marginBottom: 10,
	},
	block: {
		width: "92%",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		borderWidth: 1,
		borderBottomWidth: 0,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	rankNumber: {
		fontWeight: "900",
	},
});

export const MemoizedPodium = React.memo(Podium);
