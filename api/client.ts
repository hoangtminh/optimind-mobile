import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { Buffer } from "buffer";

export const BASE_IP = `192.168.1.22`;
// const API_BASE_URL = `http://${BASE_IP}:8080`;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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

let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorized = callback;
};

const TOKEN_REFRESH_SKEW_MS = 60 * 1000;

export const isTokenExpiredOrExpiringSoon = (token: string): boolean => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      Buffer.from(normalizedPayload, "base64").toString("utf8"),
    );

    if (typeof decoded.exp !== "number") return true;
    return decoded.exp * 1000 - Date.now() <= TOKEN_REFRESH_SKEW_MS;
  } catch {
    return true;
  }
};

export const getFreshAccessToken = async (): Promise<string | null> => {
  try {
    const token =
      Platform.OS === "web"
        ? localStorage.getItem("accessToken")
        : await SecureStore.getItemAsync("accessToken");

    if (token && !isTokenExpiredOrExpiringSoon(token)) {
      return token;
    }

    const refreshToken =
      Platform.OS === "web"
        ? localStorage.getItem("refreshToken")
        : await SecureStore.getItemAsync("refreshToken");

    if (!refreshToken) {
      return null;
    }

    console.log("Token expired or missing. Attempting silent refresh...");
    const refreshUrl = API_BASE_URL + "/api/auth/refresh";
    const refreshResponse = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const newAccessToken = refreshData.accessToken;
      const newRefreshToken = refreshData.refreshToken;

      if (newAccessToken) {
        if (Platform.OS === "web") {
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
        } else {
          await SecureStore.setItemAsync("accessToken", newAccessToken);
          if (newRefreshToken) {
            await SecureStore.setItemAsync("refreshToken", newRefreshToken);
          }
        }

        setAuthToken(newAccessToken);
        console.log("Silent refresh succeeded in getFreshAccessToken.");
        return newAccessToken;
      }
    } else if (refreshResponse.status === 401) {
      onUnauthorized?.();
    }
    return null;
  } catch (error) {
    console.error("Error in getFreshAccessToken:", error);
    return null;
  }
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

    if (response.ok) {
      return {
        success: true,
        data,
        status: response.status,
      };
    }

    if (response.status === 401) {
      if (
        endpoint !== "/api/auth/refresh" &&
        endpoint !== "/api/auth/login" &&
        endpoint !== "/api/auth/google"
      ) {
        const newAccessToken = await getFreshAccessToken();
        if (newAccessToken) {
          console.log("Silent refresh succeeded. Retrying request...");
          const retriedHeaders = {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return apiRequest<T>(endpoint, {
            ...options,
            headers: retriedHeaders,
          });
        }
      }

      onUnauthorized?.();
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

    const message = error instanceof Error ? error.message : "Unknown error";
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
