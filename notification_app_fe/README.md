# Campus Notifications Front‑End

A **Next.js** application that displays campus‑wide notifications fetched from the Evaluation Service API.

## Features
- Fetches live notifications using a token‑protected API.
- Shows all notifications on the home page.
- "Priority" view that displays the top‑N notifications based on a simple scoring algorithm.
- Material‑UI (MUI) design with modern visual styles.
- Server‑side proxy (`pages/api/notifications.js`) to avoid CORS issues.

## Prerequisites
- **Node.js** (>=18) and **npm**.
- An **access token** for the API (provided by the evaluator).

## Getting Started
```bash
# Clone the repository
git clone <repo‑url>
cd E0123009/notification_app_fe

# Install dependencies
npm install

# Create an .env.local file with your token
echo "NEXT_PUBLIC_EVAL_TOKEN=YOUR_ACCESS_TOKEN" > .env.local

# Run the development server
npm run dev
```
Open your browser at `http://localhost:3000`.

## Building for Production
```bash
npm run build
npm start   # serves the built app
```

## Folder Structure
```
notification_app_fe/
├─ components/        # UI components (NotificationCard, etc.)
├─ context/           # React context for read/unread state
├─ pages/             # Next.js pages (index, priority, api proxy)
├─ services/          # API service wrapper
├─ utils/             # Logger utility
├─ .env.local         # **Do NOT commit** – contains your token
├─ .gitignore         # Excludes node_modules, .next, .env, logs, etc.
└─ package.json
```

## Deploying to Vercel / Netlify
The app works out‑of‑the‑box with Vercel. Just import the repo and set the environment variable `NEXT_PUBLIC_EVAL_TOKEN` in the Vercel dashboard.

## License
MIT – feel free to adapt and extend.
