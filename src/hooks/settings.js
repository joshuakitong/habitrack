import { getDefaultTrackerStartDate } from "../utils/settingsUtils";

const SETTINGS_KEY = "habitTrackerSettings";

export function getSettings() {
  const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  return {
    trackerStartDate: stored.trackerStartDate ?? getDefaultTrackerStartDate(),
    isEditableInTracker: stored.isEditableInTracker ?? true,
  };
}

export function saveSettings(newSettings) {
  const current = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  const updated = { ...current, ...newSettings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

  return { success: true };
}