export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'not-started' | 'in-progress' | 'completed';
    dueDate: string;
  }