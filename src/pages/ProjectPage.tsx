import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, LinearProgress, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useProject } from '../context/ProjectContext';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();
  const [newNote, setNewNote] = useState('');
  const { projects, updateProject, addTask, updateTask, addDocument, addNote } = useProject();

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
      title: 'New Task',
      dueDate: new Date().toISOString().split('T')[0],
      progress: 0
    });
  };

  const handleUpdateTaskProgress = (taskId: string, newProgress: number) => {
    updateTask(project.id, taskId, { progress: newProgress });
  };

  const handleAddDocument = () => {
    const documentName = prompt('Enter document name:');
    if (documentName) {
      addDocument(project.id, { name: documentName, icon: '📄' });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Typography variant="h4" gutterBottom>{project.name}</Typography>
        
        {/* 项目概览 */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>项目概览</Typography>
        <Box sx={{ bgcolor: theme.palette.background.paper, p: 2, borderRadius: 2 }}>
          <Typography>开始日期: {project.startDate}</Typography>
          <Typography>预计完成: {project.endDate}</Typography>
          <Typography>进度: {project.progress}%</Typography>
          <LinearProgress variant="determinate" value={project.progress} sx={{ mt: 1 }} />
        </Box>
        
        {/* 任务列表 */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>任务列表</Typography>
        {project.tasks.map((task) => (
          <Box key={task.id} sx={{ bgcolor: theme.palette.background.paper, p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="h6">{task.title}</Typography>
            <Typography>截止日期: {task.dueDate}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={task.progress} 
                sx={{ flexGrow: 1, mr: 2 }} 
              />
              <TextField
                type="number"
                value={task.progress}
                onChange={(e) => handleUpdateTaskProgress(task.id, Number(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
                sx={{ width: 70 }}
              />
              <Typography variant="body2">%</Typography>
            </Box>
          </Box>
        ))}
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ mt: 2 }}
          onClick={handleAddTask}
        >
          添加任务
        </Button>
      </Box>
      
      {/* 右侧边栏 */}
      <Box sx={{ width: 240, p: 2, bgcolor: theme.palette.background.paper, borderLeft: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom>项目文档</Typography>
        <List>
          {project.documents.map((doc, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemText primary={`${doc.icon} ${doc.name}`} />
            </ListItem>
          ))}
        </List>
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
        <List sx={{ bgcolor: theme.palette.action.hover, borderRadius: 2, maxHeight: 200, overflowY: 'auto' }}>
          {project.notes.map((note, index) => (
            <ListItem key={index}>
              <ListItemText primary={note} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ProjectPage;