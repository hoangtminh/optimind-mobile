import React from "react";
import { Avatar, Button, Text, XStack, YStack } from "tamagui";
import { Check, X } from "lucide-react-native";
import { Theme } from "@/constants/Theme";
import { FriendRequestResponse } from "@/api/friend-actions";

interface IncomingRequestItemProps {
	request: FriendRequestResponse;
	onAccept: (requestId: string) => void;
	onDecline: (requestId: string) => void;
}

export const IncomingRequestItem = React.memo(({
	request,
	onAccept,
	onDecline,
}: IncomingRequestItemProps) => {
	const handleAccept = React.useCallback(() => {
		onAccept(request.id);
	}, [onAccept, request.id]);

	const handleDecline = React.useCallback(() => {
		onDecline(request.id);
	}, [onDecline, request.id]);

	return (
		<XStack
			padding="$3"
			borderRadius={8}
			alignItems="center"
			gap="$3"
			backgroundColor={Theme.surface}
			borderWidth={1}
			borderColor={Theme.border}
		>
			<Avatar circular size={40}>
				<Avatar.Image
					src={request.user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
						request.user.username,
					)}&background=F2EDFA&color=4F378A&bold=true`}
				/>
				<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
			</Avatar>
			<YStack flex={1}>
				<Text
					fontWeight="700"
					color={Theme.text}
					fontSize="$3"
					numberOfLines={1}
				>
					{request.user.username}
				</Text>
				<Text
					fontSize={11}
					color={Theme.textMuted}
					numberOfLines={1}
				>
					{request.user.email}
				</Text>
			</YStack>
			<XStack gap="$2">
				<Button
					size="$2"
					circular
					backgroundColor={Theme.primary}
					icon={<Check size={16} color="white" />}
					onPress={handleAccept}
					pressStyle={{ opacity: 0.8 }}
				/>
				<Button
					size="$2"
					circular
					backgroundColor={Theme.border}
					icon={<X size={16} color={Theme.text} />}
					onPress={handleDecline}
					pressStyle={{ backgroundColor: Theme.border }}
				/>
			</XStack>
		</XStack>
	);
});

export default IncomingRequestItem;
