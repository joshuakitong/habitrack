import { formatDate, getDayLabel, getActiveDaysForDate } from "../utils/dateUtils";

export const getStreaks = (habit) => {
  if (!habit || typeof habit !== "object") return { current: 0, longest: 0, total: 0 };

  const checkedDates = habit.checkedDates || {};

  // Step 1: Get all checked dates, sorted
  const checked = Object.keys(checkedDates)
    .filter((dateStr) => checkedDates[dateStr])
    .map((dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    })
    .sort((a, b) => a - b);

  if (checked.length === 0) return { current: 0, longest: 0, total: 0 };

  const checkedSet = new Set(checked.map((d) => formatDate(d)));

  // Step 2: Count total active days that were checked
  const total = checked.filter((date) => {
    const activeDays = getActiveDaysForDate(habit, date);
    return activeDays.includes(getDayLabel(date));
  }).length;

  const start = new Date(checked[0]);
  const end = new Date(checked[checked.length - 1]);

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

  // Step 4: Check last 2 recent checkable days
  const recentCheckableDays = [];
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (recentCheckableDays.length < 2) {
    const dayLabel = getDayLabel(cursor);
    const dateStr = formatDate(cursor);
    const activeDays = getActiveDaysForDate(habit, cursor);

    if (activeDays.includes(dayLabel)) {
      recentCheckableDays.push({
        dateStr,
        isChecked: checkedSet.has(dateStr),
      });
    }

    if (checked.length > 0 && cursor < checked[0]) break;

    cursor.setDate(cursor.getDate() - 1);
  }

  if (
    recentCheckableDays.length === 2 &&
    !recentCheckableDays[0].isChecked &&
    !recentCheckableDays[1].isChecked
  ) {
    return { current: 0, longest, total };
  }

  // Step 5: Find current streak (go backward from end)
  let current = 0;
  for (let date = new Date(end); date >= start; date.setDate(date.getDate() - 1)) {
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