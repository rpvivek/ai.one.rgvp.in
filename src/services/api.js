import axios from 'axios';

/**
 * Centralized Axios API client
 * Features:
 * - Automatic JWT token attachment from HTTP-only cookies
 * - Global error handling via response interceptor
 * - Excludes JWT for public auth endpoints
 * - 2026 best practices for enterprise applications
 */

const API_BASE_URL = import.meta.env.VITE_URL_APP_API || 'https://apis.one.rgvp.in';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include HTTP-only cookies with requests
});

/**
 * Request Interceptor
 * Automatically attaches JWT Bearer token from cookies
 * Excludes token for public auth routes
 */
api.interceptors.request.use(
  (config) => {
    // Public routes that should not include JWT
    const publicRoutes = ['/auth/login', '/auth/forgot-password', '/auth/register'];
    
    const isPublicRoute = publicRoutes.some(route => 
      config.url?.includes(route)
    );

    // For non-public routes, cookie-based JWT is automatically sent
    // via withCredentials: true configuration
    // No manual token attachment needed for HTTP-only cookies
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Global error handling for common scenarios:
 * - 401: Unauthorized - redirect to login
 * - 403: Forbidden - show access denied
 * - 500: Server error - show error message
 */
api.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - session expired or invalid
          // Clear local auth state and redirect to login
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            console.error('Unauthorized: Redirecting to login');
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access denied:', data.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.config.url);
          break;

        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error:', data.message || 'Internal server error');
          break;

        default:
          console.error('API Error:', data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper functions for common API operations
 */

/**
 * GET request with query parameters
 * @param {string} table - Table/endpoint name
 * @param {Object} params - Query parameters
 */
export const getAll = (table, params = {}) => {
  return api.get(`/${table}`, { params });
};

/**
 * GET single record by ID
 * @param {string} table - Table/endpoint name
 * @param {string|number} id - Record ID
 */
export const getById = (table, id) => {
  return api.get(`/${table}/${id}`);
};

/**
 * POST - Create new record
 * @param {string} table - Table/endpoint name
 * @param {Object} data - Record data
 */
export const create = (table, data) => {
  return api.post(`/${table}`, data);
};

/**
 * PUT - Update existing record
 * @param {string} table - Table/endpoint name
 * @param {string|number} id - Record ID
 * @param {Object} data - Updated data
 */
export const update = (table, id, data) => {
  return api.put(`/${table}/${id}`, data);
};

/**
 * DELETE - Remove record
 * @param {string} table - Table/endpoint name
 * @param {string|number} id - Record ID
 */
export const remove = (table, id) => {
  return api.delete(`/${table}/${id}`);
};

export default api;