import React, { useState, useEffect } from 'react';
import HabitForm from '../components/habit/HabitForm';
import HabitTracker from '../components/habit/HabitTracker';
import { Habit, HabitLog } from '../types/habit';

const HabitManagement: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    const storedHabitLogs = localStorage.getItem('habitLogs');
    if (storedHabits) setHabits(JSON.parse(storedHabits));
    if (storedHabitLogs) setHabitLogs(JSON.parse(storedHabitLogs));
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem('habits', JSON.stringify(newHabits));
  };

  const saveHabitLogs = (newHabitLogs: HabitLog[]) => {
    setHabitLogs(newHabitLogs);
    localStorage.setItem('habitLogs', JSON.stringify(newHabitLogs));
  };

  const handleHabitSubmit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (editingHabit) {
      const updatedHabits = habits.map(h =>
        h.id === editingHabit.id ? { ...h, ...habitData } : h
      );
      saveHabits(updatedHabits);
    } else {
      const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      saveHabits([...habits, newHabit]);
    }
    setIsFormOpen(false);
    setEditingHabit(undefined);
  };

  const handleToggleHabit = (habitId: string, date: string, completed: boolean) => {
    const existingLog = habitLogs.find(log => log.habitId === habitId && log.date === date);
    if (existingLog) {
      const updatedLogs = habitLogs.map(log =>
        log.id === existingLog.id ? { ...log, completed } : log
      );
      saveHabitLogs(updatedLogs);
    } else {
      const newLog: HabitLog = {
        id: Date.now().toString(),
        habitId,
        date,
        completed,
      };
      saveHabitLogs([...habitLogs, newLog]);
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Habit Management</h1>
      <button
        onClick={() => setIsFormOpen(true)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Add New Habit
      </button>
      {isFormOpen && (
        <div className="mb-8">
          <HabitForm
            habit={editingHabit}
            onSubmit={handleHabitSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingHabit(undefined);
            }}
          />
        </div>
      )}
      <HabitTracker
        habits={habits}
        habitLogs={habitLogs}
        onToggleHabit={handleToggleHabit}
        onEditHabit={handleEditHabit}
      />
    </div>
  );
};

export default HabitManagement;