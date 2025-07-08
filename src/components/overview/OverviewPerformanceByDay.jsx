import { parseISO } from "date-fns";
import { getSettings } from "../../hooks/useSettings";
import { daysOfWeek } from "../../utils/dateUtils";

const renderList = (title, list) => (
  <div className="bg-[#1a1a1a] p-4 rounded shadow w-full">
    <h3 className="text-md font-semibold mb-2">{title}</h3>

    {list.length === 0 ? (
      <p className="text-gray-400 text-sm">No data</p>
    ) : (
      <ol className="list-decimal list-inside space-y-1 text-sm">
        {list.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between whitespace-nowrap truncate gap-4"
          >
            <span className="truncate">{item.day}</span>
            <span className="text-gray-400 shrink-0">{item.total}</span>
          </li>
        ))}
      </ol>
    )}
  </div>
);

const getTotalsByWeekday = (habits, trackerStartDate) => {
  const start = parseISO(trackerStartDate);
  const totals = Array(7).fill(0);

  habits.forEach((habit) => {
    Object.entries(habit.checkedDates || {}).forEach(([dateStr, isChecked]) => {
      if (!isChecked) return;

      const date = parseISO(dateStr);
      if (date < start) return;

      const dayIndex = date.getDay();
      totals[dayIndex]++;
    });
  });

  return totals.map((total, index) => ({
    day: daysOfWeek[index],
    total,
  }));
};

const OverviewPerformanceByWeekday = ({ habits }) => {
  const { trackerStartDate } = getSettings();
  const totals = getTotalsByWeekday(habits, trackerStartDate);

  const bestDays = [...totals]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const worstDays = [...totals]
    .sort((a, b) => a.total - b.total)
    .slice(0, 3);

  return (
    <div className="mb-6 p-4 bg-[#1e1e1e] rounded-lg shadow mt-6">
      <h2 className="text-lg mb-4 font-semibold text-center">Habit Performance by Day</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mt-4">
        {renderList("Most Active Days", bestDays)}
        {renderList("Least Active Days", worstDays)}
      </div>
    </div>
  );
};

export default OverviewPerformanceByWeekday;