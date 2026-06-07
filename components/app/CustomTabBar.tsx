import { Theme } from "@/constants/Theme";
import { activeSessionTracker } from "@/utils/activeSession";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BookOpen,
  Clock,
  ListTodo,
  MessageCircle,
  Settings,
  Trophy,
} from "lucide-react-native";
import React from "react";
import { Text, View, XStack, YStack, styled } from "tamagui";
import { PremiumAlertDialog } from "../common/PremiumAlertDialog";

const TabItem = styled(YStack, {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: "$2",
  position: "relative",
  pressStyle: { scale: 0.98, opacity: 0.9 },
});

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [targetTabName, setTargetTabName] = React.useState<string | null>(null);
  const [targetTabKey, setTargetTabKey] = React.useState<string | null>(null);

  const tabs = [
    { name: "study/index", icon: BookOpen, label: "Study" },
    { name: "tasks", icon: ListTodo, label: "Task" },
    { name: "chat", icon: MessageCircle, label: "Chat" },
    { name: "history/index", icon: Clock, label: "History" },
    { name: "rank/index", icon: Trophy, label: "Rank" },
    { name: "setting", icon: Settings, label: "Setting" },
  ];

  return (
    <>
      <XStack
        backgroundColor={Theme.surface}
        borderTopWidth={1}
        borderTopColor={Theme.border}
        paddingBottom="$2"
        paddingTop="$1"
        elevation={0} // Remove shadow for flat minimalist aesthetic
      >
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const IconComponent = tab.icon;

          const onPress = () => {
            const isLeavingStudy = state.index === 0 && index !== 0;

            if (isLeavingStudy && activeSessionTracker.getRunning()) {
              setTargetTabName(state.routes[index].name);
              setTargetTabKey(state.routes[index].key);
              setIsAlertOpen(true);
              return;
            }

            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[index].name);
            }
          };

          return (
            <TabItem
              key={tab.name}
              onPress={onPress}
              backgroundColor={isFocused ? Theme.primaryPastel : "transparent"}
              borderRadius={6} // Crisp minimalist corner radius
              marginHorizontal="$1"
            >
              <IconComponent
                size={18}
                color={isFocused ? Theme.primary : Theme.textMuted}
                strokeWidth={isFocused ? 2.5 : 1.8}
              />
              <Text
                fontSize={10}
                fontWeight={isFocused ? "700" : "500"}
                color={isFocused ? Theme.primary : Theme.textMuted}
                marginTop="$1"
              >
                {tab.label}
              </Text>
              {isFocused && (
                <View
                  position="absolute"
                  bottom={-2}
                  width="30%"
                  height={2}
                  backgroundColor={Theme.primary}
                  borderRadius={1}
                />
              )}
            </TabItem>
          );
        })}
      </XStack>

      <PremiumAlertDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Tạm dừng phiên học?"
        description="Bạn đang trong phiên học. Nếu chuyển trang, phiên học và camera giám sát sẽ được tạm dừng. Bạn có chắc chắn muốn chuyển không?"
        type="confirm"
        cancelText="Hủy"
        confirmText="Đồng ý"
        onConfirm={() => {
          setIsAlertOpen(false);
          activeSessionTracker.pauseSession();
          if (targetTabKey && targetTabName) {
            const event = navigation.emit({
              type: "tabPress",
              target: targetTabKey,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(targetTabName);
            }
          }
          setTargetTabName(null);
          setTargetTabKey(null);
        }}
      />
    </>
  );
};

export default CustomTabBar;
