import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Input, View, XStack } from "tamagui";
import { Search } from "lucide-react-native";
import { Theme } from "@/constants/Theme";

interface FriendSearchBarProps {
	onSearch: (query: string) => void;
	onClear: () => void;
	isSearching: boolean;
}

export const FriendSearchBar = React.memo(({
	onSearch,
	onClear,
	isSearching,
}: FriendSearchBarProps) => {
	const [localSearch, setLocalSearch] = useState("");

	useEffect(() => {
		if (localSearch === "") {
			onClear();
		}
	}, [localSearch, onClear]);

	const handleSubmit = useCallback(() => {
		if (localSearch.trim()) {
			onSearch(localSearch.trim());
		}
	}, [localSearch, onSearch]);

	return (
		<XStack
			paddingHorizontal="$4"
			paddingTop="$4"
			paddingBottom="$2"
			gap="$2"
			alignItems="center"
		>
			<View flex={1} position="relative">
				<View position="absolute" left={12} top={14} zIndex={10}>
					<Search size={16} color={Theme.primary} />
				</View>
				<Input
					placeholder="Search friends by email..."
					backgroundColor={Theme.surface}
					borderWidth={1}
					borderColor={Theme.border}
					height={44}
					borderRadius={8}
					paddingLeft={40}
					fontSize="$3"
					color={Theme.text}
					value={localSearch}
					onChangeText={setLocalSearch}
					onSubmitEditing={handleSubmit}
					returnKeyType="search"
				/>
			</View>
			<Button
				backgroundColor={Theme.primary}
				height={44}
				borderRadius={8}
				onPress={handleSubmit}
				pressStyle={{ opacity: 0.8 }}
			>
				{isSearching ? (
					<ActivityIndicator size="small" color={Theme.primaryText} />
				) : (
					<Button.Text color={Theme.primaryText} fontWeight="700">Search</Button.Text>
				)}
			</Button>
		</XStack>
	);
});

export default FriendSearchBar;
