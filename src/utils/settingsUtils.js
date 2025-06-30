import { formatDate } from "../utils/dateUtils";

export function getDefaultTrackerStartDate() {
  const today = new Date();
  today.setDate(today.getDate() - 30);
  return formatDate(today);
};