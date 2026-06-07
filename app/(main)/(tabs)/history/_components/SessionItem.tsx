import { StudySession } from "@/lib/types/study";
import { ChevronRight, Clock } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  formatSecondsDuration,
  formatSessionDateTime,
} from "../_utils/historyUtils";

export interface SessionItemProps {
  session: StudySession;
  onPress: (id: string) => void;
}

const SessionItemComponent: React.FC<SessionItemProps> = ({
  session,
  onPress,
}) => {
  const handlePress = useCallback(() => {
    onPress(session.id);
  }, [session.id, onPress]);

  // Capitalize session type
  const sessionTitle = useMemo(() => {
    if (!session.type) return "Focus Session";
    const cleanType = session.type.toLowerCase().replace("_", " ");
    return cleanType.charAt(0).toUpperCase() + cleanType.slice(1) + " Session";
  }, [session.type]);

  // Render formatted duration using totalTime (in seconds)
  const durationText = useMemo(() => {
    const totalSecs =
      session.totalTime !== undefined
        ? session.totalTime
        : session.duration > 200
          ? session.duration
          : session.duration * 60;
    return formatSecondsDuration(totalSecs);
  }, [session.totalTime, session.duration]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="w-full bg-white rounded-2xl p-3 flex-row items-center justify-between mb-2 border border-[#f2ecf4]"
    >
      <View className="flex-row items-center flex-1 pr-2">
        <View className="w-9 h-9 rounded-full bg-[#f2ecf4] items-center justify-center shrink-0 mr-3">
          <Clock size={16} color="#6750A4" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-0.5">
            <Text
              className="font-bold text-[#1d1b20] text-sm flex-1 mr-2"
              numberOfLines={1}
            >
              {sessionTitle}
            </Text>
            {session.completed ? (
              <View className="bg-[#e9ddff] px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-[#4f378a]">
                  Completed
                </Text>
              </View>
            ) : (
              <View className="bg-[#ffdad6] px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-[#ba1a1a]">
                  Incomplete
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[12px] text-[#494551]">
              {formatSessionDateTime(
                session.date,
                session.startTime,
                session.endTime,
              )}
            </Text>
            <Text className="text-[12px] text-[#7a7582]">•</Text>
            <Text className="text-[12px] text-[#6750A4] font-semibold">
              {durationText}
            </Text>
          </View>
        </View>
      </View>
      <ChevronRight size={16} color="#7a7582" />
    </TouchableOpacity>
  );
};

export const SessionItem = React.memo(SessionItemComponent);
