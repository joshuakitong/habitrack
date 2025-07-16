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

const generateMonthlyDateGrids = (numMonths, startBoundary) => {
  const today = new Date();
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

function getHabitActivityMap(habits, startBoundary) {
  const startLimit = startBoundary ? parseISO(startBoundary) : new Date();
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

function getIntensityClass(count, totalHabits) {
  if (totalHabits === 0) {
    return "bg-gray-700";
  }

  const threshold5 = totalHabits * 0.8;
  const threshold4 = totalHabits * 0.6;
  const threshold3 = totalHabits * 0.4;
  const threshold2 = totalHabits * 0.2;
  const threshold1 = 1;

  if (count >= threshold5) return legendColors[4];
  if (count >= threshold4) return legendColors[3];
  if (count >= threshold3) return legendColors[2];
  if (count >= threshold2) return legendColors[1];
  if (count >= threshold1) return legendColors[0];

  return "bg-gray-700";
};

const legendColors = [
  "bg-blue-200",
  "bg-blue-300",
  "bg-blue-400",
  "bg-blue-500",
  "bg-blue-600",
];

const OverviewHeatMap = ({ habits, startBoundary }) => {
  const activityMap = getHabitActivityMap(habits, startBoundary);
  const months = generateMonthlyDateGrids(6, startBoundary);

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
                          className={`w-4 h-4 rounded-sm ${getIntensityClass(activityMap[dateStr] || 0, habits.length)}`}
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
      <div className="flex justify-end items-center mt-4 text-gray-400 text-sm">
        <span className="text-xs mr-1">Less</span>
        {legendColors.map((colorClass, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-sm ${colorClass} mx-[1px]`}
            title={`Intensity Level ${index + 1}`}
          ></div>
        ))}
        <span className="text-xs ml-1">More</span>
      </div>
    </div>
  );
};

export default OverviewHeatMap;