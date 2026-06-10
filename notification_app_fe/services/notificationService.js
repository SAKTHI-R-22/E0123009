notification_app_fe/services/notificationService.js
/**
 * Front‑end service for fetching notifications and computing priority.
 * Replace `API_URL` with the real endpoint when available.
 */
import { Log } from '../utils/logger';

const API_URL = '/api/notifications'; // proxied via Next.js API route to avoid CORS

// ---------------------------------------------------------------------------
// Helper: priority scoring – higher weight = more important
// weight map can be adjusted as business rules evolve.
// ---------------------------------------------------------------------------
const TYPE_WEIGHTS = {
  placement: 3,
  event: 2,
  result: 1,
};

function computeScore(notif) {
  const weight = TYPE_WEIGHTS[notif.type] ?? 0;
  // Use timestamp (ms) to break ties – newer = higher.
  return weight * 1_000_000_000 + new Date(notif.timestamp).getTime();
}

/** Fetch all notifications from the API. */
export async function getAllNotifications() {
  try {
    Log('frontend', 'info', 'notificationService', 'Fetching all notifications');
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    // The API returns { notifications: [...] } with capitalized field names.
    const list = Array.isArray(data) ? data : (data.notifications || []);
    // Normalise field names to lowercase for the frontend.
    return list.map((n, idx) => ({
      id: n.ID || n.id || idx,
      type: (n.Type || n.type || '').toLowerCase(),
      message: n.Message || n.message || '',
      timestamp: n.Timestamp || n.timestamp || '',
    }));
  } catch (e) {
    console.error('Failed to fetch notifications', e);
    Log('frontend', 'error', 'notificationService', `Fetch error: ${e.message}`);
    return [];
  }
}

/** Return top‑N priority notifications from a list (already filtered if needed). */
export function getPriorityNotifications(notifications, topN = 10) {
  const sorted = [...notifications].sort((a, b) => computeScore(b) - computeScore(a));
  return sorted.slice(0, topN);
}
