import { useEffect, useState } from "react";
import { getSettings, saveSettings as saveSettingsToSource } from "./useSettings";
import { useAuth } from "../context/AuthContext";

export function useSettingsManager() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      setIsSettingsLoading(true);
      const data = await getSettings();
      setSettings(data);
      setIsSettingsLoading(false);
    };

    loadSettings();
  }, [user]);

  const saveSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettingsToSource(newSettings);
  };

  return { settings, saveSettings, isSettingsLoading };
}