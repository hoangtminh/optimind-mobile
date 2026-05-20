import { TaskResponse } from "../lib/types/task";
import { apiDelete, apiGet, apiPost, apiPut, ApiResponse } from "./client";

export interface CreateTaskRequest {
	title: string;
	note?: string;
	priority: "low" | "medium" | "high";
	dueDate?: string;
	status: "todo" | "in_progress" | "review" | "complete";
	tag?: string[];
	repeated?: string;
	projectId: string;
}

export interface UpdateTaskRequest {
	title?: string;
	note?: string;
	priority?: "low" | "medium" | "high";
	dueDate?: string;
	status?: "todo" | "in_progress" | "review" | "complete";
	tag?: string[];
	repeated?: string;
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
			dueDate: data.dueDate,
			status: data.status,
			tag: data.tag || [],
			repeated: data.repeated || "none",
			projectId: data.projectId,
		};

		return apiPost<TaskResponse>("/api/tasks", payload);
	},

	/**
	 * Get all tasks for a project
	 */
	async getTasksByProject(
		projectId: string,
	): Promise<ApiResponse<TaskResponse[]>> {
		return apiGet<TaskResponse[]>(`/api/tasks/project/${projectId}`);
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
