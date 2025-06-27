import { useEffect, useState, useRef } from "react";
import { getWeekDates, buildSelectableWeeks } from "../utils/dateUtils";
import HabitRow from "../components/HabitRow";
import HabitsForm from "../components/HabitsForm";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import { useHabitManager } from "../hooks/useHabitManager";
import { startOfDay } from "date-fns";
import { ChevronDown } from "lucide-react";

const HabitTracker = () => {
  const hasMounted = useRef(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState(getWeekDates(0));
  const [selectableWeeks, setSelectableWeeks] = useState([]);

  const {
    habits,
    setHabits,
    editingHabit,
    habitToDelete,
    isModalOpen,
    isDeleteModalOpen,
    setIsModalOpen,
    setIsDeleteModalOpen,
    confirmDelete,
    handleEdit,
    handleDelete,
    handleAddOrUpdateHabit,
    openCreateModal
  } = useHabitManager();

  const isLastDate = weekDates[weekDates.length - 1] >= new Date();
  const hasPreviousData = habits.some((habit) => {
    const checkedDates = habit.checkedDates || {};
    return Object.keys(checkedDates).some((dateStr) => {
      if (!checkedDates[dateStr]) return false;

      const [y, m, d] = dateStr.split("-").map(Number);
      const date = startOfDay(new Date(y, m - 1, d));
      const weekStart = startOfDay(weekDates[0]);

      return date < weekStart;
    });
  });

  useEffect(() => {
    const stored = localStorage.getItem("habits");
    const habits = stored ? JSON.parse(stored) : [];
    setSelectableWeeks(buildSelectableWeeks(habits));
  }, []);

  useEffect(() => {
    setWeekDates(getWeekDates(weekOffset));
  }, [weekOffset]);

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
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <div className="flex gap-2">
          <div className="relative w-fit">
            <select
              value={weekOffset}
              onChange={(e) => setWeekOffset(parseInt(e.target.value))}
              className="bg-gray-800 text-white p-2 pl-4 pr-10 rounded border border-gray-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
            >
              {selectableWeeks.map(({ label, offset }) => (
                <option key={offset} value={offset}>{label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
            <ChevronDown size={16} />
          </div>
          </div>
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

      <div className="overflow-x-auto mt-4">
        <table className="table-fixed w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="w-[12rem] lg:w-[18rem]">Habits</th>
              {weekDates.map((date) => (
                <th key={date} className="w-[5rem] text-center">
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
        <button
          onClick={openCreateModal}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          + Add Habit
        </button>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitsForm onSubmit={handleAddOrUpdateHabit} habit={editingHabit} />
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitsForm habit={editingHabit} onSubmit={handleAddOrUpdateHabit} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ConfirmDelete
          itemName={habitToDelete?.name}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HabitTracker;