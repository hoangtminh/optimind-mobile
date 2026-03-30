import { apiGet, apiPost, ApiResponse } from "./client";

export interface ChatMessage {
	id: string;
	chatId: string;
	senderId: string;
	content: string;
	createdAt: string;
}

export interface Chat {
	id: string;
	name: string;
	lastMessage?: {
		content: string;
		createdAt: string;
	};
}

export const chatActions = {
	getHistory: (
		chatId: string,
		page: number,
		size: number,
	): Promise<ApiResponse<ChatMessage[]>> => {
		return apiGet<ChatMessage[]>(
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
	createChat: (name: string): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats`, { name });
	},
	joinChat: (chatId: string): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats/${chatId}/join`);
	},
	getChats: (): Promise<ApiResponse<Chat[]>> => {
		return apiGet<Chat[]>(`/api/chats`);
	},
};
