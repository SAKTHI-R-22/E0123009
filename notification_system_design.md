# Notification System Design

## Architecture Overview

- **Frontend (React/Next.js)** – `notification_app_fe/`
  - Uses **Material UI** for styling.
  - Consumes the **Notifications API** via a server-side proxy route (`pages/api/notifications.js`) to avoid CORS.
  - Contains a **logging utility** (`utils/logger.js`) that posts events to the evaluation-service log endpoint.
  - Stores *read/unread* state in **localStorage**.
  - Provides two pages:
    1. **All Notifications** (`pages/index.js`) – list of every notification.
    2. **Priority Inbox** (`pages/priority.js`) – top `n` notifications (default 10) ranked by type-weight + recency.

- **Backend (placeholder)** – `notification_app_be/`
  - Minimal Express server demonstrating shared logging middleware.
  - In production this would proxy the evaluation service and add authentication.

- **Logging Middleware** – `logging_middleware/logger.js`
  - Shared logger used by both frontend and backend.
  - Validates parameters and POSTs to `http://4.224.186.213/evaluation-service/logs`.

## Priority Calculation
```js
const TYPE_WEIGHT = { placement: 3, event: 2, result: 1 };
function computeScore(notif) {
  const weight = TYPE_WEIGHT[notif.type] ?? 0;
  return weight * 1e9 + new Date(notif.timestamp).getTime();
}
```
Higher type weight = more important. Within the same weight, newer notifications score higher.

## Folder Structure
```
E0123009/
├─ .gitignore
├─ notification_system_design.md        # This file
├─ logging_middleware/
│   └─ logger.js                        # Shared logging middleware
├─ notification_app_be/
│   ├─ package.json
│   └─ src/
│       └─ index.js                     # Express health-check server
├─ notification_app_fe/
│   ├─ package.json
│   ├─ package-lock.json
│   ├─ README.md
│   ├─ components/
│   │   └─ NotificationCard.js          # MUI card component
│   ├─ context/
│   │   └─ ReadContext.js               # Read/unread state (localStorage)
│   ├─ pages/
│   │   ├─ _app.js                      # MUI ThemeProvider + ReadProvider
│   │   ├─ index.js                     # All Notifications page
│   │   ├─ priority.js                  # Priority Inbox page
│   │   └─ api/
│   │       └─ notifications.js         # Server-side proxy to evaluation API
│   ├─ services/
│   │   └─ notificationService.js       # Fetch + priority scoring
│   └─ utils/
│       └─ logger.js                    # Frontend logging wrapper
└─ Stage1/
    └─ main.js                          # Stage 1 implementation
```

---

*All code follows production-grade naming conventions, includes comments, and uses the shared logging middleware for traceability.*
