import { useState } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumbs from '../../components/common/Breadcrumbs';

/**
 * Main Application Layout
 * Provides the complete dashboard layout structure:
 * - Fixed header (top)
 * - Collapsible sidebar (left)
 * - Content area with breadcrumbs
 * - Fixed footer (bottom)
 * 
 * This layout is used for all authenticated routes
 */

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-bg">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <main className="pt-16 pb-12 lg:pl-64 min-h-screen">
        <div className="p-6">
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Page Content */}
          <div className="mt-4">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/**
 * Layout-specific hydration fallback
 * Shows skeleton UI while page content is loading
 */
export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-bg">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="skeleton w-8 h-8 rounded-md" />
            <div className="skeleton w-32 h-8 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton w-24 h-8 rounded-md hidden md:block" />
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="skeleton w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-dark-surface border-r border-light-border dark:border-dark-border hidden lg:block">
        <div className="p-4 space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-10 rounded-md" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="pt-16 lg:pl-64 p-6">
        <div className="skeleton h-6 w-48 rounded-md mb-6" />
        <div className="card p-6">
          <div className="skeleton h-8 w-64 rounded-md mb-4" />
          <div className="space-y-3">
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-5/6 rounded-md" />
            <div className="skeleton h-4 w-4/6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}