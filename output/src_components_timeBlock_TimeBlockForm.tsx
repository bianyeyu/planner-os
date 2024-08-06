import React, { useState, useEffect } from 'react';
import { TimeBlock } from '../../types/timeBlock';
import { Task } from '../../types/task';

interface TimeBlockFormProps {
  timeBlock?: TimeBlock;
  tasks: Task[];
  onSubmit: (timeBlock: Omit<TimeBlock, 'id'>) => void;
  onCancel: () => void;
}

const TimeBlockForm: React.FC<TimeBlockFormProps> = ({ timeBlock, tasks, onSubmit, onCancel }) => {
  const [name, setName] = useState(timeBlock?.name || '');
  const [startTime, setStartTime] = useState(timeBlock?.startTime || '');
  const [endTime, setEndTime] = useState(timeBlock?.endTime || '');
  const [type, setType] = useState<TimeBlock['type']>(timeBlock?.type || 'work');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(timeBlock?.taskIds || []);

  useEffect(() => {
    if (timeBlock) {
      setName(timeBlock.name);
      setStartTime(timeBlock.startTime);
      setEndTime(timeBlock.endTime);
      setType(timeBlock.type);
      setSelectedTaskIds(timeBlock.taskIds);
    }
  }, [timeBlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      startTime,
      endTime,
      type,
      taskIds: selectedTaskIds,
    });
  };

  const handleTaskToggle = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
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
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as TimeBlock['type'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="work">Work</option>
          <option value="break">Break</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Associated Tasks</label>
        <div className="mt-2 space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={selectedTaskIds.includes(task.id)}
                onChange={() => handleTaskToggle(task.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`task-${task.id}`} className="ml-2 block text-sm text-gray-900">
                {task.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {timeBlock ? 'Update Time Block' : 'Create Time Block'}
        </button>
      </div>
    </form>
  );
};

export default TimeBlockForm;