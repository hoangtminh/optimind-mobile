import { apiPost, apiGet, ApiResponse } from "./client";

export interface User {
	id: string;
	email: string;
	username?: string;
	role?: string;
}

export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

export const authActions = {
	/**
	 * Register a new user
	 */
	async register(data: any): Promise<ApiResponse<User>> {
		return apiPost<User>("/api/auth/register", data);
	},

	/**
	 * Login a user with email and password
	 */
	async login(data: any): Promise<ApiResponse<TokenResponse>> {
		return apiPost<TokenResponse>("/api/auth/login", data);
	},

	/**
	 * Logout the current user
	 */
	async logout(refreshToken: string): Promise<ApiResponse<any>> {
		return apiPost<any>("/api/auth/logout", { refreshToken });
	},

	/**
	 * Get the currently authenticated user
	 */
	async getMe(): Promise<ApiResponse<User>> {
		return apiGet<User>("/api/auth/me");
	},

	/**
	 * Handle Google OAuth2 Login
	 */
	async googleLogin(
		code: string,
	): Promise<ApiResponse<{ token: TokenResponse }>> {
		return apiPost<{ token: TokenResponse }>("/api/auth/oauth2/google", {
			code,
		});
	},
};
