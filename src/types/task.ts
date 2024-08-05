export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'not-started' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    category: string;
    tags: string[];
    parentId?: string;
    subTasks: Task[];
  }
  
  export type TaskStatus = Task['status'];
  export type TaskPriority = Task['priority'];