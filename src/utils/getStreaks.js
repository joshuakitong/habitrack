import { formatDate, getDayLabel, getActiveDaysForDate } from "../utils/dateUtils";
import { parseISO } from "date-fns";

export const getStreaks = (habit, trackerStartDate) => {
  if (!habit || typeof habit !== "object") return { current: 0, longest: 0, total: 0 };

  const startLimit = parseISO(trackerStartDate);
  const checkedDates = habit.checkedDates || {};

  // Step 1: Get all checked dates after trackerStartDate, sorted
  const checked = Object.keys(checkedDates)
    .filter((dateStr) => {
      const date = new Date(dateStr);
      return checkedDates[dateStr] && date >= startLimit;
    })
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a - b);

  if (checked.length === 0) return { current: 0, longest: 0, total: 0 };

  const checkedSet = new Set(checked.map((d) => formatDate(d)));

  // Step 2: Count total active days that were checked
  const total = checked.filter((date) => {
    const activeDays = getActiveDaysForDate(habit, date);
    return activeDays.includes(getDayLabel(date));
  }).length;

  const start = new Date(startLimit);
  const end = new Date();

  // Step 3: Find longest streak
  let longest = 0;
  let streak = 0;

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayLabel = getDayLabel(date);
    const dateStr = formatDate(date);
    const activeDays = getActiveDaysForDate(habit, date);

    if (activeDays.includes(dayLabel)) {
      if (checkedSet.has(dateStr)) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 0;
      }
    }
  }

  // Step 4: Check last 2 recent checkable days (from today backward)
  const recentCheckableDays = [];
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (recentCheckableDays.length < 2) {
    if (cursor < startLimit) break;

    const dayLabel = getDayLabel(cursor);
    const dateStr = formatDate(cursor);
    const activeDays = getActiveDaysForDate(habit, cursor);

    if (activeDays.includes(dayLabel)) {
      recentCheckableDays.push({
        dateStr,
        isChecked: checkedSet.has(dateStr),
        date: new Date(cursor),
      });
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  if (recentCheckableDays.length === 2) {
    const [todayEntry, prevEntry] = recentCheckableDays;
    if (!todayEntry.isChecked && !prevEntry.isChecked) {
      return { current: 0, longest, total };
    }

    if (!todayEntry.isChecked && prevEntry.isChecked) {
      cursor = new Date(prevEntry.date);
    } else {
      cursor = new Date();
    }
  } else {
    cursor = new Date();
  }

  let current = 0;

  for (let date = new Date(cursor); date >= start; date.setDate(date.getDate() - 1)) {
    const dayLabel = getDayLabel(date);
    const dateStr = formatDate(date);
    const activeDays = getActiveDaysForDate(habit, date);

    if (activeDays.includes(dayLabel)) {
      if (checkedSet.has(dateStr)) {
        current++;
      } else {
        break;
      }
    }
  }

  return { current, longest, total };
};