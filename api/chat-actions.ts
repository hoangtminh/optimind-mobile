import { ChatMessageResponse, ChatRoomResponse } from "../lib/types/chat";
import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./client";

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
		return apiPost<any>(`/api/chats/${chatId}/invite`, { userId });
	},
	addMember: (chatId: string, userId: string): Promise<ApiResponse<any>> => {
		return apiPost<any>(`/api/chats/${chatId}/members`, { userId });
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
	getChatDetail: (chatId: string): Promise<ApiResponse<any>> => {
		return apiGet<any>(`/api/chats/${chatId}`);
	},
	getChatMembers: (chatId: string): Promise<ApiResponse<any[]>> => {
		return apiGet<any[]>(`/api/chats/${chatId}/members`);
	},
	updateMessage: (
		messageId: string,
		text: string,
		chatId: string,
	): Promise<ApiResponse<any>> => {
		return apiPut<any>(`/api/messages/${messageId}`, {
			id: messageId,
			text,
			chatId,
		});
	},
	deleteMessage: (messageId: string): Promise<ApiResponse<any>> => {
		return apiDelete<any>(`/api/messages/${messageId}`);
	},
	updateChat: (
		chatId: string,
		name: string,
		isPublic?: boolean,
	): Promise<ApiResponse<any>> => {
		return apiPut<any>(`/api/chats/${chatId}`, { name, isPublic });
	},
};
