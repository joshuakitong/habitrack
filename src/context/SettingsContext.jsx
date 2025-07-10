import { createContext, useContext } from "react";
import { useSettingsManager } from "../hooks/useSettingsManager";

const SettingsContext = createContext();
export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const settingsManager = useSettingsManager();
  return (
    <SettingsContext.Provider value={settingsManager}>
      {children}
    </SettingsContext.Provider>
  );
};