import { Link, useLocation } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Automatically generates breadcrumb navigation based on current route
 * Improves UX by showing the user's location in the app hierarchy
 */

export default function Breadcrumbs() {
  const location = useLocation();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Home', path: '/', icon: Home }
    ];

    let currentPath = '';
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert kebab-case to Title Case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === paths.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          
          {crumb.isLast ? (
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              {crumb.icon && <crumb.icon className="w-4 h-4" />}
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}