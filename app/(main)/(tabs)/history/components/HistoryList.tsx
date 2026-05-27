import { AppHeader } from "@/components/common/AppHeader";
import { Calendar } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupedSession, ListStats } from "../hooks/useHistory";
import { SessionItem } from "./SessionItem";

export interface HistoryListProps {
  listStats: ListStats;
  groupedSessions: GroupedSession[];
  onSessionSelect: (id: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  listStats,
  groupedSessions,
  onSessionSelect,
  isLoading,
  onRefresh,
}) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fdf7ff" }}
      edges={["top"]}
    >
      <AppHeader title="Study History" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={["#6750A4"]}
            tintColor="#6750A4"
          />
        }
      >
        {/* Summary Stats (Bento style) */}
        <View className="px-6 pt-5 pb-3">
          <View className="grid grid-cols-2 gap-4">
            <View className="bg-white rounded-2xl p-4 items-center justify-center border border-[#f2ecf4]">
              <Text
                className="text-2xl font-black text-[#6750A4]"
                numberOfLines={1}
              >
                {listStats.displayTotalTime}
              </Text>
              <Text className="text-xs font-semibold text-[#494551] mt-1.5">
                Total Study Time
              </Text>
            </View>
            <View className="bg-white rounded-2xl p-4 items-center justify-center border border-[#f2ecf4]">
              <Text
                className="text-2xl font-black text-[#6750A4]"
                numberOfLines={1}
              >
                {listStats.completedSessions}
              </Text>
              <Text className="text-xs font-semibold text-[#494551] mt-1.5">
                Sessions Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Chronologically Grouped Session List */}
        <View className="px-6 pt-3">
          {groupedSessions.length > 0 ? (
            groupedSessions.map((group) => (
              <View key={group.title} className="mb-4">
                <Text className="text-[#494551] font-bold text-sm tracking-wide mb-3 uppercase px-1">
                  {group.title}
                </Text>
                {group.data.map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    onPress={onSessionSelect}
                  />
                ))}
              </View>
            ))
          ) : isLoading ? (
            <View className="items-center justify-center p-12 mt-8">
              <ActivityIndicator size="large" color="#6750A4" />
              <Text className="text-[#494551] text-sm mt-3 font-semibold">
                Loading study history...
              </Text>
            </View>
          ) : (
            <View className="bg-white p-8 rounded-2xl border border-purple-50 items-center justify-center mt-8">
              <View className="w-16 h-16 rounded-full bg-[#f8f2fa] items-center justify-center mb-4">
                <Calendar size={28} color="#7a7582" />
              </View>
              <Text className="text-base font-semibold text-[#1d1b20] text-center mb-1">
                No Sessions Yet
              </Text>
              <Text className="text-sm text-[#494551] text-center max-w-[240px]">
                Start your first study session to track your cognitive metrics
                and progress!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
