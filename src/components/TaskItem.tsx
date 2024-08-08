import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, IconButton, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import dayjs from 'dayjs';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddSubtask: (parentId: string) => void;
  level: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask, onAddSubtask, level }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTask(task.id, { title: event.target.value });
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      onUpdateTask(task.id, { dueDate: date.format('YYYY-MM-DD') });
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCompletedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTask(task.id, { completed: event.target.checked });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        pl: level * 2 + 1,
        bgcolor: '#f5f5f5',
        borderRadius: 1,
        mb: 1,
        '&:hover': {
          bgcolor: '#e0e0e0',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={task.completed}
          onChange={handleCompletedChange}
          sx={{ mr: 1 }}
        />
        {isEditing ? (
          <TextField
            value={task.title}
            onChange={handleTitleChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
            fullWidth
            variant="standard"
          />
        ) : (
          <Typography
            variant="body1"
            onClick={() => setIsEditing(true)}
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </Typography>
        )}
        {isHovered && !isExpanded && (
          <Box>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <IconButton size="small" onClick={toggleExpand}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      {isExpanded && (
        <Box sx={{ pl: 4, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DatePicker
              value={dayjs(task.dueDate)}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  variant: "standard",
                  sx: { mr: 1 }
                }
              }}
            />
          </Box>
          {isHovered && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <IconButton size="small" onClick={() => onAddSubtask(task.id)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
      {task.subtasks && task.subtasks.length > 0 && isExpanded && (
        <Box sx={{ pl: 2 }}>
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onUpdateTask={onUpdateTask}
              onAddSubtask={onAddSubtask}
              level={level + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TaskItem;