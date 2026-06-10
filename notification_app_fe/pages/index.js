import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, List, ListItem, Divider, Box, Button } from '@mui/material';
import Link from 'next/link';
import NotificationCard from '../components/NotificationCard';
import { ReadContext } from '../context/ReadContext';
import { getAllNotifications } from '../services/notificationService';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { markAsRead } = useContext(ReadContext);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllNotifications();
      setNotifications(data);
    }
    fetchData();
  }, []);

  const handleMarkRead = (id) => {
    markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Link href="/priority" passHref legacyBehavior>
          <Button variant="contained" color="primary">Priority</Button>
        </Link>
      </Box>
      <List>
        {notifications.map((notif) => (
          <React.Fragment key={notif.id}>
            <ListItem disableGutters>
              <NotificationCard notification={notif} onMarkRead={handleMarkRead} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}
