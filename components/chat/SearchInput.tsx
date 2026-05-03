import { Search } from "lucide-react-native";
import { Input, View, YStack, styled } from "tamagui";

const StyledInput = styled(Input, {
	backgroundColor: "#f2ecf4",
	borderWidth: 0,
	height: 52,
	borderRadius: 16,
	paddingLeft: 48,
	fontSize: "$4",
	color: "#1d1b20",
	focusStyle: {
		backgroundColor: "#ffffff",
		borderWidth: 2,
		borderColor: "#6750A4",
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
			<View position="absolute" left={32} top={30} zIndex={10}>
				<Search size={20} color="#6750A4" />
			</View>
			<StyledInput
				placeholder={placeholder}
				placeholderTextColor="$on_surface_variant"
				value={value}
				onChangeText={onChangeText}
			/>
		</YStack>
	);
};
