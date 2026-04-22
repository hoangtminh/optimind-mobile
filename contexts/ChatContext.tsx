import { Client } from "@stomp/stompjs";
import { Buffer } from "buffer";
import * as SecureStore from "expo-secure-store";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Platform } from "react-native";
import { chatActions } from "../api/chat-actions";
import { useAuth } from "../hooks/useAuth";
import { ChatMessageResponse, ChatRoomResponse } from "../lib/types/chat";

import { TextDecoder, TextEncoder } from "text-encoding";
if (typeof global.TextEncoder === "undefined") {
	global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
	global.TextDecoder = TextDecoder;
}
if (typeof global.Buffer === "undefined") {
	global.Buffer = Buffer;
}

interface ChatContextType {
	chats: ChatRoomResponse[];
	messages: ChatMessageResponse[];
	isConnected: boolean;
	sendMessage: (text: string) => void;
	joinChat: (chatId: string) => Promise<void>;
	leaveChat: (chatId: string) => Promise<void>;
	inviteToChat: (chatId: string, userId: string) => Promise<void>;
	addMemberToChat: (chatId: string, userId: string) => Promise<void>;
	loadMoreMessages: () => Promise<void>;
	hasMore: boolean;
	isLoadingHistory: boolean;
	activeChatId: string | null;
	createChat: (
		name: string,
		userIds: string[],
		isPublic: boolean,
	) => Promise<string | undefined>;
	joinChatById: (chatId: string) => Promise<void>;
	fetchChats: () => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
	undefined,
);

export const useChat = () => {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const { user } = useAuth();
	const [chats, setChats] = useState<ChatRoomResponse[]>([]);
	const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const PAGE_SIZE = 30; // 20-30 messages per fetch
	const [isConnected, setIsConnected] = useState(false);
	const stompClientRef = useRef<Client | null>(null);
	const activeChatIdRef = useRef<string | null>(null);

	useEffect(() => {
		activeChatIdRef.current = activeChatId;
	}, [activeChatId]);

	const getToken = async (key: string) => {
		if (Platform.OS === "web") {
			return localStorage.getItem(key);
		}
		return await SecureStore.getItemAsync(key);
	};

	useEffect(() => {
		fetchChats();
	}, []);

	useEffect(() => {
		if (!user || !user.id) return;

		const setupClient = async () => {
			const token = await getToken("accessToken");
			const socketUrl = `ws://10.219.144.88:8080/chat/websocket`; // Dùng chung 1 endpoint đã khai báo ở Backend

			try {
				const client = new Client({
					brokerURL: socketUrl,
					connectHeaders: {
						Authorization: `Bearer ${token}`,
					},
					// Adding for stompjs to connect from Android
					forceBinaryWSFrames: true,
					appendMissingNULLonIncoming: true,
					//
					debug: (str) => console.log("STOMP Debug:", str),
					reconnectDelay: 5000,
					onConnect: () => {
						setIsConnected(true);
						console.log("connected");
						client.subscribe(
							`/user/${user.id}/notifications`,
							(message) => {
								const payload = JSON.parse(message.body);
								console.log(payload);
								const targetChatId = payload.chatId;

								if (targetChatId === activeChatIdRef.current) {
									setMessages((prev) => [payload, ...prev]);
								} else {
									console.log(
										"New message in another chat:",
										targetChatId,
									);
								}
							},
						);

						client.subscribe(
							`/user/${user.id}/update`,
							(message) => {
								const updatedMsg = JSON.parse(message.body);
								setMessages((prev) =>
									prev.map((msg) =>
										msg.id === updatedMsg.id
											? updatedMsg
											: msg,
									),
								);
							},
						);

						client.subscribe(
							`/user/${user.id}/delete`,
							(message) => {
								const deletedId = message.body.replace(
									/"/g,
									"",
								);
								setMessages((prev) =>
									prev.filter((msg) => msg.id !== deletedId),
								);
							},
						);
					},
					onDisconnect: () => setIsConnected(false),
					onStompError: (frame) => {
						console.log(
							"SERVER REJECTED US:",
							frame.headers["message"],
						);
						console.log("FULL ERROR FRAME:", frame);
					},
					onWebSocketError: (event) => {
						console.error("WebSocket connection error:", event);
						setIsConnected(false);
					},
					onWebSocketClose: () => {
						setIsConnected(false);
					},
				});

				client.activate();
				stompClientRef.current = client;
			} catch (err) {
				console.log(err);
			}
		};

		setupClient();
		return () => {
			stompClientRef.current?.deactivate();
		};
	}, [user]);

	const joinChat = async (chatId: string) => {
		setActiveChatId(chatId);
		setPage(0);
		setHasMore(true);
		setIsLoadingHistory(true);

		try {
			// Ensure your API supports page and size parameters
			const res = await chatActions.getHistory(chatId, 0, PAGE_SIZE);
			if (res.success) {
				setMessages(res.data as ChatMessageResponse[]);
				setHasMore(
					(res.data as ChatMessageResponse[]).length === PAGE_SIZE,
				);
				setPage(1);
			}
		} catch (error) {
			console.error("Failed to load chat history:", error);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	const leaveChat = async (chatId: string) => {
		try {
			const res = await chatActions.leaveChat(chatId);
			if (res.success && activeChatId === chatId) {
				setActiveChatId(null);
				setMessages([]);
			}
		} catch (error) {
			console.error("Failed to leave chat:", error);
		}
	};

	const inviteToChat = async (chatId: string, userId: string) => {
		try {
			await chatActions.inviteToChat(chatId, userId);
		} catch (error) {
			console.error("Failed to invite to chat:", error);
		}
	};

	const addMemberToChat = async (chatId: string, userId: string) => {
		try {
			await chatActions.addMember(chatId, userId);
		} catch (error) {
			console.error("Failed to add member to chat:", error);
		}
	};

	const loadMoreMessages = async () => {
		if (!activeChatId || isLoadingHistory || !hasMore) return;

		setIsLoadingHistory(true);
		try {
			const res = await chatActions.getHistory(
				activeChatId,
				page,
				PAGE_SIZE,
			);
			if (res.success) {
				// Append older messages for inverted list
				setMessages((prev) => [
					...prev,
					...(res.data as ChatMessageResponse[]).reverse(),
				]);
				setHasMore(
					(res.data as ChatMessageResponse[]).length === PAGE_SIZE,
				);
				setPage((prev) => prev + 1);
			}
		} catch (error) {
			console.error("Failed to load more messages:", error);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	const createChat = async (name: string, members: string[]) => {
		try {
			console.log(members);
			const res = await chatActions.createChat(name, members, true);
			console.log(res);
			if (res.success && res.data) {
				return res.data;
			}
		} catch (error) {
			console.error("Failed to create chat:", error);
		}
	};

	const joinChatById = async (chatId: string) => {
		try {
			const res = await chatActions.joinChat(chatId);
			if (res.success) {
				await joinChat(chatId); // Mở và tải lịch sử phòng chat sau khi join thành công
			}
		} catch (error) {
			console.error("Failed to join chat by id:", error);
		}
	};

	const sendMessage = (text: string) => {
		if (stompClientRef.current?.connected && activeChatIdRef.current) {
			const messageData = {
				text: text,
			};
			console.log(activeChatIdRef.current);
			stompClientRef.current.publish({
				destination: `/app/chat/${activeChatIdRef.current}/send`, // Khớp với @MessageMapping("/chat/{chatId}/send")
				body: JSON.stringify(messageData),
			});
		}
	};

	const fetchChats = async () => {
		const res = await chatActions.getChats();
		if (res.success && res.data) {
			setChats(res.data);
		}
	};

	return (
		<ChatContext.Provider
			value={{
				chats,
				messages,
				isConnected,
				sendMessage,
				joinChat,
				leaveChat,
				inviteToChat,
				addMemberToChat,
				loadMoreMessages,
				hasMore,
				isLoadingHistory,
				activeChatId,
				createChat,
				joinChatById,
				fetchChats,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
