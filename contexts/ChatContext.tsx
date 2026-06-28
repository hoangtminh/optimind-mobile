import { Client } from "@stomp/stompjs";
import { Buffer } from "buffer";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { chatActions } from "../api/chat-actions";
import { getFreshAccessToken } from "../api/client";
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

const SOCKET_URL =
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080")
    .replace("http://", "ws://")
    .replace("https://", "wss://") + "/chat/websocket";
const HEARTBEAT_INTERVAL_MS = 10000;
const RECONNECT_DELAY_MS = 5000;

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
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (user?.id) {
      fetchChats();
      return;
    }

    setChats([]);
    setMessages([]);
    setActiveChatId(null);
    setIsConnected(false);
  }, [user?.id]);

  useEffect(() => {
    appStateRef.current = AppState.currentState;
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;

    let isDisposed = false;

    const createClient = () => {
      try {
        const client = new Client({
          brokerURL: SOCKET_URL,
          beforeConnect: async () => {
            try {
              const token = await getFreshAccessToken();
              if (!token) {
                console.warn(
                  "Missing access token for chat socket, connection might fail",
                );
                return;
              }

              client.connectHeaders = {
                Authorization: `Bearer ${token}`,
              };
            } catch (err) {
              console.warn("Error getting fresh token in beforeConnect:", err);
            }
          },
          // Adding for stompjs to connect from Android
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,
          reconnectDelay: RECONNECT_DELAY_MS,
          heartbeatIncoming: HEARTBEAT_INTERVAL_MS,
          heartbeatOutgoing: HEARTBEAT_INTERVAL_MS,
          onConnect: () => {
            if (isDisposed) return;
            setIsConnected(true);
            client.subscribe(`/user/${user.id}/notifications`, (message) => {
              const payload = JSON.parse(message.body);
              const targetChatId = payload.chatId;

              if (targetChatId === activeChatIdRef.current) {
                setMessages((prev) => [payload, ...prev]);
              } else {
                fetchChats();
              }
            });

            client.subscribe(`/user/${user.id}/update`, (message) => {
              const updatedMsg = JSON.parse(message.body);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === updatedMsg.id ? updatedMsg : msg,
                ),
              );
            });

            client.subscribe(`/user/${user.id}/delete`, (message) => {
              const deletedId = message.body.replace(/"/g, "");
              setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
            });
          },
          onDisconnect: () => setIsConnected(false),
          onStompError: (frame) => {
            console.warn("Chat socket STOMP error:", frame.headers["message"]);
          },
          onWebSocketError: (event) => {
            console.warn("Chat socket connection error:", event);
            setIsConnected(false);
          },
          onWebSocketClose: () => {
            setIsConnected(false);
          },
        });

        stompClientRef.current = client;
        return client;
      } catch (err) {
        console.warn("Failed to create chat socket client:", err);
        return null;
      }
    };

    const client = createClient();
    if (!client) return;

    const activateClient = () => {
      if (isDisposed || client.active || appStateRef.current !== "active")
        return;
      client.activate();
    };

    const deactivateClient = () => {
      if (!client.active) return;
      setIsConnected(false);
      client.deactivate();
    };

    activateClient();

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        appStateRef.current = nextAppState;

        if (nextAppState === "active") {
          if (client && !client.connected) {
            console.log(
              "App returned to foreground, socket not connected. Re-activating...",
            );
            try {
              await client.deactivate();
            } catch (err) {
              console.warn(
                "Failed to deactivate STOMP client on foreground change:",
                err,
              );
            }
            if (!isDisposed && appStateRef.current === "active") {
              client.activate();
            }
          } else {
            activateClient();
          }
        } else {
          deactivateClient();
        }
      },
    );

    return () => {
      isDisposed = true;
      subscription.remove();
      setIsConnected(false);
      client.deactivate();
      if (stompClientRef.current === client) {
        stompClientRef.current = null;
      }
    };
  }, [user?.id]);

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
        setHasMore((res.data as ChatMessageResponse[]).length === PAGE_SIZE);
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
      const res = await chatActions.getHistory(activeChatId, page, PAGE_SIZE);
      if (res.success) {
        // Append older messages for inverted list
        setMessages((prev) => [
          ...prev,
          ...(res.data as ChatMessageResponse[]).reverse(),
        ]);
        setHasMore((res.data as ChatMessageResponse[]).length === PAGE_SIZE);
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
      const res = await chatActions.createChat(name, members, true);
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
