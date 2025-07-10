import { useSettingsContext } from "../context/SettingsContext";
import { useHabitManagerContext } from "../context/HabitManagerContext";
import OverviewHeatMap from "../components/overview/OverviewHeatMap";
import OverviewTopAndBottomHabits from "../components/overview/OverviewTopAndBottomHabits";
import OverviewAccumulatedHabitsChart from "../components/overview/OverviewAccumulatedHabitsChart";
import OverviewPerformanceByDay from "../components/overview/OverviewPerformanceByDay";

const Overview = () => {
  const { settings, isLoading } = useSettingsContext();
  
  if (isLoading) {
    return <div className="text-white text-center py-6">Loading settings...</div>;
  }

  const { trackerStartDate } = settings;
  
  const { habits } = useHabitManagerContext();

  return (
    <div className="py-6 px-4 lg:px-42 text-white">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <OverviewTopAndBottomHabits habits={habits} trackerStartDate={trackerStartDate} />
      <OverviewPerformanceByDay habits={habits} trackerStartDate={trackerStartDate} />
      <OverviewHeatMap habits={habits} trackerStartDate={trackerStartDate} />
      <OverviewAccumulatedHabitsChart habits={habits} trackerStartDate={trackerStartDate} />
    </div>
  );
};

export default Overview;