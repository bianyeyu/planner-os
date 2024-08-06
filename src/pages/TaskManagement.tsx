import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import TaskForm from '../components/task/TaskForm';
import TaskList from '../components/task/TaskList';
import { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';

const TaskManagement: React.FC = () => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }
    handleCloseDialog();
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1>Task Management</h1>
      <Button onClick={handleAddNewTask} variant="contained" color="primary" sx={{ mb: 2 }}>
        Add New Task
      </Button>
      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleTaskSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TaskManagement;