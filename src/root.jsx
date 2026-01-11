import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Root layout component for the entire application
 * Provides global context providers and error boundaries
 */
export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Root component - renders child routes
 */
export default function Root() {
  return <Outlet />;
}

/**
 * Global error boundary
 * Handles all uncaught errors in the application
 */
export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg">
      <div className="bg-white dark:bg-dark-surface p-8 rounded-lg shadow-soft-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {errorStatus}
        </h1>
        <p className="text-gray-700 dark:text-dark-text mb-4">
          {errorMessage}
        </p>
        <a
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

/**
 * Global hydration fallback
 * Shown during initial SSR hydration
 */
export function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading application...</p>
      </div>
    </div>
  );
}