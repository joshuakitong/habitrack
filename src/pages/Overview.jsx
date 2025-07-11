import { useSettingsContext } from "../context/SettingsContext";
import { useHabitManagerContext } from "../context/HabitManagerContext";
import OverviewHeatMap from "../components/overview/OverviewHeatMap";
import OverviewTopAndBottomHabits from "../components/overview/OverviewTopAndBottomHabits";
import OverviewAccumulatedHabitsChart from "../components/overview/OverviewAccumulatedHabitsChart";
import OverviewPerformanceByDay from "../components/overview/OverviewPerformanceByDay";

const Overview = () => {
  const { settings, isSettingsLoading } = useSettingsContext();
  const { habits, isHabitLoading } = useHabitManagerContext();

  if (isSettingsLoading || isHabitLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { trackerStartDate } = settings;

  return (
    <div className="pt-6 px-4 lg:px-42 text-white">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <OverviewTopAndBottomHabits habits={habits} trackerStartDate={trackerStartDate} />
      <OverviewPerformanceByDay habits={habits} trackerStartDate={trackerStartDate} />
      <OverviewHeatMap habits={habits} trackerStartDate={trackerStartDate} />
      <OverviewAccumulatedHabitsChart habits={habits} trackerStartDate={trackerStartDate} />
    </div>
  );
};

export default Overview;