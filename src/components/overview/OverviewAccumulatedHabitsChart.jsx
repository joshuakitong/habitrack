import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { parseISO, format, subMonths, eachDayOfInterval } from "date-fns";

function getAccumulatedData(habits, startBoundary) {
  const startDate = startBoundary ? parseISO(startBoundary) : new Date();
  const sixMonthsAgo = subMonths(new Date(), 6);
  const chartStart = startDate > sixMonthsAgo ? startDate : sixMonthsAgo;
  const end = new Date();

  const allDays = eachDayOfInterval({ start: chartStart, end });

  let totalCompleted = 0;

  return allDays.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");

    let dayCompleted = 0;
    for (const habit of habits) {
      const isChecked = habit.checkedDates?.[dateStr];
      if (isChecked) dayCompleted++;
    }

    totalCompleted += dayCompleted;

    return {
      date: dateStr,
      totalCompleted,
    };
  });
}

export default function OverviewAccumulatedHabitsChart({ habits, startBoundary }) {
  const data = getAccumulatedData(habits, startBoundary);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;

      const date = dataPoint.date;
      const totalCompleted = dataPoint.totalCompleted;

      return (
        <div style={{
          backgroundColor: '#333',
          border: '1px solid #555',
          padding: '10px',
          color: '#fff',
          borderRadius: '5px'
        }}>
          <p>{`Date: ${format(parseISO(date), "MMMM d, yyyy")}`}</p>
          <p>{`Total Completed: ${totalCompleted} habits`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-6 p-4 bg-[#1e1e1e] rounded shadow mt-6">
      <h2 className="text-lg mb-4 font-semibold text-center">Accumulated Habit Completions</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
            data={data}
            margin={{ top: 0, right: 20, bottom: 0, left: -20 }}
          >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            stroke="#ccc"
            tickFormatter={(dateStr) => format(parseISO(dateStr), "MMM d")}
          />
          <YAxis stroke="#ccc" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="totalCompleted"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}