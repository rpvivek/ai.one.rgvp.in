import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { fetchMenuItems, buildMenuHierarchy, filterMenuByRoles } from '../../services/menu.service';
import { useAuth } from '../../context/AuthContext';

/**
 * Dynamic Sidebar Component
 * Features:
 * - Database-driven menu from backend API
 * - Hierarchical menu support (parent/sub-menus)
 * - Role-based visibility
 * - Collapsible menu items
 * - Active route highlighting
 * - Responsive design with mobile overlay
 */

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Fetch menu items on mount
  useEffect(() => {
    loadMenu();
  }, [user]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const items = await fetchMenuItems();
      const hierarchy = buildMenuHierarchy(items);
      
      // Filter by user roles
      const userRoles = user?.roles || [];
      const filteredMenu = filterMenuByRoles(hierarchy, userRoles);
      
      setMenuItems(filteredMenu);
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const getIcon = (iconName) => {
    if (!iconName) return null;
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const paddingLeft = `${(depth + 1) * 0.75}rem`;

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpanded(item.id)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            style={{ paddingLeft }}
          >
            <div className="flex items-center gap-3">
              {getIcon(item.icon)}
              <span className="text-sm font-medium">{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="bg-gray-50 dark:bg-gray-800/50">
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 transition-colors ${
            isActive
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-4 border-primary-600'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`
        }
        style={{ paddingLeft }}
      >
        {getIcon(item.icon)}
        <span className="text-sm font-medium">{item.title}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-dark-surface border-r border-light-border dark:border-dark-border transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Menu Items */}
        <nav className="h-full overflow-y-auto py-4">
          {loading ? (
            <div className="px-4 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-md" />
              ))}
            </div>
          ) : menuItems.length > 0 ? (
            <div className="space-y-1">
              {menuItems.map(item => renderMenuItem(item))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <p>No menu items available</p>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-800 border-t border-light-border dark:border-dark-border">
          <button
            onClick={loadMenu}
            className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Refresh Menu
          </button>
        </div>
      </aside>
    </>
  );
}