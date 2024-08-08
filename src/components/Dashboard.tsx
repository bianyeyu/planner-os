import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

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
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      <Box sx={{ flex: 1, mr: rightSidebarOpen ? '220px' : 0, transition: 'margin-right 0.3s' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">{t('dashboard.greeting', { username: '用户名' })}</Typography>
          <IconButton 
            sx={{ bgcolor: '#6750A4', color: 'white' }}
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          >
            {rightSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left Timeline */}
          <Box sx={{ width: '48%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t('dashboard.todayTasks')}</Typography>
            <Box sx={{ bgcolor: '#E8DEF8', p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>{t('dashboard.allDayTasks')}</Typography>
              <ExpandMoreIcon />
            </Box>
            <Box sx={{ position: 'relative', pl: 4 }}>
              <Box sx={{ position: 'absolute', left: 8, top: 0, bottom: 50, width: 2, bgcolor: '#6750A4' }} />
              {tasks.map((task, index) => (
                <Box key={index} sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    bgcolor: '#6750A4', 
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
                  bgcolor: '#6750A4', 
                  color: 'white',
                  '&:hover': { bgcolor: '#5c4593' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Right Timeline */}
          <Box sx={{ width: '48%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t('dashboard.timeRecords')}</Typography>
            <Box sx={{ position: 'relative', pl: 4 }}>
              <Box sx={{ position: 'absolute', left: 8, top: 0, bottom: 50, width: 2, bgcolor: '#03DAC6' }} />
              {timeRecords.map((record, index) => (
                <Box key={index} sx={{ mb: 4, position: 'relative' }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    bgcolor: '#03DAC6', 
                    position: 'absolute',
                    left: 2,
                    top: 12,
                    zIndex: 1
                  }} />
                  <Box sx={{ 
                    ml: 3,
                    height: 40, 
                    width: 'calc(100% - 24px)', 
                    bgcolor: 'rgba(3, 218, 198, 0.2)',
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
                  bgcolor: '#03DAC6', 
                  color: 'white',
                  '&:hover': { bgcolor: '#02b9a5' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box sx={{ 
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: rightSidebarOpen ? 220 : 0,
        bgcolor: 'white', 
        py: 2, 
        px: rightSidebarOpen ? 1 : 0, 
        display: 'flex', 
        flexDirection: 'column', 
        borderLeft: '1px solid #e0e0e0',
        transition: 'width 0.3s, padding 0.3s',
        overflow: 'hidden'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>切换视图</Typography>
        {views.map((view, index) => (
          <Button
            key={index}
            variant={index === 0 ? "contained" : "outlined"}
            sx={{
              mb: 1,
              bgcolor: index === 0 ? '#E8DEF8' : 'white',
              color: '#1C1B1F',
              border: index === 0 ? 'none' : '1px solid #CAC4D0',
              borderRadius: '20px',
              '&:hover': { bgcolor: index === 0 ? '#E8DEF8' : 'white' },
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
              bgcolor: index === 0 ? '#E8DEF8' : 'white',
              color: '#1C1B1F',
              border: index === 0 ? 'none' : '1px solid #CAC4D0',
              borderRadius: '20px',
              '&:hover': { bgcolor: index === 0 ? '#E8DEF8' : 'white' },
            }}
          >
            {filter}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;