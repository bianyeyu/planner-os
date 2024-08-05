import React, { useState, useEffect } from 'react';
import TaskList from '../components/task/TaskList';
import TaskForm from '../components/task/TaskForm';
import { Task } from '../types/task';

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('TaskManagement component mounted');
    // Load tasks from localStorage or API here
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try refreshing the page.');
    }
  }, []);

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id'>) => {
    try {
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
      // Save tasks to localStorage
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error('Error submitting task:', err);
      setError('Failed to save task. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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

      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      ) : (
        <p>No tasks available. Click 'Add New Task' to create one.</p>
      )}
    </div>
  );
};

export default TaskManagement;