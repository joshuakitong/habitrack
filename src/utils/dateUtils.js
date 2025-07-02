import { startOfWeek, format, differenceInCalendarWeeks, addWeeks } from "date-fns";
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

export const buildSelectableWeeks = () => {
  const today = new Date();
  const todayStart = startOfWeek(today, { weekStartsOn: 0 });

  const { trackerStartDate } = getSettings();
  const earliestDate = startOfWeek(new Date(trackerStartDate), { weekStartsOn: 0 });
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