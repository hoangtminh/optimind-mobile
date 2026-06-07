import * as SecureStore from "expo-secure-store";
import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Platform } from "react-native";
import { authActions, User } from "../api/auth-actions";
import { setAuthToken, setOnUnauthorized } from "../api/client";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

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
      let token = await getToken("accessToken");
      const refreshToken = await getToken("refreshToken");

      if (!token && refreshToken) {
        console.log("Access token missing but refresh token exists. Fetching new access token...");
        const refreshResponse = await authActions.refresh({ refreshToken });
        if (refreshResponse.success && refreshResponse.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          
          if (Platform.OS === "web") {
            localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
          } else {
            await SecureStore.setItemAsync("accessToken", newAccessToken);
            if (newRefreshToken) await SecureStore.setItemAsync("refreshToken", newRefreshToken);
          }
          token = newAccessToken;
        }
      }

      if (token) {
        setAuthToken(token);
        const response = await authActions.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setAuthToken(null);
          setUser(null);
          if (Platform.OS === "web") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          } else {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
          }
        }
      }
    } catch (error) {
      console.error("Failed to load user session", error);
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
    const response = await authActions.googleLogin({ code, redirectUri });
    if (!response.success || !response.data) {
      throw new Error(response.error || "Google sign in failed");
    }

    const { accessToken, refreshToken } = response.data.token;
    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
    setAuthToken(accessToken);

    const meResponse = await authActions.getMe();
    if (meResponse.success && meResponse.data) {
      setUser(meResponse.data);
    }
  };

  const startGoogleLogin = async () => {
    const clientId = "225511301288-ivp3vt9l4kc17dmflvraj18hjdmcrht3.apps.googleusercontent.com";
    const redirectUri = "http://localhost:3000/auth/callback";
    const scope = "openid email profile";
    const responseType = "code";
    const prompt = "select_account";

    // Build the deep link redirect URL that the web app should redirect back to if running on mobile
    const state = Platform.OS === "web" ? "" : Linking.createURL("/auth/callback");

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&prompt=${prompt}&state=${encodeURIComponent(state)}`;

    if (Platform.OS === "web") {
      window.location.href = googleUrl;
    } else {
      // On mobile, use WebBrowser to open the URL and listen for the deep link redirect
      const result = await WebBrowser.openAuthSessionAsync(
        googleUrl,
        Linking.createURL("/auth/callback")
      );

      if (result.type === "success" && result.url) {
        // Parse the code from the redirected URL
        const parsed = Linking.parse(result.url);
        const code = parsed.queryParams?.code;
        if (typeof code === "string") {
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
