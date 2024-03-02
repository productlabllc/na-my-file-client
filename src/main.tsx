import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';

import './index.css';
import router from './router';
import MUITheme from './MUITheme';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
import './i18n/config.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={MUITheme}>
      <NotificationCenter />

      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
