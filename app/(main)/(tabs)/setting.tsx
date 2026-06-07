import GlobalHeader from "@/components/app/GlobalHeader";
import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { useAuth } from "@/hooks/useAuth";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import {
	Bell,
	ChevronRight,
	HelpCircle,
	LogOut,
	Moon,
	Palette,
	Shield,
	Sun,
	Target,
	Timer,
	User,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
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
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoBreak, setAutoBreak] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const onConfirmLogout = () => {
    console.log("User logged out");
    setShowLogoutDialog(false);
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
          icon: darkMode ? (
            <Moon size={18} color={Theme.text} />
          ) : (
            <Sun size={18} color={Theme.text} />
          ),
          rightComponent: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Theme.border, true: Theme.primary }}
              thumbColor={Theme.surface}
            />
          ),
          showChevron: false,
        },
        {
          title: "Theme",
          subtitle: "Choose your preferred theme",
          icon: <Palette size={18} color={Theme.text} />,
          onPress: () => console.log("Navigate to theme settings"),
        },
      ],
    },
    {
      title: "Study Settings",
      items: [
        {
          title: "Timer Preferences",
          subtitle: "Customize Pomodoro settings",
          icon: <Timer size={18} color={Theme.text} />,
          onPress: () => console.log("Navigate to timer settings"),
        },
        {
          title: "Goals & Targets",
          subtitle: "Set daily and weekly goals",
          icon: <Target size={18} color={Theme.text} />,
          onPress: () => console.log("Navigate to goals settings"),
        },
        {
          title: "Sound Effects",
          subtitle: "Enable/disable timer sounds",
          icon: <Bell size={18} color={Theme.text} />,
          rightComponent: (
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: Theme.border, true: Theme.primary }}
              thumbColor={Theme.surface}
            />
          ),
          showChevron: false,
        },
        {
          title: "Auto Break",
          subtitle: "Automatically start break after session",
          icon: <Timer size={18} color={Theme.text} />,
          rightComponent: (
            <Switch
              value={autoBreak}
              onValueChange={setAutoBreak}
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

        {/* Logout Button — flat pale red aesthetic */}
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
