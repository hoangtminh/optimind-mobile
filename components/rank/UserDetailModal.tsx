import React, { useEffect, useState } from "react";
import {
	Modal,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Platform,
} from "react-native";
import { YStack, XStack, View, Text, Button } from "tamagui";
import { Theme } from "@/constants/Theme";
import { LeaderboardUser, UserProfile } from "@/lib/types/user";
import { userActions } from "@/api/user-actions";
import { friendActions } from "@/api/friend-actions";
import { toast } from "@/components/common/Toast";
import { LinearGradient } from "expo-linear-gradient";
import {
	X,
	UserPlus,
	UserCheck,
	Flame,
	Trophy,
	Medal,
	Crown,
	Clock,
	Award,
	Coins,
	Calendar,
	ShieldAlert,
} from "lucide-react-native";

interface UserDetailModalProps {
	visible: boolean;
	onClose: () => void;
	user: LeaderboardUser | null;
}

export default function UserDetailModal({
	visible,
	onClose,
	user,
}: UserDetailModalProps) {
	const [loading, setLoading] = useState(false);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [relationStatus, setRelationStatus] = useState<
		"FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "NONE" | "SELF" | null
	>(null);
	const [actionLoading, setActionLoading] = useState(false);

	useEffect(() => {
		if (visible && user) {
			fetchUserProfileAndRelation();
		} else {
			// Reset state when closed
			setUserProfile(null);
			setRelationStatus(null);
		}
	}, [visible, user]);

	const fetchUserProfileAndRelation = async () => {
		if (!user) return;
		setLoading(true);

		// Determine if it is self
		if (user.isCurrentUser) {
			setRelationStatus("SELF");
		}

		try {
			// 1. Fetch full profile to get email
			const profileRes = await userActions.getUserProfile(user.id);
			if (profileRes.success && profileRes.data) {
				setUserProfile(profileRes.data);

				// 2. Fetch relation status using email (if not self)
				if (!user.isCurrentUser && profileRes.data.email) {
					const relationRes = await friendActions.searchFriendByEmail(
						profileRes.data.email
					);
					if (relationRes.success && relationRes.data) {
						setRelationStatus(relationRes.data.relationStatus);
					} else {
						setRelationStatus("NONE");
					}
				}
			} else {
				// Fallback relation if profile fails to load
				if (!user.isCurrentUser) {
					setRelationStatus("NONE");
				}
			}
		} catch (error) {
			console.error("Failed to load user detail profile/relation:", error);
			if (!user.isCurrentUser) {
				setRelationStatus("NONE");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleAddFriend = async () => {
		if (!userProfile?.email) return;
		setActionLoading(true);

		try {
			if (relationStatus === "NONE") {
				const res = await friendActions.sendFriendRequest(userProfile.email);
				if (res.success) {
					setRelationStatus("REQUEST_SENT");
					toast.success(`Friend request sent to ${user?.name}!`);
				} else {
					toast.error(res.error || "Failed to send friend request");
				}
			} else if (relationStatus === "REQUEST_RECEIVED") {
				// Fetch incoming requests to get requestId
				const incomingRes = await friendActions.getIncomingRequests();
				if (incomingRes.success && incomingRes.data) {
					const matchingReq = incomingRes.data.find(
						(req) =>
							req.user.email.toLowerCase() ===
							userProfile.email.toLowerCase()
					);
					if (matchingReq) {
						const acceptRes = await friendActions.acceptFriendRequest(
							matchingReq.id
						);
						if (acceptRes.success) {
							setRelationStatus("FRIEND");
							toast.success(`You are now friends with ${user?.name}!`);
						} else {
							toast.error(acceptRes.error || "Failed to accept request");
						}
					} else {
						// Fallback if request is not found in incoming
						toast.error("Friend request not found");
					}
				} else {
					toast.error("Failed to fetch incoming requests");
				}
			}
		} catch (error) {
			console.error("Friend action error:", error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	const handleReportUser = () => {
		Alert.alert(
			"Report User",
			`Are you sure you want to report ${user?.name} for inappropriate behavior or cheating?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Report",
					style: "destructive",
					onPress: async () => {
						setActionLoading(true);
						// Simulate network call
						await new Promise((resolve) => setTimeout(resolve, 800));
						setActionLoading(false);
						toast.success(
							`Thank you. ${user?.name} has been reported. We will review their activity.`
						);
						onClose();
					},
				},
			]
		);
	};

	if (!user) return null;

	const isDark = Theme.isDark;
	const initials = user.name.substring(0, 2).toUpperCase();

	// Select podium gradient colors for top 3
	let podiumGradient: [string, string] = isDark
		? ["#2A2A2A", "#1A1A1A"]
		: ["#FFFFFF", "#F9F9F8"];
	let rankBorder: string = Theme.border;
	let rankIcon = null;

	if (user.rank === 1) {
		podiumGradient = isDark ? ["#451A03", "#D97706"] : ["#FEF3C7", "#F59E0B"];
		rankBorder = isDark ? "#F59E0B" : "#D97706";
		rankIcon = <Crown size={16} color={isDark ? "#FBBF24" : "#F59E0B"} />;
	} else if (user.rank === 2) {
		podiumGradient = isDark ? ["#1F2937", "#4B5563"] : ["#F3F4F6", "#9CA3AF"];
		rankBorder = isDark ? "#9CA3AF" : "#6B7280";
		rankIcon = <Medal size={16} color={isDark ? "#D1D5DB" : "#9CA3AF"} />;
	} else if (user.rank === 3) {
		podiumGradient = isDark ? ["#2E1065", "#6D28D9"] : ["#F3E8FF", "#8B5CF6"];
		rankBorder = isDark ? "#A78BFA" : "#6D28D9";
		rankIcon = <Trophy size={16} color={isDark ? "#C084FC" : "#8B5CF6"} />;
	}

	// Format joined date if available
	const getJoinedDate = () => {
		if (!userProfile?.createdAt) return "";
		const date = new Date(userProfile.createdAt);
		return date.toLocaleDateString(undefined, {
			month: "long",
			year: "numeric",
		});
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View
				flex={1}
				justifyContent="flex-end"
				backgroundColor="rgba(29, 27, 32, 0.4)"
				style={
					Platform.OS === "web"
						? ({ backdropFilter: "blur(4px)" } as any)
						: {}
				}
			>
				{/* Backdrop pressable area to close modal */}
				<TouchableOpacity
					style={styles.backdropPressable}
					activeOpacity={1}
					onPress={onClose}
				/>

				<YStack
					backgroundColor={Theme.surface}
					width="100%"
					borderTopLeftRadius={20}
					borderTopRightRadius={20}
					borderWidth={1}
					borderColor={Theme.border}
					padding="$5"
					paddingBottom="$8"
					gap="$4"
					elevation={10}
					shadowColor="#000"
					shadowOffset={{ width: 0, height: -4 }}
					shadowOpacity={0.1}
					shadowRadius={8}
				>
					{/* Handle bar for visual cue */}
					<View
						width={36}
						height={4}
						backgroundColor={Theme.border}
						borderRadius={2}
						alignSelf="center"
						marginBottom="$1"
					/>

					{/* Header Close button */}
					<XStack justifyContent="flex-end" position="absolute" right={16} top={16}>
						<Button
							circular
							size="$3"
							chromeless
							icon={<X size={18} color={Theme.textMuted} />}
							onPress={onClose}
							pressStyle={{ backgroundColor: Theme.background }}
						/>
					</XStack>

					{/* Main Profile Info Section */}
					<YStack alignItems="center" gap="$2" marginTop="$2">
						{/* Large initials avatar with rank color borders */}
						<View
							style={[
								styles.avatarContainer,
								{ borderColor: rankBorder, borderWidth: user.rank <= 3 ? 3 : 2 },
							]}
						>
							<LinearGradient
								colors={podiumGradient}
								style={styles.avatarGradient}
							>
								<Text
									fontSize={24}
									fontWeight="900"
									color={user.rank <= 3 ? (isDark ? "#FFFFFF" : "#111111") : Theme.text}
								>
									{initials}
								</Text>
							</LinearGradient>
						</View>

						{/* Full Name */}
						<Text
							fontSize="$6"
							fontWeight="800"
							color={Theme.text}
							textAlign="center"
							marginTop="$1"
						>
							{user.name}
						</Text>

						{/* Quick Tag (Rank, level or currentUser badge) */}
						<XStack gap="$2" alignItems="center">
							{rankIcon}
							<Text
								fontSize="$2"
								fontWeight="700"
								color={
									user.rank === 1
										? "#D97706"
										: user.rank === 2
										? "#6B7280"
										: user.rank === 3
										? "#8B5CF6"
										: Theme.textMuted
								}
								textTransform="uppercase"
								letterSpacing={0.5}
							>
								Rank #{user.rank}
							</Text>

							{user.isCurrentUser && (
								<View
									backgroundColor={Theme.primary}
									paddingHorizontal="$2"
									paddingVertical="$0.5"
									borderRadius={4}
								>
									<Text fontSize={10} fontWeight="800" color={Theme.primaryText}>
										YOU
									</Text>
								</View>
							)}
						</XStack>
					</YStack>

					{/* Bento Stats Grid */}
					<YStack gap="$3" marginTop="$2">
						<XStack gap="$3">
							{/* Level Stat Card */}
							<YStack style={styles.statCard}>
								<XStack gap="$2" alignItems="center">
									<Award size={16} color={Theme.primary} />
									<Text fontSize="$2" fontWeight="700" color={Theme.textMuted}>
										Level
									</Text>
								</XStack>
								<Text fontSize="$5" fontWeight="800" color={Theme.text} marginTop="$1">
									{user.level}
								</Text>
							</YStack>

							{/* Study Time Stat Card */}
							<YStack style={styles.statCard}>
								<XStack gap="$2" alignItems="center">
									<Clock size={16} color={Theme.primary} />
									<Text fontSize="$2" fontWeight="700" color={Theme.textMuted}>
										Study Time
									</Text>
								</XStack>
								<Text fontSize="$5" fontWeight="800" color={Theme.text} marginTop="$1">
									{user.totalStudyTime}m
								</Text>
							</YStack>
						</XStack>

						<XStack gap="$3">
							{/* Streak Stat Card */}
							<YStack style={styles.statCard}>
								<XStack gap="$2" alignItems="center">
									<Flame size={16} color="#EF4444" />
									<Text fontSize="$2" fontWeight="700" color={Theme.textMuted}>
										Streak
									</Text>
								</XStack>
								<Text fontSize="$5" fontWeight="800" color={Theme.text} marginTop="$1">
									{user.streak} days
								</Text>
							</YStack>

							{/* Completed Tasks Stat Card */}
							<YStack style={styles.statCard}>
								<XStack gap="$2" alignItems="center">
									<Trophy size={16} color="#F59E0B" />
									<Text fontSize="$2" fontWeight="700" color={Theme.textMuted}>
										Completed Tasks
									</Text>
								</XStack>
								<Text fontSize="$5" fontWeight="800" color={Theme.text} marginTop="$1">
									{user.completedTasks}
								</Text>
							</YStack>
						</XStack>

						{/* Extended Profile Stats (Coins, Joined Date) */}
						{loading ? (
							<View paddingVertical="$2" alignItems="center">
								<ActivityIndicator size="small" color={Theme.primary} />
							</View>
						) : (
							userProfile && (
								<YStack
									backgroundColor={Theme.surfaceMuted}
									padding="$3.5"
									borderRadius={12}
									borderWidth={1}
									borderColor={Theme.border}
									gap="$2"
								>
									{userProfile.coins !== undefined && (
										<XStack justifyContent="space-between" alignItems="center">
											<XStack gap="$2" alignItems="center">
												<Coins size={14} color="#F59E0B" />
												<Text fontSize="$2" color={Theme.textMuted} fontWeight="600">
													Coins Balance
												</Text>
											</XStack>
											<Text fontSize="$2" fontWeight="800" color={Theme.text}>
												{userProfile.coins} coins
											</Text>
										</XStack>
									)}

									{userProfile.createdAt && (
										<XStack justifyContent="space-between" alignItems="center">
											<XStack gap="$2" alignItems="center">
												<Calendar size={14} color={Theme.primary} />
												<Text fontSize="$2" color={Theme.textMuted} fontWeight="600">
													Member Since
												</Text>
											</XStack>
											<Text fontSize="$2" fontWeight="700" color={Theme.text}>
												{getJoinedDate()}
											</Text>
										</XStack>
									)}
								</YStack>
							)
						)}
					</YStack>

					{/* Action Buttons Footer */}
					{relationStatus !== "SELF" && relationStatus !== null && (
						<XStack gap="$3" marginTop="$2">
							{/* Add Friend Button */}
							<Button
								flex={2}
								height={48}
								borderRadius={8}
								backgroundColor={
									relationStatus === "NONE"
										? Theme.primary
										: relationStatus === "REQUEST_RECEIVED"
										? Theme.primaryPastel
										: Theme.surfaceMuted
								}
								borderWidth={relationStatus === "NONE" ? 0 : 1}
								borderColor={Theme.border}
								onPress={handleAddFriend}
								disabled={
									actionLoading ||
									relationStatus === "FRIEND" ||
									relationStatus === "REQUEST_SENT"
								}
								opacity={
									actionLoading ||
									relationStatus === "FRIEND" ||
									relationStatus === "REQUEST_SENT"
										? 0.7
										: 1
								}
								pressStyle={{ scale: 0.98 }}
							>
								{actionLoading ? (
									<ActivityIndicator
										size="small"
										color={relationStatus === "NONE" ? "white" : Theme.primary}
									/>
								) : (
									<XStack gap="$2" alignItems="center" justifyContent="center">
										{relationStatus === "NONE" && (
											<>
												<UserPlus size={18} color={Theme.primaryText} />
												<Text color={Theme.primaryText} fontWeight="700" fontSize="$3">
													Add Friend
												</Text>
											</>
										)}
										{relationStatus === "REQUEST_SENT" && (
											<>
												<UserCheck size={18} color={Theme.textMuted} />
												<Text color={Theme.textMuted} fontWeight="700" fontSize="$3">
													Request Sent
												</Text>
											</>
										)}
										{relationStatus === "REQUEST_RECEIVED" && (
											<>
												<UserPlus size={18} color={Theme.primaryPastelText} />
												<Text color={Theme.primaryPastelText} fontWeight="700" fontSize="$3">
													Accept Request
												</Text>
											</>
										)}
										{relationStatus === "FRIEND" && (
											<>
												<UserCheck size={18} color={Theme.accentGreenText} />
												<Text color={Theme.accentGreenText} fontWeight="700" fontSize="$3">
													Friends
												</Text>
											</>
										)}
									</XStack>
								)}
							</Button>

							{/* Report Button */}
							<Button
								flex={1}
								height={48}
								borderRadius={8}
								backgroundColor={Theme.accentRed}
								borderWidth={1}
								borderColor={Theme.border}
								onPress={handleReportUser}
								disabled={actionLoading}
								pressStyle={{ scale: 0.98 }}
							>
								<XStack gap="$1.5" alignItems="center" justifyContent="center">
									<ShieldAlert size={16} color={Theme.accentRedText} />
									<Text color={Theme.accentRedText} fontWeight="700" fontSize="$3">
										Report
									</Text>
								</XStack>
							</Button>
						</XStack>
					)}
				</YStack>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdropPressable: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	avatarContainer: {
		width: 72,
		height: 72,
		borderRadius: 36,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},
	avatarGradient: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	statCard: {
		flex: 1,
		backgroundColor: Theme.surfaceMuted,
		borderWidth: 1,
		borderColor: Theme.border,
		borderRadius: 12,
		padding: 12,
	},
});
