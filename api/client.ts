import { getServerIp } from "@/utils/getServerIp";

export const BASE_IP = `192.168.1.9`;
const API_BASE_URL = `http://${BASE_IP}:8080`;

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	status: number;
}

export class ApiError extends Error {
	constructor(
		public statusCode: number,
		public originalError?: any,
	) {
		super(`API Error: ${statusCode}`);
		this.name = "ApiError";
	}
}

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
	authToken = token;
};

async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	try {
		const url = API_BASE_URL + endpoint;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};
		if (authToken) {
			headers["Authorization"] = `Bearer ${authToken}`;
		}

		console.log("Server: ", url, getServerIp());
		console.log("Options: ", options);

		const response = await fetch(url, {
			...options,
			headers,
		});

		const contentType = response.headers.get("content-type");
		let data;

		try {
			if (contentType?.includes("application/json")) {
				data = await response.json();
			} else {
				data = await response.text();
			}
		} catch (e) {
			data = null;
		}

		console.log(data);
		if (response.ok) {
			return {
				success: true,
				data,
				status: response.status,
			};
		}

		throw new ApiError(response.status, data);
	} catch (error) {
		console.log("Error: ", error);
		if (error instanceof ApiError) {
			return {
				success: false,
				error: error.originalError?.message || error.message,
				status: error.statusCode,
			};
		}

		const message =
			error instanceof Error ? error.message : "Unknown error";
		return {
			success: false,
			error: message,
			status: 0,
		};
	}
}

export const apiGet = <T>(endpoint: string): Promise<ApiResponse<T>> =>
	apiRequest<T>(endpoint, { method: "GET" });

export const apiPost = <T>(
	endpoint: string,
	body?: any,
): Promise<ApiResponse<T>> =>
	apiRequest<T>(endpoint, {
		method: "POST",
		body: body ? JSON.stringify(body) : undefined,
	});

export const apiPut = <T>(
	endpoint: string,
	body?: any,
): Promise<ApiResponse<T>> =>
	apiRequest<T>(endpoint, {
		method: "PUT",
		body: body ? JSON.stringify(body) : undefined,
	});

export const apiDelete = <T>(endpoint: string): Promise<ApiResponse<T>> =>
	apiRequest<T>(endpoint, { method: "DELETE" });

export const apiPatch = <T>(
	endpoint: string,
	body?: any,
): Promise<ApiResponse<T>> =>
	apiRequest<T>(endpoint, {
		method: "PATCH",
		body: body ? JSON.stringify(body) : undefined,
	});
