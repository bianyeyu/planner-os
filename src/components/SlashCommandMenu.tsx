import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export interface SlashCommand {
  name: string;
  execute?: () => void;
  subCommands?: SlashCommand[];
}

interface SlashCommandMenuProps {
  commands: SlashCommand[];
  isOpen: boolean;
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  commands,
  isOpen,
  position,
  selectedIndex,
  onSelect,
}) => {
  if (!isOpen) return null;

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
        {commands.map((command, index) => (
          <ListItem 
            button 
            key={command.name} 
            selected={index === selectedIndex}
            onClick={() => onSelect(command)}
          >
            <ListItemText primary={command.name} />
            {command.subCommands && (
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SlashCommandMenu;