import React from 'react';
import Calendar from '../components/Calendar';

const CalendarView: React.FC = () => {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Calendar</h1>
      <Calendar />
    </div>
  );
};

export default CalendarView;