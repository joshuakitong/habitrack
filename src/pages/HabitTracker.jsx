import { useEffect, useState } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import { useHabitManagerContext } from "../context/HabitManagerContext";
import { getWeekDates, buildSelectableWeeks, formatDate } from "../utils/dateUtils";
import HabitRow from "../components/habits/HabitRow";
import HabitsForm from "../components/habits/HabitsForm";
import HabitsModal from "../components/habits/HabitsModal";
import HabitsConfirmDelete from "../components/habits/HabitsConfirmDelete";
import { startOfDay, startOfWeek, addWeeks, parseISO } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import SortableWrapper from "../components/dnd/SortableWrapper";

const HabitTracker = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState(getWeekDates(0));
  const [selectableWeeks, setSelectableWeeks] = useState([]);

  const { settings, isSettingsLoading } = useSettingsContext();
  const {
    habits,
    setHabits,
    isHabitLoading,
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
  } = useHabitManagerContext();

  useEffect(() => {
    if (!isSettingsLoading && settings?.trackerStartDate) {
      setSelectableWeeks(buildSelectableWeeks({ trackerStartDate: settings.trackerStartDate }));
    }
  }, [isSettingsLoading, settings]);

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

  if (isSettingsLoading || isHabitLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { trackerStartDate, isEditableInTracker, isColorCoded, isRowColored } = settings;

  const today = new Date();
  const startOfNextWeek = addWeeks(startOfWeek(today, { weekStartsOn: 0 }), 0);
  const isLastDate = weekDates[0] >= startOfNextWeek;
  const isBeforeTrackerStart =
    startOfDay(weekDates[0]).getTime() >
    startOfDay(parseISO(trackerStartDate)).getTime();

  return (
    <div className="py-6 px-2 text-white">
      <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-2 md:gap-0">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>

        <div className="flex gap-2">
          <div className="relative w-fit">
            <select
              value={weekOffset}
              onChange={(e) => setWeekOffset(parseInt(e.target.value))}
              className="bg-[#1e1e1e] text-sm text-white p-2 pl-4 pr-10 rounded border border-[#333333] hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
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
            className="bg-[#1e1e1e] border border-[#333333] px-3 py-1 rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isBeforeTrackerStart}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="bg-[#1e1e1e] border border-[#333333] px-3 py-1 rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLastDate}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <SortableWrapper items={habits.map(h => h.id)} onReorder={(newOrder) => {
          const newHabits = newOrder.map(id => habits.find(h => h.id === id));
          setHabits(newHabits);
        }}>
            <table className="w-full text-left border-collapse overflow-hidden">
              <thead>
                <tr>
                  <th className="w-[12rem] lg:w-[18rem] pl-4 border border-[#333333] bg-[#1e1e1e]">Habits</th>
                  {weekDates.map((date) => {
                    const isToday = formatDate(date) === formatDate(new Date());
                    return (
                      <th key={date} className={`text-center border-y w-[4rem] border-[#333333] bg-[#1e1e1e] ${isToday ? "bg-[#353535]" : ""}`}>
                        <div className="text-sm mt-2">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className="text-xs text-gray-400 mb-2">{date.getDate()}</div>
                      </th>
                    );
                  })}
                  <th className="text-center text-xs font-normal w-[3rem] leading-snug bg-[#1e1e1e] border border-[#333333]">Current Streak</th>
                  <th className="text-center text-xs font-normal w-[3rem] leading-snug bg-[#1e1e1e] border border-[#333333]">Longest Streak</th>
                  <th className="text-center text-xs font-normal w-[3rem] leading-snug bg-[#1e1e1e] border border-[#333333]">Total Count</th>
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
                    trackerStartDate={trackerStartDate}
                    isEditableInTracker={isEditableInTracker}
                    isColorCoded={isColorCoded}
                    isRowColored={isRowColored}
                  />
                ))}

                {isEditableInTracker && (
                  <tr>
                    <td className="text-center">
                      <button
                        onClick={openCreateModal}
                        className="text-white font-semibold py-2 px-4 hover:bg-[#1e1e1e] w-full cursor-pointer"
                      >
                        + Add Habit
                      </button>
                    </td>
                    {habits.length === 0 && (
                      <td colSpan={weekDates.length} className="text-center text-gray-400 pl-4">
                        No habits yet. Click “+ Add Habit” to begin.
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </SortableWrapper>
      </div>

      <HabitsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitsForm 
          onSubmit={handleAddOrUpdateHabit} 
          habit={editingHabit}
          isColorCoded={isColorCoded}
        />
      </HabitsModal>

      <HabitsModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <HabitsConfirmDelete
          itemName={habitToDelete?.name}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </HabitsModal>
    </div>
  );
};

export default HabitTracker;