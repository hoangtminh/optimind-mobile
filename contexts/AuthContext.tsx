import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { authActions, User } from "../api/auth-actions";
import { getFreshAccessToken, setAuthToken, setOnUnauthorized } from "../api/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: (code: string, redirectUri?: string) => Promise<void>;
  startGoogleLogin: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  };

  const loadUser = useCallback(async () => {
    try {
      const token = await getFreshAccessToken();
      if (token) {
        const response = await authActions.getMe();
        if (response.success && response.data) {
          setUser(response.data);
          return;
        }
      }
      setUser(null);
    } catch (error) {
      console.error("Failed to load user session", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    setOnUnauthorized(async () => {
      setUser(null);
      setAuthToken(null);
      if (Platform.OS === "web") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    });
  }, [loadUser]);

  const signIn = async (email: string, password: string, remember: boolean) => {
    const response = await authActions.login(email, password, remember);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to sign in");
    }

    const { accessToken, refreshToken } = response.data;

    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", accessToken);
      if (remember && refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
    } else {
      await SecureStore.setItemAsync("accessToken", accessToken);
      if (remember && refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      } else {
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }

    setAuthToken(accessToken);
    const meResponse = await authActions.getMe();
    if (meResponse.success && meResponse.data) {
      setUser(meResponse.data);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    const response = await authActions.register({
      username,
      email,
      password,
    });
    if (!response.success) {
      throw new Error(response.error || "Failed to sign up");
    }
  };

  const signOut = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await authActions.logout({ refreshToken });
      }
    } catch (error) {
      console.error("Failed to call logout API", error);
    } finally {
      setUser(null);
      setAuthToken(null);
      if (Platform.OS === "web") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }
  };

  const signInWithGoogle = async (code: string, redirectUri?: string) => {
    if (!code) return;
    const response = await authActions.googleLogin({ code, redirectUri });
    if (!response.success || !response.data) {
      throw new Error(response.error || "Google sign in failed");
    }

    const tokenData = response.data.token || response.data;
    if (!tokenData || !tokenData.accessToken) {
      throw new Error("No access token returned from Google login");
    }

    const { accessToken, refreshToken } = tokenData;
    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
    } else {
      await SecureStore.setItemAsync("accessToken", accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      } else {
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }
    setAuthToken(accessToken);

    const meResponse = await authActions.getMe();
    if (!meResponse.success || !meResponse.data) {
      throw new Error(
        meResponse.error || "Failed to load user profile after Google sign in",
      );
    }
    setUser(meResponse.data);
  };

  const startGoogleLogin = async () => {
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri =
      Platform.OS === "web"
        ? window.location.origin + "/sign-in"
        : process.env.EXPO_PUBLIC_API_URL + "/api/auth/callback";

    console.log("====== GOOGLE AUTH CONFIG ======");
    console.log("Client ID:", clientId);
    console.log("Redirect URI:", redirectUri);
    console.log("================================");

    const scope = "openid email profile";
    const responseType = "code";
    const prompt = "select_account";

    // Build the deep link redirect URL that the web app should redirect back to if running on mobile
    const state = Platform.OS === "web" ? "" : Linking.createURL("/sign-in");

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=${responseType}&scope=${encodeURIComponent(
      scope,
    )}&prompt=${prompt}&state=${encodeURIComponent(state)}`;

    if (Platform.OS === "web") {
      window.location.href = googleUrl;
    } else {
      // On mobile, use WebBrowser to open the URL and listen for the deep link redirect
      const result = await WebBrowser.openAuthSessionAsync(
        googleUrl,
        Linking.createURL("/sign-in"),
      );
      console.log("Google Auth Result:", result);
      if (result.type === "success" && result.url) {
        // Parse the code from the redirected URL
        const parsed = Linking.parse(result.url);
        const code = parsed.queryParams?.code;
        if (typeof code === "string") {
          console.log(code);
          await signInWithGoogle(code, redirectUri);
        } else {
          throw new Error("No authorization code returned from Google");
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        startGoogleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
