import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography, Drawer, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useProject } from '../context/ProjectContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { projects, addProject, deleteProject } = useProject();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        name: newProjectName,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        tasks: [],
        documents: [],
        notes: []
      };
      addProject(newProject);
      setNewProjectDialogOpen(false);
      setNewProjectName('');
    }
  };

  const handleDeleteProject = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      if (location.pathname === `/project/${id}`) {
        navigate('/');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? 240 : 60,
            boxSizing: 'border-box',
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          alignItems: sidebarOpen ? 'flex-start' : 'center',
        }}>
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ 
              alignSelf: 'center', 
              mb: 2, 
              color: theme.palette.primary.main,
              ...(sidebarOpen && { alignSelf: 'flex-start' })
            }}
          >
            <MenuIcon />
          </IconButton>

          <List sx={{ width: '100%' }}>
            <ListItem button onClick={() => navigate('/')} sx={{ mb: 1, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                <HomeIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary={t('navigation.home')} />}
            </ListItem>
            <ListItem button onClick={() => navigate('/inbox')} sx={{ mb: 1, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                <InboxIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="收集箱" />}
            </ListItem>
          </List>

          {sidebarOpen && <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Projects</Typography>}
          <List sx={{ flexGrow: 1, overflowY: 'auto', width: '100%' }}>
            {sidebarOpen && projects.map((project) => (
              <ListItem 
                button 
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                sx={{ 
                  py: 0.5, 
                  color: location.pathname === `/project/${project.id}` ? theme.palette.primary.main : theme.palette.text.secondary,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">
                  {project.name}
                </Typography>
                {hoveredProject === project.id && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            ))}
            {sidebarOpen && (
              <ListItem>
                <Button 
                  startIcon={<AddIcon />} 
                  sx={{ color: theme.palette.primary.main, justifyContent: 'flex-start', px: 0 }}
                  onClick={() => setNewProjectDialogOpen(true)}
                >
                  添加项目
                </Button>
              </ListItem>
            )}
          </List>
          <List sx={{ width: '100%' }}>
            <ListItem button sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                <FitnessCenterIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="习惯管理" />}
            </ListItem>
            <ListItem button sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                <BarChartIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="数据统计" />}
            </ListItem>
            <ListItem button sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                <InsightsIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="数据分析" />}
            </ListItem>
            <ListItem button onClick={() => navigate('/settings')} sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                <SettingsIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary={t('navigation.settings')} />}
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.background.default, overflow: 'auto' }}>
        {children}
      </Box>
      <Dialog open={newProjectDialogOpen} onClose={() => setNewProjectDialogOpen(false)}>
        <DialogTitle>创建新项目</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="项目名称"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewProjectDialogOpen(false)}>取消</Button>
          <Button onClick={handleAddProject}>创建</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;