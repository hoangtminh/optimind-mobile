import React from "react";
import { Modal, ScrollView } from "react-native";
import { Avatar, Button, Text, View, XStack, YStack } from "tamagui";
import { X } from "lucide-react-native";
import { Theme } from "@/constants/Theme";
import { FriendRequestResponse } from "@/api/friend-actions";

interface SentRequestsModalProps {
	isOpen: boolean;
	onClose: () => void;
	sentRequests: FriendRequestResponse[];
	onWithdraw: (requestId: string) => void;
}

export const SentRequestsModal = React.memo(({
	isOpen,
	onClose,
	sentRequests,
	onWithdraw,
}: SentRequestsModalProps) => {
	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor="rgba(0,0,0,0.4)"
				padding="$4"
			>
				<View
					backgroundColor={Theme.surface}
					width="100%"
					maxWidth={500}
					maxHeight="80%"
					borderRadius={8}
					overflow="hidden"
					borderWidth={1}
					borderColor={Theme.border}
				>
					<XStack
						padding="$5"
						justifyContent="space-between"
						alignItems="center"
						borderBottomWidth={1}
						borderBottomColor={Theme.border}
					>
						<YStack>
							<Text fontSize="$6" fontWeight="800" color={Theme.text}>
								Sent Requests
							</Text>
							<Text fontSize="$2" color={Theme.textMuted}>
								Manage your pending invitations
							</Text>
						</YStack>
						<Button
							circular
							chromeless
							icon={<X size={20} color={Theme.text} />}
							onPress={onClose}
							pressStyle={{ backgroundColor: Theme.border }}
						/>
					</XStack>

					<ScrollView contentContainerStyle={{ padding: 20 }}>
						<YStack gap="$3">
							{sentRequests.map((req) => (
								<XStack
									key={req.id}
									padding="$3"
									backgroundColor={Theme.surfaceMuted}
									borderRadius={8}
									borderWidth={1}
									borderColor={Theme.border}
									alignItems="center"
									justifyContent="space-between"
								>
									<XStack alignItems="center" gap="$3" flex={1}>
										<Avatar circular size={48}>
											<Avatar.Image
												src={req.user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
													req.user.username,
												)}&background=F2EDFA&color=4F378A&bold=true`}
											/>
											<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
										</Avatar>
										<YStack flex={1}>
											<Text
												fontWeight="700"
												color={Theme.text}
												numberOfLines={1}
											>
												{req.user.username}
											</Text>
											<Text
												fontSize={12}
												color={Theme.textMuted}
												numberOfLines={1}
											>
												{req.user.email}
											</Text>
										</YStack>
									</XStack>
									<Button
										size="$2"
										backgroundColor={Theme.accentRed}
										borderRadius={6}
										height={36}
										onPress={() => onWithdraw(req.id)}
									>
										<Text
											fontSize={12}
											fontWeight="700"
											color={Theme.accentRedText}
										>
											Withdraw
										</Text>
									</Button>
								</XStack>
							))}
							{sentRequests.length === 0 && (
								<Text textAlign="center" color={Theme.textMuted} fontSize="$3" marginVertical="$4">
									No pending sent requests.
								</Text>
							)}
						</YStack>
					</ScrollView>

					<View
						padding="$4"
						backgroundColor={Theme.surfaceMuted}
						alignItems="center"
						borderTopWidth={1}
						borderTopColor={Theme.border}
					>
						<Text
							fontSize={10}
							fontWeight="700"
							color={Theme.textMuted}
							textTransform="uppercase"
							letterSpacing={0.5}
						>
							Pending requests expire in 30 days
						</Text>
					</View>
				</View>
			</View>
		</Modal>
	);
});

export default SentRequestsModal;
