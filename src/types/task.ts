// src/types/task.ts

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'not-started' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    dueDate: string;
    estimatedTime?: number;
    tags: string[];
    subTasks: Task[];
  }
  
  export type TaskStatus = Task['status'];
  export type TaskPriority = Task['priority'];