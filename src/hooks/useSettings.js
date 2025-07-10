import { getDefaultTrackerStartDate } from "../utils/settingsUtils";
import { fetchSettings, saveSettings as saveToFirebase } from "../firebase/firebaseService";

export async function getSettings() {
  try {
    const data = await fetchSettings();
    return {
      trackerStartDate: data?.trackerStartDate ?? getDefaultTrackerStartDate(),
      isEditableInTracker: data?.isEditableInTracker ?? true,
      isColorCoded: data?.isColorCoded ?? true,
      isRowColored: data?.isRowColored ?? true,
    };
  } catch (err) {
    console.error("Error fetching settings:", err);
    return {
      trackerStartDate: getDefaultTrackerStartDate(),
      isEditableInTracker: true,
      isColorCoded: true,
      isRowColored: true,
    };
  }
}

export async function saveSettings(newSettings) {
  try {
    await saveToFirebase(newSettings);
    return { success: true };
  } catch (err) {
    console.error("Error saving settings:", err);
    return { success: false };
  }
}