import { useState, useEffect } from 'react';
import { Menu, Bell, Sun, Moon, Maximize, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import FullScreenToggle from '../../components/common/FullScreenToggle';

/**
 * Application Header Component
 * Fixed header with logo, sidebar toggle, and user widgets
 * Features:
 * - Live clock
 * - Theme toggle
 * - Fullscreen mode
 * - Notifications
 * - User menu with profile and logout
 */

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSignedInTime = () => {
    // This would come from your auth context or user session data
    return user?.signedInAt ? new Date(user.signedInAt).toLocaleString() : 'Just now';
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-surface border-b border-light-border dark:border-dark-border shadow-sm z-40">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section: Logo and Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={import.meta.env.VITE_ORG_LOGO}
              alt={import.meta.env.VITE_ORG_NAME}
              className="h-8 w-auto"
            />
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-200 hidden sm:block">
              {import.meta.env.VITE_ORG_NAME}
            </span>
          </div>
        </div>

        {/* Right Section: Widgets */}
        <div className="flex items-center gap-2">
          {/* Live Clock */}
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(currentTime)}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <FullScreenToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg">
                <div className="p-4 border-b border-light-border dark:border-dark-border">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-800 dark:text-gray-200">
                {user?.name || user?.email || 'User'}
              </span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg">
                <div className="p-4 border-b border-light-border dark:border-dark-border">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.userCode || user?.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Signed in: {getSignedInTime()}
                  </p>
                </div>

                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">My Profile</span>
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </a>
                </div>

                <div className="border-t border-light-border dark:border-dark-border py-2">
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}