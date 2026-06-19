import { Theme } from "@/constants/Theme";
import { StudySession } from "@/lib/types/study";
import { ChevronRight, Clock } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  formatSecondsDuration,
  formatSessionDateTime,
} from "@/utils/historyUtils";

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

  console.log(session);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        width: "100%",
        backgroundColor: Theme.surface,
        borderRadius: 12, // Crisp corners
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Theme.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          paddingRight: 8,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: Theme.primaryPastel,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Clock size={16} color={Theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                color: Theme.text,
                fontSize: 14,
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {sessionTitle}
            </Text>
            {session.completed ? (
              <View
                style={{
                  backgroundColor: Theme.accentGreen,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: Theme.accentGreenText,
                  }}
                >
                  Completed
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: Theme.accentRed,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: Theme.accentRedText,
                  }}
                >
                  Incomplete
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 12, color: Theme.textMuted }}>
              {formatSessionDateTime(
                session.date,
                session.startTime,
                session.endTime,
              )}
            </Text>
            <Text style={{ fontSize: 12, color: Theme.textMuted }}>•</Text>
            <Text
              style={{ fontSize: 12, color: Theme.primary, fontWeight: "600" }}
            >
              {durationText}
            </Text>
          </View>
        </View>
      </View>
      <ChevronRight size={16} color={Theme.textMuted} />
    </TouchableOpacity>
  );
};

export const SessionItem = React.memo(SessionItemComponent);
export default SessionItem;
