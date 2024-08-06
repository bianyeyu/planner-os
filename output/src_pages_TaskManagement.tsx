import React, { useState, useEffect, createContext } from 'react';
import { Button, Box } from '@mui/material';
import TaskForm from '../components/task/TaskForm';
import TaskList from '../components/task/TaskList';
import { Task } from '../types/task';

export const TaskContext = createContext<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
} | undefined>(undefined);

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...taskData, id: task.id } : task
      );
      saveTasks(updatedTasks);
    } else {
      // Create new task
      const newTask: Task = { ...taskData, id: Date.now().toString(), subTasks: [] };
      saveTasks([...tasks, newTask]);
    }
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      <Box sx={{ p: 3 }}>
        <h1>Task Management</h1>
        <Button onClick={() => setIsFormOpen(true)} variant="contained" color="primary" sx={{ mb: 2 }}>
          Add New Task
        </Button>
        {isFormOpen && (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setEditingTask(null);
              setIsFormOpen(false);
            }}
          />
        )}
        <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      </Box>
    </TaskContext.Provider>
  );
};

export default TaskManagement;