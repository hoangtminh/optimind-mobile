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
								User
								{user.username?.charAt(0).toUpperCase()}
							</Text>
						</View>
						<TouchableOpacity style={styles.cameraButton}>
							<Camera size={16} color="#ffffff" />
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
						<Edit size={20} color="#0058be" />
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
						<Flame size={24} color="#f59e0b" />
						<Text style={styles.statNumber}>
							{user.currentStreak}
						</Text>
						<Text style={styles.statLabel}>Day Streak</Text>
					</View>

					<View style={styles.statCard}>
						<Target size={24} color="#10b981" />
						<Text style={styles.statNumber}>
							{user.longestStreak}
						</Text>
						<Text style={styles.statLabel}>Tasks Done</Text>
					</View>

					<View style={styles.statCard}>
						<User size={24} color="#8b5cf6" />
						<Text style={styles.statNumber}>
							{formatDuration(user.studyTime)}
						</Text>
						<Text style={styles.statLabel}>Total Study</Text>
					</View>

					<View style={styles.statCard}>
						<Trophy size={24} color="#f97316" />
						<Text style={styles.statNumber}>
							{/* {unlockedAchievements.length} */}
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
						<User size={20} color="#0058be" />
						<Text style={styles.actionText}>Edit Profile</Text>
						<Edit size={16} color="#cbd5e1" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionItem}>
						<Trophy size={20} color="#f59e0b" />
						<Text style={styles.actionText}>
							View All Achievements
						</Text>
						<Edit size={16} color="#cbd5e1" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionItem}>
						<Target size={20} color="#10b981" />
						<Text style={styles.actionText}>Study Statistics</Text>
						<Edit size={16} color="#cbd5e1" />
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fb",
	},
	content: {
		flex: 1,
		padding: 16,
	},
	profileHeader: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 24,
		marginBottom: 16,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},
	avatarContainer: {
		position: "relative",
		marginRight: 16,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#0058be",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#ffffff",
	},
	cameraButton: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#10b981",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#ffffff",
	},
	profileInfo: {
		flex: 1,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1e293b",
		marginBottom: 4,
	},
	email: {
		fontSize: 16,
		color: "#64748b",
		marginBottom: 8,
	},
	levelBadge: {
		backgroundColor: "#f0f9ff",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 16,
		alignSelf: "flex-start",
	},
	levelText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#0058be",
	},
	editButton: {
		padding: 8,
	},
	section: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 12,
	},
	progressCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	progressTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
	},
	progressSubtitle: {
		fontSize: 14,
		color: "#64748b",
	},
	progressBar: {
		height: 8,
		backgroundColor: "#e2e8f0",
		borderRadius: 4,
		marginBottom: 8,
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#0058be",
		borderRadius: 4,
	},
	progressText: {
		fontSize: 12,
		color: "#64748b",
		textAlign: "center",
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
		marginBottom: 16,
	},
	statCard: {
		flex: 1,
		minWidth: "45%",
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1e293b",
		marginTop: 8,
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 12,
		color: "#64748b",
		textAlign: "center",
	},
	activityCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	activityItem: {
		flex: 1,
		alignItems: "center",
	},
	activityLabel: {
		fontSize: 14,
		color: "#64748b",
		marginBottom: 4,
	},
	activityValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1e293b",
	},
	activityDivider: {
		width: 1,
		height: 40,
		backgroundColor: "#e2e8f0",
		marginHorizontal: 16,
	},
	achievementCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 8,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	achievementIcon: {
		fontSize: 24,
		marginRight: 12,
	},
	achievementContent: {
		flex: 1,
	},
	achievementTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 2,
	},
	achievementDescription: {
		fontSize: 14,
		color: "#64748b",
		marginBottom: 4,
	},
	achievementDate: {
		fontSize: 12,
		color: "#94a3b8",
	},
	actionItem: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 8,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	actionText: {
		fontSize: 16,
		color: "#1e293b",
		marginLeft: 12,
		flex: 1,
	},
});
