import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';
import CalendarView from './pages/CalendarView';
import TimeTracking from './pages/TimeTracking';
import HabitManagement from './pages/HabitManagement';
import TimeBlockManagement from './pages/TimeBlockManagement';
import Daily from './pages/Daily';
import { TaskProvider } from './context/TaskContext';
import { DailyProvider } from './context/DailyContext';

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
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TaskProvider>
          <DailyProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/daily" replace />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<TaskManagement />} />
                  <Route path="/calendar" element={<CalendarView />} />
                  <Route path="/time-tracking" element={<TimeTracking />} />
                  <Route path="/habits" element={<HabitManagement />} />
                  <Route path="/time-blocks" element={<TimeBlockManagement />} />
                </Routes>
              </Layout>
            </Router>
          </DailyProvider>
        </TaskProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;