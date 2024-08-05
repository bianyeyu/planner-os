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
  Typography 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';
import DateRangePicker from './DateRangePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  dueDate: string;
  tags: string[];
  subTasks: { id: string; title: string; completed: boolean }[];
}

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel }) => {
  const { addTask, updateTask } = useTaskContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'not-started');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [startDate, setStartDate] = useState<Dayjs | null>(task?.startDate ? dayjs(task.startDate) : null);
  const [endDate, setEndDate] = useState<Dayjs | null>(task?.dueDate ? dayjs(task.dueDate) : null);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [subTasks, setSubTasks] = useState<string[]>(task?.subTasks.map(st => st.title) || []);
  const [newSubTask, setNewSubTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Task = {
      id: task?.id || Date.now().toString(),
      title,
      description,
      status,
      priority,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      dueDate: endDate ? endDate.format('YYYY-MM-DD') : '',
      tags,
      subTasks: subTasks.map(st => ({ id: Date.now().toString(), title: st, completed: false })),
    };
    if (task) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    onCancel();
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleAddSubTask = () => {
    if (newSubTask && !subTasks.includes(newSubTask)) {
      setSubTasks([...subTasks, newSubTask]);
      setNewSubTask('');
    }
  };

  const handleDateChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    setStartDate(newValue[0]);
    setEndDate(newValue[1]);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto' }}>
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
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
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
              <Box display="flex" alignItems="center">
                <TextField
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  size="small"
                  fullWidth
                />
                <IconButton onClick={handleAddSubTask} size="small">
                  <AddIcon />
                </IconButton>
              </Box>
              <Box mt={1}>
                {subTasks.map((subTask, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" style={{ marginRight: 8 }}>{subTask}</Typography>
                    <IconButton size="small" onClick={() => setSubTasks(subTasks.filter((_, i) => i !== index))}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
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
    </Card>
  );
};

export default TaskForm;