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
  subTasks: Task[]; // 这里改为递归的 Task 类型
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];