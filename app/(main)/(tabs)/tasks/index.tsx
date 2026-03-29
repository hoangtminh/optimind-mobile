import AddProjectModal from "@/components/projects/AddProjectModal";
import { useNavigation } from "@react-navigation/native";
import { ArrowRight, FolderOpen } from "lucide-react-native";
import React, { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Project {
	id: string;
	name: string;
	description: string;
	lastModified: string;
	taskCount: number;
	completedTasks: number;
}

const mockProjects: Project[] = [
	{
		id: "927687412895493685",
		name: "Study Sanctuary App",
		description:
			"Productivity and study management application with Pomodoro timer",
		lastModified: "2026-03-23",
		taskCount: 24,
		completedTasks: 18,
	},
	{
		id: "6222951898278486672",
		name: "E-commerce Platform",
		description: "Vietnamese marketplace with seller and buyer dashboards",
		lastModified: "2026-03-14",
		taskCount: 45,
		completedTasks: 32,
	},
];

export default function Task() {
	const navigation = useNavigation();
	const [isAddProjectVisible, setIsAddProjectVisible] = useState(false);

	const handleProjectSelect = (project: Project) => {
		// Navigate to ProjectTasks screen with project ID
		navigation.navigate([
			"ProjectTasks",
			{ projectId: project.id },
		] as never);
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Projects</Text>
				<Text style={styles.headerSubtitle}>
					Manage your tasks across different projects
				</Text>
			</View>

			{/* Projects List */}
			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{mockProjects.map((project) => (
					<TouchableOpacity
						key={project.id}
						style={styles.projectCard}
						onPress={() => handleProjectSelect(project)}
					>
						<View style={styles.projectHeader}>
							<FolderOpen size={24} color="#0058be" />
							<View style={styles.projectInfo}>
								<Text style={styles.projectName}>
									{project.name}
								</Text>
								<Text style={styles.projectDescription}>
									{project.description}
								</Text>
							</View>
							<ArrowRight size={20} color="#cbd5e1" />
						</View>

						<View style={styles.projectStats}>
							<View style={styles.stat}>
								<Text style={styles.statValue}>
									{project.taskCount}
								</Text>
								<Text style={styles.statLabel}>Tasks</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statValue}>
									{project.completedTasks}
								</Text>
								<Text style={styles.statLabel}>Done</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statValue}>
									{Math.round(
										(project.completedTasks /
											project.taskCount) *
											100,
									)}
									%
								</Text>
								<Text style={styles.statLabel}>Progress</Text>
							</View>
						</View>

						<Text style={styles.lastModified}>
							Last modified: {project.lastModified}
						</Text>
					</TouchableOpacity>
				))}

				{/* Add Project Button */}
				<TouchableOpacity
					style={styles.addProjectCard}
					onPress={() => setIsAddProjectVisible(true)}
				>
					<View style={styles.addProjectContent}>
						<Text style={styles.addProjectIcon}>+</Text>
						<Text style={styles.addProjectText}>
							Create New Project
						</Text>
					</View>
				</TouchableOpacity>
			</ScrollView>

			<AddProjectModal
				visible={isAddProjectVisible}
				onClose={() => setIsAddProjectVisible(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fb",
	},
	header: {
		padding: 20,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1e293b",
		textAlign: "center",
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#64748b",
		textAlign: "center",
		marginTop: 4,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	projectCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	projectHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 16,
	},
	projectInfo: {
		flex: 1,
		marginLeft: 12,
		marginRight: 12,
	},
	projectName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 4,
	},
	projectDescription: {
		fontSize: 14,
		color: "#64748b",
		lineHeight: 20,
	},
	projectStats: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	stat: {
		alignItems: "center",
		flex: 1,
	},
	statValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#0058be",
	},
	statLabel: {
		fontSize: 12,
		color: "#64748b",
		marginTop: 2,
	},
	lastModified: {
		fontSize: 12,
		color: "#94a3b8",
		textAlign: "right",
	},
	addProjectCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		borderWidth: 2,
		borderColor: "#e2e8f0",
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
		minHeight: 120,
	},
	addProjectContent: {
		alignItems: "center",
	},
	addProjectIcon: {
		fontSize: 32,
		color: "#cbd5e1",
		marginBottom: 8,
	},
	addProjectText: {
		fontSize: 16,
		color: "#64748b",
		fontWeight: "500",
	},
});
