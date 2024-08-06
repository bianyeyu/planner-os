import React, { useState, useCallback } from 'react';
import { Task } from '../../types/task';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip, 
  Collapse, 
  IconButton, 
  Typography, 
  Box 
} from '@mui/material';
import { 
  ExpandLess, 
  ExpandMore, 
  CheckCircle, 
  RadioButtonUnchecked, 
  Pending 
} from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  level: number;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, onTaskClick, level }) => {
  const { updateTask } = useTaskContext();
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in-progress': return <Pending />;
      default: return <RadioButtonUnchecked />;
    }
  };

  const toggleTaskStatus = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'not-started' : 'completed';
    updateTask({ ...task, status: newStatus });
  }, [task, updateTask]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Expanding/Collapsing task:', task.id);
    setExpanded(prev => !prev);
  }, [task.id]);

  const handleTaskClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskClick(task);
  }, [task, onTaskClick]);

  console.log('Rendering TaskItem:', task.id, 'Expanded:', expanded);

  return (
    <>
      <ListItem 
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleTaskClick}
      >
        <ListItemIcon onClick={toggleTaskStatus}>
          {getStatusIcon(task.status)}
        </ListItemIcon>
        <ListItemText 
          primary={task.title}
          secondary={`${task.startDate} - ${task.dueDate}`}
        />
        {task.tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" style={{ marginRight: 4 }} />
        ))}
        {task.subTasks.length > 0 && (
          <IconButton onClick={handleExpand}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>
      {task.subTasks.length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {task.subTasks.map((subTask) => (
              <TaskItem 
                key={subTask.id} 
                task={subTask} 
                onTaskClick={onTaskClick} 
                level={level + 1} 
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
});

interface TaskListProps {
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskClick }) => {
  const { tasks } = useTaskContext();

  console.log('Rendering TaskList, tasks count:', tasks.length);

  return (
    <List>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskClick={onTaskClick} level={0} />
      ))}
    </List>
  );
};

export default TaskList;