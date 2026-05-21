import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const T = {
  primary: "#4f378a",
  outline: "#7a7582",
  outlineVariant: "#cbc4d2",
  onSurface: "#1d1b20",
  onSurfaceVariant: "#494551",
  surface: "#fdf7ff",
  surfaceContainerHighest: "#e6e0e9",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OR divider
// ─────────────────────────────────────────────────────────────────────────────
interface AuthDividerProps {
  label?: string;
}
export function AuthDivider({ label = "Or continue with" }: AuthDividerProps) {
  return (
    <View style={dividerStyles.container}>
      <View style={dividerStyles.line} />
      <Text style={dividerStyles.text}>{label}</Text>
      <View style={dividerStyles.line} />
    </View>
  );
}

const dividerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: { flex: 1, height: 1, backgroundColor: T.outlineVariant },
  text: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    letterSpacing: 0.25,
    color: T.outline,
    marginHorizontal: 12,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox row (terms / remember me)
// ─────────────────────────────────────────────────────────────────────────────
interface AuthCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
export function AuthCheckbox({ checked, onToggle, children }: AuthCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={checkboxStyles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[checkboxStyles.box, checked && checkboxStyles.boxChecked]}>
        {checked && (
          <MaterialCommunityIcons name="check" size={13} color="#fff" />
        )}
      </View>
      <View style={checkboxStyles.content}>{children}</View>
    </TouchableOpacity>
  );
}

const checkboxStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: T.outlineVariant,
    backgroundColor: T.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  content: { flex: 1 },
});
