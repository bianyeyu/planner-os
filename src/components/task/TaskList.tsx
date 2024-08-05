import React, { useContext } from 'react';
import { Task } from '../../types/task';
import { List, ListItem, ListItemText, ListItemIcon, Chip, Collapse, IconButton, Button } from '@mui/material';
import { ExpandLess, ExpandMore, CheckCircle, RadioButtonUnchecked, Pending } from '@mui/icons-material';
import { TaskContext } from '../../pages/TaskManagement';

interface TaskItemProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  level: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskClick, level }) => {
  const [open, setOpen] = React.useState(false);
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    throw new Error("TaskContext not found");
  }

  const { tasks, setTasks } = taskContext;

  const handleClick = () => {
    setOpen(!open);
    onTaskClick(task);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in-progress': return <Pending />;
      default: return <RadioButtonUnchecked />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const updateTaskStatusRecursively = (taskToUpdate: Task, newStatus: Task['status']): Task => {
    return {
      ...taskToUpdate,
      status: newStatus,
      subTasks: taskToUpdate.subTasks.map(subTask => updateTaskStatusRecursively(subTask, newStatus))
    };
  };

  const toggleTaskStatus = () => {
    const newStatus = task.status === 'completed' ? 'not-started' : 'completed';
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? updateTaskStatusRecursively(t, newStatus) : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <>
      <ListItem button onClick={handleClick} style={{ paddingLeft: `${level * 16}px` }}>
        <ListItemIcon>{getStatusIcon(task.status)}</ListItemIcon>
        <ListItemText 
          primary={task.title}
          secondary={`${formatDate(task.startDate)} - ${formatDate(task.endDate)} | Est. ${task.estimatedTime} min | Priority: ${task.priority}`}
        />
        {task.tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" style={{ marginRight: 4 }} />
        ))}
        <Button onClick={(e) => { e.stopPropagation(); toggleTaskStatus(); }}>
          {task.status === 'completed' ? 'Reopen' : 'Complete'}
        </Button>
        {task.subTasks.length > 0 && (
          <IconButton onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>
      {task.subTasks.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {task.subTasks.map((subTask) => (
              <TaskItem key={subTask.id} task={subTask} onTaskClick={onTaskClick} level={level + 1} />
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