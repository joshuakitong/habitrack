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