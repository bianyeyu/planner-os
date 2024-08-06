export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  dueDate: string;
  tags: string[];
  subTasks: Task[];
}

export type TaskPriority = Task['priority'];