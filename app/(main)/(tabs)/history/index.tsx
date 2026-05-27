import { AppHeader } from "@/components/common/AppHeader";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryList } from "./components/HistoryList";
import { SessionDetails } from "./components/SessionDetails";
import { useHistory } from "./hooks/useHistory";

export default function History() {
  const {
    selectedSessionId,
    selectedSession,
    selectedSessionMetrics,
    listStats,
    groupedSessions,
    handleSessionSelect,
    handleGoBack,
    isLoading,
    refreshSessions,
    isLoadingDetails,
  } = useHistory();

  if (selectedSessionId && isLoadingDetails) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fdf7ff" }}
        edges={["top"]}
      >
        <AppHeader
          title="Session Details"
          showBackButton={true}
          onBack={handleGoBack}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6750A4" />
          <Text className="text-[#494551] text-sm mt-3 font-semibold">
            Loading details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedSession && selectedSessionMetrics) {
    return (
      <SessionDetails
        session={selectedSession}
        metrics={selectedSessionMetrics}
        onBack={handleGoBack}
      />
    );
  }

  return (
    <HistoryList
      listStats={listStats}
      groupedSessions={groupedSessions}
      onSessionSelect={handleSessionSelect}
      isLoading={isLoading}
      onRefresh={refreshSessions}
    />
  );
}
