import { Brain, Check, Clock, Coffee, Repeat, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
  ScrollView,
  styled,
  Text,
  XStack,
  YStack,
} from "tamagui";

export interface TimerSettings {
  mode: "pomodoro" | "countdown";
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  totalCycles: number;
}

interface TimerSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

const SettingItem = styled(YStack, {
  gap: "$2",
  marginBottom: "$4",
});

const DEFAULT_SETTINGS: TimerSettings = {
  mode: "pomodoro",
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  totalCycles: 4,
};

export const TimerSettingsModal = ({
  open,
  onOpenChange,
  settings,
  onSave,
}: TimerSettingsModalProps) => {
  const [tempSettings, setTempSettings] = useState<TimerSettings>(
    settings ?? DEFAULT_SETTINGS,
  );

  useEffect(() => {
    if (open && settings) {
      setTempSettings(settings);
    }
  }, [open, settings]);

  const handleSave = () => {
    if (tempSettings && onSave) {
      onSave(tempSettings);
      onOpenChange?.(false);
    }
  };

  const updateSetting = (key: keyof TimerSettings, value: any) => {
    setTempSettings((prev) => {
      if (!prev) return DEFAULT_SETTINGS;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0,0,0,0.5)"
        />
        <Dialog.Content
          key="content"
          bordered
          x={0}
          scale={1}
          opacity={1}
          y={0}
          backgroundColor="white"
          borderRadius={32}
          padding="$6"
          width="95%"
          maxWidth={450}
          alignSelf="center"
        >
          <YStack>
            <XStack justifyContent="space-between" alignItems="center">
              <Dialog.Title fontSize="$6" fontWeight="900" color="#1d1b20">
                Timer Settings
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  circular
                  size="$3"
                  chromeless
                  icon={<X size={20} color="#7a7582" />}
                />
              </Dialog.Close>
            </XStack>

            <ScrollView maxHeight={400} showsVerticalScrollIndicator={false}>
              <YStack gap="$5">
                <SettingItem>
                  <Label fontSize="$3" fontWeight="700" color="#494551">
                    Mode
                  </Label>
                  <XStack
                    backgroundColor="#f2ecf4"
                    padding="$1.5"
                    borderRadius={16}
                    gap="$1"
                  >
                    <Button
                      flex={1}
                      size="$3"
                      borderRadius={12}
                      backgroundColor={
                        tempSettings?.mode === "pomodoro"
                          ? "white"
                          : "transparent"
                      }
                      onPress={() => updateSetting("mode", "pomodoro")}
                      chromeless={tempSettings?.mode !== "pomodoro"}
                    >
                      <Text
                        fontWeight="700"
                        color={
                          tempSettings?.mode === "pomodoro"
                            ? "#6750A4"
                            : "#7a7582"
                        }
                      >
                        Pomodoro
                      </Text>
                    </Button>
                    <Button
                      flex={1}
                      size="$3"
                      borderRadius={12}
                      backgroundColor={
                        tempSettings?.mode === "countdown"
                          ? "white"
                          : "transparent"
                      }
                      onPress={() => updateSetting("mode", "countdown")}
                      chromeless={tempSettings?.mode !== "countdown"}
                    >
                      <Text
                        fontWeight="700"
                        color={
                          tempSettings?.mode === "countdown"
                            ? "#6750A4"
                            : "#7a7582"
                        }
                      >
                        Countdown
                      </Text>
                    </Button>
                  </XStack>
                </SettingItem>

                <XStack gap="$4">
                  <SettingItem flex={1}>
                    <XStack gap="$2" alignItems="center" marginBottom="$1">
                      <Brain size={16} color="#6750A4" />
                      <Label fontSize="$3" fontWeight="700" color="#494551">
                        Focus
                      </Label>
                    </XStack>
                    <Input
                      keyboardType="numeric"
                      value={tempSettings?.focusDuration?.toString() ?? "0"}
                      onChangeText={(val) =>
                        updateSetting("focusDuration", parseInt(val) || 0)
                      }
                      borderRadius={16}
                      borderWidth={2}
                      borderColor="#f2ecf4"
                      focusStyle={{
                        borderColor: "#6750A4",
                      }}
                    />
                  </SettingItem>
                  <SettingItem flex={1}>
                    <XStack gap="$2" alignItems="center" marginBottom="$1">
                      <Coffee size={16} color="#6750A4" />
                      <Label fontSize="$3" fontWeight="700" color="#494551">
                        Break
                      </Label>
                    </XStack>
                    <Input
                      keyboardType="numeric"
                      value={tempSettings?.breakDuration?.toString() ?? "0"}
                      onChangeText={(val) =>
                        updateSetting("breakDuration", parseInt(val) || 0)
                      }
                      borderRadius={16}
                      borderWidth={2}
                      borderColor="#f2ecf4"
                      focusStyle={{
                        borderColor: "#6750A4",
                      }}
                    />
                  </SettingItem>
                </XStack>

                {tempSettings?.mode === "pomodoro" && (
                  <>
                    <SettingItem>
                      <XStack gap="$2" alignItems="center" marginBottom="$1">
                        <Clock size={16} color="#6750A4" />
                        <Label fontSize="$3" fontWeight="700" color="#494551">
                          Long Break
                        </Label>
                      </XStack>
                      <Input
                        keyboardType="numeric"
                        value={
                          tempSettings?.longBreakDuration?.toString() ?? "0"
                        }
                        onChangeText={(val) =>
                          updateSetting("longBreakDuration", parseInt(val) || 0)
                        }
                        borderRadius={16}
                        borderWidth={2}
                        borderColor="#f2ecf4"
                        focusStyle={{
                          borderColor: "#6750A4",
                        }}
                      />
                    </SettingItem>

                    <XStack gap="$4">
                      <SettingItem flex={1}>
                        <XStack gap="$2" alignItems="center" marginBottom="$1">
                          <Repeat size={16} color="#6750A4" />
                          <Label fontSize="$3" fontWeight="700" color="#494551">
                            Cycles
                          </Label>
                        </XStack>
                        <Input
                          keyboardType="numeric"
                          value={
                            tempSettings?.cyclesBeforeLongBreak?.toString() ??
                            "0"
                          }
                          onChangeText={(val) =>
                            updateSetting(
                              "cyclesBeforeLongBreak",
                              parseInt(val) || 0,
                            )
                          }
                          borderRadius={16}
                          borderWidth={2}
                          borderColor="#f2ecf4"
                          focusStyle={{
                            borderColor: "#6750A4",
                          }}
                        />
                      </SettingItem>
                      <SettingItem flex={1}>
                        <XStack gap="$2" alignItems="center" marginBottom="$1">
                          <Repeat size={16} color="#6750A4" />
                          <Label fontSize="$3" fontWeight="700" color="#494551">
                            Total
                          </Label>
                        </XStack>
                        <Input
                          keyboardType="numeric"
                          value={tempSettings?.totalCycles?.toString() ?? "0"}
                          onChangeText={(val) =>
                            updateSetting("totalCycles", parseInt(val) || 0)
                          }
                          borderRadius={16}
                          borderWidth={2}
                          borderColor="#f2ecf4"
                          focusStyle={{
                            borderColor: "#6750A4",
                          }}
                        />
                      </SettingItem>
                    </XStack>
                  </>
                )}
              </YStack>
            </ScrollView>

            <XStack gap="$3" marginTop="$2">
              <Dialog.Close asChild>
                <Button
                  flex={1}
                  borderRadius={16}
                  backgroundColor="#f2ecf4"
                  pressStyle={{ scale: 0.95 }}
                >
                  <Text fontWeight="700" color="#6750A4">
                    Cancel
                  </Text>
                </Button>
              </Dialog.Close>
              <Button
                flex={2}
                borderRadius={16}
                backgroundColor="#6750A4"
                pressStyle={{ scale: 0.95 }}
                onPress={handleSave}
                icon={<Check size={18} color="white" />}
              >
                <Text fontWeight="700" color="white">
                  Save Changes
                </Text>
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
