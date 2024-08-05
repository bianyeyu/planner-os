import React, { useState } from 'react';

interface TimeEntry {
  id: string;
  activity: string;
  category: string;
  startTime: Date;
  endTime: Date;
}

interface TimeEntryFormProps {
  onSubmit: (entry: Omit<TimeEntry, 'id'>) => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSubmit }) => {
  const [activity, setActivity] = useState('');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      activity,
      category,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });
    // Reset form
    setActivity('');
    setCategory('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
          Activity
        </label>
        <input
          type="text"
          id="activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="datetime-local"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Record Time Entry
      </button>
    </form>
  );
};

export default TimeEntryForm;