import React, { useState } from 'react';
import TimeEntryForm from '../components/TimeEntryForm';
import TimeStatistics from '../components/TimeStatistics';

interface TimeEntry {
  id: string;
  activity: string;
  category: string;
  startTime: Date;
  endTime: Date;
}

const TimeTracking: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const handleSubmit = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setTimeEntries([...timeEntries, newEntry]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Lioubov Time Tracking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Record Time Entry</h2>
          <TimeEntryForm onSubmit={handleSubmit} />
        </div>
        <div>
          <TimeStatistics entries={timeEntries} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Time Entries</h2>
        <ul className="divide-y divide-gray-200">
          {timeEntries.map((entry) => (
            <li key={entry.id} className="py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.activity}</p>
                  <p className="text-sm text-gray-500">{entry.category}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {entry.startTime.toLocaleString()} - {entry.endTime.toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeTracking;