import { getStreaks } from "../../utils/getStreaks";
import { formatDate, getDayLabel, getActiveDaysForDate } from "../../utils/dateUtils";
import { eachDayOfInterval } from "date-fns";
import { getSettings } from "../../hooks/useSettings";

export const calculateCompletionRate = (habit) => {
  if (!habit || !habit.checkedDates) return 0;

  const { trackerStartDate } = getSettings();
  const startDate = new Date(trackerStartDate);
  const endDate = new Date();

  const checkedDates = habit.checkedDates;
  let totalCheckableDays = 0;
  let completedDays = 0;

  const allRelevantDates = eachDayOfInterval({ start: startDate, end: endDate });

  for (const date of allRelevantDates) {
    const dateStr = formatDate(date);
    const dayLabel = getDayLabel(date);
    const activeDays = getActiveDaysForDate(habit, date);

    if (activeDays.includes(dayLabel)) {
      totalCheckableDays++;
      if (checkedDates[dateStr]) completedDays++;
    }
  }

  return totalCheckableDays === 0 ? 0 : (completedDays / totalCheckableDays) * 100;
};

const getTopHabits = (habits, key, getValueFn, sortOrder = "desc", count = 5) => {
  return [...habits]
    .map((habit) => ({
      name: habit.name,
      value: getValueFn(habit),
    }))
    .sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    )
    .slice(0, count);
};

const getBottomHabits = (habits, getValueFn, count = 5) => {
  return habits
    .map((habit) => ({
      name: habit.name,
      value: getValueFn(habit),
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, count)
};

const OverviewTopAndBottomHabits = ({ habits }) => {
  const topByCount = getTopHabits(
    habits,
    "count",
    (habit) => Object.values(habit.checkedDates || {}).filter(Boolean).length
  );

  const topByCurrentStreak = getTopHabits(
    habits,
    "longestCurrentStreak",
    (habit) => getStreaks(habit).current
  );

  const topByLongestStreak = getTopHabits(
    habits,
    "longestStreak",
    (habit) => getStreaks(habit).longest
  );

  const topByCompletion = getTopHabits(habits, "completion", calculateCompletionRate);

  const bottomByCount = getBottomHabits(
    habits,
    (habit) => Object.values(habit.checkedDates || {}).filter(Boolean).length
  );

  const bottomByCompletion = getBottomHabits(
    habits,
    calculateCompletionRate
  );

  const bottomByCurrentStreak = getBottomHabits(
    habits,
    (habit) => getStreaks(habit).current
  );

  const bottomByLongestStreak = getBottomHabits(
    habits,
    (habit) => getStreaks(habit).longest
  );

  const renderList = (title, list, suffix = "") => (
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
              <span className="truncate">{item.name}</span>
              <span className="text-gray-400 shrink-0">
                {suffix === "%" ? item.value.toFixed(1) : Math.round(item.value)}
                {suffix}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-6 p-4 bg-[#1e1e1e] rounded-lg shadow mt-6">
        <h2 className="text-lg font-bold text-center text-white">Top Performers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mt-4">
          {renderList("Most Completions", topByCount)}
          {renderList("Highest Completion Rate", topByCompletion, "%")}
          {renderList("Longest Current Streak", topByCurrentStreak)}
          {renderList("Longest All-time Streak", topByLongestStreak)}
        </div>
      </div>

      <div className="mb-6 p-4 bg-[#1e1e1e] rounded-lg shadow mt-6">
        <h2 className="text-lg font-bold text-center text-white">Bottom Performers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mt-4">
          {renderList("Least Completions", bottomByCount)}
          {renderList("Lowest Completion Rate", bottomByCompletion, "%")}
          {renderList("Shortest Current Streak", bottomByCurrentStreak)}
          {renderList("Shortest All-time Streak", bottomByLongestStreak)}
        </div>
      </div>
    </>
  );
};

export default OverviewTopAndBottomHabits;
