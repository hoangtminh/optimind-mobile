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
