import { TaskResponse } from "./task";

export interface ProjectResponse {
	id: string;
	name: string;
	description?: string;
	userId: string;
	createdAt: string;
	updatedAt?: string;
	taskCount?: number;
	tasks?: TaskResponse[];
}
