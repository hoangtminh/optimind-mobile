import { AppHeader } from "@/components/common/AppHeader";
import { StudySession } from "@/lib/types/study";
import { Clock, Coffee, RotateCw, TrendingUp } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionMetrics } from "@/hooks/useHistory";
import { formatSessionDateOnly } from "@/utils/historyUtils";
import { Theme } from "@/constants/Theme";

export interface SessionDetailsProps {
  session: StudySession;
  metrics: SessionMetrics;
  onBack: () => void;
}

export const SessionDetails: React.FC<SessionDetailsProps> = ({
  session,
  metrics,
  onBack,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.background }}
      edges={["top"]}
    >
      <AppHeader
        title="Session Details"
        showBackButton={true}
        onBack={onBack}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Metadata details list (Top of view) */}
        <View style={{ backgroundColor: Theme.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.border, marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.border }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Theme.textMuted }}>Date</Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Theme.text }}>
              {formatSessionDateOnly(
                session.date,
                session.startTime,
                session.endTime,
              )}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.border, marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Theme.textMuted }}>
              Start Time
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Theme.text }}>
              {formatSessionDateOnly(session.startTime)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.border, marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Theme.textMuted }}>
              End Time
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Theme.text }}>
              {formatSessionDateOnly(session.endTime)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.border, marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Theme.textMuted }}>
              Total Time
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Theme.text }}>
              {metrics.totalTimeText}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.border, marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Theme.textMuted }}>
              Session Type
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Theme.text, textTransform: "capitalize" }}>
              {session.type || "focus"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Theme.textMuted }}>Status</Text>
            <Text
              style={{ fontSize: 14, fontWeight: "700", color: session.completed ? Theme.primary : Theme.textMuted }}
            >
              {session.completed ? "Completed" : "Incomplete"}
            </Text>
          </View>
        </View>

        {/* Focus Score Line Chart Card */}
        <View style={{ backgroundColor: Theme.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Theme.border, marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Theme.text }}>
              Focus Score Timeline
            </Text>
            <View style={{ backgroundColor: Theme.primaryPastel, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: Theme.primary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                AI Monitored
              </Text>
            </View>
          </View>

          {/* Curved LineChart */}
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 8 }}>
            <LineChart
              data={{
                labels: metrics.labels,
                datasets: [
                  {
                    data: metrics.chartPoints,
                    color: (opacity = 1) => Theme.isDark ? `rgba(187, 134, 252, ${opacity})` : `rgba(79, 55, 138, ${opacity})`,
                    strokeWidth: 3,
                  },
                  {
                    data: [100], // Keep Y-axis scale fixed up to 100%
                    withDots: false,
                    color: () => "transparent",
                    strokeWidth: 0,
                  },
                ],
              }}
              yAxisSuffix="%"
              width={windowWidth - 52}
              height={200}
              withDots={true}
              getDotColor={() => Theme.primary}
              fromZero={true}
              segments={4}
              withVerticalLines={false}
              withHorizontalLines={true}
              chartConfig={{
                backgroundColor: Theme.surface,
                backgroundGradientFrom: Theme.surface,
                backgroundGradientTo: Theme.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => Theme.isDark ? `rgba(187, 134, 252, ${opacity})` : `rgba(79, 55, 138, ${opacity})`,
                labelColor: (opacity = 1) => Theme.isDark ? `rgba(238, 238, 238, ${opacity})` : `rgba(120, 119, 116, ${opacity})`,
                propsForLabels: {
                  fontSize: 10,
                  fontFamily: "System",
                },
                propsForBackgroundLines: {
                  stroke: Theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(203, 196, 210, 0.3)",
                  strokeDasharray: "4 4",
                },
                fillShadowGradient: Theme.primary,
                fillShadowGradientOpacity: 0.15,
                fillShadowGradientTo: Theme.primary,
                fillShadowGradientToOpacity: 0,
                useShadowColorFromDataset: false,
              }}
              bezier
              style={{
                borderRadius: 16,
                paddingRight: 35,
                paddingLeft: 35,
                marginLeft: 10,
              }}
            />
          </View>
        </View>

        {/* Statistics Bento Grid (Flexbox layout for cross-platform 2 columns) */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          {/* Focus Time */}
          <View style={{ backgroundColor: Theme.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.border, width: "48%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Clock size={18} color={Theme.primary} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: Theme.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Focus Time
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: Theme.primary }}>
              {metrics.focusTimeText}
            </Text>
          </View>

          {/* Break Time */}
          <View style={{ backgroundColor: Theme.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.border, width: "48%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Coffee size={18} color={Theme.textMuted} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: Theme.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Break Time
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: Theme.text }}>
              {metrics.breakTimeText}
            </Text>
          </View>

          {/* Cycles */}
          <View style={{ backgroundColor: Theme.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.border, width: "48%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <RotateCw size={18} color={Theme.text} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: Theme.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Cycles
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: Theme.text }}>
              {metrics.cycles}
            </Text>
          </View>

          {/* Average Focus Score */}
          <View style={{ backgroundColor: Theme.primaryPastel, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.primary, width: "48%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <TrendingUp size={18} color={Theme.primary} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: Theme.primary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Avg. Focus
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: Theme.primary }}>
              {metrics.prodScore}%
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SessionDetails;
