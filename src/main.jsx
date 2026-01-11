import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import './styles/theme.css';

/**
 * Main application entry point
 * Uses React 19's createRoot API for optimal performance
 * HydratedRouter handles SSR hydration automatically
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HydratedRouter />
  </StrictMode>
);