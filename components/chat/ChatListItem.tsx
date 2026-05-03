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

const StyledCard = styled(XStack, {
	padding: "$4",
	borderRadius: 24,
	alignItems: "center",
	gap: "$4",
	backgroundColor: "#ffffff",
	pressStyle: { scale: 0.98, backgroundColor: "#f8f2fa" },
	shadowColor: "#6750A4",
	shadowRadius: 15,
	shadowOpacity: 0.04,
	shadowOffset: { width: 0, height: 4 },
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
			borderLeftColor="#6750A4"
		>
			<Avatar circular size="$5">
				<Avatar.Image
					src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=6750A4&color=fff&bold=true`}
				/>
				<Avatar.Fallback backgroundColor="#e9ddff" />
			</Avatar>

			<YStack flex={1} gap="$1">
				<XStack justifyContent="space-between" alignItems="center">
					<Text
						fontWeight={hasUnread ? "800" : "700"}
						fontSize="$4"
						color="#1d1b20"
						numberOfLines={1}
						flex={1}
					>
						{chat.name}
					</Text>
					<Text
						fontSize={11}
						fontWeight={hasUnread ? "700" : "500"}
						color={hasUnread ? "#6750A4" : "#7a7582"}
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
						color={hasUnread ? "#1d1b20" : "#494551"}
						fontSize="$3"
						numberOfLines={1}
						flex={1}
						fontWeight={hasUnread ? "600" : "400"}
					>
						{chat.lastMessage?.content || "No messages yet"}
					</Text>
					{hasUnread && (
						<Circle
							size={10}
							backgroundColor="#6750A4"
							marginLeft="$2"
						/>
					)}
				</XStack>
			</YStack>

			<Popover size="$5" allowFlip placement="bottom-end">
				<Popover.Trigger asChild>
					<Button
						icon={<MoreVertical size={20} color="#7a7582" />}
						circular
						chromeless
						onPress={(e) => {
							e.stopPropagation();
						}}
						pressStyle={{ backgroundColor: "#f2ecf4" }}
					/>
				</Popover.Trigger>

				<Popover.Content
					borderWidth={1}
					borderColor="#f2ecf4"
					enterStyle={{ y: -10, opacity: 0 }}
					exitStyle={{ y: -10, opacity: 0 }}
					padding="$0"
					borderRadius={16}
					overflow="hidden"
					backgroundColor="white"
				>
					<YStack width={180}>
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
							hoverStyle={{ backgroundColor: "#fffbfa" }}
							pressStyle={{ backgroundColor: "#ffdad6" }}
						>
							<XStack gap="$3" alignItems="center">
								<LogOut size={18} color="#ba1a1a" />
								<Text color="#ba1a1a" fontWeight="700">
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
