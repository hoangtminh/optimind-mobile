import { Theme } from "@/constants/Theme";
import { useChat } from "@/contexts/ChatContext";
import { LinearGradient } from "expo-linear-gradient";
import { Paperclip, Send, Smile } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Input, View, XStack, YStack } from "tamagui";

const ChatInputComponent = () => {
  const [inputText, setInputText] = useState("");
  const { sendMessage } = useChat();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  return (
    <View
      paddingHorizontal="$4"
      paddingVertical="$3"
      backgroundColor={Theme.primaryPastel}
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
            colors={
              Theme.isDark
                ? [Theme.primary, Theme.primary]
                : ["#6750A4", "#4F378A"]
            }
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
  );
};

export const ChatInput = React.memo(ChatInputComponent);
export default ChatInput;
