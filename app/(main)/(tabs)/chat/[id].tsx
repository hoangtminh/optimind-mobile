import { AppHeader } from "@/components/app/AppHeader";
import ChatInput from "@/components/chat/ChatInput";
import MessageBubble from "@/components/chat/MessageBubble";
import { Theme } from "@/constants/Theme";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Info } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, View, YStack } from "tamagui";

export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const headerHeight = useHeaderHeight();
  const { user } = useAuth();
  const {
    messages,
    joinChat,
    sendMessage,
    isLoadingHistory,
    loadMoreMessages,
    chats,
  } = useChat();
  const Container = View;

  const chatRoom = chats.find((r) => r.id === id);

  useEffect(() => {
    if (id) {
      joinChat(id);
    }
  }, [id]);

  const renderMessage = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const currentUserId = item.author?.id || item.senderId;
      const isSelf = currentUserId === user?.id;

      const prevMsg = messages[index + 1];
      const nextMsg = messages[index - 1];

      const prevUserId = prevMsg?.author?.id || prevMsg?.senderId;
      const nextUserId = nextMsg?.author?.id || nextMsg?.senderId;

      const currentMsgTime = new Date(item.createdAt || Date.now()).getTime();
      const prevMsgTime = prevMsg
        ? new Date(prevMsg.createdAt || Date.now()).getTime()
        : 0;
      const nextMsgTime = nextMsg
        ? new Date(nextMsg.createdAt || Date.now()).getTime()
        : 0;

      const TIME_THRESHOLD = 5 * 60 * 1000;

      const isFirstInGroup =
        !prevMsg ||
        prevUserId !== currentUserId ||
        currentMsgTime - prevMsgTime > TIME_THRESHOLD;

      const isLastInGroup =
        !nextMsg ||
        nextUserId !== currentUserId ||
        nextMsgTime - currentMsgTime > TIME_THRESHOLD;

      return (
        <MessageBubble
          message={item}
          isSelf={isSelf}
          isFirstInGroup={isFirstInGroup}
          isLastInGroup={isLastInGroup}
        />
      );
    },
    [messages, user?.id],
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top", "bottom"]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <YStack flex={1}>
        <AppHeader
          title={chatRoom?.name || "Chat"}
          showBackButton
          onBack={() => {
            router.replace("/(main)/(tabs)/chat");
          }}
          rightElement={
            <Button
              icon={<Info size={20} color={Theme.text} />}
              circular
              chromeless
              onPress={() =>
                router.push(`/(main)/(tabs)/chat/info/${chatRoom?.id}`)
              }
              pressStyle={{
                backgroundColor: Theme.isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              }}
            />
          }
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={25}
        >
          <Container style={{ flex: 1 }}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                padding: 16,
                paddingTop: 20,
                paddingBottom: 10,
              }} // paddingTop for header
              inverted
              onEndReached={loadMoreMessages}
              onEndReachedThreshold={0.5}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                isLoadingHistory ? (
                  <View marginVertical="$4">
                    <ActivityIndicator color={Theme.primary} />
                  </View>
                ) : null
              }
            />
          </Container>
          {/* Input Area */}
          <ChatInput />
        </KeyboardAvoidingView>
      </YStack>
    </SafeAreaView>
  );
}
