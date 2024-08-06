import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/task';

interface PomodoroTimerProps {
  onTimerComplete: (duration: number, taskId?: string) => void;
  tasks: Task[];
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onTimerComplete, tasks }) => {
  const [workTime, setWorkTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);

  const resetTimer = useCallback(() => {
    setTime(isBreak ? breakTime : workTime);
    setIsActive(false);
  }, [isBreak, breakTime, workTime]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      onTimerComplete(isBreak ? breakTime : workTime, selectedTaskId);
      setIsBreak(!isBreak);
      resetTimer();
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, onTimerComplete, selectedTaskId, breakTime, workTime, resetTimer]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleWorkTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWorkTime = parseInt(e.target.value, 10) * 60;
    setWorkTime(newWorkTime);
    if (!isBreak) setTime(newWorkTime);
  };

  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBreakTime = parseInt(e.target.value, 10) * 60;
    setBreakTime(newBreakTime);
    if (isBreak) setTime(newBreakTime);
  };

  const handleTaskSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaskId(e.target.value === 'none' ? undefined : e.target.value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isBreak ? 'Break Time' : 'Work Time'}
      </h2>
      <div className="text-6xl font-bold mb-8 text-center">{formatTime(time)}</div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`px-4 py-2 rounded-md ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
        >
          Reset
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Work Time (minutes):
        </label>
        <input
          type="number"
          value={workTime / 60}
          onChange={handleWorkTimeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
          max="60"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Break Time (minutes):
        </label>
        <input
          type="number"
          value={breakTime / 60}
          onChange={handleBreakTimeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
          max="30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Task:
        </label>
        <select
          value={selectedTaskId || 'none'}
          onChange={handleTaskSelect}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="none">No task selected</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PomodoroTimer;