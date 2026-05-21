import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

// ─── Design tokens (StudyFlow / Focused Academic System) ──────────────────────
const T = {
  primary: "#4f378a",
  onSurface: "#1d1b20",
  onSurfaceVariant: "#494551",
  surface: "#fdf7ff",
} as const;

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Brand wordmark */}
      <View style={styles.brandRow}>
        <Text style={styles.brandName}>Optimind</Text>
      </View>

      {/* Page identity */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 32,
  },
  brandName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    letterSpacing: -0.4,
    color: T.primary,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    color: T.onSurface,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: T.onSurfaceVariant,
    textAlign: "center",
  },
});

export default AuthHeader;
