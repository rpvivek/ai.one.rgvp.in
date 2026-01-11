import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 * Shows loading state during authentication check
 * 
 * Usage in route configuration:
 * - Wrap protected routes with this component
 * - Uses <Outlet /> to render child routes
 */

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-surface dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-light-muted dark:text-dark-muted">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}