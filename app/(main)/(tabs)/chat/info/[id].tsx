import { chatActions } from "@/api/chat-actions";
import { AppHeader } from "@/components/app/AppHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { Theme } from "@/constants/Theme";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  BellOff,
  Edit2,
  Group,
  LogOut,
  Pin,
  UserPlus,
  Verified,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Input, Text, View, XStack, YStack } from "tamagui";

export default function ChatInfoScreen() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    leaveChat: leaveRoom,
    chats: rooms,
    fetchChats,
    updateChatName,
  } = useChat();

  const chatRoom = rooms.find((r) => r.id === id);
  const [chatDetail, setChatDetail] = useState<any>(null);
  const [rawMembers, setRawMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchChatData = async () => {
        setIsLoading(true);
        try {
          const detailRes = await chatActions.getChatDetail(id);
          if (detailRes.success && detailRes.data) {
            setChatDetail(detailRes.data);

            // If detail has members, use it
            if (
              detailRes.data.members &&
              Array.isArray(detailRes.data.members)
            ) {
              setRawMembers(detailRes.data.members);
            } else {
              // Otherwise, try to load members from the separate endpoint
              const membersRes = await chatActions.getChatMembers(id);
              if (membersRes.success && membersRes.data) {
                setRawMembers(membersRes.data);
              }
            }
          } else {
            // Fallback if detail failed but members might succeed
            const membersRes = await chatActions.getChatMembers(id);
            if (membersRes.success && membersRes.data) {
              setRawMembers(membersRes.data);
            }
          }
        } catch (error) {
          console.error("Failed to load chat info:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchChatData();
    }
  }, [id]);

  const mappedMembers = rawMembers.map((m: any) => ({
    id: m.id || m.userId || String(Math.random()),
    name: m.username || m.name || m.email || "Member",
    role:
      m.id === (chatDetail?.creatorId || chatDetail?.creator?.id)
        ? "Admin"
        : "Member",
    avatar: m.imageUrl || m.avatar || "",
    isVerified: m.id === currentUser?.id || m.isVerified || false,
  }));

  const members =
    mappedMembers.length > 0
      ? mappedMembers
      : [
          {
            id: currentUser?.id,
            name: currentUser?.username || "You",
            role: "Admin",
            isVerified: true,
            avatar: "",
          },
        ];

  // State for settings toggles
  const [isMuted, setIsMuted] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState("");

  const handleLeaveChat = () => {
    setShowLeaveDialog(true);
  };

  const onConfirmLeave = async () => {
    if (id) {
      await leaveRoom(id);
      await fetchChats();
      router.replace("/(main)/(tabs)/chat");
    }
    setShowLeaveDialog(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top", "bottom"]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <YStack flex={1} backgroundColor={Theme.background}>
        <AppHeader
          title="Chat Info"
          showBackButton
          onBack={() => {
            router.replace(`/(main)/(tabs)/chat/${id}`);
          }}
        />
        <ScrollView
          style={{ flex: 1, backgroundColor: Theme.background }}
          contentContainerStyle={{
            paddingBottom: 32,
            flexGrow: 1,
          }}
        >
          {isLoading ? (
            <View
              flex={1}
              justifyContent="center"
              alignItems="center"
              paddingTop="$10"
            >
              <ActivityIndicator size="large" color={Theme.primary} />
            </View>
          ) : (
            <YStack paddingTop="$8" paddingHorizontal="$4">
              {/* Profile Header Section */}
              <YStack alignItems="center" marginBottom="$3">
                <View position="relative" marginBottom="$3">
                  <Avatar
                    size={128}
                    borderRadius="$6"
                    elevation="$2"
                    borderWidth={4}
                    borderColor={Theme.surface}
                  >
                    <Avatar.Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        chatRoom?.name || chatDetail?.name || "Chat Group",
                      )}&background=${Theme.isDark ? "2A223A" : "F2EDFA"}&color=${
                        Theme.isDark ? "BB86FC" : "4F378A"
                      }&bold=true&size=256`}
                    />
                    <Avatar.Fallback backgroundColor={Theme.surfaceMuted} />
                  </Avatar>
                  <View
                    position="absolute"
                    bottom={-8}
                    right={-8}
                    backgroundColor={Theme.primary}
                    padding="$1.5"
                    borderRadius="$3"
                    borderWidth={4}
                    borderColor={Theme.surface}
                  >
                    <Group size={14} color={Theme.primaryText} />
                  </View>
                </View>
                <XStack
                  alignItems="center"
                  gap="$2"
                  justifyContent="center"
                  marginBottom="$1"
                >
                  <Text
                    fontSize="$7"
                    fontWeight="700"
                    textAlign="center"
                    color={Theme.text}
                  >
                    {chatRoom?.name || chatDetail?.name || "Chat Group"}
                  </Text>
                  <Button
                    icon={<Edit2 size={16} color={Theme.primary} />}
                    circular
                    chromeless
                    size="$2"
                    onPress={() => {
                      setNewName(chatRoom?.name || chatDetail?.name || "");
                      setShowRenameModal(true);
                    }}
                    pressStyle={{
                      backgroundColor: Theme.primaryPastel,
                    }}
                  />
                </XStack>
                <Text color={Theme.textMuted} fontSize="$3" fontWeight="500">
                  Academic Sanctuary • {members.length} Members
                </Text>
              </YStack>

              {/* Members Section */}
              <YStack marginBottom="$4">
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="$1"
                  paddingHorizontal="$2"
                >
                  <Text
                    fontSize="$1"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing={1.5}
                    color={Theme.textMuted}
                  >
                    Members
                  </Text>
                  <Text
                    fontSize="$2"
                    fontWeight="600"
                    color={Theme.primaryPastelText}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    backgroundColor={Theme.primaryPastel}
                    borderRadius="$2"
                  >
                    Shared Workspace
                  </Text>
                </XStack>
                <YStack
                  backgroundColor={Theme.surface}
                  borderRadius={24}
                  paddingHorizontal="$2"
                  gap="$1"
                  borderWidth={1}
                  borderColor={Theme.border}
                >
                  {members.map((member) => (
                    <XStack
                      key={member.id}
                      alignItems="center"
                      justifyContent="space-between"
                      padding="$3"
                      backgroundColor={
                        member.id === currentUser?.id
                          ? Theme.surfaceMuted
                          : "transparent"
                      }
                      borderRadius="$5"
                      hoverStyle={{
                        transform: [{ translateX: 4 }],
                      }}
                    >
                      <XStack alignItems="center" gap="$4">
                        <Avatar size={40} borderRadius="$3">
                          <Avatar.Image
                            src={
                              member.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${Theme.isDark ? "2A223A" : "F2EDFA"}&color=${Theme.isDark ? "BB86FC" : "4F378A"}&bold=true`
                            }
                          />
                          <Avatar.Fallback
                            backgroundColor={Theme.primaryPastel}
                          />
                        </Avatar>
                        <YStack>
                          <Text
                            fontSize="$3"
                            fontWeight="600"
                            color={Theme.text}
                          >
                            {member.name}
                          </Text>
                          <Text
                            fontSize="$1"
                            color={Theme.textMuted}
                            textTransform="uppercase"
                            letterSpacing={0.5}
                          >
                            {member.role}
                          </Text>
                        </YStack>
                      </XStack>
                      {member.isVerified && member.id !== currentUser?.id && (
                        <Verified size={14} color={Theme.primary} />
                      )}
                    </XStack>
                  ))}
                </YStack>
              </YStack>

              {/* Chat Settings Section */}
              <YStack marginBottom="$6">
                <Text
                  fontSize="$1"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing={1.5}
                  color={Theme.textMuted}
                  marginBottom="$1"
                  paddingHorizontal="$2"
                >
                  Chat Settings
                </Text>
                <YStack
                  backgroundColor={Theme.surface}
                  borderRadius={24}
                  padding="$2"
                  gap="$3"
                  borderWidth={1}
                  borderColor={Theme.border}
                >
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal="$4"
                    paddingVertical="$1.5"
                    borderRadius="$5"
                  >
                    <XStack alignItems="center" gap="$4">
                      <View
                        borderRadius="$3"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <BellOff size={20} color={Theme.primary} />
                      </View>
                      <Text fontSize="$3" fontWeight="500" color={Theme.text}>
                        Mute Notifications
                      </Text>
                    </XStack>
                    <Switch
                      value={isMuted}
                      onValueChange={setIsMuted}
                      trackColor={{ false: Theme.border, true: Theme.primary }}
                      thumbColor={Theme.surface}
                    />
                  </XStack>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal="$4"
                    paddingVertical="$1.5"
                    borderRadius="$5"
                  >
                    <XStack alignItems="center" gap="$4">
                      <View alignItems="center" justifyContent="center">
                        <Pin size={20} color={Theme.primary} />
                      </View>
                      <Text fontSize="$3" fontWeight="500" color={Theme.text}>
                        Pin to Top
                      </Text>
                    </XStack>
                    <Switch
                      value={isPinned}
                      onValueChange={setIsPinned}
                      trackColor={{ false: Theme.border, true: Theme.primary }}
                      thumbColor={Theme.surface}
                    />
                  </XStack>
                </YStack>
              </YStack>

              {/* Actions */}
              <YStack gap="$3">
                <Button
                  height="$5"
                  borderRadius="$5"
                  pressStyle={{ scale: 0.95 }}
                  onPress={() => {}}
                  backgroundColor={Theme.primary}
                >
                  <UserPlus size={18} color={Theme.primaryText} />
                  <Text
                    color={Theme.primaryText}
                    fontWeight="700"
                    marginLeft="$2"
                  >
                    Add Members
                  </Text>
                </Button>
                <Button
                  height="$5"
                  borderRadius="$5"
                  borderWidth={1}
                  borderColor={Theme.border}
                  backgroundColor={Theme.accentRed}
                  onPress={handleLeaveChat}
                  pressStyle={{
                    scale: 0.95,
                    backgroundColor: Theme.border,
                  }}
                  icon={<LogOut size={18} color={Theme.accentRedText} />}
                >
                  <Text
                    color={Theme.accentRedText}
                    fontWeight="700"
                    marginLeft="$2"
                  >
                    Leave Chat
                  </Text>
                </Button>
              </YStack>
            </YStack>
          )}
        </ScrollView>
      </YStack>

      <PremiumAlertDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        onConfirm={onConfirmLeave}
        title="Leave Chat"
        description="Are you sure you want to leave this chat? You will no longer receive messages from this group."
        type="confirm"
        confirmText="Leave"
      />

      {/* Rename Modal */}
      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(29, 27, 32, 0.4)"
          padding="$4"
        >
          <View
            backgroundColor={Theme.surface}
            width="100%"
            maxWidth={400}
            borderRadius={12}
            borderWidth={1}
            borderColor={Theme.border}
            padding="$5"
          >
            <Text
              fontSize="$5"
              fontWeight="700"
              color={Theme.text}
              marginBottom="$4"
            >
              Rename Sanctuary
            </Text>

            <YStack gap="$1.5" marginBottom="$4">
              <Text fontSize="$3" color={Theme.text} fontWeight="600">
                New Name
              </Text>
              <Input
                backgroundColor={Theme.background}
                borderWidth={1}
                borderColor={Theme.border}
                color={Theme.text}
                focusStyle={{ borderColor: Theme.primary }}
                paddingHorizontal="$3.5"
                height={44}
                borderRadius={8}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter new sanctuary name..."
                placeholderTextColor={Theme.textMuted as any}
                selectionColor={Theme.primary as any}
              />
            </YStack>

            <XStack justifyContent="flex-end" gap="$3">
              <Button
                height={36}
                borderRadius={6}
                backgroundColor={Theme.background}
                borderWidth={1}
                borderColor={Theme.border}
                onPress={() => setShowRenameModal(false)}
                pressStyle={{ backgroundColor: Theme.border, scale: 0.98 }}
              >
                <Text color={Theme.textMuted} fontWeight="600">
                  Cancel
                </Text>
              </Button>

              <Button
                height={36}
                borderRadius={6}
                backgroundColor={Theme.primary}
                disabled={!newName.trim()}
                opacity={!newName.trim() ? 0.6 : 1}
                onPress={async () => {
                  if (newName.trim() && id) {
                    await updateChatName(id, newName.trim());
                    setShowRenameModal(false);
                  }
                }}
                pressStyle={{ scale: 0.98 }}
              >
                <Text color={Theme.primaryText} fontWeight="700">
                  Save
                </Text>
              </Button>
            </XStack>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
