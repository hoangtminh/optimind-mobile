import { AppHeader } from "@/components/app/AppHeader";
import { Theme } from "@/constants/Theme";
import { GroupedSession, ListStats } from "@/hooks/useHistory";
import { Calendar } from "lucide-react-native";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SectionList,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  // Convert GroupedSession[] to SectionList sections format
  const sections = useMemo(() => {
    return groupedSessions.map((group) => ({
      title: group.title,
      data: group.data,
    }));
  }, [groupedSessions]);

  // List empty state renderer
  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center p-12 mt-8">
          <ActivityIndicator size="large" color={Theme.primary} />
          <Text
            style={{
              color: Theme.textMuted,
              fontSize: 14,
              marginTop: 12,
              fontWeight: "600",
            }}
          >
            Loading study history...
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          backgroundColor: Theme.surface,
          padding: 32,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Theme.border,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 32,
          marginHorizontal: 24,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: Theme.primaryPastel,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Calendar size={28} color={Theme.textMuted} />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: Theme.text,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          No Sessions Yet
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: Theme.textMuted,
            textAlign: "center",
            maxWidth: 240,
          }}
        >
          Start your first study session to track your cognitive metrics and
          progress!
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top"]}
    >
      <AppHeader title="Study History" />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && sections.length > 0} // Only show spinner in refresh control if we already have data loaded
            onRefresh={onRefresh}
            colors={[Theme.primary]}
            tintColor={Theme.primary}
          />
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 24 }}>
            <SessionItem session={item} onPress={onSessionSelect} />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              color: Theme.text,
              fontWeight: "700",
              fontSize: 12,
              letterSpacing: 0.5,
              marginTop: 16,
              marginBottom: 12,
              textTransform: "uppercase",
              paddingHorizontal: 28,
            }}
          >
            {title}
          </Text>
        )}
        ListHeaderComponent={
          /* Summary Stats (Bento style) */
          <View className="px-6 pt-5 pb-3">
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Theme.surface,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: Theme.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: Theme.primary,
                  }}
                  numberOfLines={1}
                >
                  {listStats.displayTotalTime}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: Theme.textMuted,
                    marginTop: 6,
                  }}
                >
                  Total Study Time
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Theme.surface,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: Theme.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: Theme.primary,
                  }}
                  numberOfLines={1}
                >
                  {listStats.completedSessions}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: Theme.textMuted,
                    marginTop: 6,
                  }}
                >
                  Sessions Completed
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default HistoryList;
