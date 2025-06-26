import { useEffect, useState, useRef } from "react";
import { getCurrentWeekDates } from "../utils/dateUtils";
import HabitRow from "../components/HabitRow";

const HabitTracker = () => {
  const hasMounted = useRef(false);
  const [habits, setHabits] = useState([]);
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());

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

  return (
    <div className="py-6 px-2 text-white">
      <h1 className="text-2xl font-bold mb-6">Habit Tracker</h1>

      <div className="overflow-x-auto">
        <table className="table-fixed w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="pr-4 w-64">Habit</th>
              {weekDates.map((date) => (
                <th key={date} className="px-2 text-center">
                  <div className="text-sm">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-xs text-gray-400">{date.getDate()}</div>
                </th>
              ))}
              <th className="text-center text-xs font-normal w-12 leading-snug">Current Streak</th>
              <th className="text-center text-xs font-normal w-12 leading-snug">Longest Streak</th>
              <th className="text-center text-xs font-normal w-12 leading-snug">Total Count</th>
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