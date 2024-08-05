import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const upcomingTasks = [
    { id: '1', title: 'Complete project proposal', dueDate: '2023-08-15' },
    { id: '2', title: 'Review team performance', dueDate: '2023-08-10' },
    { id: '3', title: 'Prepare for client meeting', dueDate: '2023-08-20' },
  ];

  const timeBlockSummary = {
    totalHours: 8,
    productive: 5.5,
    unproductive: 2.5,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Tasks</h3>
          <div className="mt-5">
            <ul className="divide-y divide-gray-200">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.dueDate}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Link to="/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all tasks
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Time Block Summary</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{timeBlockSummary.totalHours}</dd>
            </div>
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Productive Hours</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{timeBlockSummary.productive}</dd>
            </div>
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Unproductive Hours</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">{timeBlockSummary.unproductive}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;