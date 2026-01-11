import { Link } from 'react-router';
import { Edit, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Profile View Page
 * Displays current user's profile information
 */

export default function ProfileView() {
  const { user } = useAuth();

  const profileSections = [
    {
      title: 'Contact Information',
      items: [
        { icon: Mail, label: 'Email', value: user?.email || 'Not provided' },
        { icon: Phone, label: 'Phone', value: user?.phone || 'Not provided' },
        { icon: MapPin, label: 'Location', value: user?.location || 'Not provided' },
      ],
    },
    {
      title: 'Work Information',
      items: [
        { icon: Briefcase, label: 'Department', value: user?.department || 'Not assigned' },
        { icon: Briefcase, label: 'Position', value: user?.position || 'Not assigned' },
        { icon: Calendar, label: 'Join Date', value: user?.joinDate || 'Unknown' },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your personal information
          </p>
        </div>
        <Link to="/profile/edit" className="btn-primary flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {user?.name || 'User Name'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user?.position || 'Position'} • {user?.department || 'Department'}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {user?.role || 'User'}
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                user?.status === 'active' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}>
                {user?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      {profileSections.map((section, index) => (
        <div key={index} className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Account Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Account Settings
        </h3>
        <div className="space-y-3">
          <Link
            to="/settings"
            className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <p className="font-medium text-gray-800 dark:text-gray-200">
              General Settings
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account preferences
            </p>
          </Link>
          <Link
            to="/settings/security"
            className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Security
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update password and security settings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const meta = () => {
  return [
    { title: 'My Profile - RGVP Core' },
    { name: 'description', content: 'View and manage your profile' },
  ];
};