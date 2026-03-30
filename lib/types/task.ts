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
