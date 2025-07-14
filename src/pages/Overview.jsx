import { useState } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import { useHabitManagerContext } from "../context/HabitManagerContext";
import OverviewHeatMap from "../components/overview/OverviewHeatMap";
import OverviewTopAndBottomHabits from "../components/overview/OverviewTopAndBottomHabits";
import OverviewAccumulatedHabitsChart from "../components/overview/OverviewAccumulatedHabitsChart";
import OverviewPerformanceByDay from "../components/overview/OverviewPerformanceByDay";
import { subDays, parseISO, formatISO, isAfter } from "date-fns";

const Overview = () => {
  const [viewMode, setViewMode] = useState("all time");
  const handleChangeView = (mode) => {
    setViewMode(mode);
  };

  const { settings, isSettingsLoading } = useSettingsContext();
  const { habits, isHabitLoading } = useHabitManagerContext();

  if (isSettingsLoading || isHabitLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const now = new Date();
  let startBoundaryDate = null;

  if (viewMode === "7 days") {
    startBoundaryDate = subDays(now, 6);
  } else if (viewMode === "30 days") {
    startBoundaryDate = subDays(now, 29);
  } else {
    startBoundaryDate = parseISO(settings.trackerStartDate);
  }

  let startBoundary = formatISO(startBoundaryDate, { representation: "date" });

  return (
    <div className="pt-6 px-4 lg:px-42 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Overview</h1>

        <div className="flex text-sm rounded overflow-hidden h-9.5 border bg-[#1e1e1e] border-[#333333]">
          {["7 days", "30 days", "all time"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleChangeView(mode)}
              className={`px-4 py-1 focus:border-blue-500 focus:outline-none ${
                viewMode === mode
                  ? "bg-[#1e1e1e] text-blue-500"
                  : "bg-[#111111] text-gray-400 rounded border border-[#333333] hover:border-blue-500 cursor-pointer"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <OverviewTopAndBottomHabits habits={habits} startBoundary={startBoundary} />
      <OverviewPerformanceByDay habits={habits} startBoundary={startBoundary} />
      <OverviewHeatMap habits={habits} startBoundary={startBoundary} />
      <OverviewAccumulatedHabitsChart habits={habits} startBoundary={startBoundary} />
    </div>
  );
};

export default Overview;