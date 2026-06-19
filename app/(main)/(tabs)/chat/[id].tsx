import { MessageBubble } from "@/components/chat/MessageBubble";
import { AppHeader } from "@/components/common/AppHeader";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Info, Paperclip, Send, Smile } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, View, XStack, YStack } from "tamagui";
import { Theme } from "@/constants/Theme";

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
  const [inputText, setInputText] = useState("");
  const Container = View;

  const chatRoom = chats.find((r) => r.id === id);

  useEffect(() => {
    if (id) {
      joinChat(id);
    }
  }, [id]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !id) return;
    sendMessage(inputText);
    setInputText("");
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
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
  };

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
                backgroundColor: Theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
              }}
            />
          }
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          <View
            paddingHorizontal="$4"
            paddingVertical="$3"
            backgroundColor={Theme.surface}
            borderTopWidth={1}
            borderTopColor={Theme.border}
          >
            <XStack alignItems="center" gap="$3">
              <Button
                icon={<Paperclip color={Theme.primary} />}
                circular
                chromeless
                pressStyle={{ backgroundColor: Theme.primaryPastel }}
              />
              <YStack flex={1} position="relative" justifyContent="center">
                <Input
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your message..."
                  placeholderTextColor={Theme.textMuted as any}
                  backgroundColor={Theme.background}
                  color={Theme.text}
                  borderWidth={1}
                  borderColor={Theme.border}
                  borderRadius={20}
                  paddingHorizontal="$4"
                  fontSize="$4"
                  height={48}
                  focusStyle={{
                    backgroundColor: Theme.surface,
                    borderWidth: 1.5,
                    borderColor: Theme.primary,
                  }}
                  onSubmitEditing={handleSendMessage}
                />
                <Button
                  position="absolute"
                  right="$1"
                  icon={<Smile color={Theme.primary} />}
                  circular
                  chromeless
                  pressStyle={{ backgroundColor: Theme.primaryPastel }}
                />
              </YStack>
              <TouchableOpacity onPress={handleSendMessage}>
                <LinearGradient
                  colors={Theme.isDark ? [Theme.primary, Theme.primary] : ["#6750A4", "#4F378A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 4,
                    shadowColor: Theme.primary,
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  }}
                >
                  <Send color={Theme.primaryText} size={20} />
                </LinearGradient>
              </TouchableOpacity>
            </XStack>
          </View>
        </KeyboardAvoidingView>
      </YStack>
    </SafeAreaView>
  );
}
