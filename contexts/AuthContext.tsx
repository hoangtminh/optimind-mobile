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

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	signIn: (
		email: string,
		password: string,
		remember: boolean,
	) => Promise<void>;
	signUp: (
		username: string,
		email: string,
		password: string,
	) => Promise<void>;
	signOut: () => Promise<void>;
	signInWithGoogle: (code: string) => Promise<void>;
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
			const token = await getToken("accessToken"); // Dùng helper ở đây
			if (token) {
				setAuthToken(token);
				const response = await authActions.getMe();
				if (response.success && response.data) {
					setUser(response.data);
					console.log("Load user", response.data);
				} else {
					setAuthToken(null);
					setUser(null);
					await SecureStore.deleteItemAsync("accessToken");
					await SecureStore.deleteItemAsync("refreshToken");
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

	const signIn = async (
		email: string,
		password: string,
		remember: boolean,
	) => {
		const response = await authActions.login(email, password, true);
		if (!response.success || !response.data) {
			throw new Error(response.error || "Failed to sign in");
		}

		const { accessToken, refreshToken } = response.data;

		if (Platform.OS === "web") {
			localStorage.setItem("accessToken", accessToken);
			if (remember) localStorage.setItem("refreshToken", refreshToken);
		} else {
			await SecureStore.setItemAsync("accessToken", accessToken);
			if (remember)
				await SecureStore.setItemAsync("refreshToken", refreshToken);
		}

		setAuthToken(accessToken);
		const meResponse = await authActions.getMe();
		if (meResponse.success && meResponse.data) {
			setUser(meResponse.data);
		}
	};

	const signUp = async (
		username: string,
		email: string,
		password: string,
	) => {
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

	const signInWithGoogle = async (code: string) => {
		const response = await authActions.googleLogin({ code });
		if (!response.success || !response.data) {
			throw new Error(response.error || "Google sign in failed");
		}

		const { accessToken, refreshToken } = response.data.token;
		await SecureStore.setItemAsync("accessToken", accessToken);
		await SecureStore.setItemAsync("refreshToken", refreshToken);
		setAuthToken(accessToken);

		const meResponse = await authActions.getMe();
		if (meResponse.success && meResponse.data) {
			setUser(meResponse.data);
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
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
