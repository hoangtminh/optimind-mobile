import { apiPost, apiGet, apiPut, apiDelete, ApiResponse } from "./client";

export interface CreateTaskRequest {
	title: string;
	note?: string;
	priority: "low" | "medium" | "high";
	due_date?: string;
	status: "todo" | "in_progress" | "review" | "complete";
	tag?: string[];
	repeated?: string;
	projectId: string;
}

export interface UpdateTaskRequest {
	title?: string;
	note?: string;
	priority?: "low" | "medium" | "high";
	due_date?: string;
	status?: "todo" | "in_progress" | "review" | "complete";
	tag?: string[];
	repeated?: string;
}

export interface TaskResponse {
	id: string;
	title: string;
	note?: string;
	priority: "low" | "medium" | "high";
	due_date?: string;
	status: "todo" | "in_progress" | "review" | "complete";
	tag?: string[];
	repeated?: string;
	project_id: string;
	user_id: string;
	created_at: string;
	updated_at?: string;
	is_completed: boolean;
}

export const taskActions = {
	/**
	 * Create a new task
	 */
	async createTask(
		data: CreateTaskRequest,
	): Promise<ApiResponse<TaskResponse>> {
		const payload = {
			title: data.title,
			note: data.note || "",
			priority: data.priority,
			due_date: data.due_date,
			status: data.status,
			tag: data.tag || [],
			repeated: data.repeated || "none",
			project_id: data.projectId,
		};

		return apiPost<TaskResponse>("/api/tasks", payload);
	},

	/**
	 * Get all tasks for a project
	 */
	async getTasksByProject(
		projectId: string,
	): Promise<ApiResponse<TaskResponse[]>> {
		return apiGet<TaskResponse[]>(`/api/projects/${projectId}/tasks`);
	},

	/**
	 * Get all tasks for the current user
	 */
	async getAllTasks(): Promise<ApiResponse<TaskResponse[]>> {
		return apiGet<TaskResponse[]>("/api/tasks");
	},

	/**
	 * Get a single task by ID
	 */
	async getTaskById(taskId: string): Promise<ApiResponse<TaskResponse>> {
		return apiGet<TaskResponse>(`/api/tasks/${taskId}`);
	},

	/**
	 * Update a task
	 */
	async updateTask(
		taskId: string,
		data: UpdateTaskRequest,
	): Promise<ApiResponse<TaskResponse>> {
		return apiPut<TaskResponse>(`/api/tasks/${taskId}`, data);
	},

	/**
	 * Update task status only
	 */
	async updateTaskStatus(
		taskId: string,
		status: "todo" | "in_progress" | "review" | "complete",
	): Promise<ApiResponse<TaskResponse>> {
		return apiPut<TaskResponse>(`/api/tasks/${taskId}`, {
			status,
			is_completed: status === "complete",
		});
	},

	/**
	 * Delete a task
	 */
	async deleteTask(
		taskId: string,
	): Promise<ApiResponse<{ message: string }>> {
		return apiDelete<{ message: string }>(`/api/tasks/${taskId}`);
	},

	/**
	 * Delete multiple tasks
	 */
	async deleteTasks(
		taskIds: string[],
	): Promise<ApiResponse<{ message: string }>> {
		return apiPost<{ message: string }>("/api/tasks/delete-multiple", {
			ids: taskIds,
		});
	},
};
