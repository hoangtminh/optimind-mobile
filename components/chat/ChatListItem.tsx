import { useChat } from "@/contexts/ChatContext";
import { useRouter } from "expo-router";
import { LogOut, MoreVertical } from "lucide-react-native";
import {
	Avatar,
	Button,
	Circle,
	Popover,
	Text,
	XStack,
	YStack,
	styled,
} from "tamagui";
import { Theme } from "@/constants/Theme";

const StyledCard = styled(XStack, {
	padding: "$4",
	borderRadius: 8, // Crisp corners
	alignItems: "center",
	gap: "$4",
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	elevation: 0,
	pressStyle: { scale: 0.98, backgroundColor: Theme.primaryPastel },
});

interface ChatListItemProps {
	chat: {
		id: string;
		name: string;
		lastMessage?: {
			content: string;
			createdAt: string;
		};
	};
	hasUnread?: boolean;
}

export const ChatListItem = ({
	chat,
	hasUnread = false,
}: ChatListItemProps) => {
	const router = useRouter();
	const { leaveChat, fetchChats } = useChat();

	return (
		<StyledCard
			onPress={() => router.push(`/(main)/(tabs)/chat/${chat.id}`)}
			borderLeftWidth={hasUnread ? 4 : 0}
			borderLeftColor={Theme.primary}
		>
			<Avatar circular size="$5">
				<Avatar.Image
					src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=F2EDFA&color=4F378A&bold=true`}
				/>
				<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
			</Avatar>

			<YStack flex={1} gap="$1">
				<XStack justifyContent="space-between" alignItems="center">
					<Text
						fontWeight={hasUnread ? "700" : "600"}
						fontSize="$4"
						color={Theme.text}
						numberOfLines={1}
						flex={1}
					>
						{chat.name}
					</Text>
					<Text
						fontSize={11}
						fontWeight={hasUnread ? "700" : "500"}
						color={hasUnread ? Theme.primary : Theme.textMuted}
					>
						{chat.lastMessage?.createdAt
							? new Date(
									chat.lastMessage.createdAt,
								).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})
							: ""}
					</Text>
				</XStack>

				<XStack justifyContent="space-between" alignItems="center">
					<Text
						color={hasUnread ? Theme.text : Theme.textMuted}
						fontSize="$3"
						numberOfLines={1}
						flex={1}
						fontWeight={hasUnread ? "600" : "400"}
					>
						{chat.lastMessage?.content || "No messages yet"}
					</Text>
					{hasUnread && (
						<Circle
							size={8}
							backgroundColor={Theme.primary}
							marginLeft="$2"
						/>
					)}
				</XStack>
			</YStack>

			<Popover size="$5" allowFlip placement="bottom-end">
				<Popover.Trigger asChild>
					<Button
						icon={<MoreVertical size={18} color={Theme.textMuted} />}
						circular
						chromeless
						onPress={(e) => {
							e.stopPropagation();
						}}
						pressStyle={{ backgroundColor: Theme.background }}
					/>
				</Popover.Trigger>

				<Popover.Content
					borderWidth={1}
					borderColor={Theme.border}
					enterStyle={{ y: -5, opacity: 0 }}
					exitStyle={{ y: -5, opacity: 0 }}
					padding="$0"
					borderRadius={6} // Crisp corners
					overflow="hidden"
					backgroundColor={Theme.surface}
					elevation={0}
				>
					<YStack width={160}>
						<Button
							chromeless
							borderRadius={0}
							justifyContent="flex-start"
							paddingVertical="$3"
							onPress={async (e) => {
								e.stopPropagation();
								await leaveChat(chat.id);
								await fetchChats();
							}}
							pressStyle={{ backgroundColor: Theme.accentRed }}
						>
							<XStack gap="$3" alignItems="center">
								<LogOut size={16} color={Theme.accentRedText} />
								<Text color={Theme.accentRedText} fontWeight="700">
									Leave Chat
								</Text>
							</XStack>
						</Button>
					</YStack>
				</Popover.Content>
			</Popover>
		</StyledCard>
	);
};
export default ChatListItem;
