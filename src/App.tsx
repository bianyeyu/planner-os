import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';
import CalendarView from './pages/CalendarView';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </Layout>
  );
};

export default App;