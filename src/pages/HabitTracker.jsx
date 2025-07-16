import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { useSettingsContext } from "../context/SettingsContext";
import { useHabitManagerContext } from "../context/HabitManagerContext";
import { getWeekDates, buildSelectableWeeks, getMonthDates, buildSelectableMonths, formatDate } from "../utils/dateUtils";
import HabitRow from "../components/habits/HabitRow";
import HabitsForm from "../components/habits/HabitsForm";
import HabitsModal from "../components/habits/HabitsModal";
import HabitsConfirmDelete from "../components/habits/HabitsConfirmDelete";
import { startOfDay, parseISO } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import SortableWrapper from "../components/dnd/SortableWrapper";

const HabitTracker = () => {
  const [viewMode, setViewMode] = useState("weekly");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectableWeeks, setSelectableWeeks] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectableMonths, setSelectableMonths] = useState([]);
  const [visibleDates, setVisibleDates] = useState([]);
  const tableRef = useRef(null);

  const { settings, isSettingsLoading, saveSettings } = useSettingsContext();
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
    openCreateModal,
  } = useHabitManagerContext();

  useEffect(() => {
    if (!isSettingsLoading && settings?.trackerStartDate) {
      setSelectableMonths(
        buildSelectableMonths({ trackerStartDate: settings.trackerStartDate })
      );
      setSelectableWeeks(
        buildSelectableWeeks({ trackerStartDate: settings.trackerStartDate })
      );
    }
  }, [isSettingsLoading, settings]);

  useEffect(() => {
    if (settings?.viewMode) {
      setViewMode(settings.viewMode);
    }
  }, [settings?.viewMode]);

  useEffect(() => {
    if (viewMode === "weekly") {
      setVisibleDates(getWeekDates(weekOffset));
    } else {
      setVisibleDates(getMonthDates(monthOffset));
    }

    setTimeout(() => {
      const todayHeader = document.querySelector("th.today-col") ?? document.querySelector("th.habits-col");
      const scrollContainer = tableRef.current;

      if (todayHeader && scrollContainer) {
        const headerRect = todayHeader.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        const isHeaderVisible = (
          headerRect.left >= containerRect.left &&
          headerRect.right <= containerRect.right + 20
        );

        if (!isHeaderVisible) {
          const offsetLeft = todayHeader.offsetLeft;
          scrollContainer.scrollTo({
            left: offsetLeft - 150,
            behavior: "smooth"
          });
        }
      }
    }, 0);
  }, [viewMode, weekOffset, monthOffset]);

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

  const handleChangeView = (mode) => {
    setViewMode(mode);
    saveSettings({ viewMode: mode });
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
  const isWeeklyBeforeTrackerStart =
    startOfDay(getWeekDates(weekOffset)[0]) <=
    startOfDay(parseISO(trackerStartDate));
  const isMonthlyBeforeTrackerStart =
    startOfDay(getMonthDates(monthOffset)[0]) <=
    startOfDay(parseISO(trackerStartDate));

  return (
    <div className="py-6 px-2 text-white">
      <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-2 md:gap-0">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-bold">HabiTrack</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex text-sm rounded overflow-hidden h-9.5 w-full border bg-[#1e1e1e] border-[#333333]">
            <button
              onClick={() => handleChangeView("weekly")}
              className={`px-4 py-1 flex-1 focus:border-blue-500 focus:outline-none ${
                viewMode === "weekly"
                  ? "bg-[#1e1e1e] text-blue-500"
                  : "bg-[#111111] text-gray-400 rounded border border-[#333333] hover:border-blue-500 cursor-pointer"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => handleChangeView("monthly")}
              className={`px-4 py-1 flex-1 focus:border-blue-500 focus:outline-none ${
                viewMode === "monthly"
                  ? "bg-[#1e1e1e] text-blue-500"
                  : "bg-[#111111] text-gray-400 rounded border border-[#333333] hover:border-blue-500 cursor-pointer"
              }`}
            >
              Monthly
            </button>
          </div>
          {viewMode === "weekly" ? (
            <>
              <div className="relative w-fit">
                <select
                  value={weekOffset}
                  onChange={(e) => setWeekOffset(parseInt(e.target.value))}
                  className="bg-[#1e1e1e] h-9.5 w-40 text-sm text-white p-2 pl-4 pr-10 rounded border border-[#333333] hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {selectableWeeks.map(({ label, offset }) => (
                    <option key={offset} value={offset}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="bg-[#1e1e1e] h-9.5 w-10.5 border border-[#333333] px-3 py-1 rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isWeeklyBeforeTrackerStart}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="bg-[#1e1e1e] h-9.5 w-10.5 border border-[#333333] px-3 py-1 rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={weekOffset >= 0}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative w-fit">
                <select
                  value={monthOffset}
                  onChange={(e) => setMonthOffset(parseInt(e.target.value))}
                  className="bg-[#1e1e1e] h-9.5 w-40 text-sm text-white p-2 pl-4 pr-10 rounded border border-[#333333] hover:border-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {selectableMonths.map(({ label, offset }) => (
                    <option key={offset} value={offset}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonthOffset((prev) => prev - 1)}
                  className="bg-[#1e1e1e] h-9.5 w-10.5  border border-[#333333] px-3 py-1 rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isMonthlyBeforeTrackerStart}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={() => setMonthOffset((prev) => prev + 1)}
                  className="bg-[#1e1e1e] h-9.5 w-10.5  border border-[#333333] px-3 py-1 rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={monthOffset >= 0}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mt-4 scrollbar-thin-dark border-1 border-[#333333] bg-[#333333] rounded-md" ref={tableRef}>
        <SortableWrapper
          items={habits.map((h) => h.id)}
          onReorder={(newOrder) => {
            const newHabits = newOrder.map((id) => habits.find((h) => h.id === id));
            setHabits(newHabits);
          }}
        >
          <table className="w-full text-left border-collapse overflow-hidden">
            <thead>
              <tr>
                <th className="w-[12rem] lg:w-[18rem] pl-4 border border-[#333333] bg-[#1e1e1e] rounded-tl-md habits-col">Habits</th>
                {visibleDates.map((date) => {
                  const isToday = formatDate(date) === formatDate(today);
                  return (
                    <th
                      key={date}
                      className={`text-center border-y w-[4rem] border-[#333333] bg-[#1e1e1e] ${
                        isToday ? "bg-[#353535] today-col" : ""
                      }`}
                    >
                      <div className="text-sm mt-2">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{date.getDate()}</div>
                    </th>
                  );
                })}
                <th className="text-center text-xs font-normal w-[3rem] leading-snug bg-[#1e1e1e] border border-[#333333]">
                  Current Streak
                </th>
                <th className="text-center text-xs font-normal w-[3rem] leading-snug bg-[#1e1e1e] border border-[#333333]">
                  Longest Streak
                </th>
                <th className="text-center text-xs font-normal w-[3rem] leading-snug bg-[#1e1e1e] border border-[#333333] rounded-tr-md">
                  Total Count
                </th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, index) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  weekDates={visibleDates}
                  onToggle={toggleCheck}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  trackerStartDate={trackerStartDate}
                  isEditableInTracker={isEditableInTracker}
                  isColorCoded={isColorCoded}
                  isRowColored={isRowColored}
                  isLastHabitRow={index === habits.length - 1 && !isEditableInTracker}
                />
              ))}

              {isEditableInTracker && (
                <>
                  <tr>
                    {habits.length === 0 && (
                      <td colSpan={visibleDates.length + 4} className="bg-[#121212] text-center text-gray-400 py-2">
                        No habits yet. Click on “+ Add Habit” to begin.
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-center" colSpan={visibleDates.length + 4}>
                      <button
                        onClick={openCreateModal}
                        className={`text-white font-semibold py-2 px-4 hover:bg-[#353535] bg-[#1e1e1e] ${habits.length === 0 ? "border-t" : ""} border-[#333333] w-full rounded-b-lg cursor-pointer`}
                      >
                        + Add Habit
                      </button>
                    </td>
                  </tr>
                </>
              )}
              {!isEditableInTracker && (
                <>
                  <tr>
                    {habits.length === 0 && (
                      <td colSpan={visibleDates.length + 4} className="text-center text-gray-400 py-2">
                        No habits yet. Go to <Link to="/habits" className="text-blue-500 hover:text-blue-600 hover:underline">Habits</Link> and click on “+ Add Habit” to begin.
                      </td>
                    )}
                  </tr>
                </>
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
