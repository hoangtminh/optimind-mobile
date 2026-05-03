export interface TaskResponse {
	id: string;
	title: string;
	note?: string;
	priority: TaskPriority;
	dueDate?: string;
	status: TaskStatus;
	tag?: string[];
	repeated?: TaskRepeat;
	projectId: string;
	userId: string;
	createdAt: string;
	updatedAt?: string;
	isCompleted: boolean;
}

export type TaskStatus = "todo" | "in_progress" | "review" | "complete";
export type TaskPriority = "low" | "medium" | "high";
export type TaskRepeat =
	| "daily"
	| "weekly"
	| "monthly"
	| "yearly"
	| "none"
	| string;
