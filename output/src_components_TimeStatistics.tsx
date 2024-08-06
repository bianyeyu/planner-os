import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TimeEntry {
  id: string;
  activity: string;
  category: string;
  startTime: Date;
  endTime: Date;
}

interface TimeStatisticsProps {
  entries: TimeEntry[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TimeStatistics: React.FC<TimeStatisticsProps> = ({ entries }) => {
  const calculateTotalTimeByCategory = () => {
    const categoryTotals: { [key: string]: number } = {};
    entries.forEach((entry) => {
      const duration = entry.endTime.getTime() - entry.startTime.getTime();
      if (categoryTotals[entry.category]) {
        categoryTotals[entry.category] += duration;
      } else {
        categoryTotals[entry.category] = duration;
      }
    });
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: value / (1000 * 60 * 60), // Convert to hours
    }));
  };

  const data = calculateTotalTimeByCategory();

  return (
    <div className="h-96">
      <h2 className="text-lg font-semibold mb-4">Time Distribution by Category</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(2)} hours`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeStatistics;