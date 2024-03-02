import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'sonner';
import { SocketContextProvider } from './store/SocketContextProvider';
import {QueryClient , QueryClientProvider} from "@tanstack/react-query"

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()
root.render(
  <QueryClientProvider client={queryClient}>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
    <Toaster position="top-left" expand={false} closeButton duration={5000} richColors />
  </QueryClientProvider>
);

