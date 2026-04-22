import { ChatMessageResponse, ChatRoomResponse } from "../lib/types/chat";
import { apiGet, apiPost, ApiResponse } from "./client";

export const chatActions = {
	getHistory: (
		chatId: string,
		page: number,
		size: number,
	): Promise<ApiResponse<ChatMessageResponse[]>> => {
		return apiGet<ChatMessageResponse[]>(
			`/api/messages/chat/${chatId}?page=${page}&size=${size}`,
		);
	},
	leaveChat: (chatId: string): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats/${chatId}/leave`);
	},
	inviteToChat: (
		chatId: string,
		userId: string,
	): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats${chatId}/invite`, { userId });
	},
	addMember: (chatId: string, userId: string): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats${chatId}/members`, { userId });
	},
	createChat: (
		name: string,
		members: string[],
		isPublic: boolean,
	): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats`, { name, members, isPublic });
	},
	joinChat: (chatId: string): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats/${chatId}/join`);
	},
	getChats: (): Promise<ApiResponse<ChatRoomResponse[]>> => {
		return apiGet<ChatRoomResponse[]>(`/api/chats`);
	},
};
