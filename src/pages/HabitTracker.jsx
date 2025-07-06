import { useEffect, useState, useRef } from "react";
import { getWeekDates, buildSelectableWeeks, formatDate } from "../utils/dateUtils";
import HabitRow from "../components/habits/HabitRow";
import HabitsForm from "../components/habits/HabitsForm";
import Modal from "../components/habits/Modal";
import ConfirmDelete from "../components/habits/ConfirmDelete";
import { useHabitManager } from "../hooks/useHabitManager";
import { getSettings } from "../hooks/useSettings";
import { startOfDay, startOfWeek, addWeeks } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const HabitTracker = () => {
  const hasMounted = useRef(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState(getWeekDates(0));
  const [selectableWeeks, setSelectableWeeks] = useState([]);
  const { trackerStartDate, isEditableInTracker, isColorCoded } = getSettings();

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

  const today = new Date();
  const startOfNextWeek = addWeeks(startOfWeek(today, { weekStartsOn: 0 }), 0);
  const isLastDate = weekDates[0] >= startOfNextWeek;
  const isBeforeTrackerStart = startOfDay(weekDates[0]).getTime() > startOfDay(new Date(trackerStartDate)).getTime();

  useEffect(() => {
    setSelectableWeeks(buildSelectableWeeks());
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex(h => h.id === active.id);
    const newIndex = habits.findIndex(h => h.id === over.id);
    const newHabits = arrayMove(habits, oldIndex, newIndex);
    setHabits(newHabits);
  };

  return (
    <div className="py-6 px-2 text-white">
      <div className="flex w-full items-center justify-between">
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
            <table className="w-full text-left border-collapse overflow-hidden">
              <thead>
                <tr>
                  <th className="w-[12rem] lg:w-[18rem] pl-4 border border-[#333333] bg-[#1e1e1e]">Habits</th>
                  {weekDates.map((date) => {
                    const isToday = formatDate(date) === formatDate(new Date());
                    return (
                      <th key={date} className={`text-center border-y border-[#333333] bg-[#1e1e1e] ${isToday ? "bg-[#353535]" : ""}`}>
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
                  </tr>
                )}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitsForm 
          onSubmit={handleAddOrUpdateHabit} 
          habit={editingHabit}
          isColorCoded={isColorCoded}
        />
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