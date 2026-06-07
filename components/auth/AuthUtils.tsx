import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Theme } from "@/constants/Theme";

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
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: Theme.border },
  text: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: Theme.textMuted,
    marginHorizontal: 12,
  },
});

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
          <MaterialCommunityIcons name="check" size={12} color={Theme.primaryText} />
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
    width: 18,
    height: 18,
    borderRadius: 4, // Crisp checkbox radius
    borderWidth: 1.5,
    borderColor: Theme.border,
    backgroundColor: Theme.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
  content: { flex: 1 },
});
