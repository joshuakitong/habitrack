import { getDefaultTrackerStartDate } from "../utils/settingsUtils";

const settingsKey = "habitTrackerSettings";

export function getSettings() {
  const stored = JSON.parse(localStorage.getItem(settingsKey)) || {};
  return {
    trackerStartDate: stored.trackerStartDate ?? getDefaultTrackerStartDate(),
    isEditableInTracker: stored.isEditableInTracker ?? true,
    isColorCoded: stored.isColorCoded ?? true,
  };
}

export function saveSettings(newSettings) {
  const current = JSON.parse(localStorage.getItem(settingsKey)) || {};
  const updated = { ...current, ...newSettings };
  localStorage.setItem(settingsKey, JSON.stringify(updated));

  return { success: true };
}