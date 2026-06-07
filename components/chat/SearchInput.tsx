import { Search } from "lucide-react-native";
import { Input, View, YStack, styled } from "tamagui";
import { Theme } from "@/constants/Theme";

const StyledInput = styled(Input, {
	backgroundColor: Theme.surface,
	borderWidth: 1,
	borderColor: Theme.border,
	height: 44,
	borderRadius: 6, // Crisp corners
	paddingLeft: 44,
	fontSize: "$3",
	color: Theme.text,
	focusStyle: {
		backgroundColor: Theme.surface,
		borderWidth: 1.5,
		borderColor: Theme.primary,
	},
});

interface SearchInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
}

export const SearchInput = ({
	value,
	onChangeText,
	placeholder = "Search...",
}: SearchInputProps) => {
	return (
		<YStack
			paddingHorizontal="$4"
			paddingTop="$4"
			paddingBottom="$2"
			position="relative"
		>
			<View position="absolute" left={28} top={28} zIndex={10}>
				<Search size={16} color={Theme.primary} />
			</View>
			<StyledInput
				placeholder={placeholder}
				placeholderTextColor={Theme.textMuted as any}
				value={value}
				onChangeText={onChangeText}
				selectionColor={Theme.primary}
			/>
		</YStack>
	);
};
export default SearchInput;
