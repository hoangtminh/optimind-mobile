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
import { GroupedSession, ListStats } from "../_hooks/useHistory";
import { SessionItem } from "./SessionItem";
import { Theme } from "@/constants/Theme";

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
      style={{ flex: 1, backgroundColor: Theme.primaryPastel }}
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
            colors={[Theme.primary]}
            tintColor={Theme.primary}
          />
        }
      >
        {/* Summary Stats (Bento style) */}
        <View className="px-6 pt-5 pb-3">
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: Theme.surface, borderRadius: 12, padding: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Theme.border }}>
              <Text
                style={{ fontSize: 20, fontWeight: "900", color: Theme.primary }}
                numberOfLines={1}
              >
                {listStats.displayTotalTime}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: "600", color: Theme.textMuted, marginTop: 6 }}>
                Total Study Time
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: Theme.surface, borderRadius: 12, padding: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Theme.border }}>
              <Text
                style={{ fontSize: 20, fontWeight: "900", color: Theme.primary }}
                numberOfLines={1}
              >
                {listStats.completedSessions}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: "600", color: Theme.textMuted, marginTop: 6 }}>
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
                <Text style={{ color: Theme.text, fontWeight: "700", fontSize: 12, letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase", paddingHorizontal: 4 }}>
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
              <ActivityIndicator size="large" color={Theme.primary} />
              <Text style={{ color: Theme.textMuted, fontSize: 14, marginTop: 12, fontWeight: "600" }}>
                Loading study history...
              </Text>
            </View>
          ) : (
            <View style={{ backgroundColor: Theme.surface, padding: 32, borderRadius: 12, borderWidth: 1, borderColor: Theme.border, alignItems: "center", justifyContent: "center", marginTop: 32 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Theme.primaryPastel, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Calendar size={28} color={Theme.textMuted} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: Theme.text, textAlign: "center", marginBottom: 4 }}>
                No Sessions Yet
              </Text>
              <Text style={{ fontSize: 13, color: Theme.textMuted, textAlign: "center", maxWidth: 240 }}>
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

export default HistoryList;