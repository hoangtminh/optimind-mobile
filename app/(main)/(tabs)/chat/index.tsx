import GlobalHeader from "@/components/app/GlobalHeader";
import { useTimeFormatter } from "@/hooks/useUtils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Bot, Plus, Send, User } from "lucide-react-native";
import React, { useState } from "react";
import {
	FlatList,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatMessage {
	id: string;
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

const mockMessages: ChatMessage[] = [
	{
		id: "1",
		text: "Hello! I'm your productivity assistant. How can I help you today?",
		sender: "assistant",
		timestamp: new Date(Date.now() - 3600000), // 1 hour ago
	},
	{
		id: "2",
		text: "I need help organizing my study schedule for this week.",
		sender: "user",
		timestamp: new Date(Date.now() - 3300000), // 55 minutes ago
	},
	{
		id: "3",
		text: "Great! I can help you create an effective study schedule. Based on your goals, I recommend the Pomodoro technique. Would you like me to suggest a schedule?",
		sender: "assistant",
		timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
	},
	{
		id: "4",
		text: "Yes, that sounds good. I have exams coming up.",
		sender: "user",
		timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
	},
	{
		id: "5",
		text: "Perfect! For exam preparation, I suggest: 25-minute focused study sessions followed by 5-minute breaks. Here's a sample schedule for today...",
		sender: "assistant",
		timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
	},
];

export default function Chat() {
	const navigation = useNavigation();
	const { formatTime } = useTimeFormatter();
	const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
	const [inputText, setInputText] = useState("");

	const handleSendMessage = () => {
		if (!inputText.trim()) return;

		const newMessage: ChatMessage = {
			id: Date.now().toString(),
			text: inputText,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputText("");

		// Simulate assistant response
		setTimeout(() => {
			const assistantResponse: ChatMessage = {
				id: (Date.now() + 1).toString(),
				text: "Thanks for your message! I'm here to help you stay productive. What would you like to work on next?",
				sender: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, assistantResponse]);
		}, 1000);
	};

	const renderMessage = ({ item }: { item: ChatMessage }) => (
		<View
			className={`flex-row mb-4 ${item.sender === "user" ? "justify-end" : "justify-start"}`}
		>
			{item.sender === "assistant" && (
				<View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3 mt-1">
					<Bot size={16} color="white" />
				</View>
			)}

			<View
				className={`max-w-[75%] ${item.sender === "user" ? "items-end" : "items-start"}`}
			>
				<View
					className={`px-4 py-3 rounded-2xl ${
						item.sender === "user"
							? "bg-blue-500 rounded-br-md"
							: "bg-white border border-gray-200 rounded-bl-md"
					}`}
				>
					<Text
						className={`${
							item.sender === "user"
								? "text-white"
								: "text-slate-900"
						}`}
					>
						{item.text}
					</Text>
				</View>
				<Text className="text-xs text-slate-500 mt-1">
					{formatTime(item.timestamp)}
				</Text>
			</View>

			{item.sender === "user" && (
				<View className="w-8 h-8 bg-slate-300 rounded-full items-center justify-center ml-3 mt-1">
					<User size={16} color="#64748b" />
				</View>
			)}
		</View>
	);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#f8f9fb" }}
			edges={["top"]}
		>
			<GlobalHeader
				title="AI Assistant"
				onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
			/>

			{/* Chat Messages */}
			<FlatList
				data={messages}
				renderItem={renderMessage}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
				inverted={false}
			/>

			{/* Quick Actions */}
			<View className="absolute bottom-20 left-4 right-4 flex-row space-x-2">
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<TouchableOpacity className="bg-white px-4 py-2 rounded-full border border-gray-200 mr-2">
						<Text className="text-sm text-slate-700">
							Study Tips
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className="bg-white px-4 py-2 rounded-full border border-gray-200 mr-2">
						<Text className="text-sm text-slate-700">
							Task Help
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className="bg-white px-4 py-2 rounded-full border border-gray-200 mr-2">
						<Text className="text-sm text-slate-700">
							Motivation
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className="bg-white px-4 py-2 rounded-full border border-gray-200 mr-2">
						<Text className="text-sm text-slate-700">Schedule</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>

			{/* Message Input */}
			<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
				<View className="flex-row items-center space-x-3">
					<TouchableOpacity className="p-2">
						<Plus size={20} color="#64748b" />
					</TouchableOpacity>

					<View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
						<TextInput
							value={inputText}
							onChangeText={setInputText}
							placeholder="Ask me anything about productivity..."
							className="flex-1 text-slate-900"
							multiline={false}
							onSubmitEditing={handleSendMessage}
						/>
					</View>

					<TouchableOpacity
						onPress={handleSendMessage}
						className={`p-2 rounded-full ${
							inputText.trim() ? "bg-blue-500" : "bg-gray-300"
						}`}
						disabled={!inputText.trim()}
					>
						<Send
							size={20}
							color={inputText.trim() ? "white" : "#9ca3af"}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
