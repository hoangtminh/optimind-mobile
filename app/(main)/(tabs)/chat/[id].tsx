import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Info, Paperclip, Send, Smile } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Input, Text, View, XStack, YStack } from "tamagui";

export default function ConversationScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const headerHeight = useHeaderHeight();
	const { user } = useAuth();
	const {
		messages,
		joinChat,
		sendMessage,
		isLoadingHistory,
		loadMoreMessages,
		chats,
	} = useChat();
	const [inputText, setInputText] = useState("");
	const Container = View;

	const chatRoom = chats.find((r) => r.id === id);

	useEffect(() => {
		if (id) {
			joinChat(id);
		}
	}, [id]);

	const handleSendMessage = () => {
		if (!inputText.trim() || !id) return;
		console.log(inputText);
		sendMessage(inputText);
		setInputText("");
	};

	const renderMessage = ({ item, index }: { item: any; index: number }) => {
		const currentUserId = item.author?.id || item.senderId;
		const isSelf = currentUserId === user?.id;

		const prevMsg = messages[index + 1]; // Older message (visually above)
		const nextMsg = messages[index - 1]; // Newer message (visually below)

		const prevUserId = prevMsg?.author?.id || prevMsg?.senderId;
		const nextUserId = nextMsg?.author?.id || nextMsg?.senderId;

		const currentMsgTime = new Date(item.createdAt || Date.now()).getTime();
		const prevMsgTime = prevMsg
			? new Date(prevMsg.createdAt || Date.now()).getTime()
			: 0;
		const nextMsgTime = nextMsg
			? new Date(nextMsg.createdAt || Date.now()).getTime()
			: 0;

		const TIME_THRESHOLD = 5 * 60 * 1000; // 5 minutes

		// Is this the first message in a contiguous group from the same user?
		const isFirstInGroup =
			!prevMsg ||
			prevUserId !== currentUserId ||
			currentMsgTime - prevMsgTime > TIME_THRESHOLD;

		// Is this the last message in a contiguous group from the same user?
		const isLastInGroup =
			!nextMsg ||
			nextUserId !== currentUserId ||
			nextMsgTime - currentMsgTime > TIME_THRESHOLD;

		if (isSelf) {
			return (
				<XStack
					alignItems="center"
					gap="$2"
					maxWidth="100%"
					group
					justifyContent="flex-end"
					marginTop={isFirstInGroup ? "$4" : "$1"}
				>
					<YStack
						alignItems="flex-end"
						gap="$1"
						maxWidth="85%"
						minWidth={0}
					>
						{isFirstInGroup && (
							<Text
								fontSize="$2"
								fontWeight="600"
								color="$on_surface_variant"
								marginRight="$8"
							>
								{item.author?.username || "You"}
							</Text>
						)}
						<XStack
							gap="$2"
							justifyContent="flex-end"
							alignContent="flex-end"
						>
							<LinearGradient
								colors={["#0058be", "#2170e4"]} // $primary to $primary_container
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={{
									borderRadius: 20,
									borderBottomRightRadius: isLastInGroup
										? 20
										: 4,
									borderTopRightRadius: isFirstInGroup
										? 20
										: 4,
									flexShrink: 1,
								}}
							>
								<View
									paddingHorizontal="$3"
									paddingVertical="$2"
									maxWidth="100%"
								>
									<Text
										color="white"
										fontSize="$3"
										lineHeight="$3.5"
										flexWrap="wrap"
										style={{ wordBreak: "break-word" }}
									>
										{item.text}
									</Text>
								</View>
							</LinearGradient>
							<Avatar
								circular
								size="$3"
								opacity={isLastInGroup ? 1 : 0}
							>
								<Avatar.Image
									source={{
										uri:
											item.author?.imageUrl ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(item.author?.username || item.sender?.username || "U")}&background=e1e2e4&color=191c1e`,
									}}
								/>
								<Avatar.Fallback backgroundColor="green" />
							</Avatar>
						</XStack>
						{isLastInGroup && (
							<XStack>
								<Text
									fontSize="$1"
									color="$outline"
									marginRight={"$8"}
								>
									{new Date(
										item.createdAt || Date.now(),
									).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Text>
							</XStack>
						)}
					</YStack>
				</XStack>
			);
		}
		return (
			<XStack
				alignItems="flex-end"
				gap="$2"
				maxWidth="85%"
				group
				marginTop={isFirstInGroup ? "$4" : "$1"}
			>
				<YStack gap="$1" flex={1}>
					{isFirstInGroup && (
						<Text
							fontSize="$2"
							fontWeight="600"
							color="black"
							marginLeft="$8"
						>
							{item.author?.username ||
								item.sender?.username ||
								"User"}
						</Text>
					)}
					<XStack gap={"$2"}>
						<Avatar
							circular
							size="$3"
							opacity={isLastInGroup ? 1 : 0}
						>
							<Avatar.Image
								source={{
									uri:
										item.author?.imageUrl ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(item.author?.username || item.sender?.username || "U")}&background=e1e2e4&color=191c1e`,
								}}
							/>
							<Avatar.Fallback
								delayMs={1000}
								backgroundColor="green"
							/>
						</Avatar>
						<LinearGradient
							colors={["lightgray", "lightgray"]} // $primary to $primary_container
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								borderRadius: 20,
								borderBottomLeftRadius: isLastInGroup ? 20 : 4,
								borderTopLeftRadius: isFirstInGroup ? 20 : 4,
							}}
						>
							<View paddingHorizontal="$3" paddingVertical="$2">
								<Text fontSize="$3" lineHeight="$3">
									{item.content || item.text}
								</Text>
							</View>
						</LinearGradient>
					</XStack>
					{isLastInGroup && (
						<Text fontSize="$1" color="$outline" marginLeft="$8">
							{new Date(
								item.createdAt || Date.now(),
							).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					)}
				</YStack>
			</XStack>
		);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["bottom"]}
		>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: false,
					headerStyle: { backgroundColor: "white" },
					headerShadowVisible: false,
					headerTitle: () => (
						<View alignItems="center">
							<Text
								fontSize="$4"
								fontWeight="600"
								color="$on_surface"
							>
								{chatRoom?.name || "Chat"}
							</Text>
						</View>
					),
					headerRight: () => (
						<Button
							icon={<Info size={24} color="#0058be" />}
							circular
							chromeless
							onPress={() =>
								router.push(
									`/(main)/(tabs)/chat/info/${chatRoom?.id}`,
								)
							}
						/>
					),
					headerLeft: () => (
						<Button
							icon={<ArrowLeft size={24} color="#0058be" />}
							circular
							chromeless
							onPress={() =>
								router.replace("/(main)/(tabs)/chat")
							}
						/>
					),
				}}
			/>
			<Container
				style={{ flex: 1 }}
				// {...(Platform.OS !== "web" && {
				// 	bottomOffset: 0,
				// 	contentContainerStyle: { flexGrow: 1 },
				// })}
			>
				<FlatList
					data={messages}
					renderItem={renderMessage}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						padding: 16,
						paddingTop: 20,
						paddingBottom: 10,
					}} // paddingTop for header
					inverted
					onEndReached={loadMoreMessages}
					onEndReachedThreshold={0.5}
					ListFooterComponent={
						isLoadingHistory ? (
							<View marginVertical="$4">
								<ActivityIndicator color="#0058be" />
							</View>
						) : null
					}
				/>
			</Container>
			<KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
				{/* Input Area */}
				<View
					paddingHorizontal="$2"
					paddingVertical="$3"
					backgroundColor="rgba(255, 255, 255, 1)"
					borderTopColor="$surface_container_high"
				>
					<XStack alignItems="center" gap="$3">
						<Button
							icon={<Paperclip color="#727785" />} // $outline
							circular
							chromeless
							pressStyle={{ scale: 0.9 }}
						/>
						<YStack
							flex={1}
							position="relative"
							justifyContent="center"
						>
							<Input
								value={inputText}
								onChangeText={setInputText}
								placeholder="Type your message..."
								backgroundColor="$surface_container_high"
								borderWidth={0}
								borderRadius="$full"
								paddingVertical="$2"
								paddingHorizontal="$4"
								paddingRight="$10"
								fontSize="$3"
								height="fit-content"
								max-height="30%"
								placeholderTextColor="$outline"
								onSubmitEditing={handleSendMessage}
							/>
							<Button
								position="absolute"
								right="$1"
								icon={<Smile color="#727785" />} // $outline
								circular
								chromeless
								pressStyle={{ scale: 0.9 }}
							/>
						</YStack>
						<View>
							<LinearGradient
								colors={["#0058be", "#2170e4"]} // $primary to $primary_container
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={{
									borderRadius: 999,
									width: 36,
									height: 36,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Button
									unstyled
									onPress={handleSendMessage}
									width="100%"
									height="100%"
									justifyContent="center"
									alignItems="center"
								>
									<Send color="white" size={18} />
								</Button>
							</LinearGradient>
						</View>
					</XStack>
				</View>
			</KeyboardStickyView>
		</SafeAreaView>
	);
}
