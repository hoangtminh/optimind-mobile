import { HelpCircle } from "lucide-react-native";
import React from "react";
import { AlertDialog, Button, Text, View, YStack } from "tamagui";

interface PauseAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onKeepStudying: () => void;
    onTurnOffCameraAndContinue: () => void;
    onPauseSession: () => void;
}

const PauseAlertDialogComponent = ({
    open,
    onOpenChange,
    onKeepStudying,
    onTurnOffCameraAndContinue,
    onPauseSession,
}: PauseAlertDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    key="overlay"
                    opacity={0.5}
                    backgroundColor="#1d1b20"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <AlertDialog.Content
                    bordered
                    elevate
                    key="content"
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    x={0}
                    y={0}
                    scale={1}
                    opacity={1}
                    backgroundColor="white"
                    borderRadius={32}
                    padding="$6"
                    width="90%"
                    maxWidth={400}
                    alignSelf="center"
                    justifyContent="center"
                >
                    <YStack gap="$4" alignItems="center">
                        <View
                            backgroundColor="#f2ecf4"
                            padding="$4"
                            borderRadius={24}
                            marginBottom="$2"
                        >
                            <HelpCircle size={32} color="#6750A4" />
                        </View>

                        <YStack gap="$2" alignItems="center">
                            <AlertDialog.Title
                                fontSize="$6"
                                fontWeight="800"
                                color="#1d1b20"
                                textAlign="center"
                            >
                                Bạn còn ở đó không?
                            </AlertDialog.Title>
                            <AlertDialog.Description
                                color="#494551"
                                textAlign="center"
                                fontSize={14}
                                lineHeight={20}
                            >
                                Không phát hiện thấy khuôn mặt trong 5 giây. Bộ đếm thời gian học đã được tạm dừng.{"\n\n"}
                                💡 <Text fontWeight="bold">Gợi ý:</Text> Bạn có thể tắt camera theo dõi để tiết kiệm pin/tài nguyên mà vẫn tiếp tục đếm giờ học tập.
                            </AlertDialog.Description>
                        </YStack>

                        <YStack gap={10} width="100%" marginTop="$4">
                            <Button
                                height={48}
                                borderRadius={16}
                                backgroundColor="#6750A4"
                                onPress={onKeepStudying}
                                pressStyle={{ opacity: 0.8 }}
                            >
                                <Text fontWeight="700" color="white">
                                    Tôi vẫn đang học (Bật Cam)
                                </Text>
                            </Button>

                            <Button
                                height={48}
                                borderRadius={16}
                                backgroundColor="#f2ecf4"
                                onPress={onTurnOffCameraAndContinue}
                                pressStyle={{ backgroundColor: "#e9ddff" }}
                            >
                                <Text fontWeight="700" color="#6750A4">
                                    Tắt camera & Tiếp tục học
                                </Text>
                            </Button>

                            <Button
                                height={48}
                                borderRadius={16}
                                backgroundColor="transparent"
                                chromeless
                                onPress={onPauseSession}
                                pressStyle={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                            >
                                <Text fontWeight="700" color="#ba1a1a">
                                    Tạm dừng học tập
                                </Text>
                            </Button>
                        </YStack>
                    </YStack>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog>
    );
};

export const PauseAlertDialog = React.memo(PauseAlertDialogComponent);
