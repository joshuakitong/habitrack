import { getAuth } from "firebase/auth";
import { defaultSettings } from "../data/defaultSettings";
import { fetchSettings as fetchFromFirestore, saveSettings as saveToFirestore } from "../firebase/firebaseService";
import { getDefaultTrackerStartDate } from "../utils/settingsUtils";

export async function getSettings() {
  const user = getAuth().currentUser;
  const localSettings = JSON.parse(localStorage.getItem("settings") || "{}");
  const localInitialized = !!localStorage.getItem("hasInitialized");

  if (!user) {
    const fallbackSettings = {
      ...defaultSettings,
      trackerStartDate: getDefaultTrackerStartDate(),
      ...localSettings,
    };

    if (!localInitialized) {
      localStorage.setItem("settings", JSON.stringify(fallbackSettings));
      localStorage.setItem("hasInitialized", "true");
    }

    return fallbackSettings;
  }

  const remoteSettings = await fetchFromFirestore();
  const hasRemoteSettings = !!remoteSettings && Object.keys(remoteSettings).length > 0;

  if (!hasRemoteSettings) {
    const localHasBeenInitialized = !!localStorage.getItem("hasInitialized");

    const fallbackSettings = localHasBeenInitialized && Object.keys(localSettings).length
      ? { ...defaultSettings, ...localSettings } 
      : { ...defaultSettings, trackerStartDate: getDefaultTrackerStartDate() };

    await saveToFirestore(fallbackSettings);
    return fallbackSettings;
  }

  return {
    trackerStartDate: remoteSettings.trackerStartDate ?? getDefaultTrackerStartDate(),
    isEditableInTracker: remoteSettings.isEditableInTracker ?? true,
    isColorCoded: remoteSettings.isColorCoded ?? true,
    isRowColored: remoteSettings.isRowColored ?? true,
  };
}

export async function saveSettings(newSettings) {
  const user = getAuth().currentUser;
  if (!user) {
    const current = JSON.parse(localStorage.getItem("settings")) || {};
    const updated = { ...current, ...newSettings };
    localStorage.setItem("settings", JSON.stringify(updated));
    return { success: true };
  }

  try {
    await saveToFirestore(newSettings);
    return { success: true };
  } catch (err) {
    console.error("Error saving settings:", err);
    return { success: false };
  }
}