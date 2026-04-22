import { UserProfile } from "../lib/types/user";
import { apiGet, apiPut, ApiResponse } from "./client";

export const userActions = {
	getUserProfile: (id: string): Promise<ApiResponse<UserProfile>> =>
		apiGet<UserProfile>(`/api/users/${id}`),
	updateUserProfile: (
		id: string,
		data: Partial<UserProfile>,
	): Promise<ApiResponse<UserProfile>> =>
		apiPut<UserProfile>(`/api/users/${id}`, data),
};
