import React from 'react';
console.log("Main component rendered");
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SupabaseProvider } from '/src/integrations/supabase/index.js';

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log("Main component rendered");
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
