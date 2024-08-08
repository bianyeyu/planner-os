// src/context/DailyContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import dayjs from 'dayjs';

export interface Node {
  id: string;
  content: string;
  level: number;
}

export interface DailyEntry {
  date: string;
  nodes: Node[];
}

interface DailyContextType {
  entries: DailyEntry[];
  setEntries: React.Dispatch<React.SetStateAction<DailyEntry[]>>;
  selectedNodes: string[];
  setSelectedNodes: React.Dispatch<React.SetStateAction<string[]>>;
  getBacklinks: (date: string) => DailyEntry[];
}

const DailyContext = createContext<DailyContextType | undefined>(undefined);

export const DailyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('dailyEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    } else {
      const today = dayjs().format('YYYY-MM-DD');
      setEntries([{ date: today, nodes: [{ id: '1', content: '', level: 0 }] }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyEntries', JSON.stringify(entries));
  }, [entries]);

  const getBacklinks = (date: string): DailyEntry[] => {
    return entries.filter(entry => 
      entry.date !== date && 
      entry.nodes.some(node => node.content.includes(`[[${date}]]`))
    );
  };

  return (
    <DailyContext.Provider value={{ entries, setEntries, selectedNodes, setSelectedNodes, getBacklinks }}>
      {children}
    </DailyContext.Provider>
  );
};

export const useDaily = () => {
  const context = useContext(DailyContext);
  if (context === undefined) {
    throw new Error('useDaily must be used within a DailyProvider');
  }
  return context;
};