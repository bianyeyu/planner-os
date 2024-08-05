import { Task } from './task';

export interface TimeBlock {
  id: string;
  name: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: 'work' | 'break' | 'personal';
  taskIds: string[];
}

export interface TimeBlockWithTasks extends TimeBlock {
  tasks: Task[];
}