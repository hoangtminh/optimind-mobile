import { AppHeader } from "@/components/common/AppHeader";
import { StudySession } from "@/lib/types/study";
import { Clock, Coffee, RotateCw, TrendingUp } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionMetrics } from "../hooks/useHistory";
import { formatSessionDateOnly } from "../utils/historyUtils";

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
      style={{ flex: 1, backgroundColor: "#fdf7ff" }}
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
        <View className="bg-white rounded-2xl p-4 border border-[#f2ecf4] mb-5">
          <View className="flex-row justify-between py-2 border-b border-[#f2ecf4]">
            <Text className="text-sm font-semibold text-[#494551]">Date</Text>
            <Text className="text-sm font-bold text-[#1d1b20]">
              {formatSessionDateOnly(
                session.date,
                session.startTime,
                session.endTime,
              )}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-[#f2ecf4]">
            <Text className="text-sm font-semibold text-[#494551]">
              Start Time
            </Text>
            <Text className="text-sm font-bold text-[#1d1b20]">
              {formatSessionDateOnly(session.startTime)}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-[#f2ecf4]">
            <Text className="text-sm font-semibold text-[#494551]">
              End Time
            </Text>
            <Text className="text-sm font-bold text-[#1d1b20]">
              {formatSessionDateOnly(session.endTime)}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-[#f2ecf4]">
            <Text className="text-sm font-semibold text-[#494551]">
              Total Time
            </Text>
            <Text className="text-sm font-bold text-[#1d1b20]">
              {metrics.totalTimeText}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-[#f2ecf4]">
            <Text className="text-sm font-semibold text-[#494551]">
              Session Type
            </Text>
            <Text className="text-sm font-bold text-[#1d1b20] capitalize">
              {session.type || "focus"}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-sm font-semibold text-[#494551]">Status</Text>
            <Text
              className={`text-sm font-bold ${session.completed ? "text-[#6750A4]" : "text-[#7a7582]"}`}
            >
              {session.completed ? "Completed" : "Incomplete"}
            </Text>
          </View>
        </View>

        {/* Focus Score Line Chart Card */}
        <View className="bg-white rounded-3xl p-5 mb-5 border border-[#f2ecf4]">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-[#1d1b20]">
              Focus Score Timeline
            </Text>
            <View className="bg-[#e9ddff] px-2.5 py-0.5 rounded-full">
              <Text className="text-[11px] font-bold text-[#6750A4] uppercase tracking-wide">
                AI Monitored
              </Text>
            </View>
          </View>

          {/* Curved LineChart */}
          <View className="items-center justify-center mt-2">
            <LineChart
              data={{
                labels: metrics.labels,
                datasets: [
                  {
                    data: metrics.chartPoints,
                    color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
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
              getDotColor={() => "#6750A4"}
              fromZero={true}
              segments={4}
              withVerticalLines={false}
              withHorizontalLines={true}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(73, 69, 81, ${opacity})`,
                propsForLabels: {
                  fontSize: 10,
                  fontFamily: "System",
                },
                propsForBackgroundLines: {
                  stroke: "rgba(203, 196, 210, 0.3)",
                  strokeDasharray: "4 4",
                },
                fillShadowGradient: "#6750a4",
                fillShadowGradientOpacity: 0.15,
                fillShadowGradientTo: "#6750a4",
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
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-4">
          {/* Focus Time */}
          <View className="bg-white rounded-2xl p-4 border border-[#f2ecf4] w-[48%]">
            <View className="flex-row items-center gap-2 mb-2">
              <Clock size={18} color="#6750A4" />
              <Text className="text-xs font-bold text-[#494551] uppercase tracking-wider">
                Focus Time
              </Text>
            </View>
            <Text className="text-2xl font-bold text-[#6750A4]">
              {metrics.focusTimeText}
            </Text>
          </View>

          {/* Break Time */}
          <View className="bg-white rounded-2xl p-4 border border-[#f2ecf4] w-[48%]">
            <View className="flex-row items-center gap-2 mb-2">
              <Coffee size={18} color="#625b71" />
              <Text className="text-xs font-bold text-[#494551] uppercase tracking-wider">
                Break Time
              </Text>
            </View>
            <Text className="text-2xl font-bold text-[#625b71]">
              {metrics.breakTimeText}
            </Text>
          </View>

          {/* Cycles */}
          <View className="bg-white rounded-2xl p-4 border border-[#f2ecf4] w-[48%]">
            <View className="flex-row items-center gap-2 mb-2">
              <RotateCw size={18} color="#1d1b20" />
              <Text className="text-xs font-bold text-[#494551] uppercase tracking-wider">
                Cycles
              </Text>
            </View>
            <Text className="text-2xl font-bold text-[#1d1b20]">
              {metrics.cycles}
            </Text>
          </View>

          {/* Average Focus Score */}
          <View className="bg-[#e9ddff] rounded-2xl p-4 border border-[#cbc4d2] w-[48%]">
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUp size={18} color="#4f378a" />
              <Text className="text-xs font-bold text-[#4f378a] uppercase tracking-wider">
                Avg. Focus
              </Text>
            </View>
            <Text className="text-2xl font-bold text-[#4f378a]">
              {metrics.prodScore}%
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
