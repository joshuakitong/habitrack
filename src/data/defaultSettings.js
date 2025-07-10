const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

export const defaultSettings = {
  trackerStartDate: thirtyDaysAgo.toISOString().split("T")[0],
  isEditableInTracker: true,
  isColorCoded: true,
  isRowColored: true,
};