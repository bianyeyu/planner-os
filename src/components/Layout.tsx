import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, List, ListItem, Typography, Drawer, Button, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();

  const projects = [
    { icon: '🚀', name: '网站重设计' },
    { icon: '📊', name: '数据分析报告' },
    { icon: '📱', name: '移动应用开发' },
    { icon: '🛠️', name: '系统维护' },
    { icon: '📚', name: '文档编写' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
            transition: 'width 0.3s',
            overflowX: 'hidden',
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <IconButton onClick={toggleSidebar} sx={{ alignSelf: 'flex-start', mb: 2, color: theme.palette.primary.main }}>
            <MenuIcon />
          </IconButton>

          <Button 
            onClick={() => navigate('/')}
            sx={{ color: theme.palette.text.primary, justifyContent: 'flex-start', width: '100%', mb: 2 }}
          >
            {sidebarOpen ? <><HomeIcon sx={{ mr: 1 }} /> {t('navigation.home')}</> : <HomeIcon />} 
          </Button>

          {sidebarOpen && <Typography variant="h6" sx={{ mb: 2 }}>Projects</Typography>}
          <List>
            {sidebarOpen && projects.map((project, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {project.icon} {project.name}
                </Typography>
              </ListItem>
            ))}
            {sidebarOpen && (
              <ListItem>
                <Button startIcon={<AddIcon />} sx={{ color: theme.palette.primary.main, justifyContent: 'flex-start', px: 0 }}>
                  添加项目
                </Button>
              </ListItem>
            )}
          </List>
          <Box sx={{ mt: 'auto' }}>
            <Button sx={{ color: theme.palette.text.primary, justifyContent: 'flex-start', width: '100%' }}>
              {sidebarOpen ? <><BarChartIcon sx={{ mr: 1 }} /> 数据统计</> : <BarChartIcon />}
            </Button>
            <Button sx={{ color: theme.palette.text.primary, justifyContent: 'flex-start', width: '100%' }}>
              {sidebarOpen ? <><InsightsIcon sx={{ mr: 1 }} /> 数据分析</> : <InsightsIcon />}
            </Button>
            <Button 
              onClick={() => navigate('/settings')} 
              sx={{ color: theme.palette.text.primary, justifyContent: 'flex-start', width: '100%' }}
            >
              {sidebarOpen ? <><SettingsIcon sx={{ mr: 1 }} /> {t('navigation.settings')}</> : <SettingsIcon />} 
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.background.default, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;