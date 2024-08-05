import React, { useState } from 'react';
import { Task } from '../../types/task';
import { List, ListItem, ListItemText, ListItemIcon, Chip, Collapse, IconButton, Typography, Box } from '@mui/material';
import { ExpandLess, ExpandMore, CheckCircle, RadioButtonUnchecked, Pending } from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskClick }) => {
  const { updateTask } = useTaskContext();

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in-progress': return <Pending />;
      default: return <RadioButtonUnchecked />;
    }
  };

  const toggleTaskStatus = () => {
    const newStatus = task.status === 'completed' ? 'not-started' : 'completed';
    updateTask({ ...task, status: newStatus });
  };

  return (
    <ListItem>
      <ListItemIcon onClick={toggleTaskStatus}>
        {getStatusIcon(task.status)}
      </ListItemIcon>
      <ListItemText 
        primary={task.title}
        secondary={`${task.startDate} - ${task.dueDate}`}
        onClick={() => onTaskClick(task)}
      />
      {task.tags.map((tag, index) => (
        <Chip key={index} label={tag} size="small" style={{ marginRight: 4 }} />
      ))}
    </ListItem>
  );
};

interface TaskListProps {
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskClick }) => {
  const { tasks } = useTaskContext();
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <List>
      {activeTasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskClick={onTaskClick} />
      ))}
      <ListItem button onClick={() => setCompletedExpanded(!completedExpanded)}>
        <ListItemText primary={<Typography variant="h6">已完成</Typography>} />
        <IconButton edge="end" aria-label="expand">
          {completedExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={completedExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {completedTasks.map((task) => (
            <Box key={task.id} ml={2}>
              <TaskItem task={task} onTaskClick={onTaskClick} />
            </Box>
          ))}
        </List>
      </Collapse>
    </List>
  );
};

export default TaskList;