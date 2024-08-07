import React, { useRef, KeyboardEvent, useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton, Drawer } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import dayjs, { Dayjs } from 'dayjs';
import { useDaily, DailyEntry, Node } from '../context/DailyContext';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/task/TaskList';

const Daily: React.FC = () => {
  const { entries, setEntries, selectedNodes, setSelectedNodes } = useDaily();
  const { tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const contentRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const todayRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    setSelectedDate(dayjs(today));
    const todayEntry = entries.find((entry: DailyEntry) => entry.date === today);
    if (!todayEntry) {
      setEntries((prevEntries: DailyEntry[]) => [...prevEntries, { date: today, nodes: [{ id: '1', content: '', level: 0 }] }]);
    }
    todayRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, setEntries]);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      const dateString = newDate.format('YYYY-MM-DD');
      if (!entries.some((entry: DailyEntry) => entry.date === dateString)) {
        setEntries((prevEntries: DailyEntry[]) => [...prevEntries, { date: dateString, nodes: [{ id: '1', content: '', level: 0 }] }]);
      }
    }
  };

  const handleContentChange = (date: string, nodeId: string, newContent: string) => {
    setEntries((prevEntries: DailyEntry[]) =>
      prevEntries.map((entry: DailyEntry) =>
        entry.date === date
          ? {
              ...entry,
              nodes: entry.nodes.map((node: Node) =>
                node.id === nodeId ? { ...node, content: newContent } : node
              )
            }
          : entry
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, date: string, nodeId: string, index: number) => {
    const entry = entries.find((entry: DailyEntry) => entry.date === date);
    if (!entry) return;

    const currentNode = entry.nodes[index];
    const input = contentRefs.current[`${date}-${nodeId}`];
    if (!input) return;

    const cursorAtStart = input.selectionStart === 0;
    const cursorAtEnd = input.selectionEnd === currentNode.content.length;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newNode = {
        id: Date.now().toString(),
        content: '',
        level: currentNode.level,
      };
      setEntries((prevEntries: DailyEntry[]) =>
        prevEntries.map((entry: DailyEntry) =>
          entry.date === date
            ? {
                ...entry,
                nodes: [
                  ...entry.nodes.slice(0, index + 1),
                  newNode,
                  ...entry.nodes.slice(index + 1),
                ]
              }
            : entry
        )
      );
      setTimeout(() => {
        contentRefs.current[`${date}-${newNode.id}`]?.focus();
      }, 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey && index > 0) {
        setEntries((prevEntries: DailyEntry[]) =>
          prevEntries.map((entry: DailyEntry) =>
            entry.date === date
              ? {
                  ...entry,
                  nodes: entry.nodes.map((node: Node, i: number) =>
                    i === index ? { ...node, level: Math.max(0, node.level - 1) } : node
                  )
                }
              : entry
          )
        );
      } else if (!e.shiftKey && index > 0) {
        const prevNodeLevel = entry.nodes[index - 1].level;
        setEntries((prevEntries: DailyEntry[]) =>
          prevEntries.map((entry: DailyEntry) =>
            entry.date === date
              ? {
                  ...entry,
                  nodes: entry.nodes.map((node: Node, i: number) =>
                    i === index ? { ...node, level: Math.min(prevNodeLevel + 1, node.level + 1) } : node
                  )
                }
              : entry
          )
        );
      }
    } else if (e.key === 'Backspace' && currentNode.content === '' && index > 0) {
      e.preventDefault();
      setEntries((prevEntries: DailyEntry[]) =>
        prevEntries.map((entry: DailyEntry) =>
          entry.date === date
            ? {
                ...entry,
                nodes: entry.nodes.filter((_, i: number) => i !== index)
              }
            : entry
        )
      );
      setTimeout(() => {
        const prevNode = entry.nodes[index - 1];
        contentRefs.current[`${date}-${prevNode.id}`]?.focus();
      }, 0);
    } else if ((e.key === 'ArrowUp' && cursorAtStart) || (e.key === 'ArrowDown' && cursorAtEnd)) {
      e.preventDefault();
      const targetIndex = e.key === 'ArrowUp' ? index - 1 : index + 1;
      const targetNode = entry.nodes[targetIndex];
      if (targetNode) {
        contentRefs.current[`${date}-${targetNode.id}`]?.focus();
      }
    } else if ((e.key === 'ArrowLeft' && cursorAtStart) || (e.key === 'ArrowRight' && cursorAtEnd)) {
      e.preventDefault();
      const targetIndex = e.key === 'ArrowLeft' ? index - 1 : index + 1;
      const targetNode = entry.nodes[targetIndex];
      if (targetNode) {
        const targetInput = contentRefs.current[`${date}-${targetNode.id}`];
        if (targetInput) {
          targetInput.focus();
          if (e.key === 'ArrowLeft') {
            targetInput.selectionStart = targetInput.selectionEnd = targetInput.value.length;
          } else {
            targetInput.selectionStart = targetInput.selectionEnd = 0;
          }
        }
      }
    } else if (e.key === '/') {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setSlashMenuPosition({ top: rect.bottom, left: rect.left });
      setSlashMenuOpen(true);
    }
  };

  const handleMouseDown = (date: string, nodeId: string, e: React.MouseEvent) => {
    if (e.shiftKey && selectedNodes.length > 0) {
      const entry = entries.find((entry: DailyEntry) => entry.date === date);
      if (entry) {
        const startIndex = entry.nodes.findIndex((n: Node) => n.id === selectedNodes[0]);
        const endIndex = entry.nodes.findIndex((n: Node) => n.id === nodeId);
        const newSelectedNodes = entry.nodes
          .slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
          .map((n: Node) => n.id);
        setSelectedNodes(newSelectedNodes);
      }
    } else {
      setSelectedNodes([nodeId]);
    }
  };

  const sortedEntries = [...entries].sort((a: DailyEntry, b: DailyEntry) => dayjs(b.date).diff(dayjs(a.date)));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, pb: 2 }}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Box>
          {sortedEntries.map((entry: DailyEntry) => (
            <Box 
              key={entry.date} 
              sx={{ mb: 4 }} 
              ref={entry.date === dayjs().format('YYYY-MM-DD') ? todayRef : null}
            >
              <Typography variant="h4" gutterBottom>
                {dayjs(entry.date).format('MMM D, YYYY')}
              </Typography>
              {entry.nodes.map((node: Node, index: number) => (
                <Box 
                  key={node.id} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    ml: node.level * 2,
                    bgcolor: selectedNodes.includes(node.id) ? 'action.selected' : 'transparent',
                  }}
                  onMouseDown={(e) => handleMouseDown(entry.date, node.id, e)}
                >
                  <FiberManualRecordIcon sx={{ fontSize: 8, mt: 2, mr: 1, color: 'text.secondary' }} />
                  <TextField
                    inputRef={el => contentRefs.current[`${entry.date}-${node.id}`] = el}
                    value={node.content}
                    onChange={(e) => handleContentChange(entry.date, node.id, e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, entry.date, node.id, index)}
                    fullWidth
                    multiline
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: '16px', lineHeight: '1.5' }
                    }}
                    placeholder={index === 0 ? "Type / for options" : ""}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <IconButton
          onClick={() => setIsDrawerOpen(true)}
          sx={{ position: 'fixed', right: 16, top: 16 }}
        >
          <ArrowDropDownIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              待办事项
            </Typography>
            <TaskList tasks={tasks} onTaskClick={() => {}} />
          </Box>
        </Drawer>
        {slashMenuOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: slashMenuPosition.top,
              left: slashMenuPosition.left,
              bgcolor: 'background.paper',
              boxShadow: 3,
              p: 1,
              zIndex: 1300,
            }}
          >
            <Typography>添加任务</Typography>
            <Typography>插入日期</Typography>
            <Typography>插入待办事项</Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Daily;