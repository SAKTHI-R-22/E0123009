notification_app_fe/components/NotificationCard.js
import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Typography, Button, Chip } from '@mui/material';
import { AccessTime, HourglassEmpty } from '@mui/icons-material';

export default function NotificationCard({ notification, onMarkRead }) {
  const { id, message, type, timestamp, read } = notification;
  // Derive a display title from the type (e.g. "Placement", "Event", "Result").
  const displayTitle = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Notification';

  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <Card sx={{ width: '100%', bgcolor: read ? 'background.default' : 'action.hover' }} elevation={read ? 1 : 4}>
      <CardHeader
        title={displayTitle}
        subheader={formattedDate}
        avatar={type === 'placement' ? <AccessTime color="primary" /> : <HourglassEmpty />}
        action={
          !read && (
            <Button size="small" onClick={() => onMarkRead(id)}>
              Mark as read
            </Button>
          )
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Chip label={type} sx={{ mt: 1 }} />
      </CardContent>
      {read && (
        <CardActions>
          <Typography variant="caption" color="text.disabled">
            Already read
          </Typography>
        </CardActions>
      )}
    </Card>
  );
}
