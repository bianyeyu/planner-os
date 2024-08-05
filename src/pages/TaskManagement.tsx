import React, { useState } from 'react';
import TaskList from '../components/task/TaskList';
import TaskForm from '../components/task/TaskForm';
import { Task } from '../types/task';

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete project proposal', status: 'in-progress', dueDate: '2023-08-15' },
    { id: '2', title: 'Review team performance', status: 'completed', dueDate: '2023-08-10' },
    { id: '3', title: 'Prepare for client meeting', status: 'in-progress', dueDate: '2023-08-20' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: String(Date.now()), // Simple ID generation
      };
      setTasks([...tasks, newTask]);
    }
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Task Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Task
        </button>
      </div>
      
      {isFormOpen && (
        <div className="mb-6">
          <TaskForm
            task={editingTask}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
    </div>
  );
};

export default TaskManagement;