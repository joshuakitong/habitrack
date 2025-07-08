import {
  eachDayOfInterval,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  parseISO
} from "date-fns";
import React from "react";
import { getSettings } from "../../hooks/useSettings";

const generateMonthlyDateGrids = (numMonths, trackerStartDate) => {
  const today = new Date();
  const startLimit = parseISO(trackerStartDate);
  const months = [];

  for (let i = numMonths - 1; i >= 0; i--) {
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const lastOfMonth = endOfMonth(firstOfMonth);
    const start = startOfWeek(firstOfMonth, { weekStartsOn: 0 });
    const end = endOfWeek(lastOfMonth, { weekStartsOn: 0 });
    const allDates = eachDayOfInterval({ start, end });

    const weeks = [];
    for (let i = 0; i < allDates.length; i += 7) {
      const week = allDates.slice(i, i + 7).map(date =>
        isSameMonth(date, firstOfMonth)
          ? format(date, "yyyy-MM-dd")
          : null
      );
      weeks.push(week);
    }

    months.push({
      key: format(firstOfMonth, "yyyy-MM"),
      label: format(firstOfMonth, "MMMM"),
      weeks,
    });
  }

  return months;
};

function getHabitActivityMap(habits, trackerStartDate) {
  const startLimit = parseISO(trackerStartDate);
  const activityMap = {};
  habits.forEach(habit => {
    for (const [dateStr, isChecked] of Object.entries(habit.checkedDates || {})) {
      const date = new Date(dateStr);
      if (isChecked && date >= startLimit) {
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      }
    }
  });
  return activityMap;
};

function getIntensityClass(count) {
  if (count >= 6) return "bg-blue-800";
  if (count >= 5) return "bg-blue-700";
  if (count >= 4) return "bg-blue-600";
  if (count >= 3) return "bg-blue-500";
  if (count >= 2) return "bg-blue-400";
  if (count >= 1) return "bg-blue-300";
  return "bg-gray-700";
};

const OverviewHeatMap = ({ habits }) => {
  const { trackerStartDate } = getSettings();

  const activityMap = getHabitActivityMap(habits, trackerStartDate);
  const months = generateMonthlyDateGrids(6, trackerStartDate);

  return (
    <div className="bg-[#1e1e1e] p-4 rounded shadow">
      <h2 className="text-lg mb-4 font-semibold text-center">Habits Heat Map</h2>
      <div className="flex w-full gap-[2px] overflow-x-auto text-white">
        {months.map(({ key, label, weeks }, idx) => (
          <React.Fragment key={key}>
            {idx > 0 && <div className="w-2" />}

            <div className="flex flex-col items-center gap-1 mx-auto">
              <div className="text-xs text-gray-400 h-[1rem] origin-bottom-left whitespace-nowrap">
                {label}
              </div>

              <div className="flex gap-[2px]">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-[2px]">
                    {week.map((dateStr, j) =>
                      dateStr ? (
                        <div
                          key={dateStr}
                          title={`${dateStr}: ${activityMap[dateStr] || 0} completed`}
                          className={`w-4 h-4 rounded-sm ${getIntensityClass(activityMap[dateStr] || 0)}`}
                        />
                      ) : (
                        <div key={j} className="w-4 h-4 opacity-0" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OverviewHeatMap;