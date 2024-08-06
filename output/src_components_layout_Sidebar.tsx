import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Tasks', path: '/tasks', icon: <AssignmentIcon /> },
  { name: 'Calendar', path: '/calendar', icon: <CalendarTodayIcon /> },
  { name: 'Time Tracking', path: '/time-tracking', icon: <TimerIcon /> },
  { name: 'Habits', path: '/habits', icon: <EmojiEventsIcon /> },
  { name: 'Time Blocks', path: '/time-blocks', icon: <ViewWeekIcon /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.name}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;