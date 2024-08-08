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
import ErrorBoundary from '../components/ErrorBoundary';
import SlashCommandMenu, { SlashCommand } from '../components/SlashCommandMenu';

const SLASH_COMMANDS: SlashCommand[] = [
  { 
    name: 'Date', 
    subCommands: [
      {
        name: 'Start time',
        execute: () => {
          console.log('Inserting start time...');
          // 实现插入开始时间的逻辑
        }
      },
      {
        name: 'End time',
        execute: () => {
          console.log('Inserting end time...');
          // 实现插入结束时间的逻辑
        }
      }
    ]
  },
  {
    name: 'Time record',
    execute: () => {
      console.log('Starting time record...');
      // 实现时间记录的逻辑
    }
  },
  {
    name: 'Pomodoro',
    execute: () => {
      console.log('Starting Pomodoro timer...');
      // 实现番茄钟的逻辑
    }
  }
];

const Daily: React.FC = () => {
  const { entries, setEntries, selectedNodes, setSelectedNodes } = useDaily();
  const { tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const contentRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const todayRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);

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

    checkForSlashCommand(date, nodeId, newContent);
  };

  const checkForSlashCommand = (date: string, nodeId: string, content: string) => {
    const input = contentRefs.current[`${date}-${nodeId}`];
    if (input) {
      const cursorPosition = input.selectionStart;
      const textBeforeCursor = content.slice(0, cursorPosition);
      const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

      if (lastSlashIndex === -1 || cursorPosition <= lastSlashIndex) {
        setSlashMenuOpen(false);
      } else {
        const searchTerm = textBeforeCursor.slice(lastSlashIndex + 1).toLowerCase();
        const filtered = SLASH_COMMANDS.filter(cmd => cmd.name.toLowerCase().startsWith(searchTerm));
        setFilteredCommands(filtered);
        
        if (filtered.length === 0) {
          setSlashMenuOpen(false);
        } else {
          const rect = input.getBoundingClientRect();
          const lineHeight = parseInt(getComputedStyle(input).lineHeight);
          const lines = textBeforeCursor.split('\n');
          const currentLineIndex = lines.length - 1;
          const top = rect.top + window.scrollY + lineHeight * (currentLineIndex + 1);
          const left = rect.left + window.scrollX + (lines[currentLineIndex].length * 8); // Approximation for character width
          setSlashMenuPosition({ top, left });
          setSlashMenuOpen(true);
          setSelectedCommand(0);
        }
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, date: string, nodeId: string, index: number) => {
    const entry = entries.find((entry: DailyEntry) => entry.date === date);
    if (!entry) return;

    const currentNode = entry.nodes[index];
    const input = contentRefs.current[`${date}-${nodeId}`];
    if (!input) return;

    const cursorAtStart = input.selectionStart === 0;
    const cursorAtEnd = input.selectionEnd === currentNode.content.length;

    if (slashMenuOpen) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommand(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommand(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCommandSelect(filteredCommands[selectedCommand]);
      }
    } else if (e.key === '/') {
      checkForSlashCommand(date, nodeId, currentNode.content + '/');
    } else if (e.key === 'Enter' && !e.shiftKey) {
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
    }
  };

  const handleCommandSelect = (command: SlashCommand) => {
    if (command.subCommands) {
      setFilteredCommands(command.subCommands);
    } else if (command.execute) {
      command.execute();
      setSlashMenuOpen(false);
    }
  };

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      setSelectedNodes(prev => {
        if (prev.includes(nodeId)) {
          return prev.filter(id => id !== nodeId);
        } else {
          return [...prev, nodeId];
        }
      });
    } else {
      setSelectedNodes([nodeId]);
    }
    setActiveNodeId(nodeId);
  };

  const handleNodeFocus = (date: string, nodeId: string) => {
    setActiveNodeId(nodeId);
    const node = entries.find(entry => entry.date === date)?.nodes.find(node => node.id === nodeId);
    if (node) {
      checkForSlashCommand(date, nodeId, node.content);
    }
  };

  const handleNodeBlur = () => {
    setActiveNodeId(null);
    setSlashMenuOpen(false);
  };

  const sortedEntries = [...entries].sort((a: DailyEntry, b: DailyEntry) => dayjs(b.date).diff(dayjs(a.date)));

  const uniqueEntries = sortedEntries.filter((entry, index, self) =>
    index === self.findIndex((t) => t.date === entry.date)
  );

  return (
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 3, display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, pb: 2 }}>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Box>
            {uniqueEntries.map((entry: DailyEntry) => (
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
                    onClick={(e) => handleNodeClick(node.id, e)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      ml: node.level * 2,
                      bgcolor: selectedNodes.length > 1 && selectedNodes.includes(node.id) ? 'action.selected' : 'transparent',
                      cursor: 'text',
                    }}
                  >
                    <FiberManualRecordIcon sx={{ fontSize: 8, mt: 2, mr: 1, color: 'text.secondary' }} />
                    <TextField
                      inputRef={el => contentRefs.current[`${entry.date}-${node.id}`] = el}
                      value={node.content}
                      onChange={(e) => handleContentChange(entry.date, node.id, e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, entry.date, node.id, index)}
                      onFocus={() => handleNodeFocus(entry.date, node.id)}
                      onBlur={handleNodeBlur}
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
          <SlashCommandMenu
            commands={filteredCommands}
            isOpen={slashMenuOpen && !!activeNodeId}
            position={slashMenuPosition}
            selectedIndex={selectedCommand}
            onSelect={handleCommandSelect}
          />
        </Box>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default Daily;