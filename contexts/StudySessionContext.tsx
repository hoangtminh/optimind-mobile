import { studyActions } from "@/api/study-session-action";
import { StudySession } from "@/lib/types/study";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";

interface StudySessionContextType {
  studySessions: StudySession[];
  isLoading: boolean;
  addSession: (session: Partial<StudySession>) => Promise<void>;
  updateSession: (id: string, session: Partial<StudySession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  saveDetailedSession: (sessionData: any) => Promise<boolean>;
  refreshSessions: () => Promise<void>;
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

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    const response = await studyActions.getSessions();
    if (response.success && response.data) setStudySessions(response.data);
    setIsLoading(false);
  }, []);

  const addSession = useCallback(async (session: Partial<StudySession>) => {
    const response = await studyActions.createSession(session);
    if (response.success && response.data)
      setStudySessions((prev) => [...prev, response.data!]);
  }, []);

  const updateSession = useCallback(
    async (id: string, session: Partial<StudySession>) => {
      const response = await studyActions.updateSession(id, session);
      if (response.success && response.data) {
        setStudySessions((prev) =>
          prev.map((s) => (s.id === id ? response.data! : s)),
        );
      }
    },
    [],
  );

  const deleteSession = useCallback(async (id: string) => {
    const response = await studyActions.deleteSession(id);
    if (response.success)
      setStudySessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const saveDetailedSession = useCallback(
    async (sessionData: any) => {
      try {
        const formattedRequest = {
          startTime: sessionData.startTime || new Date().toISOString(),
          endTime: sessionData.endTime || new Date().toISOString(),
          totalTime: Number(sessionData.totalTime) || 0,
          focusTime: Number(sessionData.focusTime) || 0,
          breakTime: Number(sessionData.breakTime) || 0,
          cycles: Number(sessionData.cycles) || 1,
          averageFocus: Number(sessionData.averageFocus) || 0.0,
          sessionType: sessionData.sessionType || "pomodoro",
          focusData: Array.isArray(sessionData.focusData)
            ? sessionData.focusData.map((d: any) => ({
                timestamp: d.timestamp || new Date().toISOString(),
                focusLevel:
                  Number(
                    d.focusLevel !== undefined ? d.focusLevel : d.focusPoint,
                  ) || 0.0,
              }))
            : [],
        };

        const response = await studyActions.createSession(formattedRequest);
        if (response.success) {
          await loadSessions();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to save detailed session", error);
        return false;
      }
    },
    [loadSessions],
  );

  const contextValue = useMemo(
    () => ({
      studySessions,
      isLoading,
      addSession,
      updateSession,
      deleteSession,
      saveDetailedSession,
      refreshSessions: loadSessions,
    }),
    [
      studySessions,
      isLoading,
      addSession,
      updateSession,
      deleteSession,
      saveDetailedSession,
      loadSessions,
    ],
  );

  return (
    <StudySessionContext.Provider value={contextValue}>
      {children}
    </StudySessionContext.Provider>
  );
};
