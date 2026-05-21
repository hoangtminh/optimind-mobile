import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  primary: "#4f378a",
  surfaceTint: "#6750a4",
  onPrimary: "#ffffff",
  surface: "#fdf7ff",
  onSurface: "#1d1b20",
  outlineVariant: "#cbc4d2",
  surfaceContainerHighest: "#e6e0e9",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Primary CTA button (pill-shaped, filled with primary)
// ─────────────────────────────────────────────────────────────────────────────
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
        <ActivityIndicator color={T.onPrimary} />
      ) : (
        <>
          <Text style={styles.primaryBtnText}>{label}</Text>
          {trailingIcon && <View style={styles.trailingIcon}>{trailingIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Social (outlined, pill-shaped)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  primaryBtn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: T.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: T.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  disabled: {
    opacity: 0.55,
  },
  primaryBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    letterSpacing: 0.1,
    color: T.onPrimary,
  },
  trailingIcon: {
    marginLeft: 8,
  },
  socialBtn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    letterSpacing: 0.1,
    color: T.onSurface,
  },
});
