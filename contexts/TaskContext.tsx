import { taskActions } from "@/api/task-actions";
import { TaskResponse } from "@/lib/types/task";
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Task extends TaskResponse {
	// Add any frontend-only fields here if needed
}

interface TaskContextType {
	tasks: Task[];
	loading: boolean;
	error: string | null;
	selectedProjectId: string;
	setSelectedProjectId: (id: string) => void;

	// CRUD operations
	createTask: (data: {
		title: string;
		note?: string;
		priority: "low" | "medium" | "high";
		dueDate?: string;
		status: "todo" | "in_progress" | "review" | "complete";
		projectId: string;
		tag?: string[];
		repeated?: string;
	}) => Promise<void>;

	updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
	updateTaskStatus: (
		taskId: string,
		status: "todo" | "in_progress" | "review" | "complete",
	) => Promise<void>;
	deleteTask: (taskId: string) => Promise<void>;

	// Data fetching
	fetchTasks: (projectId?: string) => Promise<void>;
	fetchAllTasks: () => Promise<void>;
	fetchTaskById: (taskId: string) => Promise<Task | null>;

	// UI state
	isAddModalOpen: boolean;
	setIsAddModalOpen: (open: boolean) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error("useTask must be used within a TaskProvider");
	}
	return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedProjectId, setSelectedProjectId] = useState("");
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const fetchTasks = async (projectId?: string) => {
		setLoading(true);
		setError(null);

		try {
			let response;
			if (projectId) {
				response = await taskActions.getTasksByProject(projectId);
			} else {
				response = await taskActions.getAllTasks();
			}

			if (response.success && response.data) {
				setTasks(response.data as Task[]);
			} else {
				setError(response.error || "Failed to fetch tasks");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const fetchAllTasks = async () => {
		await fetchTasks();
	};

	const fetchTaskById = async (taskId: string): Promise<Task | null> => {
		setLoading(true);
		setError(null);

		try {
			const response = await taskActions.getTaskById(taskId);
			if (response.success && response.data) {
				const task = response.data as Task;
				// Update existing task in state if it exists
				setTasks((prev) => {
					const index = prev.findIndex((t) => t.id === taskId);
					if (index !== -1) {
						const next = [...prev];
						next[index] = task;
						return next;
					}
					return [...prev, task];
				});
				return task;
			} else {
				setError(response.error || "Failed to fetch task");
				return null;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const createTask = async (data: {
		title: string;
		note?: string;
		priority: "low" | "medium" | "high";
		dueDate?: string;
		status: "todo" | "in_progress" | "review" | "complete";
		projectId: string;
		tag?: string[];
		repeated?: string;
	}) => {
		setLoading(true);
		setError(null);

		try {
			const response = await taskActions.createTask(data);

			if (response.success && response.data) {
				setTasks((prev) => [...prev, response.data as Task]);
			} else {
				throw new Error(response.error || "Failed to create task");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateTask = async (taskId: string, updates: Partial<Task>) => {
		setLoading(true);
		setError(null);

		try {
			const updateData = {
				title: updates.title,
				note: updates.note,
				priority: updates.priority,
				dueDate: updates.dueDate,
				status: updates.status,
				tag: updates.tag,
				repeated: updates.repeated,
			};

			const response = await taskActions.updateTask(taskId, updateData);

			if (response.success && response.data) {
				setTasks((prev) =>
					prev.map((task) =>
						task.id === taskId
							? {
									...task,
									...updates,
									note: updates.note || task.note,
									dueDate: updates.dueDate || task.dueDate,
								}
							: task,
					),
				);
			} else {
				throw new Error(response.error || "Failed to update task");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateTaskStatus = async (
		taskId: string,
		status: "todo" | "in_progress" | "review" | "complete",
	) => {
		setLoading(true);
		setError(null);

		try {
			const response = await taskActions.updateTaskStatus(taskId, status);

			if (response.success && response.data) {
				setTasks((prev) =>
					prev.map((task) =>
						task.id === taskId
							? {
									...task,
									status,
									isCompleted: status === "complete",
								}
							: task,
					),
				);
			} else {
				throw new Error(
					response.error || "Failed to update task status",
				);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteTask = async (taskId: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await taskActions.deleteTask(taskId);

			if (response.success) {
				setTasks((prev) => prev.filter((task) => task.id !== taskId));
			} else {
				throw new Error(response.error || "Failed to delete task");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const contextValue: TaskContextType = {
		tasks,
		loading,
		error,
		selectedProjectId,
		setSelectedProjectId,
		createTask,
		updateTask,
		updateTaskStatus,
		deleteTask,
		fetchTasks,
		fetchAllTasks,
		fetchTaskById,
		isAddModalOpen,
		setIsAddModalOpen,
	};

	return (
		<TaskContext.Provider value={contextValue}>
			{children}
		</TaskContext.Provider>
	);
};
