import { startOfWeek, format, differenceInCalendarWeeks, addWeeks, parseISO } from "date-fns";
import { getSettings } from "../hooks/useSettings";

export function getWeekDates(offset = 0) {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay(); // 0 = Sun, 1 = Mon, ...
  startOfWeek.setDate(startOfWeek.getDate() - day + offset * 7);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    week.push(d);
  }
  return week;
}

export const buildSelectableWeeks = ({ trackerStartDate }) => {
  const today = new Date();
  const todayStart = startOfWeek(today, { weekStartsOn: 0 });

  const earliestDate = startOfWeek(trackerStartDate ? parseISO(trackerStartDate) : new Date(), { weekStartsOn: 0 });
  const latestDate = todayStart;

  const selectableWeeks = [];

  for (
    let date = new Date(earliestDate);
    date <= latestDate;
    date = addWeeks(date, 1)
  ) {
    const weekStart = new Date(date);
    const weekEnd = addWeeks(weekStart, 1);
    weekEnd.setDate(weekEnd.getDate() - 1);

    const offset = differenceInCalendarWeeks(weekStart, todayStart, {
      weekStartsOn: 0,
    });
    const label = `${format(weekStart, "MMM d")} – ${format(
      weekEnd,
      "d, yyyy"
    )}`;

    selectableWeeks.push({ label, offset });
  }

  return selectableWeeks.reverse(); 
};

export const sortedDays = (unsortedDays) =>
  [...unsortedDays].sort(
    (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
);

export function getActiveDaysForDate(habit, date) {
  if (!habit || !date || isNaN(date.getTime())) return [];

  const currentWeek = startOfWeek(date, { weekStartsOn: 0 });

  if (!habit.dayOverrides || Object.keys(habit.dayOverrides).length === 0) {
    return habit.days || [];
  }

  const overrides = Object.keys(habit.dayOverrides)
    .map((d) => ({ week: parseISO(d), days: habit.dayOverrides[d] }))
    .filter(({ week }) => week <= currentWeek)
    .sort((a, b) => b.week - a.week);

  if (overrides.length > 0) {
    return overrides[0].days;
  }

  return habit.days || [];
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDayLabel(date) {
  return daysOfWeek[date.getDay()];
}

export const daysOfWeek = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];