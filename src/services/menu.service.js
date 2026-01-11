import api from './api';

/**
 * Menu Service
 * Fetches dynamic menu structure from backend
 * Handles menu transformation and caching
 */

const MENU_CACHE_KEY = 'app_menu_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch menu structure from backend
 * Returns cached version if available and not expired
 * @returns {Promise<Array>} Menu items array
 */
export async function fetchMenuItems() {
  try {
    // Check cache first
    const cached = getCachedMenu();
    if (cached) {
      return cached;
    }

    // Fetch from API
    const response = await api.get('/web_menu');
    const menuData = response.data;

    // Transform menu data if needed
    const transformedMenu = transformMenuData(menuData);

    // Cache the result
    cacheMenu(transformedMenu);

    return transformedMenu;
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    // Return cached menu even if expired, or empty array
    return getCachedMenu(true) || [];
  }
}

/**
 * Transform raw menu data into component-friendly structure
 * @param {Array|Object} menuData - Raw menu data from API
 * @returns {Array} Transformed menu items
 */
function transformMenuData(menuData) {
  // If API returns array directly
  if (Array.isArray(menuData)) {
    return menuData.map(item => ({
      id: item.id || item.menu_id,
      title: item.title || item.menu_title,
      path: item.path || item.menu_path,
      icon: item.icon || item.menu_icon,
      parentId: item.parent_id || item.menu_parent_id || null,
      order: item.order || item.menu_order || 0,
      roles: item.roles || item.menu_roles || [],
      isActive: item.is_active !== false,
      children: [],
    }));
  }

  // If API returns object with menu property
  if (menuData.menu) {
    return transformMenuData(menuData.menu);
  }

  // If API returns object with data property
  if (menuData.data) {
    return transformMenuData(menuData.data);
  }

  return [];
}

/**
 * Build hierarchical menu structure from flat array
 * @param {Array} menuItems - Flat menu items array
 * @returns {Array} Hierarchical menu structure
 */
export function buildMenuHierarchy(menuItems) {
  const itemMap = {};
  const rootItems = [];

  // Create a map of all items
  menuItems.forEach(item => {
    itemMap[item.id] = { ...item, children: [] };
  });

  // Build hierarchy
  menuItems.forEach(item => {
    if (item.parentId && itemMap[item.parentId]) {
      // Add to parent's children
      itemMap[item.parentId].children.push(itemMap[item.id]);
    } else {
      // Root level item
      rootItems.push(itemMap[item.id]);
    }
  });

  // Sort items by order
  const sortByOrder = (items) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach(item => {
      if (item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(rootItems);

  return rootItems;
}

/**
 * Filter menu items based on user roles
 * @param {Array} menuItems - Menu items
 * @param {Array} userRoles - User's roles
 * @returns {Array} Filtered menu items
 */
export function filterMenuByRoles(menuItems, userRoles = []) {
  return menuItems
    .filter(item => {
      // If no roles specified, item is public
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      // Check if user has any of the required roles
      return item.roles.some(role => userRoles.includes(role));
    })
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByRoles(item.children, userRoles) : [],
    }));
}

/**
 * Cache menu in localStorage
 * @param {Array} menuData - Menu data to cache
 */
function cacheMenu(menuData) {
  try {
    const cacheData = {
      data: menuData,
      timestamp: Date.now(),
    };
    localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to cache menu:', error);
  }
}

/**
 * Get cached menu from localStorage
 * @param {boolean} ignoreExpiry - Return cache even if expired
 * @returns {Array|null} Cached menu or null
 */
function getCachedMenu(ignoreExpiry = false) {
  try {
    const cached = localStorage.getItem(MENU_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (!ignoreExpiry && isExpired) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to get cached menu:', error);
    return null;
  }
}

/**
 * Clear menu cache
 */
export function clearMenuCache() {
  try {
    localStorage.removeItem(MENU_CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear menu cache:', error);
  }
}