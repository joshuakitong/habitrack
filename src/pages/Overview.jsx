import OverviewHeatMap from "../components/overview/OverviewHeatMap";
import OverviewTopAndBottomHabits from "../components/overview/OverviewTopAndBottomHabits";
import OverviewAccumulatedHabitsChart from "../components/overview/OverviewAccumulatedHabitsChart";
import { useHabitManager } from "../hooks/useHabitManager";

const Overview = () => {
  const { habits } = useHabitManager();

  return (
    <div className="py-4 px-4 lg:px-42 text-white">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <OverviewTopAndBottomHabits habits={habits} />
      <OverviewHeatMap habits={habits} />
      <OverviewAccumulatedHabitsChart habits={habits} />
    </div>
  );
};

export default Overview;