export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  details?: string;
  subtasks: Task[];
  progress: number;
}