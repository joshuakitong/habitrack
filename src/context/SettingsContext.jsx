import { createContext, useContext, useState, useEffect } from "react";
import { getSettings, saveSettings as saveToStorage } from "../hooks/useSettings";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    setIsLoading(true);
    const data = await getSettings();
    setSettings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    await saveToStorage(newSettings);
    await loadSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);