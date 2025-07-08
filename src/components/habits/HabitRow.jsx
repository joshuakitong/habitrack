import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDate, getDayLabel } from "../../utils/dateUtils";
import { getSettings } from "../../hooks/useSettings";
import { colorMap, bgClassMap, bgClassTodayMap } from "../../utils/colors";
import { Pencil, Trash2, MoreVertical, Check, GripVertical } from "lucide-react";
import { getStreaks } from "../../utils/getStreaks";
import { parseISO } from "date-fns";

const HabitRow = ({ habit, weekDates, onToggle, onEdit, onDelete, trackerStartDate }) => {
  if (!habit) return null;

  const { isEditableInTracker, isColorCoded, isRowColored } = getSettings();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: habit.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { current, longest, total } = getStreaks(habit, trackerStartDate);

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td className={`py-4 font-medium border border-[#333333] ${isColorCoded && isRowColored ? bgClassMap[habit.color] : ""}`}>
        <div className="flex items-center justify-between gap-2 pl-3">
          <div className="flex items-center gap-2">
            {isEditableInTracker && (
              <GripVertical
                className="text-gray-400 hover:text-white cursor-grab"
                {...listeners}
              />
            )}
            {isColorCoded && (
              <div
                className="min-w-3 min-h-3 rounded-sm"
                style={{ backgroundColor: isColorCoded ? colorMap[habit.color] : "" }}
              />
            )}
            <div className="w-[8rem] lg:w-[12rem] truncate">{habit.name}</div>
          </div>

          <div className="relative mr-2" ref={menuRef}>
            {isEditableInTracker && (
              <button
                className="text-white hover:text-gray-300 p-1 cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <MoreVertical size={18} />
              </button>
            )}

            {menuOpen && (
              <div className="absolute right-0 mt-[-1.95rem] w-28 bg-[#1e1e1e] border border-[#333333] rounded shadow z-10">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEdit(habit)} className="block w-full text-left px-4 py-2 text-blue-500 hover:text-blue-400 cursor-pointer">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(habit)} className="block w-full text-left px-4 py-2 text-red-500 hover:text-red-400 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>

      {weekDates.map((date) => {
        const dateStr = formatDate(date);
        const isChecked = habit.checkedDates?.[dateStr] || false;
        const isActive = habit.days.includes(getDayLabel(date));
        const isFuture = date > new Date();
        const isBeforeStartDate = date.setHours(0, 0, 0, 0) < parseISO(trackerStartDate).setHours(0, 0, 0, 0);
        const isCheckable = isActive && !isFuture && !isBeforeStartDate;
        const isToday = formatDate(date) === formatDate(new Date());

        return (
          <td
            key={dateStr}
            className={`text-center h-[3rem] border-y border-[#333333] ${
              isToday
                ? `${isColorCoded && isRowColored ? bgClassTodayMap[habit.color] : "bg-[#1e1e1e]"}`
                : `${isColorCoded && isRowColored ? bgClassMap[habit.color] : ""}`
            }`}
          >
            <div className="flex justify-center w-[3rem] mx-auto items-center">
              <button
                disabled={!isCheckable}
                onClick={() => onToggle(habit.id, dateStr)}
                className={`w-6 h-6 rounded-md border flex items-center justify-center hover:scale-110 disabled:hover:scale-100 transition ${
                  isChecked ? "scale-110 bg-blue-500 border-blue-500" : "border-gray-500"
                } ${isCheckable ? "cursor-pointer" : "opacity-15 cursor-not-allowed"}`}
                style={
                  isChecked
                    ? {
                        backgroundColor: isColorCoded ? colorMap[habit.color] : "",
                        borderColor: isColorCoded ? colorMap[habit.color] : "",
                      }
                    : {}
                }
              >
                {isChecked && <span className="text-white text-sm font-bold"><Check size={18} /></span>}
              </button>
            </div>
          </td>
        );
      })}

      <td className={`text-center border border-[#333333] ${isColorCoded && isRowColored ? bgClassMap[habit.color] : ""}`}>{current}</td>
      <td className={`text-center border border-[#333333] ${isColorCoded && isRowColored ? bgClassMap[habit.color] : ""}`}>{longest}</td>
      <td className={`text-center border border-[#333333] ${isColorCoded && isRowColored ? bgClassMap[habit.color] : ""}`}>{total}</td>
    </tr>
  );
};

export default HabitRow;