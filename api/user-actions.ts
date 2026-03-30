import { apiGet, apiPut, ApiResponse } from "./client";

export interface UserProfile {
	id: string;
	email: string;
	username?: string;
	role?: string;
	imageUrl?: string;
	coins?: number;
	currentStreak?: number;
	exp?: number;
	lastActiveDate?: string;
	level?: number;
	longestStreak?: number;
	studyTime?: number;
	createdAt?: string;
}

export const userActions = {
	getUserProfile: (id: string): Promise<ApiResponse<UserProfile>> =>
		apiGet<UserProfile>(`/api/users/${id}`),
	updateUserProfile: (
		id: string,
		data: Partial<UserProfile>,
	): Promise<ApiResponse<UserProfile>> =>
		apiPut<UserProfile>(`/api/users/${id}`, data),
};
