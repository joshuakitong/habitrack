import { eachDayOfInterval, format, parseISO, subMonths } from "date-fns";

export function getAccumulatedData(habits, trackerStartDate) {
  const start = parseISO(trackerStartDate);
  const sixMonthsAgo = subMonths(new Date(), 6);
  const chartStart = start > sixMonthsAgo ? start : sixMonthsAgo;
  const end = new Date();

  const allDays = eachDayOfInterval({ start: chartStart, end });

  let totalCompleted = 0;

  return allDays.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");

    let dayCompleted = 0;
    for (const habit of habits) {
      const isChecked = habit.checkedDates?.[dateStr];
      if (isChecked) dayCompleted++;
    }

    totalCompleted += dayCompleted;

    return {
      date: dateStr,
      totalCompleted,
    };
  });
}