import GlobalHeader from "@/components/app/GlobalHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import { TimerSettingsModal } from "@/components/study/TimerSettingsModal";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  Sun,
  Timer,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "@/constants/Theme";

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  rightComponent,
  showChevron = true,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: Theme.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Theme.border,
      marginBottom: 10,
    }}
    disabled={!onPress}
  >
    <View style={{
      width: 36,
      height: 36,
      backgroundColor: Theme.background,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    }}>
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: Theme.text, fontWeight: "500", fontSize: 15 }}>{title}</Text>
      {subtitle && (
        <Text style={{ color: Theme.textMuted, fontSize: 13, marginTop: 2 }}>{subtitle}</Text>
      )}
    </View>
    {rightComponent}
    {showChevron && onPress && <ChevronRight size={16} color={Theme.textMuted} />}
  </TouchableOpacity>
);

export default function Setting() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useSettings();
  
  const [notifications, setNotifications] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);

  // Local states for Sound Modal only
  const [tempVibrate, setTempVibrate] = useState(settings.vibrate);
  const [tempSoundEnabled, setTempSoundEnabled] = useState(settings.soundEnabled);
  const [tempVolume, setTempVolume] = useState(settings.soundVolume);
  const [tempSoundName, setTempSoundName] = useState(settings.soundName);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const onConfirmLogout = async () => {
    setShowLogoutDialog(false);
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const openTimerModal = () => {
    setShowTimerModal(true);
  };

  const handleSaveTimerSettings = (newTimerSettings: any) => {
    updateSettings(newTimerSettings);
  };

  const openSoundModal = () => {
    setTempVibrate(settings.vibrate);
    setTempSoundEnabled(settings.soundEnabled);
    setTempVolume(settings.soundVolume);
    setTempSoundName(settings.soundName);
    setShowSoundModal(true);
  };

  const saveSoundSettings = () => {
    updateSettings({
      vibrate: tempVibrate,
      soundEnabled: tempSoundEnabled,
      soundVolume: tempVolume,
      soundName: tempSoundName,
    });
    setShowSoundModal(false);
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          subtitle: user?.username || "Update your profile information",
          icon: <User size={18} color={Theme.text} />,
          onPress: () => router.push("/(main)/(tabs)/profile"),
        },
        {
          title: "Notifications",
          subtitle: "Manage notification preferences",
          icon: <Bell size={18} color={Theme.text} />,
          rightComponent: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Theme.border, true: Theme.primary }}
              thumbColor={Theme.surface}
            />
          ),
          showChevron: false,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          title: "Dark Mode",
          subtitle: "Toggle dark theme",
          icon: settings.darkMode ? (
            <Moon size={18} color={Theme.text} />
          ) : (
            <Sun size={18} color={Theme.text} />
          ),
          rightComponent: (
            <Switch
              value={settings.darkMode}
              onValueChange={(val) => updateSettings({ darkMode: val })}
              trackColor={{ false: Theme.border, true: Theme.primary }}
              thumbColor={Theme.surface}
            />
          ),
          showChevron: false,
        },
      ],
    },
    {
      title: "Study Settings",
      items: [
        {
          title: "Timer Preferences",
          subtitle: `${settings.mode === "pomodoro" ? "Pomodoro" : "Countdown"} (${settings.focusDuration}m / ${settings.breakDuration}m)`,
          icon: <Timer size={18} color={Theme.text} />,
          onPress: openTimerModal,
        },
        {
          title: "Sound Effects",
          subtitle: `${settings.soundEnabled ? `Enabled (${settings.soundName}, Vol: ${settings.soundVolume}%)` : "Disabled"}${settings.vibrate ? " + Vibrate" : ""}`,
          icon: <Bell size={18} color={Theme.text} />,
          onPress: openSoundModal,
        },
        {
          title: "Auto Break",
          subtitle: "Automatically start break after session",
          icon: <Timer size={18} color={Theme.text} />,
          rightComponent: (
            <Switch
              value={settings.autoBreak}
              onValueChange={(val) => updateSettings({ autoBreak: val })}
              trackColor={{ false: Theme.border, true: Theme.primary }}
              thumbColor={Theme.surface}
            />
          ),
          showChevron: false,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "Help & FAQ",
          subtitle: "Get help and find answers",
          icon: <HelpCircle size={18} color={Theme.text} />,
          onPress: () => console.log("Navigate to help"),
        },
        {
          title: "Privacy Policy",
          subtitle: "Read our privacy policy",
          icon: <Shield size={18} color={Theme.text} />,
          onPress: () => console.log("Navigate to privacy policy"),
        },
      ],
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top"]}
    >
      <GlobalHeader
        title="Settings"
        onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={{
          backgroundColor: Theme.surface,
          padding: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Theme.border,
          marginBottom: 20,
        }}>
          <View style={{ alignItems: "center" }}>
            <View style={{
              width: 56,
              height: 56,
              backgroundColor: Theme.primary,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}>
              <Text style={{ color: Theme.primaryText, fontSize: 20, fontWeight: "bold" }}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: Theme.text, marginBottom: 2 }}>
              {user?.username || "User"}
            </Text>
            <Text style={{ color: Theme.textMuted, fontSize: 14, marginBottom: 2 }}>
              {user?.email || "user@example.com"}
            </Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: Theme.text, marginBottom: 8, paddingHorizontal: 4 }}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <SettingItem key={itemIndex} {...item} />
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: Theme.accentRed,
              padding: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: Theme.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <LogOut size={18} color={Theme.accentRedText} />
              <Text style={{ color: Theme.accentRedText, fontWeight: "600", fontSize: 15, marginLeft: 8 }}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={{ alignItems: "center", marginTop: 32 }}>
          <Text style={{ color: Theme.textMuted, fontSize: 12 }}>Optimind v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Timer Preferences Modal from Components */}
      <TimerSettingsModal
        open={showTimerModal}
        onOpenChange={setShowTimerModal}
        settings={settings}
        onSave={handleSaveTimerSettings}
      />

      {/* Sound Effects Modal */}
      <Modal
        visible={showSoundModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSoundModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
          <View style={{
            backgroundColor: Theme.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Theme.border,
            width: "100%",
            maxWidth: 400,
            padding: 24,
            gap: 16,
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: Theme.text, marginBottom: 8 }}>
              Sound & Haptics Setup
            </Text>

            {/* Sound Enabled */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: Theme.text }}>Sound Effects</Text>
                <Text style={{ fontSize: 12, color: Theme.textMuted }}>Enable timer completion sound</Text>
              </View>
              <Switch
                value={tempSoundEnabled}
                onValueChange={setTempSoundEnabled}
                trackColor={{ false: Theme.border, true: Theme.primary }}
                thumbColor={Theme.surface}
              />
            </View>

            {/* Vibrate */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: Theme.text }}>Vibration</Text>
                <Text style={{ fontSize: 12, color: Theme.textMuted }}>Vibrate on session completion</Text>
              </View>
              <Switch
                value={tempVibrate}
                onValueChange={setTempVibrate}
                trackColor={{ false: Theme.border, true: Theme.primary }}
                thumbColor={Theme.surface}
              />
            </View>

            {/* Sound Volume */}
            {tempSoundEnabled && (
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: "500", color: Theme.textMuted }}>
                  Volume Level ({tempVolume}%)
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {[0, 30, 70, 100].map((vol) => (
                    <TouchableOpacity
                      key={vol}
                      onPress={() => setTempVolume(vol)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        backgroundColor: tempVolume === vol ? Theme.primaryPastel : Theme.background,
                        borderWidth: 1,
                        borderColor: tempVolume === vol ? Theme.primary : Theme.border,
                        borderRadius: 6,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{
                        color: tempVolume === vol ? Theme.primaryPastelText : Theme.text,
                        fontSize: 12,
                        fontWeight: "600",
                      }}>
                        {vol === 0 ? "Off" : vol === 100 ? "Loud" : `${vol}%`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Ringtone / Sound Choice */}
            {tempSoundEnabled && (
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: "500", color: Theme.textMuted }}>
                  Session Sound
                </Text>
                <View style={{ gap: 8 }}>
                  {["classic", "digital", "bells", "zen"].map((sound) => (
                    <TouchableOpacity
                      key={sound}
                      onPress={() => setTempSoundName(sound)}
                      style={{
                        padding: 12,
                        backgroundColor: tempSoundName === sound ? Theme.primaryPastel : Theme.background,
                        borderWidth: 1,
                        borderColor: tempSoundName === sound ? Theme.primary : Theme.border,
                        borderRadius: 6,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{
                        color: tempSoundName === sound ? Theme.primaryPastelText : Theme.text,
                        fontSize: 13,
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}>
                        {sound}
                      </Text>
                      {tempSoundName === sound && (
                        <View style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: Theme.primary,
                        }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setShowSoundModal(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 6,
                  backgroundColor: Theme.background,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: Theme.border,
                }}
              >
                <Text style={{ color: Theme.text, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveSoundSettings}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 6,
                  backgroundColor: Theme.primary,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Theme.primaryText, fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <PremiumAlertDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={onConfirmLogout}
        title="Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your tasks and chats."
        type="confirm"
        confirmText="Logout"
      />
    </SafeAreaView>
  );
}
