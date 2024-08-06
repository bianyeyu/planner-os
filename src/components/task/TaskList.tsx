import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  IconButton,
  Typography,
  Collapse,
} from '@mui/material';
import { 
  Edit as EditIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  level: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskClick, level }) => {
  const [open, setOpen] = useState(false);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
    }
  };

  return (
    <>
      <ListItem
        style={{ paddingLeft: `${level * 20}px` }}
        secondaryAction={
          <>
            {task.subTasks.length > 0 && (
              <IconButton edge="end" aria-label="expand" onClick={() => setOpen(!open)}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            <IconButton edge="end" aria-label="edit" onClick={() => onTaskClick(task)}>
              <EditIcon />
            </IconButton>
          </>
        }
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" component="div">
              {task.title}
              <Chip
                size="small"
                label={task.priority}
                color={getPriorityColor(task.priority)}
                style={{ marginLeft: '10px' }}
              />
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" component="span">
                {task.startDate} - {task.dueDate}
              </Typography>
              <div>
                {task.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" style={{ marginRight: 4, marginTop: 4 }} />
                ))}
              </div>
            </>
          }
        />
      </ListItem>
      {task.subTasks.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {task.subTasks.map((subTask, index) => (
              <TaskItem key={index} task={subTask} onTaskClick={onTaskClick} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {
  return (
    <List>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskClick={onTaskClick} level={0} />
      ))}
    </List>
  );
};

export default TaskList;