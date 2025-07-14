import { getAuth } from "firebase/auth";
import { defaultSettings } from "../data/defaultSettings";
import { fetchSettings as fetchFromFirestore, saveSettings as saveToFirestore } from "../firebase/firebaseService";

export async function getSettings() {
  const user = getAuth().currentUser;
  const localSettings = JSON.parse(localStorage.getItem("settings") || "{}");
  const localInitialized = !!localStorage.getItem("hasInitialized");

  if (!user) {
    const fallbackSettings = {
      ...defaultSettings,
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
      : { ...defaultSettings };

    await saveToFirestore(fallbackSettings);
    return fallbackSettings;
  }

  return {
    trackerStartDate: remoteSettings.trackerStartDate,
    isEditableInTracker: remoteSettings.isEditableInTracker ?? true,
    isColorCoded: remoteSettings.isColorCoded ?? true,
    isRowColored: remoteSettings.isRowColored ?? true,
    viewMode: remoteSettings.viewMode ?? "weekly",
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

export const getViewMode = async () => {
  const user = getAuth().currentUser;
  const uid = user.currentUser?.uid;
  if (!uid) return "weekly";

  const ref = doc(db, "users", uid, "settings", "main");
  const snapshot = await getDoc(ref);
  return snapshot.exists() && snapshot.data().viewMode
    ? snapshot.data().viewMode
    : "weekly";
};

export const setViewMode = async (mode) => {
  const user = getAuth().currentUser;
  const uid = user.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid, "settings", "main");
  await setDoc(ref, { viewMode: mode }, { merge: true });
};