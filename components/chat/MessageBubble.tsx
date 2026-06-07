import { Avatar, Text, View, XStack, YStack } from "tamagui";
import { Theme } from "@/constants/Theme";

interface MessageBubbleProps {
	message: {
		id: string;
		text?: string;
		content?: string;
		createdAt: string;
		author?: {
			username: string;
			imageUrl?: string;
		};
	};
	isSelf: boolean;
	isFirstInGroup: boolean;
	isLastInGroup: boolean;
}

export const MessageBubble = ({
	message,
	isSelf,
	isFirstInGroup,
	isLastInGroup,
}: MessageBubbleProps) => {
	const content = message.content || message.text;
	const date = new Date(message.createdAt || Date.now());
	const isToday = new Date().toDateString() === date.toDateString();

	const timestamp = isToday
		? date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
		: date.toLocaleDateString([], {
				month: "short",
				day: "numeric",
			}) +
			" " +
			date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});

	const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
		message.author?.username || "U",
	)}&background=F2EDFA&color=4F378A`;

	return (
		<XStack
			flexDirection={isSelf ? "row-reverse" : "row"}
			marginTop={isFirstInGroup ? "$2" : "$1"}
			width="100%"
		>
			<YStack
				alignItems={isSelf ? "flex-end" : "flex-start"}
				flexShrink={1}
				width={"75%"}
				gap={0}
			>
				{/* Sender Name */}
				{!isSelf && isFirstInGroup && (
					<Text
						fontSize={11}
						fontWeight="700"
						color={Theme.textMuted}
						marginLeft="$10"
						marginBottom="$1"
					>
						{message.author?.username}
					</Text>
				)}
				<XStack
					flexDirection={isSelf ? "row-reverse" : "row"}
					alignItems="center"
					justifyContent="flex-start"
					gap={"$2"}
				>
					{/* Avatar for the other person */}
					{!isSelf && (
						<Avatar
							alignSelf="center"
							circular
							size="$3"
							opacity={isLastInGroup ? 1 : 0}
						>
							<Avatar.Image
								source={{
									uri:
										message.author?.imageUrl ||
										fallbackAvatar,
								}}
							/>
							<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
						</Avatar>
					)}
					<YStack width={"100%"} gap={0}>
						<View
							backgroundColor={isSelf ? Theme.primary : Theme.primaryPastel}
							paddingHorizontal="$3.5"
							paddingVertical="$2"
							borderRadius={8}
							borderBottomRightRadius={
								isSelf && !isLastInGroup ? 2 : 8
							}
							borderBottomLeftRadius={
								!isSelf && !isLastInGroup ? 2 : 8
							}
							borderTopRightRadius={
								isSelf && !isFirstInGroup ? 2 : 8
							}
							borderTopLeftRadius={
								!isSelf && !isFirstInGroup ? 2 : 8
							}
							alignSelf={isSelf ? "flex-end" : "flex-start"}
						>
							<Text
								color={isSelf ? Theme.primaryText : Theme.text}
								fontSize="$4"
								lineHeight={20}
								style={{ wordBreak: "break-word" }}
							>
								{content}
							</Text>
						</View>
					</YStack>
				</XStack>
				{/* Timestamp */}
				{isLastInGroup && (
					<Text
						fontSize={10}
						color={Theme.textMuted}
						marginTop="$1"
						marginLeft={"$10"}
					>
						{timestamp}
					</Text>
				)}
			</YStack>
		</XStack>
	);
};
export default MessageBubble;
