import { useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, Search } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	Avatar,
	Button,
	Circle,
	Input,
	Text,
	View,
	XStack,
	YStack,
	styled,
} from "tamagui";

// --- Styled Components: Academic Sanctuary Design System ---

const GlassHeader = styled(XStack, {
	height: 64,
	alignItems: "center",
	paddingHorizontal: "$4",
	backgroundColor: "rgba(248, 249, 251, 0.8)", // Glassmorphism base
	zIndex: 100,
});

const SanctuaryCard = styled(TouchableOpacity, {
	padding: "$4",
	borderRadius: 16, // rounded_lg
	alignItems: "center",
	gap: "$4",
	backgroundColor: "$surface_container_lowest", // Action layer
	flexDirection: "row",
	pressStyle: { scale: 0.98, backgroundColor: "$surface_container_low" },
	transition: "quick",
	// Ambient Shadow: diffused, tinted
	shadowColor: "$on_surface",
	shadowRadius: 24,
	shadowOpacity: 0.04,
	shadowOffset: { width: 0, height: 4 },
});

// --- Extended Mock Data ---
const MOCK_ALL_FRIENDS = [
	{
		id: "u2",
		name: "Emily Carter",
		isOnline: true,
		role: "Ph.D. Architecture",
	},
	{
		id: "u3",
		name: "David Chen",
		isOnline: false,
		role: "M.Sc. Data Ethics",
	},
	{
		id: "u4",
		name: "Sophia Rodriguez",
		isOnline: true,
		role: "Digital Humanities",
	},
	{
		id: "u5",
		name: "Michael Johnson",
		isOnline: false,
		role: "B.A. Urban Planning",
	},
	{
		id: "u6",
		name: "Olivia Williams",
		isOnline: true,
		role: "Computer Science",
	},
	{ id: "u7", name: "Daniel Brown", isOnline: false, role: "Physics" },
	{ id: "u8", name: "Ava Garcia", isOnline: true, role: "Mathematics" },
	{ id: "u9", name: "James Miller", isOnline: false, role: "Biology" },
	{ id: "u10", name: "Isabella Davis", isOnline: true, role: "Chemistry" },
	{ id: "u11", name: "Liam Wilson", isOnline: false, role: "Literature" },
	{ id: "u12", name: "Noah Martinez", isOnline: true, role: "Economics" },
	{ id: "u13", name: "Emma Taylor", isOnline: false, role: "Psychology" },
];

export default function AllFriendsScreen() {
	const router = useRouter();
	const [search, setSearch] = useState("");

	const filteredFriends = MOCK_ALL_FRIENDS.filter((f) =>
		f.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<YStack flex={1} backgroundColor="$background">
				{/* Editorial Header */}
				<GlassHeader
					style={
						Platform.OS === "web"
							? ({ backdropFilter: "blur(20px)" } as any)
							: {}
					}
				>
					<Button
						circular
						chromeless
						icon={<ArrowLeft size={24} color="#0058be" />}
						onPress={() => router.back()}
						marginLeft="$-2"
					/>
					<Text
						fontSize="$6"
						fontWeight="700"
						color="$on_surface"
						marginLeft="$2"
					>
						Academic Network
					</Text>
				</GlassHeader>

				{/* Search Field - "No Box" Approach */}
				<YStack
					paddingHorizontal="$4"
					paddingTop="$4"
					paddingBottom="$4"
					position="relative"
				>
					<View position="absolute" left={32} top={30} zIndex={10}>
						<Search size={20} color="#94a3b8" />
					</View>
					<Input
						backgroundColor="$surface_container_high"
						borderWidth={0}
						paddingLeft={48}
						height={52}
						borderRadius={12} // rounded_md
						placeholder="Search scholars and peers..."
						placeholderTextColor="$on_surface_variant"
						value={search}
						onChangeText={setSearch}
						// Bottom-only active indicator
						borderBottomWidth={2}
						borderBottomColor="transparent"
						focusStyle={{ borderBottomColor: "#0058be" }}
					/>
				</YStack>

				{/* Breathable List (No dividers, generous spacing) */}
				<FlatList
					data={filteredFriends}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
					ItemSeparatorComponent={() => <View height={16} />}
					renderItem={({ item }) => (
						<SanctuaryCard
							onPress={() =>
								console.log("Open profile:", item.id)
							}
						>
							<View>
								<Avatar circular size="$5">
									<Avatar.Image
										src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0058be&color=fff`}
									/>
									<Avatar.Fallback backgroundColor="$surface_variant" />
								</Avatar>
								{item.isOnline && (
									<Circle
										size={14}
										backgroundColor="$secondary"
										position="absolute"
										bottom={-2}
										right={-2}
										borderWidth={2}
										borderColor="$surface_container_lowest"
									/>
								)}
							</View>
							<YStack flex={1} gap="$1">
								<Text
									fontWeight="800"
									fontSize="$4"
									color="$on_surface"
									letterSpacing={-0.5}
								>
									{item.name}
								</Text>
								<Text
									fontSize={13}
									color="$on_surface_variant"
									fontWeight="500"
								>
									{item.role}
								</Text>
							</YStack>
							<Button
								icon={
									<MessageSquare size={20} color="#0058be" />
								}
								circular
								backgroundColor="$primary_fixed"
								pressStyle={{
									backgroundColor: "$primary_container",
								}}
							/>
						</SanctuaryCard>
					)}
					ListEmptyComponent={
						<View
							flex={1}
							justifyContent="center"
							alignItems="center"
							marginTop="$10"
						>
							<Text color="$on_surface_variant" fontWeight="500">
								No peers found matching your criteria.
							</Text>
						</View>
					}
				/>
			</YStack>
		</SafeAreaView>
	);
}
