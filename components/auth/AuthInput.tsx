import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  primary: "#4f378a",
  outline: "#7a7582",
  outlineVariant: "#cbc4d2",
  surface: "#fdf7ff",
  onSurface: "#1d1b20",
  onSurfaceVariant: "#494551",
  surfaceContainerHigh: "#ece6ee",
  error: "#ba1a1a",
} as const;

interface AuthInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  /** Show error border + message */
  error?: string;
}

/**
 * Floating-label text input following the StudyFlow / Focused Academic design.
 * The label shrinks and rises when the field is focused or has content.
 */
function AuthInput({ label, error, value, onChangeText, ...rest }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelTop = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [17, 6],
  });
  const labelFontSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelColor = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [T.outline, isFocused ? T.primary : T.outline],
  });

  const borderColor = error
    ? T.error
    : isFocused
    ? T.primary
    : T.outlineVariant;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        {/* Floating label */}
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
            },
          ]}
        >
          {label}
        </Animated.Text>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="transparent"
          selectionColor={T.primary}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  inputContainer: {
    height: 58,
    borderRadius: 12,
    backgroundColor: T.surface,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    fontFamily: "Manrope_400Regular",
    letterSpacing: 0.15,
    zIndex: 1,
  },
  input: {
    fontFamily: "Manrope_400Regular",
    fontSize: 16,
    lineHeight: 22,
    color: "#1d1b20",
    paddingBottom: 8,
    paddingTop: 20,
    includeFontPadding: false,
  },
  errorText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    color: "#ba1a1a",
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AuthInput;
