import React from "react";
import { Avatar, Button, Text, XStack, YStack } from "tamagui";
import { Check, MessageSquare, X } from "lucide-react-native";
import { Theme } from "@/constants/Theme";
import { SearchFriendResult, FriendRequestResponse } from "@/api/friend-actions";

interface SearchResultCardProps {
	searchResult: SearchFriendResult;
	sentRequests: FriendRequestResponse[];
	incomingRequests: FriendRequestResponse[];
	onAddFriend: (email: string) => void;
	onWithdrawRequest: (requestId: string) => void;
	onAcceptRequest: (requestId: string) => void;
	onDeclineRequest: (requestId: string) => void;
	onStartChat: (email: string, username: string) => void;
}

export const SearchResultCard = React.memo(({
	searchResult,
	sentRequests,
	incomingRequests,
	onAddFriend,
	onWithdrawRequest,
	onAcceptRequest,
	onDeclineRequest,
	onStartChat,
}: SearchResultCardProps) => {
	const handleAddFriend = React.useCallback(() => {
		onAddFriend(searchResult.email);
	}, [onAddFriend, searchResult.email]);

	const handleWithdraw = React.useCallback(() => {
		const req = sentRequests.find((r) => r.user.email === searchResult.email);
		if (req) {
			onWithdrawRequest(req.id);
		}
	}, [onWithdrawRequest, sentRequests, searchResult.email]);

	const handleAccept = React.useCallback(() => {
		const req = incomingRequests.find((r) => r.user.email === searchResult.email);
		if (req) {
			onAcceptRequest(req.id);
		}
	}, [onAcceptRequest, incomingRequests, searchResult.email]);

	const handleDecline = React.useCallback(() => {
		const req = incomingRequests.find((r) => r.user.email === searchResult.email);
		if (req) {
			onDeclineRequest(req.id);
		}
	}, [onDeclineRequest, incomingRequests, searchResult.email]);

	const handleChat = React.useCallback(() => {
		onStartChat(searchResult.email, searchResult.username);
	}, [onStartChat, searchResult.email, searchResult.username]);

	return (
		<YStack gap="$2" marginTop="$2">
			<Text fontWeight="800" fontSize="$4" color={Theme.text}>
				Search Result
			</Text>
			<XStack
				padding="$3"
				borderRadius={8}
				alignItems="center"
				gap="$3"
				backgroundColor={Theme.surface}
				borderWidth={1}
				borderColor={Theme.border}
			>
				<Avatar circular size="$5">
					<Avatar.Image
						src={searchResult.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
							searchResult.username,
						)}&background=F2EDFA&color=4F378A&bold=true`}
					/>
					<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
				</Avatar>
				<YStack flex={1}>
					<Text fontWeight="700" color={Theme.text} fontSize="$4">
						{searchResult.username}
					</Text>
					<Text fontSize={12} color={Theme.textMuted} fontWeight="600">
						{searchResult.email}
					</Text>
				</YStack>
				
				<XStack gap="$2">
					{searchResult.relationStatus === "NONE" && (
						<Button
							size="$3"
							backgroundColor={Theme.primary}
							borderRadius={6}
							onPress={handleAddFriend}
							pressStyle={{ opacity: 0.8 }}
						>
							<Button.Text color={Theme.primaryText} fontWeight="700">Add Friend</Button.Text>
						</Button>
					)}
					{searchResult.relationStatus === "REQUEST_SENT" && (
						<Button
							size="$3"
							backgroundColor={Theme.accentRed}
							borderRadius={6}
							onPress={handleWithdraw}
							pressStyle={{ opacity: 0.8 }}
						>
							<Button.Text color={Theme.accentRedText} fontWeight="700">Withdraw</Button.Text>
						</Button>
					)}
					{searchResult.relationStatus === "REQUEST_RECEIVED" && (
						<>
							<Button
								size="$3"
								circular
								backgroundColor={Theme.primary}
								icon={<Check size={18} color="white" />}
								onPress={handleAccept}
								pressStyle={{ opacity: 0.8 }}
							/>
							<Button
								size="$3"
								circular
								backgroundColor={Theme.border}
								icon={<X size={18} color={Theme.text} />}
								onPress={handleDecline}
								pressStyle={{ backgroundColor: Theme.border }}
							/>
						</>
					)}
					{searchResult.relationStatus === "FRIEND" && (
						<Button
							size="$3"
							backgroundColor={Theme.primary}
							borderRadius={6}
							icon={<MessageSquare size={16} color="white" />}
							onPress={handleChat}
							pressStyle={{ opacity: 0.8 }}
						>
							<Button.Text color={Theme.primaryText} fontWeight="700">Chat</Button.Text>
						</Button>
					)}
					{searchResult.relationStatus === "SELF" && (
						<Text color={Theme.textMuted} fontWeight="700" fontSize="$3" marginRight="$2">You</Text>
					)}
				</XStack>
			</XStack>
		</YStack>
	);
});

export default SearchResultCard;
