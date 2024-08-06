import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Task } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task, parentTaskId?: string) => void;
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

  const saveTasks = useCallback((newTasks: Task[]) => {
    console.log('Saving tasks, count:', newTasks.length);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }, []);

  const addTask = useCallback((task: Task, parentTaskId?: string) => {
    setTasks(prevTasks => {
      if (parentTaskId) {
        return prevTasks.map(t => {
          if (t.id === parentTaskId) {
            return { ...t, subTasks: [...t.subTasks, task] };
          }
          return t;
        });
      } else {
        return [...prevTasks, task];
      }
    });
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => {
      const updateTaskRecursive = (taskList: Task[]): Task[] => {
        return taskList.map(task => {
          if (task.id === updatedTask.id) {
            return updatedTask;
          }
          if (task.subTasks.length > 0) {
            return { ...task, subTasks: updateTaskRecursive(task.subTasks) };
          }
          return task;
        });
      };

      return updateTaskRecursive(prevTasks);
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const deleteTaskRecursive = (taskList: Task[]): Task[] => {
        return taskList.filter(task => {
          if (task.id === taskId) {
            return false;
          }
          if (task.subTasks.length > 0) {
            task.subTasks = deleteTaskRecursive(task.subTasks);
          }
          return true;
        });
      };

      return deleteTaskRecursive(prevTasks);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const contextValue = React.useMemo(() => ({
    tasks,
    addTask,
    updateTask,
    deleteTask,
  }), [tasks, addTask, updateTask, deleteTask]);

  return (
    <TaskContext.Provider value={contextValue}>
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