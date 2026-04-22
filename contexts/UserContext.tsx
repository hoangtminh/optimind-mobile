import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { userActions, UserProfile } from "../api/user-actions";
import { useAuth } from "../hooks/useAuth";

interface UserContextType {
	user: UserProfile | null;
	isLoading: boolean;
	refreshProfile: () => Promise<void>;
	updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined,
);

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { user: authUser } = useAuth();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadProfile = async () => {
		if (authUser?.id) {
			setIsLoading(true);
			const response = await userActions.getUserProfile(authUser.id);
			if (response.success && response.data) {
				setProfile(response.data);
			}
			setIsLoading(false);
		} else {
			setProfile(null);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadProfile();
	}, [authUser]);

	const updateProfile = async (data: Partial<UserProfile>) => {
		if (authUser?.id) {
			const response = await userActions.updateUserProfile(
				authUser.id,
				data,
			);
			if (response.success && response.data) {
				setProfile(response.data);
			}
		}
	};

	return (
		<UserContext.Provider
			value={{
				user: profile,
				isLoading,
				refreshProfile: loadProfile,
				updateProfile,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
