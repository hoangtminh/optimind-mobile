import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Theme } from "@/constants/Theme";

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
    marginBottom: 24,
  },
  brandName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    letterSpacing: -0.5,
    color: Theme.primary,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    color: Theme.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: Theme.textMuted,
    textAlign: "center",
  },
});

export default AuthHeader;
