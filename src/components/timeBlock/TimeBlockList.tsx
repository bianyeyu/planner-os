import React from 'react';
import { TimeBlockWithTasks } from '../../types/timeBlock';

interface TimeBlockListProps {
  timeBlocks: TimeBlockWithTasks[];
  onEditTimeBlock: (timeBlock: TimeBlockWithTasks) => void;
  onDeleteTimeBlock: (timeBlockId: string) => void;
}

const TimeBlockList: React.FC<TimeBlockListProps> = ({ timeBlocks, onEditTimeBlock, onDeleteTimeBlock }) => {
  const getTypeColor = (type: TimeBlockWithTasks['type']) => {
    switch (type) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'break': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {timeBlocks.map(timeBlock => (
        <div key={timeBlock.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{timeBlock.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {new Date(timeBlock.startTime).toLocaleString()} - {new Date(timeBlock.endTime).toLocaleString()}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(timeBlock.type)}`}>
                    {timeBlock.type}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Associated Tasks</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {timeBlock.tasks.map(task => (
                      <li key={task.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">{task.title}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              onClick={() => onEditTimeBlock(timeBlock)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTimeBlock(timeBlock.id)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeBlockList;