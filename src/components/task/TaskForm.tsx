import React, { useState } from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  Chip, 
  Grid, 
  FormControl,
  InputLabel,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Task, TaskPriority } from '../../types/task';
import dayjs, { Dayjs } from 'dayjs';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [startDate, setStartDate] = useState<Dayjs | null>(task?.startDate ? dayjs(task.startDate) : null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(task?.dueDate ? dayjs(task.dueDate) : null);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [subTasks, setSubTasks] = useState<Omit<Task, 'id'>[]>(task?.subTasks || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : '',
      tags,
      subTasks,
    });
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, {
      title: '',
      description: '',
      priority: 'medium',
      startDate: '',
      dueDate: '',
      tags: [],
      subTasks: [],
    }]);
  };

  const handleSubTaskChange = (index: number, updatedSubTask: Omit<Task, 'id'>) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = updatedSubTask;
    setSubTasks(updatedSubTasks);
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e: SelectChangeEvent) => setPriority(e.target.value as TaskPriority)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Subtasks</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddSubTask}>
                Add Subtask
              </Button>
            </Box>
            <List>
              {subTasks.map((subTask, index) => (
                <ListItem key={index}>
                  <TaskForm
                    task={subTask as Task}
                    onSubmit={(updatedSubTask) => handleSubTaskChange(index, updatedSubTask)}
                    onCancel={() => {}}
                  />
                  <IconButton onClick={() => handleRemoveSubTask(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={onCancel} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default TaskForm;