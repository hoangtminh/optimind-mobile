import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Theme } from "@/constants/Theme";

interface AuthPrimaryButtonProps extends Omit<TouchableOpacityProps, "style"> {
  label: string;
  loading?: boolean;
  trailingIcon?: React.ReactNode;
}

export function AuthPrimaryButton({
  label,
  loading,
  trailingIcon,
  disabled,
  ...rest
}: AuthPrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.primaryBtn, disabled && styles.disabled]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={Theme.primaryText} />
      ) : (
        <>
          <Text style={styles.primaryBtnText}>{label}</Text>
          {trailingIcon && <View style={styles.trailingIcon}>{trailingIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

interface AuthSocialButtonProps extends Omit<TouchableOpacityProps, "style"> {
  label: string;
  icon: React.ReactNode;
}

export function AuthSocialButton({ label, icon, ...rest }: AuthSocialButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.socialBtn} {...rest}>
      {icon}
      <Text style={styles.socialBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    height: 48,
    borderRadius: 6, // Crisp minimalist corner radius
    backgroundColor: Theme.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.55,
  },
  primaryBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: Theme.primaryText,
  },
  trailingIcon: {
    marginLeft: 8,
  },
  socialBtn: {
    height: 48,
    borderRadius: 6, // Crisp minimalist corner radius
    backgroundColor: Theme.surface,
    borderWidth: 1,
    borderColor: Theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: Theme.text,
  },
});
