import { projectActions } from "@/api/project-actions";
import { useAuth } from "@/hooks/useAuth";
import { ProjectResponse } from "@/lib/types/project";
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface Project extends ProjectResponse {
	// Add any frontend-only fields here if needed
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
	const { user } = useAuth();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (user?.id) {
			fetchProjects();
		} else {
			setProjects([]);
		}
	}, [user]);

	const fetchProjects = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await projectActions.getAllProjects();
			if (response.success && response.data) {
				setProjects(response.data.reverse());
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
				setProjects((prev) => [...prev, response.data as Project]);
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
		setLoading(true);
		setError(null);
		try {
			const response = await projectActions.updateProject(
				projectId,
				updates as any,
			);
			if (response.success && response.data) {
				setProjects((prev) =>
					prev.map((p) =>
						p.id === projectId ? (response.data as Project) : p,
					),
				);
			} else {
				throw new Error(response.error || "Failed to update project");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteProject = async (projectId: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await projectActions.deleteProject(projectId);
			if (response.success) {
				setProjects((prev) => prev.filter((p) => p.id !== projectId));
			} else {
				throw new Error(response.error || "Failed to delete project");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
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
