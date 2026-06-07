import { Theme } from "@/constants/Theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { Button, Text, XStack } from "tamagui";

interface AppHeaderProps {
	title: string;
	showBackButton?: boolean;
	rightElement?: React.ReactNode;
	onBack?: () => void;
}

export const AppHeader = ({
	title,
	showBackButton = false,
	rightElement,
	onBack,
}: AppHeaderProps) => {
	const router = useRouter();

	const handleBack = () => {
		if (onBack) {
			onBack();
			return;
		}
		if (router.canGoBack()) {
			router.back();
		} else {
			// Fallback to tasks list if we can't go back in history
			router.replace("/(main)/(tabs)/tasks");
		}
	};

	return (
		<>
			<StatusBar style="dark" />
			<XStack
				height={56}
				alignItems="center"
				paddingHorizontal="$4"
				backgroundColor={Theme.surface}
				borderBottomWidth={1}
				borderBottomColor={Theme.border}
				justifyContent="space-between"
				elevation={0}
				zIndex={100}
			>
				<XStack alignItems="center" flex={1} gap="$3">
					{showBackButton && (
						<Button
							circular
							size="$3"
							chromeless
							icon={<ArrowLeft size={20} color={Theme.text} />}
							onPress={handleBack}
							pressStyle={{
								backgroundColor: "rgba(0, 0, 0, 0.05)",
							}}
						/>
					)}
					<Text
						fontSize="$5"
						fontWeight="700"
						color={Theme.text}
						numberOfLines={1}
						flex={1}
					>
						{title}
					</Text>
				</XStack>

				{rightElement && (
					<XStack alignItems="center" gap="$2">
						{rightElement}
					</XStack>
				)}
			</XStack>
		</>
	);
};
