notification_app_fe/pages/api/notifications.js
/**
 * Next.js API route that proxies requests to the evaluation-service.
 * This avoids CORS issues when the browser tries to call the external API directly.
 */
export default async function handler(req, res) {
  const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
  const token = process.env.NEXT_PUBLIC_EVAL_TOKEN;

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy fetch error:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications from upstream API' });
  }
}
