import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { Toast } from '@heroui/react';

import App from './App';
import { AuthProvider } from './lib/AuthProvider';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toast.Provider placement="bottom end" />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
