import { lazy } from 'react';

/**
 * Dynamic Route Generation System
 * Transforms database-driven menu manifest into React Router routes
 * Features:
 * - Lazy loading for optimal code-splitting
 * - Automatic component resolution
 * - Nested route support
 * - Role-based access control
 */

/**
 * Transform menu manifest into route configuration
 * @param {Array} menuManifest - Menu items from backend
 * @returns {Array} Route configuration objects
 */
export function generateRoutesFromManifest(menuManifest) {
  return menuManifest
    .filter(item => item.path && item.isActive)
    .map(item => transformToRoute(item));
}

/**
 * Transform single menu item to route object
 * @param {Object} menuItem - Menu item
 * @returns {Object} Route configuration
 */
function transformToRoute(menuItem) {
  const route = {
    path: menuItem.path,
    lazy: () => loadComponent(menuItem.component || menuItem.path),
    handle: {
      title: menuItem.title,
      icon: menuItem.icon,
      roles: menuItem.roles || [],
    },
  };

  // Add nested routes if children exist
  if (menuItem.children && menuItem.children.length > 0) {
    route.children = menuItem.children.map(child => transformToRoute(child));
  }

  return route;
}

/**
 * Dynamically load component based on path or component name
 * Implements lazy loading with automatic error boundaries
 * @param {string} componentPath - Component path or name
 * @returns {Promise} Lazy-loaded component
 */
async function loadComponent(componentPath) {
  try {
    // Convert path to component name
    // e.g., /dashboard/users -> DashboardUsers
    const componentName = pathToComponentName(componentPath);

    // Try to load from pages directory
    const component = await importComponent(componentName);

    return {
      Component: component.default || component,
    };
  } catch (error) {
    console.error(`Failed to load component for path: ${componentPath}`, error);
    
    // Return fallback component
    return {
      Component: () => (
        <div className="p-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
              Component Not Found
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              The component for path "{componentPath}" could not be loaded.
            </p>
          </div>
        </div>
      ),
    };
  }
}

/**
 * Convert URL path to PascalCase component name
 * @param {string} path - URL path
 * @returns {string} Component name
 */
function pathToComponentName(path) {
  // Remove leading slash and split by slash or hyphen
  return path
    .replace(/^\//, '')
    .split(/[/-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Import component with multiple fallback strategies
 * @param {string} componentName - Component name
 * @returns {Promise} Component module
 */
async function importComponent(componentName) {
  // Strategy 1: Try exact match
  try {
    return await import(`../pages/${componentName}.jsx`);
  } catch (e) {
    // Ignore and try next strategy
  }

  // Strategy 2: Try with 'Page' suffix
  try {
    return await import(`../pages/${componentName}Page.jsx`);
  } catch (e) {
    // Ignore and try next strategy
  }

  // Strategy 3: Try lowercase with hyphen
  try {
    const kebabCase = componentName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
    return await import(`../pages/${kebabCase}.jsx`);
  } catch (e) {
    // All strategies failed
    throw new Error(`Component not found: ${componentName}`);
  }
}

/**
 * Example manifest structure (from backend API):
 * 
 * [
 *   {
 *     id: 1,
 *     title: 'Dashboard',
 *     path: '/dashboard',
 *     component: 'Dashboard',
 *     icon: 'LayoutDashboard',
 *     roles: ['admin', 'user'],
 *     isActive: true,
 *     order: 1,
 *     children: [
 *       {
 *         id: 2,
 *         title: 'Users',
 *         path: '/dashboard/users',
 *         component: 'UsersList',
 *         icon: 'Users',
 *         roles: ['admin'],
 *         isActive: true,
 *         order: 1,
 *       }
 *     ]
 *   }
 * ]
 */