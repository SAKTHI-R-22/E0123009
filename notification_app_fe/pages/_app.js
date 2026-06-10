notification_app_fe/pages/_app.js
import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ReadProvider } from '../context/ReadContext';
import { Log } from '../../logging_middleware/logger';

// Initialize a light/dark theme (prefers system)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

export default function MyApp({ Component, pageProps }) {
  // Log app mount for analytics
  React.useEffect(() => {
    Log('frontend', 'info', 'app', 'Next.js app mounted');
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Campus Notifications</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReadProvider>
          <Component {...pageProps} />
        </ReadProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
