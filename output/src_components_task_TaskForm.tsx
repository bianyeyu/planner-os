import React, { useState } from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  Chip, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  IconButton, 
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';
import dayjs, { Dayjs } from 'dayjs';
import { Task, TaskStatus, TaskPriority } from '../../types/task';

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
  parentTaskId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel, parentTaskId }) => {
  const { addTask, updateTask } = useTaskContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'not-started');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([
    task?.startDate ? dayjs(task.startDate) : null,
    task?.dueDate ? dayjs(task.dueDate) : null
  ]);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [subTasks, setSubTasks] = useState<Task[]>(task?.subTasks || []);
  const [editingSubTaskIndex, setEditingSubTaskIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Task = {
      id: task?.id || Date.now().toString(),
      title,
      description,
      status,
      priority,
      startDate: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
      dueDate: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
      tags,
      subTasks,
    };
    if (task) {
      updateTask(taskData);
    } else {
      addTask(taskData, parentTaskId);
    }
    onCancel();
  };

  const handleAddSubTask = () => {
    setEditingSubTaskIndex(subTasks.length);
    setSubTasks([...subTasks, {
      id: Date.now().toString(),
      title: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      startDate: '',
      dueDate: '',
      tags: [],
      subTasks: [],
    }]);
  };

  const handleEditSubTask = (index: number) => {
    setEditingSubTaskIndex(index);
  };

  const handleDeleteSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
    setEditingSubTaskIndex(null);
  };

  const handleSubTaskChange = (updatedSubTask: Task) => {
    setSubTasks(subTasks.map((st, index) => 
      index === editingSubTaskIndex ? updatedSubTask : st
    ));
    setEditingSubTaskIndex(null);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ maxWidth: 600, margin: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="任务名称"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="描述"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={2}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <DateRangePicker
                  startText="开始日期"
                  endText="截止日期"
                  value={dateRange}
                  onChange={(newValue) => setDateRange(newValue)}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  size="small"
                >
                  <MenuItem value="low">低</MenuItem>
                  <MenuItem value="medium">中</MenuItem>
                  <MenuItem value="high">高</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  size="small"
                >
                  <MenuItem value="not-started">未开始</MenuItem>
                  <MenuItem value="in-progress">进行中</MenuItem>
                  <MenuItem value="completed">已完成</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <TextField
                    label="添加标签"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  <IconButton onClick={handleAddTag} size="small">
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box mt={1}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => setTags(tags.filter(t => t !== tag))}
                      size="small"
                      style={{ marginRight: 4, marginBottom: 4 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">子任务</Typography>
                <List>
                  {subTasks.map((subTask, index) => (
                    <ListItem key={subTask.id}>
                      <ListItemText primary={subTask.title} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditSubTask(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSubTask(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button startIcon={<AddIcon />} onClick={handleAddSubTask}>
                  添加子任务
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} size="small">取消</Button>
            <Button type="submit" variant="contained" color="primary" size="small">
              {task ? '更新任务' : '创建任务'}
            </Button>
          </CardActions>
        </form>
        {editingSubTaskIndex !== null && (
          <TaskForm
            task={subTasks[editingSubTaskIndex]}
            onCancel={() => setEditingSubTaskIndex(null)}
            parentTaskId={task?.id}
          />
        )}
      </Card>
    </LocalizationProvider>
  );
};

export default TaskForm;