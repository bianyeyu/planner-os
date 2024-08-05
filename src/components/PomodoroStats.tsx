import React from 'react';
import { Task } from '../types/task';

interface PomodoroSession {
  duration: number;
  taskId?: string;
  timestamp: number;
}

interface PomodoroStatsProps {
  sessions: PomodoroSession[];
  tasks: Task[];
}

const PomodoroStats: React.FC<PomodoroStatsProps> = ({ sessions, tasks }) => {
  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);

  const taskStats = tasks.map(task => {
    const taskSessions = sessions.filter(session => session.taskId === task.id);
    const taskTime = taskSessions.reduce((sum, session) => sum + session.duration, 0);
    return {
      taskId: task.id,
      taskTitle: task.title,
      sessionCount: taskSessions.length,
      totalTime: taskTime,
    };
  });

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pomodoro Statistics</h2>
      <div className="mb-6">
        <p>Total Sessions: {totalSessions}</p>
        <p>Total Time: {formatTime(totalTime)}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Task Breakdown</h3>
      <ul className="space-y-2">
        {taskStats.map(stat => (
          <li key={stat.taskId} className="border-b pb-2">
            <p className="font-medium">{stat.taskTitle}</p>
            <p>Sessions: {stat.sessionCount}</p>
            <p>Time: {formatTime(stat.totalTime)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PomodoroStats;