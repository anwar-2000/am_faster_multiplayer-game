import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'sonner';
import { SocketContextProvider } from './store/SocketContextProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
    <Toaster position="top-center" />
  </React.StrictMode>
);

