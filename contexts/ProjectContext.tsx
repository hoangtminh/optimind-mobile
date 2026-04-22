import { projectActions } from "@/api/project-actions";
import { ProjectResponse } from "@/lib/types/project";
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface Project {
	id: string;
	name: string;
	description: string;
	taskCount: number;
	completedTasks: number;
	lastModified: string;
}

interface ProjectContextType {
	projects: Project[];
	loading: boolean;
	error: string | null;
	createProject: (data: {
		name: string;
		description?: string;
	}) => Promise<void>;
	updateProject: (
		projectId: string,
		updates: Partial<Project>,
	) => Promise<void>;
	deleteProject: (projectId: string) => Promise<void>;
	fetchProjects: () => Promise<void>;
	getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error("useProject must be used within a ProjectProvider");
	}
	return context;
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await projectActions.getAllProjects();
			if (response.success && response.data) {
				const mappedProjects: Project[] = response.data.map(
					(
						project: ProjectResponse & {
							color?: string;
							completed_tasks?: number;
						},
					) => ({
						id: project.id,
						name: project.name,
						description: project.description || "",
						color: project.color || "#0058be",
						taskCount: project.task_count || 0,
						completedTasks: project.completed_tasks || 0,
						lastModified: project.updated_at || project.created_at,
					}),
				);
				setProjects(mappedProjects);
			} else {
				setError(response.error || "Failed to fetch projects");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const createProject = async (data: {
		name: string;
		description?: string;
	}) => {
		setLoading(true);
		setError(null);
		try {
			const response = await projectActions.createProject(data);
			if (response.success && response.data) {
				const newProject: Project = {
					id: response.data.id,
					name: response.data.name,
					description: response.data.description || "",
					taskCount: 0,
					completedTasks: 0,
					lastModified: response.data.created_at,
				};
				setProjects((prev) => [...prev, newProject]);
			} else {
				throw new Error(response.error || "Failed to create project");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateProject = async (
		projectId: string,
		updates: Partial<Project>,
	) => {
		// Add update implementation here similarly via projectActions...
	};

	const deleteProject = async (projectId: string) => {
		// Add delete implementation here similarly via projectActions...
	};

	const getProject = (id: string) =>
		projects.find((project) => project.id === id);

	const contextValue: ProjectContextType = {
		projects,
		loading,
		error,
		createProject,
		updateProject,
		deleteProject,
		fetchProjects,
		getProject,
	};

	return (
		<ProjectContext.Provider value={contextValue}>
			{children}
		</ProjectContext.Provider>
	);
};
