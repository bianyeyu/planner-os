import React, { useState } from 'react';
import { Typography, Box, Menu, MenuItem, IconButton, Collapse } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface NoteItemProps {
  note: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    handleClose();
    // Here you can add logic to update the note with the selected date
    console.log("Selected date for note:", date?.format('YYYY-MM-DD'));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box 
      sx={{ position: 'relative', mb: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography>{note}</Typography>
      {isHovered && (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ position: 'absolute', top: 0, right: 24 }}
          >
            <MoreVertIcon />
          </IconButton>
          <IconButton
            onClick={toggleExpand}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </>
      )}
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <DatePicker
            label="选择日期"
            value={selectedDate}
            onChange={handleDateSelect}
            slotProps={{
              textField: {
                variant: "standard",
                size: "small"
              }
            }}
          />
        </MenuItem>
        {/* Add more menu items here for additional information */}
      </Menu>
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #ccc' }}>
          {selectedDate && (
            <Typography variant="body2">
              Date: {selectedDate.format('YYYY-MM-DD')}
            </Typography>
          )}
          {/* Add more expanded information here */}
        </Box>
      </Collapse>
    </Box>
  );
};

export default NoteItem;