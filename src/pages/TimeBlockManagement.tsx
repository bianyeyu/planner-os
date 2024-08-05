import React, { useState, useEffect } from 'react';
import TimeBlockForm from '../components/timeBlock/TimeBlockForm';
import TimeBlockList from '../components/timeBlock/TimeBlockList';
import { TimeBlock, TimeBlockWithTasks } from '../types/timeBlock';
import { Task } from '../types/task';

const TimeBlockManagement: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlockWithTasks[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState<TimeBlockWithTasks | undefined>(undefined);

  useEffect(() => {
    const storedTimeBlocks = localStorage.getItem('timeBlocks');
    const storedTasks = localStorage.getItem('tasks');
    if (storedTimeBlocks) setTimeBlocks(JSON.parse(storedTimeBlocks));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  }, []);

  const saveTimeBlocks = (newTimeBlocks: TimeBlockWithTasks[]) => {
    setTimeBlocks(newTimeBlocks);
    localStorage.setItem('timeBlocks', JSON.stringify(newTimeBlocks));
  };

  const handleTimeBlockSubmit = (timeBlockData: Omit<TimeBlock, 'id'>) => {
    if (editingTimeBlock) {
      const updatedTimeBlocks = timeBlocks.map(tb =>
        tb.id === editingTimeBlock.id 
          ? { ...tb, ...timeBlockData, id: tb.id, tasks: tasks.filter(task => timeBlockData.taskIds.includes(task.id)) } 
          : tb
      );
      saveTimeBlocks(updatedTimeBlocks);
    } else {
      const newTimeBlock: TimeBlockWithTasks = {
        ...timeBlockData,
        id: Date.now().toString(),
        tasks: tasks.filter(task => timeBlockData.taskIds.includes(task.id)),
      };
      saveTimeBlocks([...timeBlocks, newTimeBlock]);
    }
    setIsFormOpen(false);
    setEditingTimeBlock(undefined);
  };

  const handleEditTimeBlock = (timeBlock: TimeBlockWithTasks) => {
    setEditingTimeBlock(timeBlock);
    setIsFormOpen(true);
  };

  const handleDeleteTimeBlock = (timeBlockId: string) => {
    const updatedTimeBlocks = timeBlocks.filter(tb => tb.id !== timeBlockId);
    saveTimeBlocks(updatedTimeBlocks);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Time Block Management</h1>
      <button
        onClick={() => {
          setIsFormOpen(true);
          setEditingTimeBlock(undefined);
        }}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Add New Time Block
      </button>
      {isFormOpen && (
        <div className="mb-8">
          <TimeBlockForm
            timeBlock={editingTimeBlock}
            tasks={tasks}
            onSubmit={handleTimeBlockSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTimeBlock(undefined);
            }}
          />
        </div>
      )}
      <TimeBlockList
        timeBlocks={timeBlocks}
        onEditTimeBlock={handleEditTimeBlock}
        onDeleteTimeBlock={handleDeleteTimeBlock}
      />
    </div>
  );
};

export default TimeBlockManagement;