import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, IconButton, Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const theme = useTheme();

  const tasks = [
    { time: '09:00', task: '团队晨会' },
    { time: '11:00', task: '客户演示' },
    { time: '14:00', task: '代码审查' },
    { time: '16:00', task: '项目规划会议' },
    { time: '18:00', task: '日报总结' },
  ];

  const timeRecords = [
    { time: '09:00-10:30', activity: '会议' },
    { time: '11:00-13:30', activity: '编程' },
    { time: '14:00-16:00', activity: '设计' },
    { time: '16:00-17:30', activity: '文档' },
  ];

  const views = ['时间轴视图', '时间段视图', '日视图', '周视图', '月视图'];
  const filters = ['全部任务', '优先级高', '今日截止', '未完成', '已完成'];

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">{t('dashboard.greeting', { username: '用户名' })}</Typography>
          <IconButton 
            sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          >
            {rightSidebarOpen ? <ChevronRightIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
          {/* Left Timeline */}
          <Box sx={{ width: '48%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t('dashboard.todayTasks')}</Typography>
            <Box sx={{ bgcolor: theme.palette.background.paper, p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>{t('dashboard.allDayTasks')}</Typography>
              <ExpandMoreIcon />
            </Box>
            <Box sx={{ position: 'relative', pl: 4, height: 'calc(100% - 100px)' }}>
              <Box sx={{ position: 'absolute', left: 8, top: 0, bottom: 50, width: 2, bgcolor: theme.palette.primary.main }} />
              {tasks.map((task, index) => (
                <Box key={index} sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    bgcolor: theme.palette.primary.main, 
                    position: 'absolute',
                    left: 2,
                    marginTop: '3px'
                  }} />
                  <Typography sx={{ ml: 3 }}>{task.time} {task.task}</Typography>
                </Box>
              ))}
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  left: -4, 
                  bottom: 0, 
                  bgcolor: theme.palette.primary.main, 
                  color: theme.palette.primary.contrastText,
                  '&:hover': { bgcolor: theme.palette.primary.dark }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Right Timeline */}
          <Box sx={{ width: '48%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t('dashboard.timeRecords')}</Typography>
            <Box sx={{ position: 'relative', pl: 4, height: 'calc(100% - 60px)' }}>
              <Box sx={{ position: 'absolute', left: 8, top: 0, bottom: 50, width: 2, bgcolor: theme.palette.secondary.main }} />
              {timeRecords.map((record, index) => (
                <Box key={index} sx={{ mb: 4, position: 'relative' }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    bgcolor: theme.palette.secondary.main, 
                    position: 'absolute',
                    left: 2,
                    top: 12,
                    zIndex: 1
                  }} />
                  <Box sx={{ 
                    ml: 3,
                    height: 40, 
                    width: 'calc(100% - 24px)', 
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    pl: 2
                  }}>
                    <Typography>{record.time} {record.activity}</Typography>
                  </Box>
                </Box>
              ))}
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  left: -4, 
                  bottom: 0, 
                  bgcolor: theme.palette.secondary.main, 
                  color: theme.palette.secondary.contrastText,
                  '&:hover': { bgcolor: theme.palette.secondary.dark }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      {rightSidebarOpen && (
        <Box sx={{ 
          width: 220, 
          bgcolor: theme.palette.background.paper, 
          py: 2, 
          px: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          borderLeft: `1px solid ${theme.palette.divider}`,
          overflow: 'auto'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>切换视图</Typography>
          {views.map((view, index) => (
            <Button
              key={index}
              variant={index === 0 ? "contained" : "outlined"}
              sx={{
                mb: 1,
                bgcolor: index === 0 ? theme.palette.primary.main : 'transparent',
                color: index === 0 ? theme.palette.primary.contrastText : theme.palette.text.primary,
                border: index === 0 ? 'none' : `1px solid ${theme.palette.divider}`,
                borderRadius: '20px',
                '&:hover': { bgcolor: index === 0 ? theme.palette.primary.dark : theme.palette.action.hover },
              }}
            >
              {view}
            </Button>
          ))}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>切换筛选</Typography>
          {filters.map((filter, index) => (
            <Button
              key={index}
              variant={index === 0 ? "contained" : "outlined"}
              sx={{
                mb: 1,
                bgcolor: index === 0 ? theme.palette.primary.main : 'transparent',
                color: index === 0 ? theme.palette.primary.contrastText : theme.palette.text.primary,
                border: index === 0 ? 'none' : `1px solid ${theme.palette.divider}`,
                borderRadius: '20px',
                '&:hover': { bgcolor: index === 0 ? theme.palette.primary.dark : theme.palette.action.hover },
              }}
            >
              {filter}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;