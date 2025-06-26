import { useEffect, useState, useRef } from "react";
import { getWeekDates, formatWeekRange } from "../utils/dateUtils";
import HabitRow from "../components/HabitRow";

const HabitTracker = () => {
  const hasMounted = useRef(false);
  const [habits, setHabits] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState(getWeekDates(0));

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
      <h1 className="text-2xl font-bold">Habit Tracker</h1>
      
      <div className="flex w-full items-center justify-between">
        <div className="text-lg font-semibold text-gray-300">
          {formatWeekRange(weekDates)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer"
            disabled={weekOffset === 0}
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-fixed w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="pr-4 w-[18rem]">Habit</th>
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