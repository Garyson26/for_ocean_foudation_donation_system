/**
 * Common Configuration File
 *
 * This file contains all the common constants, API endpoints,
 * and configuration used throughout the application.
 */

// ============================================
// API Configuration
// ============================================

/**
 * Base API URL for backend services
 * Update this when deploying to production
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
  },

  // Users
  USERS: {
    BASE: `${API_BASE_URL}/api/users`,
    BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPDATE: (id) => `${API_BASE_URL}/api/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/users/${id}`,
  },

  // Categories
  CATEGORIES: {
    BASE: `${API_BASE_URL}/api/categories`,
    BY_ID: (id) => `${API_BASE_URL}/api/categories/${id}`,
    CREATE: `${API_BASE_URL}/api/categories`,
    UPDATE: (id) => `${API_BASE_URL}/api/categories/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/categories/${id}`,
  },

  // Donations
  DONATIONS: {
    BASE: `${API_BASE_URL}/api/donations`,
    BY_ID: (id) => `${API_BASE_URL}/api/donations/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/api/donations/user/${userId}`,
    BY_CATEGORY: (categoryId) => `${API_BASE_URL}/api/donations/category/${categoryId}`,
    CREATE: `${API_BASE_URL}/api/donations`,
    UPDATE: (id) => `${API_BASE_URL}/api/donations/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/donations/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/donations/${id}/status`,
  },

  // Admin
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    DONATIONS: `${API_BASE_URL}/api/admin/donations`,
    CATEGORIES: `${API_BASE_URL}/api/admin/categories`,
  },
};

// ============================================
// HTTP Headers Configuration
// ============================================

/**
 * Get common HTTP headers for API requests
 * @param {boolean} includeAuth - Whether to include authorization token
 * @returns {Object} Headers object
 */
export const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ============================================
// Application Constants
// ============================================

/**
 * User Roles
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

/**
 * Donation Status
 */
export const DONATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Local Storage Keys
 * Note: userRole is NOT stored in localStorage for security reasons
 * It is decoded from the JWT token instead
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  // USER_ROLE: removed for security - use getUserRole() instead
  USER_DATA: 'userData',
};

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * Form Validation Rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^[0-9]{10}$/,
};

/**
 * File Upload Configuration
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
};

/**
 * Date Format
 */
export const DATE_FORMAT = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY HH:mm:ss',
  SHORT: 'MM/DD/YYYY',
  TIME: 'HH:mm:ss',
};

// ============================================
// Utility Functions
// ============================================

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get current user role from JWT token (secure method)
 * @returns {string|null}
 */
export const getUserRole = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return getUserRole() === USER_ROLES.ADMIN;
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  // USER_ROLE is no longer stored in localStorage
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Format currency
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format date
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 */
export const formatDate = (date, format = DATE_FORMAT.DISPLAY) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (func, delay = UI_CONFIG.DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate password
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

// ============================================
// Export default configuration
// ============================================

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getHeaders,
  USER_ROLES,
  DONATION_STATUS,
  STORAGE_KEYS,
  PAGINATION,
  VALIDATION,
  FILE_UPLOAD,
  UI_CONFIG,
  DATE_FORMAT,
  isAuthenticated,
  getUserRole,
  isAdmin,
  clearAuth,
  formatCurrency,
  formatDate,
  debounce,
  isValidEmail,
  isValidPassword,
};

