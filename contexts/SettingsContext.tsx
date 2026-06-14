import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../hooks/useAuth";
import { apiGet, apiPut } from "../api/client";
import { setTheme } from "../constants/Theme";

export interface UserSettings {
  darkMode: boolean;
  mode: "pomodoro" | "countdown";
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  totalCycles: number;
  vibrate: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  soundName: string;
  autoBreak: boolean;
}

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const defaultSettings: UserSettings = {
  darkMode: false,
  mode: "pomodoro",
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  totalCycles: 4,
  vibrate: true,
  soundEnabled: true,
  soundVolume: 80,
  soundName: "classic",
  autoBreak: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load cached settings on startup
  useEffect(() => {
    async function loadCachedSettings() {
      try {
        const cached = Platform.OS === "web"
          ? localStorage.getItem("userSettings")
          : await SecureStore.getItemAsync("userSettings");
        if (cached) {
          const parsed = JSON.parse(cached);
          setSettings(parsed);
          setTheme(parsed.darkMode ? "dark" : "light");
        }
      } catch (err) {
        console.error("Failed to load cached settings", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCachedSettings();
  }, []);

  // Fetch settings from server when user logs in
  useEffect(() => {
    if (!user) {
      setSettings(defaultSettings);
      setTheme("light");
      return;
    }

    async function fetchServerSettings() {
      try {
        const response = await apiGet<UserSettings>("/api/settings");
        if (response.success && response.data) {
          setSettings(response.data);
          setTheme(response.data.darkMode ? "dark" : "light");
          
          // Cache locally
          if (Platform.OS === "web") {
            localStorage.setItem("userSettings", JSON.stringify(response.data));
          } else {
            await SecureStore.setItemAsync("userSettings", JSON.stringify(response.data));
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings from server", err);
      }
    }
    fetchServerSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    let modeAdjustedSettings = { ...newSettings };
    if (newSettings.mode === "countdown") {
      modeAdjustedSettings.cyclesBeforeLongBreak = 1;
      modeAdjustedSettings.totalCycles = 1;
    }
    const updated = { ...settings, ...modeAdjustedSettings };
    setSettings(updated);
    setTheme(updated.darkMode ? "dark" : "light");

    // Cache locally
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("userSettings", JSON.stringify(updated));
      } else {
        await SecureStore.setItemAsync("userSettings", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Failed to cache settings", err);
    }

    // Sync to server if user is logged in
    if (user) {
      try {
        await apiPut("/api/settings", updated);
      } catch (err) {
        console.error("Failed to sync settings to server", err);
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
