import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
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
  Typography, 
  IconButton,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel }) => {
  const { updateTask, tasks, setTasks } = useTaskContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'not-started');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [startDate, setStartDate] = useState(task?.startDate || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [startTime, setStartTime] = useState(task?.startTime || '');
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime || 0);
  const [category, setCategory] = useState(task?.category || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      id: task?.id || Date.now().toString(),
      title,
      description,
      status,
      priority,
      startDate,
      dueDate,
      startTime,
      estimatedTime,
      category,
      tags,
      subTasks: task?.subTasks || [],
    };
    if (task) {
      updateTask(updatedTask);
    } else {
      setTasks([...(tasks || []), updatedTask]);
    }
    onCancel();
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <Card>
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
                variant="outlined"
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
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="截止日期"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="开始日期"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="开始时间"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="预计耗时"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">分钟</InputAdornment>,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                label="优先级"
                variant="outlined"
              >
                <MenuItem value="low">低</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="high">高</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="分类"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <TextField
                  label="标签"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ marginRight: 8 }}
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
                    style={{ marginRight: 4, marginBottom: 4 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="submit" variant="contained" color="primary">
            {task ? '更新任务' : '创建任务'}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default TaskForm;