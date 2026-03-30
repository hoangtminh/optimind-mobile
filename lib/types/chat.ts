import { UserProfile } from "./user";

export interface ChatMessageResponse {
	id: string;
	chatId: string;
	senderId: string;
	content: string;
	createdAt: string;
	author?: UserProfile;
}

export interface ChatRoomResponse {
	id: string;
	name: string;
	lastMessage?: {
		content: string;
		createdAt: string;
	};
}
