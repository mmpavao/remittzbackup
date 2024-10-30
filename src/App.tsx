import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/providers/auth-provider';
import { AppRoutes } from '@/routes';
import { InstallPrompt } from '@/components/pwa/install-prompt';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div id="app-root">
          <AppRoutes />
          <InstallPrompt />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;