import { MessageSquare } from "lucide-react-native";
import React from "react";
import { Avatar, Button, Circle, Text, XStack, YStack, styled } from "tamagui";

const StyledFriendCard = styled(XStack, {
	padding: "$3",
	borderRadius: 20,
	alignItems: "center",
	gap: "$4",
	backgroundColor: "#ffffff",
	pressStyle: { scale: 0.98, backgroundColor: "#f8f2fa" },
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
					src={`https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=e9ddff&color=6750A4&bold=true`}
				/>
				<Avatar.Fallback backgroundColor="#f2ecf4" />
				{friend.isOnline && (
					<Circle
						size={14}
						backgroundColor="#4caf50"
						position="absolute"
						bottom={0}
						right={0}
						borderWidth={2}
						borderColor="white"
					/>
				)}
			</Avatar>

			<YStack flex={1}>
				<Text fontWeight="700" fontSize="$4" color="#1d1b20">
					{friend.name}
				</Text>
				<Text
					fontSize={12}
					fontWeight="600"
					color={friend.isOnline ? "#4caf50" : "#7a7582"}
				>
					{friend.isOnline ? "Online" : "Offline"}
				</Text>
			</YStack>

			<Button
				icon={<MessageSquare size={20} color="#6750A4" />}
				circular
				chromeless
				onPress={(e) => {
					e.stopPropagation();
					onMessagePress?.();
				}}
				pressStyle={{ backgroundColor: "#f2ecf4" }}
			/>
		</StyledFriendCard>
	);
};
