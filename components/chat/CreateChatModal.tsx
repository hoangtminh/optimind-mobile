import { LinearGradient } from "expo-linear-gradient";
import { Check, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Platform, ScrollView } from "react-native";
import { Avatar, Button, Input, Text, View, XStack, YStack } from "tamagui";

interface User {
	id: string;
	name: string;
}

interface CreateChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (data: { name: string; userIds: string[] }) => void;
}

// Mock data for friends - in a real app, this would come from a context or API
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
		// For group chats, a name is required. For 1-on-1, we can auto-generate it.
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
				backgroundColor="rgba(255, 255, 255, 0.4)"
				style={
					Platform.OS === "web"
						? ({ backdropFilter: "blur(20px)" } as any)
						: {}
				}
				padding="$4"
			>
				<View
					backgroundColor="white"
					width="100%"
					maxWidth={450}
					borderRadius={24}
					paddingTop="$6"
					paddingHorizontal="$6"
					paddingBottom="$6"
					shadowColor="$on_surface"
					shadowRadius={24}
					shadowOpacity={0.06}
					shadowOffset={{ width: 0, height: 8 }}
				>
					{/* Editorial Voice: Anchors with Display/Headline */}
					<Text
						fontSize="$6"
						fontWeight="600"
						color="$on_surface"
						marginBottom="$6"
					>
						New Academic Sanctuary
					</Text>

					<YStack gap="$2" marginBottom="$4">
						{/* Annotations / Label */}
						<Text
							fontSize="$3"
							color="$on_surface_variant"
							fontWeight="500"
						>
							Sanctuary Name
						</Text>
						<Input
							backgroundColor="$surface_container_high"
							borderWidth={0}
							borderBottomWidth={2}
							borderBottomColor="transparent"
							focusStyle={{ borderBottomColor: "#0058be" }}
							paddingHorizontal="$4"
							height={52}
							borderRadius={12}
							placeholder="e.g., Advanced Quantum Mechanics"
							placeholderTextColor="$on_surface_variant"
							value={chatName}
							onChangeText={setChatName}
							onSubmitEditing={handleCreate}
						/>
					</YStack>

					<YStack gap="$2" marginBottom="$6">
						<Text
							fontSize="$3"
							color="$on_surface_variant"
							fontWeight="500"
						>
							Add Friends
						</Text>
						<View position="relative">
							<View
								position="absolute"
								left={16}
								top={16}
								zIndex={10}
							>
								<Search size={20} color="#94a3b8" />
							</View>
							<Input
								backgroundColor="$surface_container_high"
								borderWidth={0}
								paddingLeft={48}
								height={52}
								borderRadius={12}
								placeholder="Search by name..."
								value={search}
								onChangeText={setSearch}
							/>
						</View>
						<ScrollView style={{ maxHeight: 150, marginTop: 8 }}>
							<YStack gap="$2">
								{filteredFriends.map((user) => {
									const isSelected = selectedUsers.some(
										(u) => u.id === user.id,
									);
									return (
										<XStack
											key={user.id}
											padding="$2"
											borderRadius="$2"
											alignItems="center"
											gap="$3"
											backgroundColor={
												isSelected
													? "$primary_container"
													: "transparent"
											}
											onPress={() =>
												toggleUserSelection(user)
											}
											pressStyle={{
												backgroundColor:
													"$surface_container",
											}}
										>
											<Avatar circular size="$3">
												<Avatar.Image
													src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0058be&color=fff`}
												/>
												<Avatar.Fallback />
											</Avatar>
											<Text flex={1}>{user.name}</Text>
											{isSelected && (
												<Check size={20} color="blue" />
											)}
										</XStack>
									);
								})}
							</YStack>
						</ScrollView>
					</YStack>

					<XStack justifyContent="flex-end" gap="$3" marginTop="$2">
						{/* Tertiary Button */}
						<Button
							chromeless
							hoverStyle={{
								backgroundColor: "$surface_container_high",
							}}
							pressStyle={{ scale: 0.98 }}
							onPress={onClose}
						>
							Cancel
						</Button>

						{/* Primary Button */}
						<LinearGradient
							colors={["#0058be", "#2170e4"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{ borderRadius: 12 }}
						>
							<Button
								unstyled
								paddingHorizontal="$5"
								height={44}
								justifyContent="center"
								alignItems="center"
								pressStyle={{ scale: 0.98 }}
								disabled={selectedUsers.length === 0}
								onPress={handleCreate}
							>
								<Text color="white" fontWeight="600">
									Create
								</Text>
							</Button>
						</LinearGradient>
					</XStack>
				</View>
			</View>
		</Modal>
	);
}
