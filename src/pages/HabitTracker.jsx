import { useEffect, useState, useRef } from "react";
import { getWeekDates, buildSelectableWeeks } from "../utils/dateUtils";
import HabitRow from "../components/HabitRow";

const HabitTracker = () => {
  const hasMounted = useRef(false);
  const [habits, setHabits] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectableWeeks, setSelectableWeeks] = useState([]);
  const [weekDates, setWeekDates] = useState(getWeekDates(0));
  const isLastDate = weekDates[weekDates.length - 1] >= new Date();
  const hasPreviousData = habits.some((habit) => {
    const checkedDates = habit.checkedDates || {};
    return Object.keys(checkedDates).some((dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date < weekDates[0];
    });
  });

  useEffect(() => {
    const stored = localStorage.getItem("habits");
    const habits = stored ? JSON.parse(stored) : [];
    setSelectableWeeks(buildSelectableWeeks(habits));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("habits");
    setHabits(stored ? JSON.parse(stored) : []);
  }, []);

  const toggleCheck = (habitId, dateStr) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const oldChecked = habit.checkedDates || {};
        const newChecked = {
          ...oldChecked,
          [dateStr]: !oldChecked[dateStr],
        };

        return {
          ...habit,
          checkedDates: newChecked,
        };
      })
    );
  };

  useEffect(() => {
    if (hasMounted.current) {
      localStorage.setItem("habits", JSON.stringify(habits));
    } else {
      hasMounted.current = true;
    }
  }, [habits]);

  useEffect(() => {
    setWeekDates(getWeekDates(weekOffset));
  }, [weekOffset]);

  return (
    <div className="py-6 px-2 text-white">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <div className="flex gap-2">
          <select
            value={weekOffset}
            onChange={(e) => setWeekOffset(parseInt(e.target.value))}
            className="bg-gray-800 text-white p-2 rounded cursor-pointer"
          >
            {selectableWeeks.map(({ label, offset }) => (
              <option key={offset} value={offset}>{label}</option>
            ))}
          </select>
          
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasPreviousData}
          >
            Prev
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLastDate}
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-fixed w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="pr-4 w-[18rem]">Habits</th>
              {weekDates.map((date) => (
                <th key={date} className="px-2 text-center">
                  <div className="text-sm">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-xs text-gray-400">{date.getDate()}</div>
                </th>
              ))}
              <th className="text-center text-xs font-normal w-[3rem] leading-snug">Current Streak</th>
              <th className="text-center text-xs font-normal w-[3rem] leading-snug">Longest Streak</th>
              <th className="text-center text-xs font-normal w-[3rem] leading-snug">Total Count</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                weekDates={weekDates}
                onToggle={toggleCheck}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;