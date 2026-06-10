notification_app_fe/utils/logger.js
// Re‑export the shared Log function from the logging middleware.
// Using an ES6 re‑export keeps the bundle tree‑shakable and works with Next.js.

export { Log } from '../../logging_middleware/logger';
