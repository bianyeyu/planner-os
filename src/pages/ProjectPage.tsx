import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, LinearProgress, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useProject } from '../context/ProjectContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TaskItem from '../components/TaskItem';
import { Task } from '../types/task';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();
  const [newNote, setNewNote] = useState('');
  const { projects, updateProject, addTask, updateTask, addDocument, addNote } = useProject();
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return <Typography>Project not found</Typography>;
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(project.id, newNote);
      setNewNote('');
    }
  };

  const handleAddTask = () => {
    addTask(project.id, {
      id: Date.now().toString(),
      title: 'New Task',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      subtasks: [],
    });
  };

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const updateTaskRecursive = (tasks: Task[]): Task[] => {
      return tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        if (task.subtasks && task.subtasks.length > 0) {
          return { ...task, subtasks: updateTaskRecursive(task.subtasks) };
        }
        return task;
      });
    };

    const updatedTasks = updateTaskRecursive(project.tasks);
    updateProject(project.id, { tasks: updatedTasks });
  }, [project, updateProject]);

  const handleAddSubtask = useCallback((parentId: string) => {
    const addSubtaskRecursive = (tasks: Task[]): Task[] => {
      return tasks.map(task => {
        if (task.id === parentId) {
          const newSubtask: Task = {
            id: Date.now().toString(),
            title: 'New Subtask',
            completed: false,
            dueDate: new Date().toISOString().split('T')[0],
            subtasks: [],
          };
          return { ...task, subtasks: [...(task.subtasks || []), newSubtask] };
        }
        if (task.subtasks && task.subtasks.length > 0) {
          return { ...task, subtasks: addSubtaskRecursive(task.subtasks) };
        }
        return task;
      });
    };

    const updatedTasks = addSubtaskRecursive(project.tasks);
    updateProject(project.id, { tasks: updatedTasks });
  }, [project, updateProject]);

  const renderTasks = (tasks: Task[], level: number = 0) => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
      <>
        {incompleteTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateTask={handleUpdateTask}
            onAddSubtask={handleAddSubtask}
            level={level}
          />
        ))}
        {completedTasks.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button onClick={() => setShowCompletedTasks(!showCompletedTasks)}>
              {showCompletedTasks ? 'Hide' : 'Show'} Completed Tasks ({completedTasks.length})
            </Button>
            {showCompletedTasks && completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdateTask={handleUpdateTask}
                onAddSubtask={handleAddSubtask}
                level={level}
              />
            ))}
          </Box>
        )}
      </>
    );
  };

  const handleAddDocument = () => {
    const documentName = prompt('Enter document name:');
    if (documentName) {
      addDocument(project.id, { name: documentName, icon: '📄' });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Typography variant="h4" gutterBottom>{project.name}</Typography>
          
          {/* Project Overview */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>项目概览</Typography>
          <Box sx={{ bgcolor: theme.palette.background.paper, p: 2, borderRadius: 2 }}>
            <Typography>开始日期: {project.startDate}</Typography>
            <Typography>预计完成: {project.endDate}</Typography>
            <Typography>进度: {project.progress}%</Typography>
            <LinearProgress variant="determinate" value={project.progress} sx={{ mt: 1 }} />
          </Box>
          
          {/* Task List */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>任务列表</Typography>
          <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
            {renderTasks(project.tasks)}
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ mt: 2 }}
            onClick={handleAddTask}
          >
            添加任务
          </Button>
        </Box>
        
        {/* Right Sidebar */}
        <Box sx={{ width: 240, p: 2, bgcolor: theme.palette.background.paper, borderLeft: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" gutterBottom>项目文档</Typography>
          <Box>
            {project.documents.map((doc, index) => (
              <Typography key={index} sx={{ py: 1 }}>
                {doc.icon} {doc.name}
              </Typography>
            ))}
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />} 
            sx={{ mt: 1 }}
            onClick={handleAddDocument}
          >
            添加文档
          </Button>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>笔记</Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="输入新笔记..."
            />
            <Button variant="contained" onClick={handleAddNote} sx={{ mt: 1 }}>添加笔记</Button>
          </Box>
          <Box sx={{ bgcolor: theme.palette.action.hover, borderRadius: 2, p: 2, maxHeight: 200, overflowY: 'auto' }}>
            {project.notes.map((note, index) => (
              <Typography key={index} sx={{ mb: 1 }}>{note}</Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectPage;