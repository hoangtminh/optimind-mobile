import { TokenResponse } from "@/lib/types/auth";
import { apiGet, apiPost, ApiResponse } from "./client";

export interface User {
	id: string;
	username: string;
	email: string;
}

export const authActions = {
	login: (
		email: string,
		password: string,
		remember: boolean,
	): Promise<ApiResponse<TokenResponse>> =>
		apiPost("/api/auth/login", { email, password, remember }),
	register: (data: any) => apiPost("/api/auth/register", data),
	logout: (data: { refreshToken: string }) =>
		apiPost("/api/auth/logout", data),
	refresh: (data: { refreshToken: string }) =>
		apiPost("/api/auth/refresh", data),
	googleLogin: (data: {
		code: string;
		redirectUri?: string;
	}): Promise<ApiResponse<{ token: TokenResponse }>> =>
		apiPost("/api/auth/oauth2/google", data),
	getMe: () => apiGet<User>("/api/auth/me"),
};
