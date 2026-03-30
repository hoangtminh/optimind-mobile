import { TaskResponse } from "./task";

export interface ProjectResponse {
	id: string;
	name: string;
	description?: string;
	user_id: string;
	created_at: string;
	updated_at?: string;
	task_count?: number;
	tasks?: TaskResponse[];
}
