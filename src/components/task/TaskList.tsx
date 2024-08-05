import React from 'react';
import { Task } from '../../types/task';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import LowPriorityIcon from '@mui/icons-material/LowPriority';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'in-progress': return <PendingIcon />;
      default: return <RadioButtonUncheckedIcon />;
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <PriorityHighIcon />;
      case 'medium': return <DragHandleIcon />;
      case 'low': return <LowPriorityIcon />;
    }
  };

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} onClick={() => onTaskClick(task)} button>
          <ListItemIcon>
            {getStatusIcon(task.status)}
          </ListItemIcon>
          <ListItemText
            primary={task.title}
            secondary={
              <>
                <Typography component="span" variant="body2" color="text.primary">
                  {task.description}
                </Typography>
                <br />
                Due: {new Date(task.dueDate).toLocaleDateString()}
                <br />
                Category: {task.category}
              </>
            }
          />
          <ListItemIcon>
            {getPriorityIcon(task.priority)}
          </ListItemIcon>
          {task.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" />
          ))}
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;