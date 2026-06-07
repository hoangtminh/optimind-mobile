import { MessageSquare } from "lucide-react-native";
import React from "react";
import { Avatar, Button, Circle, Text, XStack, YStack, styled } from "tamagui";
import { Theme } from "@/constants/Theme";

const StyledFriendCard = styled(XStack, {
	padding: "$3",
	borderRadius: 8, // Crisp corners
	alignItems: "center",
	gap: "$4",
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	pressStyle: { scale: 0.98, backgroundColor: Theme.primaryPastel },
});

interface FriendListItemProps {
	friend: {
		id: string;
		name: string;
		isOnline?: boolean;
	};
	onPress?: () => void;
	onMessagePress?: () => void;
}

export const FriendListItem = ({
	friend,
	onPress,
	onMessagePress,
}: FriendListItemProps) => {
	return (
		<StyledFriendCard onPress={onPress}>
			<Avatar circular size="$5">
				<Avatar.Image
					src={`https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=F2EDFA&color=4F378A&bold=true`}
				/>
				<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
				{friend.isOnline && (
					<Circle
						size={12}
						backgroundColor={Theme.accentGreenText}
						position="absolute"
						bottom={0}
						right={0}
						borderWidth={1.5}
						borderColor={Theme.surface}
					/>
				)}
			</Avatar>

			<YStack flex={1}>
				<Text fontWeight="700" fontSize="$4" color={Theme.text}>
					{friend.name}
				</Text>
				<Text
					fontSize={12}
					fontWeight="600"
					color={friend.isOnline ? Theme.accentGreenText : Theme.textMuted}
				>
					{friend.isOnline ? "Online" : "Offline"}
				</Text>
			</YStack>

			<Button
				icon={<MessageSquare size={18} color={Theme.primary} />}
				circular
				chromeless
				onPress={(e) => {
					e.stopPropagation();
					onMessagePress?.();
				}}
				pressStyle={{ backgroundColor: Theme.background }}
			/>
		</StyledFriendCard>
	);
};
export default FriendListItem;
