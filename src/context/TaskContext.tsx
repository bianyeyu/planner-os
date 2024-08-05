import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const addTask = (task: Task) => {
    const newTasks = [...tasks, task];
    saveTasks(newTasks);
  };

  const updateTask = (updatedTask: Task) => {
    const newTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    saveTasks(newTasks);
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};