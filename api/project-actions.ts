import { apiPost, apiGet, apiPut, apiDelete, ApiResponse } from "./client";

export interface CreateProjectRequest {
	name: string;
	description?: string;
}

export interface UpdateProjectRequest {
	name?: string;
	description?: string;
}

export interface ProjectResponse {
	id: string;
	name: string;
	description?: string;
	user_id: string;
	created_at: string;
	updated_at?: string;
	task_count?: number;
}

export const projectActions = {
	/**
	 * Create a new project
	 */
	async createProject(
		data: CreateProjectRequest,
	): Promise<ApiResponse<ProjectResponse>> {
		const payload = {
			name: data.name,
			description: data.description || "",
		};

		return apiPost<ProjectResponse>("/api/projects", payload);
	},

	/**
	 * Get all projects for the current user
	 */
	async getAllProjects(): Promise<ApiResponse<ProjectResponse[]>> {
		return apiGet<ProjectResponse[]>("/api/projects");
	},

	/**
	 * Get a single project by ID
	 */
	async getProjectById(
		projectId: string,
	): Promise<ApiResponse<ProjectResponse>> {
		return apiGet<ProjectResponse>(`/api/projects/${projectId}`);
	},

	/**
	 * Update a project
	 */
	async updateProject(
		projectId: string,
		data: UpdateProjectRequest,
	): Promise<ApiResponse<ProjectResponse>> {
		return apiPut<ProjectResponse>(`/api/projects/${projectId}`, data);
	},

	/**
	 * Delete a project
	 */
	async deleteProject(
		projectId: string,
	): Promise<ApiResponse<{ message: string }>> {
		return apiDelete<{ message: string }>(`/api/projects/${projectId}`);
	},

	/**
	 * Get project with tasks
	 */
	async getProjectWithTasks(
		projectId: string,
	): Promise<ApiResponse<ProjectResponse & { tasks: any[] }>> {
		return apiGet(`/api/projects/${projectId}?include=tasks`);
	},
};
