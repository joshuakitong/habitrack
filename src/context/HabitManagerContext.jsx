import { createContext, useContext } from "react";
import { useHabitManager } from "../hooks/useHabitManager";

const HabitManagerContext = createContext(null);

export const HabitManagerProvider = ({ children }) => {
  const habitManager = useHabitManager();
  return (
    <HabitManagerContext.Provider value={habitManager}>
      {children}
    </HabitManagerContext.Provider>
  );
};

export const useHabitManagerContext = () => useContext(HabitManagerContext);