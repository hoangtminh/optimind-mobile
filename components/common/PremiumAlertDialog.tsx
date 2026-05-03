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
	backgroundColor: "#1d1b20",
});

const StyledContent = styled(AlertDialog.Content, {
	key: "content",
	bordered: true,
	enterStyle: { x: 0, y: -20, opacity: 0, scale: 0.9 },
	exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 },
	scale: 1,
	opacity: 1,
	y: 0,
	backgroundColor: "white",
	borderRadius: 32,
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
				return <CheckCircle2 size={32} color="#006c49" />;
			case "error":
				return <AlertCircle size={32} color="#ba1a1a" />;
			case "confirm":
				return <AlertCircle size={32} color="#6750A4" />;
			default:
				return <Info size={32} color="#6750A4" />;
		}
	};

	const getIconBg = () => {
		switch (type) {
			case "success":
				return "#e6f4ea";
			case "error":
				return "#ffdad6";
			default:
				return "#f2ecf4";
		}
	};

	const getConfirmBtnBg = () => {
		switch (type) {
			case "error":
				return "#ba1a1a";
			case "success":
				return "#006c49";
			default:
				return "#6750A4";
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialog.Portal>
				<StyledOverlay />
				<StyledContent>
					<YStack gap="$4" alignItems="center">
						<View
							backgroundColor={getIconBg()}
							padding="$4"
							borderRadius={24}
							marginBottom="$2"
						>
							{getIcon()}
						</View>

						<YStack gap="$2" alignItems="center">
							<AlertDialog.Title
								fontSize="$7"
								fontWeight="800"
								color="#1d1b20"
								textAlign="center"
							>
								{title}
							</AlertDialog.Title>
							<AlertDialog.Description
								color="#494551"
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
										height={56}
										borderRadius={16}
										backgroundColor="#f2ecf4"
										chromeless
										pressStyle={{
											backgroundColor: "#e9ddff",
										}}
									>
										<Text
											fontWeight="700"
											color="#6750A4"
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
									height={56}
									borderRadius={16}
									backgroundColor={getConfirmBtnBg()}
									onPress={onConfirm}
									pressStyle={{ opacity: 0.8 }}
								>
									<Text
										fontWeight="700"
										color="white"
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
