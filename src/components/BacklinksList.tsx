import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { DailyEntry } from '../context/DailyContext';

interface BacklinksListProps {
  backlinks: DailyEntry[];
}

const BacklinksList: React.FC<BacklinksListProps> = ({ backlinks }) => {
  if (backlinks.length === 0) return null;

  return (
    <Box sx={{ mt: 4, borderTop: '1px solid #e0e0e0', pt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Linked References
      </Typography>
      <List>
        {backlinks.map((entry) => (
          <ListItem key={entry.date} component={Link} to={`/daily/${entry.date}`} sx={{ color: 'primary.main', textDecoration: 'none' }}>
            <ListItemText
              primary={entry.date}
              secondary={entry.nodes.find(node => node.content.includes(`[[${entry.date}]]`))?.content}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BacklinksList;