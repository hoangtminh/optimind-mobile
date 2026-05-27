import { StudySession } from "../lib/types/study";
import { apiDelete, apiGet, apiPost, apiPut, ApiResponse } from "./client";

export interface SessionLogResponse {
	id: string;
	focus: number;
	timestamp: string;
	createdAt: string;
}

export interface SessionTaskResponse {
	id: string;
	taskId: string;
	completed: boolean;
}

export interface StudySessionDetailsResponse {
	session: StudySession;
	logs: SessionLogResponse[];
	tasks: SessionTaskResponse[];
}

export const studyActions = {
	getSessions: (): Promise<ApiResponse<StudySession[]>> =>
		apiGet<StudySession[]>("/api/study-sessions"),

	getSessionDetails: (
		id: string,
	): Promise<ApiResponse<StudySessionDetailsResponse>> =>
		apiGet<StudySessionDetailsResponse>(`/api/study-sessions/${id}`),

	createSession: (
		data: Partial<StudySession>,
	): Promise<ApiResponse<StudySession>> =>
		apiPost<StudySession>("/api/study-sessions", data),

	updateSession: (
		id: string,
		data: Partial<StudySession>,
	): Promise<ApiResponse<StudySession>> =>
		apiPut<StudySession>(`/api/study-sessions/${id}`, data),

	deleteSession: (id: string): Promise<ApiResponse<any>> =>
		apiDelete<any>(`/api/study-sessions/${id}`),
};
