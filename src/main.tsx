import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { Toast } from '@heroui/react';

import App from './App';

import './index.css';
import './commands/ipc';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HashRouter>
        <App />
      </HashRouter>
      <Toast.Provider placement="bottom end" />
    </ThemeProvider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
