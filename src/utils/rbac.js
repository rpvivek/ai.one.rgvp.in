/**
 * Role-Based Access Control (RBAC) Utilities
 * Helper functions for checking user permissions and roles
 */

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export function hasRole(user, role) {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array<string>} roles - Array of roles to check
 * @returns {boolean}
 */
export function hasAnyRole(user, roles) {
  if (!user || !user.roles || !Array.isArray(roles)) return false;
  return roles.some(role => user.roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 * @param {Object} user - User object
 * @param {Array<string>} roles - Array of roles to check
 * @returns {boolean}
 */
export function hasAllRoles(user, roles) {
  if (!user || !user.roles || !Array.isArray(roles)) return false;
  return roles.every(role => user.roles.includes(role));
}

/**
 * Check if user has a specific permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean}
 */
export function hasAnyPermission(user, permissions) {
  if (!user || !user.permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => user.permissions.includes(permission));
}

/**
 * Check if user can access a route based on roles
 * @param {Object} user - User object
 * @param {Array<string>} requiredRoles - Required roles for route
 * @returns {boolean}
 */
export function canAccessRoute(user, requiredRoles = []) {
  // If no roles required, route is public
  if (!requiredRoles || requiredRoles.length === 0) return true;
  
  // Check if user has any of the required roles
  return hasAnyRole(user, requiredRoles);
}

/**
 * Get user's highest priority role
 * Assumes role hierarchy: admin > manager > user
 * @param {Object} user - User object
 * @returns {string|null}
 */
export function getPrimaryRole(user) {
  if (!user || !user.roles || user.roles.length === 0) return null;
  
  const roleHierarchy = ['admin', 'manager', 'user'];
  
  for (const role of roleHierarchy) {
    if (user.roles.includes(role)) {
      return role;
    }
  }
  
  // Return first role if not in hierarchy
  return user.roles[0];
}

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isAdmin(user) {
  return hasRole(user, 'admin');
}

/**
 * Filter items based on user roles
 * @param {Array} items - Items with roles property
 * @param {Object} user - User object
 * @returns {Array} Filtered items
 */
export function filterByRoles(items, user) {
  return items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return canAccessRoute(user, item.roles);
  });
}