import React, { useState, useEffect } from 'react';

interface PomodoroTimerProps {
  initialTime: number; // in seconds
  onTimerComplete: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ initialTime, onTimerComplete }) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      onTimerComplete();
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time, onTimerComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Pomodoro Timer</h2>
      <div className="text-6xl font-bold mb-8 text-center">{formatTime(time)}</div>
      <div className="flex justify-center space-x-4">
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
    </div>
  );
};

export default PomodoroTimer;