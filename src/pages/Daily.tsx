import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface OutlineItem {
  id: string;
  content: string;
  level: number;
}

const Daily: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([{ id: '1', content: '', level: 0 }]);
  const [focusedItemId, setFocusedItemId] = useState<string>('1');
  const inputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const handleContentChange = (id: string, newContent: string) => {
    setOutlineItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const currentItem = outlineItems[index];

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newItem: OutlineItem = {
        id: Date.now().toString(),
        content: '',
        level: currentItem.level,
      };
      setOutlineItems(prevItems => [
        ...prevItems.slice(0, index + 1),
        newItem,
        ...prevItems.slice(index + 1),
      ]);
      setFocusedItemId(newItem.id);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey && index > 0) {
        // Outdent
        setOutlineItems(prevItems =>
          prevItems.map((item, i) =>
            i === index ? { ...item, level: Math.max(0, item.level - 1) } : item
          )
        );
      } else if (!e.shiftKey && index > 0) {
        // Indent
        const prevItemLevel = outlineItems[index - 1].level;
        setOutlineItems(prevItems =>
          prevItems.map((item, i) =>
            i === index ? { ...item, level: Math.min(prevItemLevel + 1, item.level + 1) } : item
          )
        );
      }
    } else if (e.key === 'Backspace' && currentItem.content === '' && index > 0) {
      e.preventDefault();
      const newItems = outlineItems.filter((_, i) => i !== index);
      setOutlineItems(newItems);
      setFocusedItemId(newItems[index - 1].id);
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setFocusedItemId(outlineItems[index - 1].id);
    } else if (e.key === 'ArrowDown' && index < outlineItems.length - 1) {
      e.preventDefault();
      setFocusedItemId(outlineItems[index + 1].id);
    }
  };

  useEffect(() => {
    if (focusedItemId) {
      inputRefs.current[focusedItemId]?.focus();
    }
  }, [focusedItemId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        {currentDate}
      </Typography>
      {outlineItems.map((item, index) => (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ width: item.level * 24, flexShrink: 0 }} />
          <FiberManualRecordIcon sx={{ fontSize: 8, mt: 1.5, mr: 1, color: 'text.secondary' }} />
          <TextField
            inputRef={el => inputRefs.current[item.id] = el}
            value={item.content}
            onChange={(e) => handleContentChange(item.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
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
  );
};

export default Daily;