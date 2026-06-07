import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { code, state } = useLocalSearchParams<{ code?: string; state?: string }>();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleCallback() {
      if (!code) {
        setError("No authorization code found.");
        return;
      }

      // If there is a state parameter that is a mobile deep link, redirect the user back to the app!
      if (state && (state.startsWith("app://") || state.startsWith("exp://"))) {
        // Build the redirect deep link
        const delimiter = state.includes("?") ? "&" : "?";
        const redirectUrl = `${state}${delimiter}code=${code}`;
        console.log("Redirecting back to mobile app:", redirectUrl);
        if (Platform.OS === "web") {
          window.location.href = redirectUrl;
        } else {
          Linking.openURL(redirectUrl);
        }
        return;
      }

      // Otherwise, we are on the web client itself. Process the login here.
      try {
        await signInWithGoogle(code);
        if (active) {
          router.replace("/(main)/(tabs)/study");
        }
      } catch (err: any) {
        console.error("OAuth error:", err);
        if (active) {
          setError(err.message || "Failed to log in with Google.");
          setTimeout(() => {
            router.replace("/(auth)/sign-in");
          }, 3000);
        }
      }
    }

    handleCallback();

    return () => {
      active = false;
    };
  }, [code, state]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {error ? (
          <>
            <Text style={styles.errorText}>Authentication Error</Text>
            <Text style={styles.subtitleText}>{error}</Text>
            <Text style={styles.redirectText}>Redirecting back to Sign In...</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#6750a4" />
            <Text style={styles.titleText}>Signing you in</Text>
            <Text style={styles.subtitleText}>
              {state && (state.startsWith("app://") || state.startsWith("exp://"))
                ? "Connecting back to your mobile app..."
                : "Please wait while we complete the Google authentication process..."}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 24,
    alignItems: "center",
    maxWidth: 400,
  },
  titleText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#1d1b20",
    marginTop: 24,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#b3261e",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#49454f",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  redirectText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#6750a4",
    marginTop: 24,
    textAlign: "center",
  },
});
