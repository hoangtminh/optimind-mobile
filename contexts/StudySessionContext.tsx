import { studyActions } from "@/api/study-session-action";
import { StudySession } from "@/lib/types/study";
import * as SecureStore from "expo-secure-store";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { Platform } from "react-native";
import { BASE_URL } from "../constants/ApiConfig";
import { useAuth } from "../hooks/useAuth";

interface StudySessionContextType {
  studySessions: StudySession[];
  isLoading: boolean;
  addSession: (session: Partial<StudySession>) => Promise<void>;
  updateSession: (id: string, session: Partial<StudySession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  saveDetailedSession: (sessionData: any) => Promise<boolean>;
}

export const StudySessionContext = createContext<
  StudySessionContextType | undefined
>(undefined);

export const useStudySessions = () => {
  const context = useContext(StudySessionContext);
  if (context === undefined) {
    throw new Error(
      "useStudySessions must be used within a StudySessionProvider",
    );
  }
  return context;
};

export const StudySessionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) loadSessions();
    else setStudySessions([]);
  }, [user]);

  const loadSessions = async () => {
    setIsLoading(true);
    const response = await studyActions.getSessions();
    if (response.success && response.data) setStudySessions(response.data);
    setIsLoading(false);
  };

  const addSession = async (session: Partial<StudySession>) => {
    const response = await studyActions.createSession(session);
    if (response.success && response.data)
      setStudySessions((prev) => [...prev, response.data!]);
  };

  const updateSession = async (id: string, session: Partial<StudySession>) => {
    const response = await studyActions.updateSession(id, session);
    if (response.success && response.data) {
      setStudySessions((prev) =>
        prev.map((s) => (s.id === id ? response.data! : s)),
      );
    }
  };

  const deleteSession = async (id: string) => {
    const response = await studyActions.deleteSession(id);
    if (response.success)
      setStudySessions((prev) => prev.filter((s) => s.id !== id));
  };

  const saveDetailedSession = async (sessionData: any) => {
    try {
      let token = null;
      if (Platform.OS === "web") {
        token = localStorage.getItem("accessToken");
      } else {
        token = await SecureStore.getItemAsync("accessToken");
      }

      const response = await fetch(`${BASE_URL}/api/study-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        await loadSessions();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to save detailed session", error);
      return false;
    }
  };

  return (
    <StudySessionContext.Provider
      value={{
        studySessions,
        isLoading,
        addSession,
        updateSession,
        deleteSession,
        saveDetailedSession,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
};
