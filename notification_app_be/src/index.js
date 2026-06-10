// notification_app_be/src/index.js
// Minimal Express server that demonstrates usage of the shared logging middleware.
// It does NOT proxy the notifications API – the frontend calls the public endpoint directly.

const express = require('express');
const path = require('path');
const { backend } = require('../../logging_middleware/logger');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => {
  backend.info('route', 'Health check endpoint hit');
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  backend.info('service', `Backend listening on port ${PORT}`);
});
