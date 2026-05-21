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
  pressStyle: { scale: 0.9, opacity: 0.8 },
});

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [targetTabName, setTargetTabName] = React.useState<string | null>(null);
  const [targetTabKey, setTargetTabKey] = React.useState<string | null>(null);

  const tabs = [
    { name: "study/index", icon: BookOpen, label: "Study" },
    { name: "tasks", icon: ListTodo, label: "Task" },
    { name: "chat/index", icon: MessageCircle, label: "Chat" },
    { name: "history/index", icon: Clock, label: "History" },
    { name: "rank/index", icon: Trophy, label: "Rank" },
    { name: "setting", icon: Settings, label: "Setting" },
  ];

  return (
    <>
      <XStack
        backgroundColor="white"
        borderTopWidth={1}
        borderTopColor="#f1f5f9"
        paddingBottom="$2"
        paddingTop="$1"
        elevation={5}
        shadowColor="#000"
        shadowRadius={10}
        shadowOpacity={0.05}
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
              backgroundColor={isFocused ? "#fdf7ff" : "transparent"}
              borderRadius={12}
            >
              <IconComponent
                size={20}
                color={isFocused ? "#6750A4" : "#64748b"}
              />
              <Text
                fontSize={10}
                fontWeight="600"
                color={isFocused ? "#6750A4" : "#64748b"}
                marginTop="$1"
              >
                {tab.label}
              </Text>
              {isFocused && (
                <View
                  position="absolute"
                  bottom={-2}
                  width="40%"
                  height={3}
                  backgroundColor="#6750A4"
                  borderRadius={2}
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
