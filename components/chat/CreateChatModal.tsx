import { Check, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Platform, ScrollView } from "react-native";
import { Avatar, Button, Input, Text, View, XStack, YStack } from "tamagui";
import { Theme } from "@/constants/Theme";

interface User {
	id: string;
	name: string;
}

interface CreateChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (data: { name: string; userIds: string[] }) => void;
}

const MOCK_FRIENDS: User[] = [
	{ id: "u2", name: "hoangtuanminh25@gmail.com" },
	{ id: "u3", name: "friendcraftdemo@gmail.com" },
	{ id: "u4", name: "Sophia Rodriguez" },
	{ id: "u5", name: "Michael Johnson" },
	{ id: "u6", name: "Olivia Williams" },
];

export function CreateChatModal({
	isOpen,
	onClose,
	onCreate,
}: CreateChatModalProps) {
	const [chatName, setChatName] = useState("");
	const [search, setSearch] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

	const handleCreate = () => {
		const finalChatName =
			chatName.trim() ||
			(selectedUsers.length > 0
				? selectedUsers.map((u) => u.name).join(", ")
				: "New Chat");

		if (selectedUsers.length > 0) {
			onCreate({
				name: finalChatName,
				userIds: selectedUsers.map((u) => u.name),
			});
			setChatName("");
			setSelectedUsers([]);
			setSearch("");
			onClose();
		}
	};

	const toggleUserSelection = (user: User) => {
		setSelectedUsers((prev) => {
			const isSelected = prev.some((u) => u.id === user.id);
			if (isSelected) {
				return prev.filter((u) => u.id !== user.id);
			}
			return [...prev, user];
		});
	};

	const filteredFriends = MOCK_FRIENDS.filter((f) =>
		f.name.toLowerCase().includes(search.toLowerCase()),
	);

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
				backgroundColor="rgba(29, 27, 32, 0.4)"
				style={
					Platform.OS === "web"
						? ({ backdropFilter: "blur(4px)" } as any)
						: {}
				}
				padding="$4"
			>
				<View
					backgroundColor={Theme.surface}
					width="100%"
					maxWidth={420}
					borderRadius={8} // Crisp corners
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
						New Academic Sanctuary
					</Text>

					<YStack gap="$1.5" marginBottom="$3">
						<Text
							fontSize="$3"
							color={Theme.text}
							fontWeight="600"
						>
							Sanctuary Name
						</Text>
						<Input
							backgroundColor={Theme.surface}
							borderWidth={1}
							borderColor={Theme.border}
							focusStyle={{ borderColor: Theme.primary }}
							paddingHorizontal="$3.5"
							height={44}
							borderRadius={6}
							placeholder="e.g., Advanced Quantum Mechanics"
							placeholderTextColor={Theme.textMuted as any}
							value={chatName}
							onChangeText={setChatName}
							onSubmitEditing={handleCreate}
							selectionColor={Theme.primary as any}
						/>
					</YStack>

					<YStack gap="$1.5" marginBottom="$4">
						<Text
							fontSize="$3"
							color={Theme.text}
							fontWeight="600"
						>
							Add Friends
						</Text>
						<View position="relative">
							<View
								position="absolute"
								left={12}
								top={14}
								zIndex={10}
							>
								<Search size={16} color={Theme.primary} />
							</View>
							<Input
								backgroundColor={Theme.surface}
								borderWidth={1}
								borderColor={Theme.border}
								focusStyle={{ borderColor: Theme.primary }}
								paddingLeft={38}
								height={44}
								borderRadius={6}
								placeholder="Search by name..."
								placeholderTextColor={Theme.textMuted as any}
								value={search}
								onChangeText={setSearch}
								selectionColor={Theme.primary as any}
							/>
						</View>
						<ScrollView style={{ maxHeight: 150, marginTop: 8 }}>
							<YStack gap="$1.5">
								{filteredFriends.map((user) => {
									const isSelected = selectedUsers.some(
										(u) => u.id === user.id,
									);
									return (
										<XStack
											key={user.id}
											padding="$2"
											borderRadius={4}
											alignItems="center"
											gap="$3"
											backgroundColor={
												isSelected
													? Theme.primaryPastel
													: "transparent"
											}
											onPress={() =>
												toggleUserSelection(user)
											}
											pressStyle={{
												backgroundColor: Theme.background,
											}}
										>
											<Avatar circular size="$3.5">
												<Avatar.Image
													src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F2EDFA&color=4F378A&bold=true`}
												/>
												<Avatar.Fallback backgroundColor={Theme.primaryPastel} />
											</Avatar>
											<Text flex={1} color={Theme.text} fontSize="$3">
												{user.name}
											</Text>
											{isSelected && (
												<Check size={16} color={Theme.primary} />
											)}
										</XStack>
									);
								})}
							</YStack>
						</ScrollView>
					</YStack>

					<XStack justifyContent="flex-end" gap="$3" marginTop="$2">
						<Button
							height={36}
							borderRadius={6}
							backgroundColor={Theme.background}
							borderWidth={1}
							borderColor={Theme.border}
							pressStyle={{ backgroundColor: Theme.border, scale: 0.98 }}
							onPress={onClose}
						>
							<Text color={Theme.textMuted} fontWeight="600">
								Cancel
							</Text>
						</Button>

						<Button
							height={36}
							borderRadius={6}
							backgroundColor={Theme.primary}
							pressStyle={{ scale: 0.98 }}
							disabled={selectedUsers.length === 0}
							opacity={selectedUsers.length === 0 ? 0.55 : 1}
							onPress={handleCreate}
						>
							<Text color={Theme.primaryText} fontWeight="700">
								Create
							</Text>
						</Button>
					</XStack>
				</View>
			</View>
		</Modal>
	);
}
export default CreateChatModal;
