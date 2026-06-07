import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Theme } from "@/constants/Theme";

interface AuthInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
}

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
    outputRange: [16, 6],
  });
  const labelFontSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 11],
  });
  const labelColor = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.textMuted, isFocused ? Theme.primary : Theme.textMuted],
  });

  const borderColor = error
    ? Theme.accentRedText
    : isFocused
    ? Theme.primary
    : Theme.border;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderWidth: isFocused ? 1.2 : 1,
          },
        ]}
      >
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
          selectionColor={Theme.primary}
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
    height: 54,
    borderRadius: 6, // Crisp minimalist corner radius
    backgroundColor: Theme.surface,
    paddingHorizontal: 14,
    justifyContent: "flex-end",
  },
  floatingLabel: {
    position: "absolute",
    left: 14,
    fontFamily: "Manrope_400Regular",
    zIndex: 1,
  },
  input: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: Theme.text,
    paddingBottom: 6,
    paddingTop: 18,
    includeFontPadding: false,
  },
  errorText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    color: Theme.accentRedText,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AuthInput;
