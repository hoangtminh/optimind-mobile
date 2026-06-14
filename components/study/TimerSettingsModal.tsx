import { Theme } from "@/constants/Theme";
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
  gap: "$1.5",
  marginBottom: "$3",
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
      const updated = {
        ...prev,
        [key]: value,
      };
      if (key === "mode" && value === "countdown") {
        updated.cyclesBeforeLongBreak = 1;
        updated.totalCycles = 1;
      }
      return updated;
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
          x={0}
          scale={1}
          opacity={1}
          y={0}
          backgroundColor={Theme.surface}
          borderColor={Theme.border}
          borderWidth={1}
          borderRadius={12}
          padding="$5"
          width="95%"
          maxWidth={450}
          alignSelf="center"
        >
          <YStack gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <Dialog.Title fontSize="$5" fontWeight="700" color={Theme.text}>
                Timer Preferences
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  circular
                  size="$3"
                  chromeless
                  icon={<X size={18} color={Theme.textMuted} />}
                />
              </Dialog.Close>
            </XStack>

            <ScrollView maxHeight={600} showsVerticalScrollIndicator={false}>
              <YStack gap="$1">
                <SettingItem>
                  <Label
                    fontSize="$2"
                    fontWeight="600"
                    color={Theme.text}
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    Mode
                  </Label>
                  <XStack
                    backgroundColor={Theme.surfaceMuted}
                    borderColor={Theme.border}
                    borderWidth={1}
                    padding="$1"
                    borderRadius={8}
                    gap="$1"
                  >
                    <Button
                      flex={1}
                      size="$3"
                      borderRadius={6}
                      backgroundColor={
                        tempSettings?.mode === "pomodoro"
                          ? Theme.primary
                          : "transparent"
                      }
                      onPress={() => updateSetting("mode", "pomodoro")}
                      chromeless={tempSettings?.mode !== "pomodoro"}
                    >
                      <Text
                        fontWeight="600"
                        color={
                          tempSettings?.mode === "pomodoro"
                            ? Theme.primaryText
                            : Theme.textMuted
                        }
                      >
                        Pomodoro
                      </Text>
                    </Button>
                    <Button
                      flex={1}
                      size="$3"
                      borderRadius={6}
                      backgroundColor={
                        tempSettings?.mode === "countdown"
                          ? Theme.primary
                          : "transparent"
                      }
                      onPress={() => updateSetting("mode", "countdown")}
                      chromeless={tempSettings?.mode !== "countdown"}
                    >
                      <Text
                        fontWeight="600"
                        color={
                          tempSettings?.mode === "countdown"
                            ? Theme.primaryText
                            : Theme.textMuted
                        }
                      >
                        Countdown
                      </Text>
                    </Button>
                  </XStack>
                </SettingItem>

                <XStack gap="$3">
                  <SettingItem flex={1}>
                    <XStack gap="$2" alignItems="center">
                      <Brain size={14} color={Theme.primary} />
                      <Label
                        fontSize="$2"
                        fontWeight="600"
                        color={Theme.text}
                        textTransform="uppercase"
                        letterSpacing={1}
                      >
                        Focus (m)
                      </Label>
                    </XStack>
                    <Input
                      keyboardType="numeric"
                      value={tempSettings?.focusDuration?.toString() ?? "0"}
                      onChangeText={(val) =>
                        updateSetting("focusDuration", parseInt(val) || 0)
                      }
                      borderRadius={6}
                      borderWidth={1}
                      borderColor={Theme.border}
                      backgroundColor={Theme.surface}
                      color={Theme.text}
                      height={"fit"}
                      focusStyle={{
                        borderColor: Theme.primary,
                        borderWidth: 1,
                      }}
                    />
                  </SettingItem>
                  <SettingItem flex={1}>
                    <XStack gap="$2" alignItems="center">
                      <Coffee size={14} color={Theme.primary} />
                      <Label
                        fontSize="$2"
                        fontWeight="600"
                        color={Theme.text}
                        textTransform="uppercase"
                        letterSpacing={1}
                      >
                        Break (m)
                      </Label>
                    </XStack>
                    <Input
                      keyboardType="numeric"
                      value={tempSettings?.breakDuration?.toString() ?? "0"}
                      onChangeText={(val) =>
                        updateSetting("breakDuration", parseInt(val) || 0)
                      }
                      borderRadius={6}
                      borderWidth={1}
                      borderColor={Theme.border}
                      backgroundColor={Theme.surface}
                      color={Theme.text}
                      height={"fit"}
                      focusStyle={{
                        borderColor: Theme.primary,
                        borderWidth: 1,
                      }}
                    />
                  </SettingItem>
                </XStack>

                {tempSettings?.mode === "pomodoro" && (
                  <>
                    <SettingItem>
                      <XStack gap="$2" alignItems="center" marginBottom="$1">
                        <Clock size={14} color={Theme.primary} />
                        <Label
                          fontSize="$2"
                          fontWeight="600"
                          color={Theme.text}
                          textTransform="uppercase"
                          letterSpacing={1}
                        >
                          Long Break (m)
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
                        borderRadius={6}
                        borderWidth={1}
                        borderColor={Theme.border}
                        backgroundColor={Theme.surface}
                        color={Theme.text}
                        height={"fit"}
                        focusStyle={{
                          borderColor: Theme.primary,
                          borderWidth: 1,
                        }}
                      />
                    </SettingItem>

                    <XStack gap="$3">
                      <SettingItem flex={1}>
                        <XStack gap="$2" alignItems="center" marginBottom="$1">
                          <Repeat size={14} color={Theme.primary} />
                          <Label
                            fontSize="$2"
                            fontWeight="600"
                            color={Theme.text}
                            textTransform="uppercase"
                            letterSpacing={1}
                          >
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
                          borderRadius={6}
                          borderWidth={1}
                          borderColor={Theme.border}
                          backgroundColor={Theme.surface}
                          color={Theme.text}
                          height={"fit"}
                          focusStyle={{
                            borderColor: Theme.primary,
                            borderWidth: 1,
                          }}
                        />
                      </SettingItem>
                      <SettingItem flex={1}>
                        <XStack gap="$2" alignItems="center" marginBottom="$1">
                          <Repeat size={14} color={Theme.primary} />
                          <Label
                            fontSize="$2"
                            fontWeight="600"
                            color={Theme.text}
                            textTransform="uppercase"
                            letterSpacing={1}
                          >
                            Total Cycles
                          </Label>
                        </XStack>
                        <Input
                          keyboardType="numeric"
                          value={tempSettings?.totalCycles?.toString() ?? "0"}
                          onChangeText={(val) =>
                            updateSetting("totalCycles", parseInt(val) || 0)
                          }
                          borderRadius={6}
                          borderWidth={1}
                          borderColor={Theme.border}
                          backgroundColor={Theme.surface}
                          color={Theme.text}
                          height={"fit"}
                          focusStyle={{
                            borderColor: Theme.primary,
                            borderWidth: 1,
                          }}
                        />
                      </SettingItem>
                    </XStack>
                  </>
                )}
              </YStack>
            </ScrollView>

            <XStack gap="$3">
              <Dialog.Close asChild>
                <Button
                  flex={1}
                  borderRadius={6}
                  backgroundColor={Theme.surfaceMuted}
                  borderColor={Theme.border}
                  borderWidth={1}
                  pressStyle={{ scale: 0.98 }}
                >
                  <Text fontWeight="600" color={Theme.text}>
                    Cancel
                  </Text>
                </Button>
              </Dialog.Close>
              <Button
                flex={2}
                borderRadius={6}
                backgroundColor={Theme.primary}
                pressStyle={{ scale: 0.98 }}
                onPress={handleSave}
                icon={<Check size={16} color={Theme.primaryText} />}
              >
                <Text fontWeight="600" color={Theme.primaryText}>
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
