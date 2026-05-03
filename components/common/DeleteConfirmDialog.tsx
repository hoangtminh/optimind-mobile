import { Trash2 } from "lucide-react-native";
import {
	AlertDialog,
	Button,
	Text,
	View,
	XStack,
	YStack,
	styled,
} from "tamagui";

interface DeleteConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
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
	elevate: true,
	enterStyle: { x: 0, y: -20, opacity: 0, scale: 0.9 },
	exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 },
	x: 0,
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

export const DeleteConfirmDialog = ({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
}: DeleteConfirmDialogProps) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialog.Portal>
				<StyledOverlay />
				<StyledContent>
					<YStack gap="$4" alignItems="center">
						<View
							backgroundColor="#ffdad6"
							padding="$4"
							borderRadius={24}
							marginBottom="$2"
						>
							<Trash2 size={32} color="#93000a" />
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
							<AlertDialog.Cancel asChild>
								<Button
									flex={1}
									height={56}
									borderRadius={16}
									backgroundColor="#f2ecf4"
									chromeless
									pressStyle={{ backgroundColor: "#e9ddff" }}
								>
									<Text
										fontWeight="700"
										color="#6750A4"
										fontSize="$4"
									>
										Cancel
									</Text>
								</Button>
							</AlertDialog.Cancel>
							<AlertDialog.Action asChild>
								<Button
									flex={1}
									height={56}
									borderRadius={16}
									backgroundColor="#93000a"
									onPress={onConfirm}
									pressStyle={{ opacity: 0.8 }}
								>
									<Text
										fontWeight="700"
										color="white"
										fontSize="$4"
									>
										Delete
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
