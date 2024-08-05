import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';
import CalendarView from './pages/CalendarView';
import TimeTracking from './pages/TimeTracking';
import HabitManagement from './pages/HabitManagement';
import TimeBlockManagement from './pages/TimeBlockManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6750A4',
    },
    secondary: {
      main: '#958DA5',
    },
    background: {
      default: '#FFFBFE',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/habits" element={<HabitManagement />} />
            <Route path="/time-blocks" element={<TimeBlockManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;