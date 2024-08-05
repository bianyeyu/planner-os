import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Project Meeting',
      start: new Date(2023, 7, 15, 10, 0), // August 15, 2023, 10:00 AM
      end: new Date(2023, 7, 15, 11, 30), // August 15, 2023, 11:30 AM
    },
    {
      id: '2',
      title: 'Team Lunch',
      start: new Date(2023, 7, 16, 12, 0), // August 16, 2023, 12:00 PM
      end: new Date(2023, 7, 16, 13, 0), // August 16, 2023, 1:00 PM
    },
    // Add more sample events as needed
  ]);

  const handleSelectSlot = (slotInfo: any) => {
    const title = window.prompt('New Event name');
    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.slots.length === 1,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    window.alert(event.title);
  };

  return (
    <div className="h-full">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 100px)' }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
      />
    </div>
  );
};

export default Calendar;