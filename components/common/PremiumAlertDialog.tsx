import { AlertCircle, CheckCircle2, Info } from "lucide-react-native";
import {
	AlertDialog,
	Button,
	Text,
	View,
	XStack,
	YStack,
	styled,
} from "tamagui";
import { Theme } from "@/constants/Theme";

type DialogType = "success" | "error" | "info" | "confirm";

interface PremiumAlertDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm?: () => void;
	title: string;
	description: string;
	type?: DialogType;
	cancelText?: string;
	confirmText?: string;
}

const StyledOverlay = styled(AlertDialog.Overlay, {
	opacity: 0.5,
	enterStyle: { opacity: 0 },
	exitStyle: { opacity: 0 },
});

const StyledContent = styled(AlertDialog.Content, {
	key: "content",
	bordered: true,
	enterStyle: { x: 0, y: -20, opacity: 0, scale: 0.9 },
	exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 },
	scale: 1,
	opacity: 1,
	y: 0,
	borderRadius: 12, // Crisp corners for minimalist aesthetic
	padding: "$6",
	width: "90%",
	maxWidth: 400,
	alignSelf: "center",
});

export const PremiumAlertDialog = ({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	type = "info",
	cancelText = "Cancel",
	confirmText = "OK",
}: PremiumAlertDialogProps) => {
	const getIcon = () => {
		switch (type) {
			case "success":
				return <CheckCircle2 size={32} color={Theme.accentGreenText} />;
			case "error":
				return <AlertCircle size={32} color={Theme.accentRedText} />;
			case "confirm":
				return <AlertCircle size={32} color={Theme.primary} />;
			default:
				return <Info size={32} color={Theme.primary} />;
		}
	};

	const getIconBg = () => {
		switch (type) {
			case "success":
				return Theme.accentGreen;
			case "error":
				return Theme.accentRed;
			default:
				return Theme.primaryPastel;
		}
	};

	const getConfirmBtnBg = () => {
		switch (type) {
			case "error":
				return Theme.accentRedText;
			case "success":
				return Theme.accentGreenText;
			default:
				return Theme.primary;
		}
	};

	const getConfirmBtnTextColor = () => {
		switch (type) {
			case "error":
			case "success":
				return "#ffffff"; // Keep text white on primary green/red
			default:
				return Theme.primaryText; // Black on primary in dark mode, white in light mode
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialog.Portal>
				<StyledOverlay backgroundColor={Theme.isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(29, 27, 32, 0.4)"} />
				<StyledContent backgroundColor={Theme.surface} borderColor={Theme.border}>
					<YStack gap="$4" alignItems="center">
						<View
							backgroundColor={getIconBg()}
							padding="$4"
							borderRadius={12} // Crisp corners
							marginBottom="$2"
						>
							{getIcon()}
						</View>

						<YStack gap="$2" alignItems="center">
							<AlertDialog.Title
								fontSize="$6"
								fontWeight="800"
								color={Theme.text}
								textAlign="center"
							>
								{title}
							</AlertDialog.Title>
							<AlertDialog.Description
								color={Theme.textMuted}
								textAlign="center"
								fontSize="$4"
								lineHeight={22}
							>
								{description}
							</AlertDialog.Description>
						</YStack>

						<XStack gap="$3" width="100%" marginTop="$4">
							{type === "confirm" && (
								<AlertDialog.Cancel asChild>
									<Button
										flex={1}
										height={48}
										borderRadius={8}
										backgroundColor={Theme.primaryPastel}
										chromeless
										pressStyle={{
											backgroundColor: Theme.border,
										}}
									>
										<Text
											fontWeight="700"
											color={Theme.primary}
											fontSize="$4"
										>
											{cancelText}
										</Text>
									</Button>
								</AlertDialog.Cancel>
							)}
							<AlertDialog.Action asChild>
								<Button
									flex={1}
									height={48}
									borderRadius={8}
									backgroundColor={getConfirmBtnBg()}
									onPress={onConfirm}
									pressStyle={{ opacity: 0.8 }}
								>
									<Text
										fontWeight="700"
										color={getConfirmBtnTextColor()}
										fontSize="$4"
									>
										{confirmText}
									</Text>
								</Button>
							</AlertDialog.Action>
						</XStack>
					</YStack>
				</StyledContent>
			</AlertDialog.Portal>
		</AlertDialog>
	);
};
