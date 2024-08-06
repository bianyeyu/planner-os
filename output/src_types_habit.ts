export interface Habit {
    id: string;
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    targetDays?: number[]; // For weekly habits, 0 = Sunday, 1 = Monday, etc.
    createdAt: string;
    archivedAt?: string;
  }
  
  export interface HabitLog {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
  }