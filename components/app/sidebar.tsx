import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  BookOpen,
  Clock,
  ListTodo,
  MessageCircle,
  Settings,
  Trophy,
  X,
} from "lucide-react-native";
import React, { useCallback } from "react";
import { StatusBar } from "react-native";
import { Image, Text, XStack, YStack, styled } from "tamagui";

// ── Palette ────────────────────────────────────────────────────────────────

const SIDEBAR = {
  bg: "#554677",
  header: "#48115c",
  activeBg: "#411270",
  activeText: "#FFFFFF",
  inactiveText: "rgba(255,255,255,0.65)",
  divider: "rgba(255,255,255,0.14)",
} as const;

// ── Types ──────────────────────────────────────────────────────────────────

type NavRoute =
  | "study/index"
  | "tasks"
  | "chat"
  | "history/index"
  | "rank/index"
  | "setting";

interface NavItem {
  route: NavRoute;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { route: "study/index", label: "Study" },
  { route: "tasks", label: "Tasks" },
  { route: "chat", label: "Chat" },
  { route: "history/index", label: "History" },
  { route: "rank/index", label: "Rank" },
  { route: "setting", label: "Setting" },
];

type IconProps = { size: number; color: string; strokeWidth?: number };

function NavIcon({ route, ...p }: IconProps & { route: NavRoute }) {
  switch (route) {
    case "study/index":
      return <BookOpen {...p} />;
    case "tasks":
      return <ListTodo {...p} />;
    case "chat":
      return <MessageCircle {...p} />;
    case "history/index":
      return <Clock {...p} />;
    case "rank/index":
      return <Trophy {...p} />;
    case "setting":
      return <Settings {...p} />;
  }
}

// ── Tamagui styled primitives ──────────────────────────────────────────────

// Pressable row that supports active + pressed states via variant-like props
const NavRow = styled(XStack, {
  name: "NavRow",
  alignItems: "center",
  borderRadius: 12,
  paddingVertical: "$3",
  paddingHorizontal: "$4",
  gap: "$3",
  position: "relative",
  overflow: "hidden",
  pressStyle: {
    backgroundColor: "rgba(255,255,255,0.07)",
    scale: 0.98,
  },
  variants: {
    active: {
      true: {
        backgroundColor: SIDEBAR.activeBg,
      },
      false: {
        backgroundColor: "transparent",
      },
    },
  } as const,
  defaultVariants: {
    active: false,
  },
});

const ActiveBar = styled(YStack, {
  name: "ActiveBar",
  position: "absolute",
  left: 0,
  top: "25%",
  bottom: "25%",
  width: 3,
  borderRadius: 2,
  variants: {
    visible: {
      true: { backgroundColor: "#FFFFFF" },
      false: { backgroundColor: "transparent" },
    },
  } as const,
  defaultVariants: { visible: false },
});

// ── SidebarItem ────────────────────────────────────────────────────────────

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  onPress: (route: NavRoute) => void;
}

const SidebarItem = React.memo(function SidebarItem({
  item,
  isActive,
  onPress,
}: SidebarItemProps) {
  const { label, route } = item;
  return (
    <NavRow
      active={isActive}
      onPress={() => onPress(route)}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
    >
      <ActiveBar visible={isActive} />

      <NavIcon
        route={route}
        size={20}
        color={isActive ? SIDEBAR.activeText : SIDEBAR.inactiveText}
        strokeWidth={isActive ? 2.5 : 1.8}
      />

      <Text
        flex={1}
        fontSize={15}
        fontWeight="600"
        letterSpacing={-0.1}
        numberOfLines={1}
        color={isActive ? SIDEBAR.activeText : SIDEBAR.inactiveText}
      >
        {label}
      </Text>
    </NavRow>
  );
});

// ── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar(props: DrawerContentComponentProps) {
  const { navigation, state } = props;

  const activeRouteName = state.routes[state.index]?.name as NavRoute;

  const closeDrawer = useCallback(() => navigation.closeDrawer(), [navigation]);

  // Close first for instant visual feedback, then navigate.
  const handleNavigate = useCallback(
    (route: NavRoute) => {
      navigation.closeDrawer();
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <YStack flex={1} backgroundColor={SIDEBAR.bg}>
      <StatusBar barStyle="light-content" />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
          paddingVertical="$4"
          backgroundColor={SIDEBAR.header}
          borderRadius={16}
          marginHorizontal="$3"
          marginBottom="$2"
        >
          <XStack alignItems="center" gap="$4">
            {/* Brand dot / logo mark */}
            <Image
              src={require("@/assets/images/icon.png")}
              width={48}
              height={48}
              borderRadius={10}
            />
            <YStack>
              <Text
                fontSize={16}
                fontWeight="800"
                color="#FFFFFF"
                letterSpacing={-0.3}
              >
                Focus Studio
              </Text>
              <Text fontSize={11} color="rgba(255,255,255,0.5)" marginTop={1}>
                Stay in your zone.
              </Text>
            </YStack>
          </XStack>

          {/* Close button */}
          <YStack
            padding="$2"
            borderRadius={8}
            backgroundColor="rgba(255,255,255,0.08)"
            onPress={closeDrawer}
            pressStyle={{ opacity: 0.7, scale: 0.95 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <X size={18} color="rgba(255,255,255,0.55)" strokeWidth={2} />
          </YStack>
        </XStack>

        {/* ── Divider ────────────────────────────────────────── */}
        <YStack
          height={1}
          backgroundColor={SIDEBAR.divider}
          marginHorizontal="$5"
          marginVertical="$3"
        />

        {/* ── Nav items ──────────────────────────────────────── */}
        <YStack paddingHorizontal="$2" gap="$2">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.route}
              item={item}
              isActive={activeRouteName === item.route}
              onPress={handleNavigate}
            />
          ))}
        </YStack>
      </DrawerContentScrollView>
    </YStack>
  );
}

export default Sidebar;
