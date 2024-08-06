import React from 'react';
import { Habit, HabitLog } from '../../types/habit';

interface HabitTrackerProps {
  habits: Habit[];
  habitLogs: HabitLog[];
  onToggleHabit: (habitId: string, date: string, completed: boolean) => void;
  onEditHabit: (habit: Habit) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, habitLogs, onToggleHabit, onEditHabit }) => {
  const today = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const isHabitCompleted = (habitId: string, date: string) => {
    return habitLogs.some(log => log.habitId === habitId && log.date === date && log.completed);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habit</th>
            {past7Days.map(date => (
              <th key={date} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {habits.map(habit => (
            <tr key={habit.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">{habit.name}</div>
                  <button
                    onClick={() => onEditHabit(habit)}
                    className="ml-2 text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </div>
              </td>
              {past7Days.map(date => (
                <td key={date} className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleHabit(habit.id, date, !isHabitCompleted(habit.id, date))}
                    className={`w-6 h-6 rounded-full ${
                      isHabitCompleted(habit.id, date) ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  >
                    {isHabitCompleted(habit.id, date) && (
                      <svg className="w-4 h-4 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTracker;