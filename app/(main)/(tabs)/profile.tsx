import GlobalHeader from "@/components/app/GlobalHeader";
import { useStudySessions } from "@/contexts/StudySessionContext";
import { useAuth } from "@/hooks/useAuth";
import { useProgressCalculator, useTimeFormatter } from "@/hooks/useUtils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Camera, Edit, Flame, Target, Trophy, User } from "lucide-react-native";
import React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "@/constants/Theme";

export default function Profile() {
	const navigation = useNavigation();
	const { user } = useAuth();
	const { studySessions } = useStudySessions();
	const { getExperienceProgress } = useProgressCalculator();
	const { formatDuration } = useTimeFormatter();

	if (!user) return null;

	const experienceProgress = getExperienceProgress(user.exp);

	const completedTodaySessions = studySessions.filter((session) => {
		const today = new Date().toDateString();
		return session.completed;
	}).length;

	return (
		<SafeAreaView style={styles.container}>
			<GlobalHeader
				title="Profile"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			<ScrollView
				style={styles.content}
				contentContainerStyle={{ paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				{/* Profile Header */}
				<View style={styles.profileHeader}>
					<View style={styles.avatarContainer}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>
								{user.username?.charAt(0).toUpperCase()}
							</Text>
						</View>
						<TouchableOpacity style={styles.cameraButton}>
							<Camera size={14} color="#ffffff" />
						</TouchableOpacity>
					</View>

					<View style={styles.profileInfo}>
						<Text style={styles.name}>{user.username}</Text>
						<Text style={styles.email}>{user.email}</Text>
						<View style={styles.levelBadge}>
							<Text style={styles.levelText}>
								Level {user.level}
							</Text>
						</View>
					</View>

					<TouchableOpacity style={styles.editButton}>
						<Edit size={18} color={Theme.text} />
					</TouchableOpacity>
				</View>

				{/* Experience Progress */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Experience Progress</Text>
					<View style={styles.progressCard}>
						<View style={styles.progressHeader}>
							<Text style={styles.progressTitle}>
								Level {user.level}
							</Text>
							<Text style={styles.progressSubtitle}>
								{experienceProgress.current}/
								{experienceProgress.needed} XP
							</Text>
						</View>
						<View style={styles.progressBar}>
							<View
								style={[
									styles.progressFill,
									{
										width: `${experienceProgress.percentage}%`,
									},
								]}
							/>
						</View>
						<Text style={styles.progressText}>
							{experienceProgress.needed -
								experienceProgress.current}{" "}
							XP to next level
						</Text>
					</View>
				</View>

				{/* Stats Grid */}
				<View style={styles.statsGrid}>
					<View style={styles.statCard}>
						<Flame size={20} color={Theme.accentRedText} />
						<Text style={styles.statNumber}>
							{user.currentStreak}
						</Text>
						<Text style={styles.statLabel}>Day Streak</Text>
					</View>

					<View style={styles.statCard}>
						<Target size={20} color={Theme.accentGreenText} />
						<Text style={styles.statNumber}>
							{user.longestStreak}
						</Text>
						<Text style={styles.statLabel}>Tasks Done</Text>
					</View>

					<View style={styles.statCard}>
						<User size={20} color={Theme.accentBlueText} />
						<Text style={styles.statNumber}>
							{formatDuration(user.studyTime)}
						</Text>
						<Text style={styles.statLabel}>Total Study</Text>
					</View>

					<View style={styles.statCard}>
						<Trophy size={20} color={Theme.accentYellowText} />
						<Text style={styles.statNumber}>
							0
						</Text>
						<Text style={styles.statLabel}>Achievements</Text>
					</View>
				</View>

				{/* Today's Activity */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Today's Activity</Text>
					<View style={styles.activityCard}>
						<View style={styles.activityItem}>
							<Text style={styles.activityLabel}>Study Time</Text>
							<Text style={styles.activityValue}>
								{formatDuration(user.studyTime || 0)}
							</Text>
						</View>
						<View style={styles.activityDivider} />
						<View style={styles.activityItem}>
							<Text style={styles.activityLabel}>Sessions</Text>
							<Text style={styles.activityValue}>
								{completedTodaySessions}
							</Text>
						</View>
					</View>
				</View>

				{/* Profile Actions */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Account Settings</Text>

					<TouchableOpacity style={styles.actionItem}>
						<User size={18} color={Theme.text} />
						<Text style={styles.actionText}>Edit Profile</Text>
						<ChevronRightIcon />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionItem}>
						<Trophy size={18} color={Theme.text} />
						<Text style={styles.actionText}>
							View All Achievements
						</Text>
						<ChevronRightIcon />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionItem}>
						<Target size={18} color={Theme.text} />
						<Text style={styles.actionText}>Study Statistics</Text>
						<ChevronRightIcon />
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

function ChevronRightIcon() {
	return (
		<Text style={{ fontSize: 16, color: Theme.textMuted }}>→</Text>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.background,
	},
	content: {
		flex: 1,
		padding: 16,
	},
	profileHeader: {
		backgroundColor: Theme.surface,
		borderRadius: 8, // Crisp corner radius
		borderWidth: 1,
		borderColor: Theme.border,
		padding: 20,
		marginBottom: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	avatarContainer: {
		position: "relative",
		marginRight: 16,
	},
	avatar: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: Theme.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontSize: 28,
		fontWeight: "bold",
		color: Theme.primaryText,
	},
	cameraButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: Theme.primary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: Theme.surface,
	},
	profileInfo: {
		flex: 1,
	},
	name: {
		fontSize: 20,
		fontWeight: "700",
		color: Theme.text,
		marginBottom: 2,
	},
	email: {
		fontSize: 14,
		color: Theme.textMuted,
		marginBottom: 8,
	},
	levelBadge: {
		backgroundColor: Theme.primaryPastel,
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 4, // Crisp tag corners
		alignSelf: "flex-start",
	},
	levelText: {
		fontSize: 12,
		fontWeight: "600",
		color: Theme.primaryPastelText,
	},
	editButton: {
		padding: 8,
	},
	section: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: Theme.text,
		marginBottom: 10,
	},
	progressCard: {
		backgroundColor: Theme.surface,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Theme.border,
		padding: 16,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	progressTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: Theme.text,
	},
	progressSubtitle: {
		fontSize: 13,
		color: Theme.textMuted,
	},
	progressBar: {
		height: 6,
		backgroundColor: Theme.primaryPastel,
		borderRadius: 3,
		marginBottom: 8,
	},
	progressFill: {
		height: "100%",
		backgroundColor: Theme.primary,
		borderRadius: 3,
	},
	progressText: {
		fontSize: 11,
		color: Theme.textMuted,
		textAlign: "center",
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		marginBottom: 16,
	},
	statCard: {
		flex: 1,
		minWidth: "45%",
		backgroundColor: Theme.surface,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Theme.border,
		padding: 16,
		alignItems: "center",
	},
	statNumber: {
		fontSize: 22,
		fontWeight: "700",
		color: Theme.text,
		marginTop: 6,
		marginBottom: 2,
	},
	statLabel: {
		fontSize: 12,
		color: Theme.textMuted,
		textAlign: "center",
	},
	activityCard: {
		backgroundColor: Theme.surface,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Theme.border,
		padding: 16,
		flexDirection: "row",
	},
	activityItem: {
		flex: 1,
		alignItems: "center",
	},
	activityLabel: {
		fontSize: 13,
		color: Theme.textMuted,
		marginBottom: 4,
	},
	activityValue: {
		fontSize: 18,
		fontWeight: "700",
		color: Theme.text,
	},
	activityDivider: {
		width: 1,
		height: 36,
		backgroundColor: Theme.border,
		marginHorizontal: 16,
	},
	actionItem: {
		backgroundColor: Theme.surface,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Theme.border,
		padding: 16,
		marginBottom: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	actionText: {
		fontSize: 15,
		color: Theme.text,
		marginLeft: 12,
		flex: 1,
	},
});
