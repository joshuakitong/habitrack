import { startOfWeek, format, differenceInCalendarWeeks, addWeeks } from "date-fns";

export function getCurrentWeekDates(endDate = new Date()) {
  const dayOfWeek = endDate.getDay();
  const start = new Date(endDate);
  start.setDate(endDate.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

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

export const formatWeekRange = (dates) => {
  if (!dates || dates.length === 0) return "";

  const start = dates[0];
  const end = dates[dates.length - 1];

  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  const startStr = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const endStr = end.toLocaleDateString("en-US", {
    month: sameMonth ? undefined : "long",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });

  const yearStr = sameYear ? start.getFullYear() : "";

  return `${startStr} – ${endStr}${sameYear ? `, ${yearStr}` : ""}`;
};

export const buildSelectableWeeks = (habits) => {
  const today = new Date();
  const todayStart = startOfWeek(today, { weekStartsOn: 0 });

  let earliestDate = null;
  let latestDate = null;

  habits.forEach((habit) => {
    const checkedDates = habit.checkedDates || {};
    Object.keys(checkedDates).forEach((dateStr) => {
      if (!checkedDates[dateStr]) return;

      const date = new Date(dateStr);
      if (!earliestDate || date < earliestDate) earliestDate = date;
      if (!latestDate || date > latestDate) latestDate = date;
    });
  });

  if (!earliestDate || !latestDate) {
    earliestDate = todayStart;
    latestDate = todayStart;
  }

  if (latestDate < todayStart) {
    latestDate = todayStart;
  }

  const start = startOfWeek(earliestDate, { weekStartsOn: 0 });
  const end = startOfWeek(latestDate, { weekStartsOn: 0 });

  const selectableWeeks = [];

  for (
    let date = new Date(start);
    date <= end;
    date = addWeeks(date, 1)
  ) {
    const weekStart = new Date(date);
    const weekEnd = addWeeks(weekStart, 1);
    weekEnd.setDate(weekEnd.getDate() - 1);

    const offset = differenceInCalendarWeeks(weekStart, todayStart, { weekStartsOn: 0 });
    const label = `${format(weekStart, "MMM d")} – ${format(weekEnd, "d, yyyy")}`;

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
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat"
];