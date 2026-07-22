// lib/api/_config.ts

export const API_CONFIG = {
  // Django Backend URL - Update this for your environment
  BASE_URL: import.meta.env.VITE_API_URL || 'https://autofix.pythonanywhere.com/api/',
  TIMEOUT: 30000, // 30 seconds (reduced from 30000000 which was too high)
  
  ENDPOINTS: {
    // ==================== Registration ====================
    CHECK_PHONE: 'register/check-phone/',
    SEND_OTP: 'register/send-otp/',
    VERIFY_OTP: 'register/verify-otp/',
    RESEND_OTP: 'register/resend-otp/',
    
    // ==================== Authentication ====================
    LOGIN: 'login/',
    LOGOUT: 'logout/',
    
    // ==================== JWT ====================
    TOKEN: 'token/',
    TOKEN_REFRESH: 'token/refresh/',
    TOKEN_VERIFY: 'token/verify/',
    
    // ==================== Profile ====================
    PROFILE: 'profile/',
    PROFILE_UPDATE: 'profile/update/',
    UPDATE_PROFILE_PICTURE: 'profile/update-picture/',
    DELETE_PROFILE_FIELD: 'profile/field/',
    DELETE_ACCOUNT: 'profile/delete-account/',
    GET_PROFILE_BY_USER: 'profile/user/',
    
    // ==================== Users ====================
    ALL_USERS: 'users/all/',
    
    // ==================== Members (Admin) ====================
    MEMBERS: 'members/',
    MEMBERS_CREATE: 'members/create/',
    MEMBERS_UPDATE: 'members/update/',
    MEMBERS_DELETE: 'members/delete/',
    MEMBERS_ACTIVATE: 'members/activate/',
    MEMBERS_DEACTIVATE: 'members/deactivate/',
    MEMBERS_STATISTICS: 'members/statistics/',
    
    // ==================== Admin User Management ====================
    ADMIN_USERS: 'users/',
    ADMIN_USER_DETAIL: 'users/',
    ADMIN_USER_ROLE: 'users/',
    ADMIN_USER_PROFILE: 'users/',
    ADMIN_USERS_BY_ROLE: 'users/role/',
    ADMIN_USER_STATS: 'users/stats/',
    
    // ==================== Admin Role Management ====================
    ADMIN_ROLES: 'roles/',
    ADMIN_ROLE_DETAIL: 'roles/',
    ADMIN_ROLES_BY_TYPE: 'roles/type/',
    ADMIN_ROLES_BY_STATUS: 'roles/status/',
    ADMIN_ROLE_STATS: 'roles/stats/',
    ADMIN_ROLE_SEARCH: 'roles/search/',
    ADMIN_ROLE_BULK_UPDATE: 'roles/bulk/update/',
    
    // ==================== Admin OTP Management ====================
    ADMIN_OTPS: 'otps/',
    ADMIN_OTP_DETAIL: 'otps/',
    
    // ==================== Admin Session Management ====================
    ADMIN_SESSIONS: 'sessions/',
    ADMIN_SESSION_DETAIL: 'sessions/',
    
    // ==================== Admin Profile Management ====================
    ADMIN_PROFILES: 'profiles/',
    ADMIN_PROFILE_DETAIL: 'profiles/',
    
    // ==================== Mechanics ====================
    MECHANICS: 'mechanics/',
    MECHANIC_DETAIL: 'mechanics/',
    
    // ==================== Payments ====================
    PAYMENTS: 'payments/',
    PAYMENT_DETAIL: 'payments/',
    PAYMENT_INITIATE: 'payments/initiate/',
    PAYMENT_CONFIRM: 'payments/confirm/',
    
    // ==================== Test ====================
    TEST: 'test/',
  }
};

// ==================== Helper Functions ====================

export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getEndpointWithId = (endpoint: string, id: number | string): string => {
  return `${endpoint}${id}/`;
};

export const getEndpointWithParams = (endpoint: string, params: Record<string, any>): string => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

// ==================== Environment Configuration ====================

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || false;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD || false;
};

export const getApiUrl = (): string => {
  return API_CONFIG.BASE_URL;
};

export default API_CONFIG;