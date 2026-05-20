import { Avatar, Text, View, XStack, YStack } from "tamagui";

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
	)}&background=e9ddff&color=6750A4`;

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
						fontSize={12}
						fontWeight="700"
						color="#494551"
						marginLeft="$10"
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
							<Avatar.Fallback backgroundColor="#f2ecf4" />
						</Avatar>
					)}
					<YStack width={"100%"} gap={0}>
						<View
							backgroundColor={isSelf ? "#6750A4" : "#f2ecf4"}
							paddingHorizontal="$4"
							paddingVertical="$2.5"
							borderRadius={20}
							borderBottomRightRadius={
								isSelf && !isLastInGroup ? 4 : 20
							}
							borderBottomLeftRadius={
								!isSelf && !isLastInGroup ? 4 : 20
							}
							borderTopRightRadius={
								isSelf && !isFirstInGroup ? 4 : 20
							}
							borderTopLeftRadius={
								!isSelf && !isFirstInGroup ? 4 : 20
							}
							alignSelf={isSelf ? "flex-end" : "flex-start"}
						>
							<Text
								color={isSelf ? "white" : "#1d1b20"}
								fontSize="$4"
								lineHeight={22}
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
						color="#7a7582"
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
