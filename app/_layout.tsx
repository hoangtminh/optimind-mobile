import {
  Roboto_400Regular,
  Roboto_700Bold,
  Roboto_900Black,
  useFonts,
} from "@expo-google-fonts/roboto";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "@tamagui/native/setup-teleport";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import "react-native-reanimated";
import { PortalProvider } from "react-native-teleport";
import { PortalHost, TamaguiProvider } from "tamagui";
import "../global.css";

import { Theme } from "@/constants/Theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { StudySessionProvider } from "@/contexts/StudySessionContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { UserProvider } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/tamagui.config";
import { KeyboardProvider } from "react-native-keyboard-controller";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(main)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { ToastContainer } from "@/components/common/Toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_900Black,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2D185C",
          gap: 20,
        }}
      >
        <Image
          source={require("../assets/images/icon.png")}
          style={{ width: 100, height: 100, borderRadius: 24 }}
        />
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  return (
    <AppProviders>
      <RootLayoutNav />
      <ToastContainer />
    </AppProviders>
  );
}

function NavigationThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const CustomNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Theme.background,
      card: Theme.surface,
      text: Theme.text,
      border: Theme.border,
      notification: Theme.accentRedText,
    },
  };

  return (
    <ThemeProvider value={CustomNavigationTheme}>{children}</ThemeProvider>
  );
}

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <TamaguiProvider config={config} defaultTheme="light">
          <PortalProvider>
            <AuthProvider>
              <SettingsProvider>
                <NavigationThemeProvider>
                  <UserProvider>
                    <ProjectProvider>
                      <TaskProvider>
                        <StudySessionProvider>
                          <ChatProvider>
                            {children}
                            <PortalHost name="" />
                          </ChatProvider>
                        </StudySessionProvider>
                      </TaskProvider>
                    </ProjectProvider>
                  </UserProvider>
                </NavigationThemeProvider>
              </SettingsProvider>
            </AuthProvider>
          </PortalProvider>
        </TamaguiProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for the authentication state to load.
    if (isLoading) return;

    // Check if the user is in the authentication-related routes.
    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "auth";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      router.replace("/study");
    }
  }, [user, segments, isLoading, router]);

  return (
    <Stack>
      <Stack.Screen name="(main)/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
