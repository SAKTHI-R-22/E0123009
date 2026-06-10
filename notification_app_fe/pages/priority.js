notification_app_fe/pages/priority.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { ReadContext } from '../context/ReadContext';
import { getAllNotifications, getPriorityNotifications } from '../services/notificationService';

export default function PriorityInbox() {
  const [allNotifs, setAllNotifs] = useState([]);
  const [displayNotifs, setDisplayNotifs] = useState([]);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState('all');
  const { markAsRead } = useContext(ReadContext);

  useEffect(() => {
    async function load() {
      const data = await getAllNotifications();
      setAllNotifs(data);
    }
    load();
  }, []);

  // recompute displayed list when inputs change
  useEffect(() => {
    const filtered = filterType === 'all' ? allNotifs : allNotifs.filter((n) => n.type === filterType);
    const top = getPriorityNotifications(filtered, topN);
    setDisplayNotifs(top);
  }, [allNotifs, topN, filterType]);

  const handleMarkRead = (id) => {
    markAsRead(id);
    setDisplayNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNChange = (event, newValue) => setTopN(newValue);
  const handleFilterChange = (e) => setFilterType(e.target.value);

  // derive distinct types for filter dropdown
  const types = Array.from(new Set(allNotifs.map((n) => n.type)));

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Priority Inbox
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box sx={{ width: 200 }}>
          <Typography gutterBottom>Show top:</Typography>
          <Slider
            value={topN}
            onChange={handleNChange}
            aria-labelledby="top-n-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={20}
          />
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            value={filterType}
            label="Type"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            {types.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {displayNotifs.map((notif) => (
        <NotificationCard
          key={notif.id}
          notification={notif}
          onMarkRead={handleMarkRead}
        />
      ))}
    </Container>
  );
}
