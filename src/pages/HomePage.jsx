import { useLoaderData } from 'react-router';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { getAll } from '../services/api';

/**
 * Dashboard Home Page
 * Displays summary statistics and recent activity
 * Uses loader for data fetching before render
 */

export default function HomePage() {
  const data = useLoaderData();

  const stats = [
    {
      title: 'Total Users',
      value: data?.userCount || '0',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Documents',
      value: data?.documentCount || '0',
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Growth',
      value: data?.growth || '0%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      title: 'Active Now',
      value: data?.activeUsers || '0',
      icon: Activity,
      color: 'bg-orange-500',
      change: '+5%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Welcome to {import.meta.env.VITE_ORG_NAME}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your organization today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/users/add"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-center"
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">Add User</p>
          </a>
          <a
            href="/employees"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-center"
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">View Employees</p>
          </a>
          <a
            href="/profile"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-center"
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">My Profile</p>
          </a>
          <a
            href="/settings"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-center"
          >
            <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">Settings</p>
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Loader function - fetches data before rendering
 * Ensures no layout flicker
 */
export async function loader() {
  try {
    // Fetch dashboard statistics
    // This is a mock - replace with actual API calls
    return {
      userCount: 1234,
      documentCount: 567,
      growth: '23.5%',
      activeUsers: 89,
      recentActivity: [
        {
          title: 'New user registered',
          timestamp: '2 hours ago',
        },
        {
          title: 'Document uploaded',
          timestamp: '5 hours ago',
        },
        {
          title: 'Profile updated',
          timestamp: '1 day ago',
        },
      ],
    };
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return {
      userCount: 0,
      documentCount: 0,
      growth: '0%',
      activeUsers: 0,
      recentActivity: [],
    };
  }
}

/**
 * SEO metadata
 */
export const meta = () => {
  return [
    { title: 'Dashboard - RGVP Core' },
    { name: 'description', content: 'RGVP Core enterprise dashboard' },
  ];
};