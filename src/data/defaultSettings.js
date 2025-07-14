const today = new Date();
const fourteenDaysAgo = new Date(today);
fourteenDaysAgo.setDate(today.getDate() - 14);

export const defaultSettings = {
  trackerStartDate: fourteenDaysAgo.toISOString().split("T")[0],
  isEditableInTracker: true,
  isColorCoded: true,
  isRowColored: true,
  viewMode: "weekly",
};