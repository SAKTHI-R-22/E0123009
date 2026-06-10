// Stage 1 – Top 10 Priority Notifications (JavaScript / Node.js)

/**
 * This script fetches the campus notifications from the evaluation service,
 * computes a priority score based on type weight (Placement > Result > Event)
 * and recency, and prints the top N (default 10) notifications.
 *
 * All major actions are logged via the custom Logging Middleware that was
 * created in the Pre‑Test Setup (log_middleware.js). The logger writes to
 * `logs/stage1.log`.
 */

// ---------------------------------------------------------------------------
// Logging Middleware – import the implementation from the pre‑test setup.
// If the file does not exist, a minimal placeholder is provided below.
// ---------------------------------------------------------------------------
const path = require('path');
const fs = require('fs');

let logger;
try {
  // The repository should contain a log_middleware.js file exported as { logger }
  // eslint-disable-next-line import/extensions
  ({ logger } = require('./log_middleware'));
} catch (e) {
  // Fallback lightweight logger that satisfies the requirement.
  const LOG_FILE = path.join(__dirname, '..', 'logs', 'stage1.log');
  const ensureLogFile = () => {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '');
  };
  ensureLogFile();
  const write = (level, msg) => {
    const line = `${new Date().toISOString()} - ${level} - ${msg}\n`;
    fs.appendFileSync(LOG_FILE, line);
  };
  logger = {
    info: (msg, ...args) => write('INFO', require('util').format(msg, ...args)),
    error: (msg, ...args) => write('ERROR', require('util').format(msg, ...args)),
    debug: (msg, ...args) => write('DEBUG', require('util').format(msg, ...args)),
  };
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const TOP_N = 10;

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------
async function fetchNotifications() {
  logger.info('Fetching notifications from %s', API_URL);
  try {
    const response = await fetch(API_URL, { method: 'GET' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const notifications = data.notifications || [];
    logger.info('Fetched %d notifications', notifications.length);
    return notifications;
  } catch (err) {
    logger.error('Failed to fetch notifications: %s', err.message);
    return [];
  }
}

function parseTimestamp(ts) {
  // Expected format: "YYYY-MM-DD HH:MM:SS"
  const date = new Date(ts.replace(' ', 'T') + 'Z'); // treat as UTC
  return isNaN(date.getTime()) ? 0 : date.getTime(); // ms since epoch
}

function computeScore(notification) {
  const type = notification.Type || 'Event';
  const weight = TYPE_WEIGHT[type] || 1;
  const ts = notification.Timestamp ? parseTimestamp(notification.Timestamp) : 0;
  // Use a large multiplier so weight dominates recency
  const score = weight * 1_000_000_000 + ts;
  logger.debug('Score %d for notification %s', score, notification.ID);
  return score;
}

function topNNotifications(notifications, n = TOP_N) {
  logger.info('Selecting top %d notifications', n);
  // Simple min‑heap implementation using an array and sort for clarity.
  const heap = [];
  for (const notif of notifications) {
    const score = computeScore(notif);
    if (heap.length < n) {
      heap.push({ score, notif });
    } else if (score > heap[0].score) {
      heap[0] = { score, notif };
    }
    // Keep smallest at index 0
    heap.sort((a, b) => a.score - b.score);
  }
  // Sort descending before returning
  heap.sort((a, b) => b.score - a.score);
  return heap.map(item => item.notif);
}

function display(notifs) {
  console.log('\n=== Top Priority Notifications ===');
  notifs.forEach((n, idx) => {
    console.log(`${idx + 1}. ID: ${n.ID}`);
    console.log(`   Type: ${n.Type}`);
    console.log(`   Message: ${n.Message}`);
    console.log(`   Timestamp: ${n.Timestamp || 'N/A'}`);
    console.log('---');
  });
}

// ---------------------------------------------------------------------------
// Main execution flow
// ---------------------------------------------------------------------------
(async () => {
  const notifications = await fetchNotifications();
  if (!notifications.length) {
    logger.error('No notifications received – exiting');
    process.exit(1);
  }
  const top = topNNotifications(notifications, TOP_N);
  display(top);
})();
