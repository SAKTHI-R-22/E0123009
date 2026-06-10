# E0123009 – Campus Notification Microservice

A campus notification system built with **Next.js** and **Material UI** that fetches live notifications from the Evaluation Service API, displays them in a clean UI, and supports a priority-ranked inbox.

## Repository Structure

| Folder | Description |
|---|---|
| `Stage1/` | Stage 1 implementation (priority calculation logic) |
| `logging_middleware/` | Shared logging middleware for frontend and backend |
| `notification_app_fe/` | **Stage 2** – Next.js frontend application |
| `notification_app_be/` | Placeholder Express backend |

## Quick Start

```bash
cd notification_app_fe
npm install
echo "NEXT_PUBLIC_EVAL_TOKEN=<your-token>" > .env.local
npm run dev
```

Open **http://localhost:3000** in your browser.

## Features

- **All Notifications** – Displays every notification from the API.
- **Priority Inbox** – Ranks notifications by type (Placement > Event > Result) and recency.
- **Read/Unread tracking** – Persisted in `localStorage`.
- **Server-side API proxy** – Avoids CORS via `pages/api/notifications.js`.
- **Structured logging** – Every action is logged via the shared middleware.

See [notification_system_design.md](notification_system_design.md) for full architecture details.
