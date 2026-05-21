import {
  Roboto_400Regular,
  Roboto_700Bold,
  Roboto_900Black,
  useFonts,
} from "@expo-google-fonts/roboto";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@tamagui/native/setup-teleport";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { PortalProvider } from "react-native-teleport";
import { PortalHost, TamaguiProvider } from "tamagui";
import "../global.css";

import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { StudySessionProvider } from "@/contexts/StudySessionContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { UserProvider } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/tamagui.config";
import { KeyboardProvider } from "react-native-keyboard-controller";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(main)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_900Black,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <KeyboardProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        <PortalProvider>
          <AuthProvider>
            <RootLayoutNav />
            <PortalHost name="" />
          </AuthProvider>
        </PortalProvider>
      </TamaguiProvider>
    </KeyboardProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for the authentication state to load.
    if (isLoading) return;

    // Check if the user is in the authentication-related routes.
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      router.replace("/study");
    }
  }, [user, segments, isLoading, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <ProjectProvider>
          <TaskProvider>
            <StudySessionProvider>
              <ChatProvider>
                <Stack>
                  <Stack.Screen
                    name="(main)/(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </ChatProvider>
            </StudySessionProvider>
          </TaskProvider>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
