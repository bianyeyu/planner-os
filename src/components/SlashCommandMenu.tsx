import React, { useState, useEffect, useMemo } from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon, Popover } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export interface SlashCommand {
  name: string;
  execute?: (arg?: any) => void;
  subCommands?: SlashCommand[];
}

interface SlashCommandMenuProps {
  commands: SlashCommand[];
  isOpen: boolean;
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (command: SlashCommand, arg?: any) => void;
  searchTerm: string;
  onClose: () => void;  // 新增：关闭菜单的回调
}

// 递归搜索函数
const searchCommands = (commands: SlashCommand[], term: string): SlashCommand[] => {
  return commands.reduce((acc: SlashCommand[], command) => {
    if (command.name.toLowerCase().includes(term.toLowerCase())) {
      acc.push(command);
    }
    if (command.subCommands) {
      const matchingSubCommands = searchCommands(command.subCommands, term);
      if (matchingSubCommands.length > 0) {
        acc.push({
          ...command,
          subCommands: matchingSubCommands
        });
      }
    }
    return acc;
  }, []);
};

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  commands,
  isOpen,
  position,
  selectedIndex,
  onSelect,
  searchTerm,
  onClose
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [commandStack, setCommandStack] = useState<SlashCommand[][]>([commands]);

  const filteredCommands = useMemo(() => {
    return searchTerm ? searchCommands(commands, searchTerm) : commands;
  }, [commands, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setCommandStack([filteredCommands]);
    } else {
      setCommandStack([commands]);
    }
  }, [searchTerm, filteredCommands, commands]);

  useEffect(() => {
    if (!isOpen) {
      setCommandStack([commands]);
    }
  }, [isOpen, commands]);

  useEffect(() => {
    if (filteredCommands.length === 0 && isOpen) {
      onClose();
    }
  }, [filteredCommands, isOpen, onClose]);

  const currentCommands = commandStack[commandStack.length - 1];

  const handleDateCommand = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setDatePickerOpen(true);
  };

  const handleDateSelect = (date: dayjs.Dayjs | null) => {
    if (date) {
      const dateString = date.format('YYYY-MM-DD');
      onSelect(commands.find(cmd => cmd.name === 'Date')!, `[[${dateString}]]`);
    }
    setDatePickerOpen(false);
  };

  const handleCommandSelect = (command: SlashCommand) => {
    if (command.subCommands && command.subCommands.length > 0) {
      setCommandStack(prev => [...prev, command.subCommands]);
    } else if (command.name === 'Date') {
      handleDateCommand({ currentTarget: anchorEl } as React.MouseEvent<HTMLElement>);
    } else if (command.execute) {
      command.execute();
      onSelect(command);
    } else {
      onSelect(command);
    }
  };

  const handleBack = () => {
    if (commandStack.length > 1) {
      setCommandStack(prev => prev.slice(0, -1));
    }
  };

  if (!isOpen || currentCommands.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        bgcolor: 'background.paper',
        boxShadow: 3,
        p: 1,
        zIndex: 1300,
        minWidth: 200,
      }}
    >
      <List>
        {commandStack.length > 1 && !searchTerm && (
          <ListItem button onClick={handleBack}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary="Back" />
          </ListItem>
        )}
        {currentCommands.map((command, index) => (
          <ListItem 
            button 
            key={command.name} 
            selected={index === selectedIndex}
            onClick={() => handleCommandSelect(command)}
          >
            <ListItemText primary={command.name} />
            {command.subCommands && command.subCommands.length > 0 && !searchTerm && (
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
            )}
          </ListItem>
        ))}
      </List>
      <Popover
        open={datePickerOpen}
        anchorEl={anchorEl}
        onClose={() => setDatePickerOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={handleDateSelect}
            renderInput={(params) => <div {...params} />}
          />
        </LocalizationProvider>
      </Popover>
    </Box>
  );
};

export default SlashCommandMenu;