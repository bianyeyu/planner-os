import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ProjectPage from './pages/ProjectPage';
import { TaskProvider } from './context/TaskContext';
import { DailyProvider } from './context/DailyContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProjectProvider } from './context/ProjectContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TaskProvider>
            <DailyProvider>
              <ProjectProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/project/:projectId" element={<ProjectPage />} />
                    {/* Add other routes as needed */}
                  </Routes>
                </Layout>
              </ProjectProvider>
            </DailyProvider>
          </TaskProvider>
        </LocalizationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;