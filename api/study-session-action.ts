import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./client";

export interface StudySession {
	id: string;
	date: string;
	duration: number;
	type: string;
	completed: boolean;
	userId?: string;
}

export const studyActions = {
	getSessions: (): Promise<ApiResponse<StudySession[]>> =>
		apiGet<StudySession[]>("/api/study-sessions"),

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
