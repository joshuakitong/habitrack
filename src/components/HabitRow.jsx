import { formatDate, getDayLabel } from "../utils/dateUtils";
import { colorMap } from "../utils/colors";

const HabitRow = ({ habit, weekDates, onToggle }) => {
  if (!habit) return null;
  
  const getStreaks = (habit) => {
    if (!habit || typeof habit !== "object") return { current: 0, longest: 0, total: 0 };

    const checkedDates = habit.checkedDates || {};
    const activeDays =
      habit.days && habit.days.length > 0
        ? habit.days
        : getDayLabel;

    const checked = Object.keys(checkedDates)
      .filter((dateStr) => checkedDates[dateStr])
      .map((dateStr) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d));
      })
      .sort((a, b) => a - b);

    if (checked.length === 0) return { current: 0, longest: 0, total: 0 };

    const checkedSet = new Set(checked.map((d) => formatDate(d)));
    const total = [...checkedSet].filter((dStr) => {
      const [y, m, d] = dStr.split("-").map(Number);
      const date = new Date(Date.UTC(y, m - 1, d));
      return activeDays.includes(getDayLabel(date));
    }).length;

    const start = new Date(checked[0]);
    const end = new Date(checked[checked.length - 1]);

    let current = 0;
    let longest = 0;
    let streak = 0;

    for (
      let date = new Date(start);
      date <= end;
      date.setUTCDate(date.getUTCDate() + 1)
    ) {
      const dayLabel = getDayLabel(date);
      const dateStr = formatDate(date);

      if (activeDays.includes(dayLabel)) {
        if (checkedSet.has(dateStr)) {
          streak++;
          longest = Math.max(longest, streak);
        } else {
          streak = 0;
        }
      }
    }

    current = 0;
    for (
      let date = new Date(end);
      date >= start;
      date.setUTCDate(date.getUTCDate() - 1)
    ) {
      const dayLabel = getDayLabel(date);
      const dateStr = formatDate(date);

      if (activeDays.includes(dayLabel)) {
        if (checkedSet.has(dateStr)) {
          current++;
        } else {
          break;
        }
      }
    }

    return { current, longest, total };
  };

  const { current, longest, total } = getStreaks(habit);

  return (
    <tr>
      <td className="pr-4 py-2 font-medium">
        <div className="flex items-center gap-2">
          <div
            className="min-w-3 min-h-3 rounded-full"
            style={{ backgroundColor: colorMap[habit.color] }}
          />
          <div className="max-w-[240px] truncate">{habit.name}</div>
        </div>
      </td>

      {weekDates.map((date) => {
        const dateStr = formatDate(date);
        const isActive = habit.days.includes(getDayLabel(date));
        const isChecked = habit.checkedDates?.[dateStr] || false;

        return (
          <td key={dateStr} className="text-center">
            <button
              disabled={!isActive}
              onClick={() => onToggle(habit.id, dateStr)}
              className={`w-6 h-6 rounded-full border transition ${
                isChecked ? "" : "border-gray-500"
              } ${isActive ? "cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
              style={
                isChecked
                  ? {
                      backgroundColor: colorMap[habit.color],
                      borderColor: colorMap[habit.color],
                    }
                  : {}
              }
            />
          </td>
        );
      })}

      <td className="text-center">{current}</td>
      <td className="text-center">{longest}</td>
      <td className="text-center">{total}</td>
    </tr>
  );
};

export default HabitRow;