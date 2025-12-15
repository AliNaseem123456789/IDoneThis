import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const SummaryChart = ({ tasks = [] }) => {
  const counts = {
    Done: tasks.filter(t => t.status === "Done").length,
    Doing: tasks.filter(t => t.status === "Doing").length,
    Delayed: tasks.filter(t => t.status === "Delayed").length,
  };

  const data = [
    { name: "Done", value: counts.Done },
    { name: "Doing", value: counts.Doing },
    { name: "Delayed", value: counts.Delayed },
  ];

  return (
    <div className="flex flex-col items-center">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          dataKey="value"
          label={false}
        >
          {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
        </Pie>
        <Tooltip />
      </PieChart>

      <div className="mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" /> Dones: {counts.Done}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400" /> Doings: {counts.Doing}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-3 h-3 rounded-full bg-red-500" /> Delayed: {counts.Delayed}
        </div>
      </div>
    </div>
  );
};

export default SummaryChart;
