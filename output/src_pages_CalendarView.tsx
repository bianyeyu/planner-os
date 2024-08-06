import React from 'react';
import { Calendar, momentLocalizer, EventProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/task';
import { Box, Typography, CircularProgress } from '@mui/material';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent extends EventProps {
  task: Task;
}

const CalendarView: React.FC = () => {
  const { tasks, loading } = useTaskContext();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const events: CalendarEvent[] = tasks?.map((task: Task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.dueDate),
    allDay: true,
    task: task
  })) || [];

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    switch (event.task.status) {
      case 'completed':
        backgroundColor = '#4caf50';
        break;
      case 'in-progress':
        backgroundColor = '#ff9800';
        break;
      case 'not-started':
        backgroundColor = '#f44336';
        break;
    }
    return { style: { backgroundColor } };
  };

  return (
    <Box height="500px">
      <Typography variant="h4" gutterBottom>
        Calendar View
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={(event: CalendarEvent) => `${event.task.title} - ${event.task.status}`}
      />
    </Box>
  );
};

export default CalendarView;