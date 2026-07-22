// services/api.ts
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://autofix.pythonanywhere.com', // Django backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token (Web version using localStorage)
api.interceptors.request.use(
  (config) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${api.defaults.baseURL}/api/token/refresh/`,
            { refresh: refreshToken }
          );
          
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear all auth data on refresh failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('profile_data');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== API FUNCTIONS ====================

// JWT Authentication
export const getToken = (mobileNumber: string, password?: string) => {
  return api.post('/api/token/', { mobile_number: mobileNumber, password });
};

export const refreshToken = (refresh: string) => {
  return api.post('/api/token/refresh/', { refresh });
};

export const verifyToken = (token: string) => {
  return api.post('/api/token/verify/', { token });
};

// Registration
export const checkPhone = (mobileNumber: string) => {
  return api.post('/api/register/check-phone/', { mobile_number: mobileNumber });
};

export const sendOTP = (mobileNumber: string, email: string) => {
  return api.post('/api/register/send-otp/', { mobile_number: mobileNumber, email });
};

export const verifyOTPAndRegister = (mobileNumber: string, email: string, otp: string) => {
  return api.post('/api/register/verify-otp/', {
    mobile_number: mobileNumber,
    email,
    otp_code: otp,
  });
};

export const resendOTP = (mobileNumber: string, email: string) => {
  return api.post('/api/register/resend-otp/', { mobile_number: mobileNumber, email });
};

// Authentication
export const login = (mobileNumber: string, password?: string) => {
  return api.post('/api/login/', { mobile_number: mobileNumber, password });
};

export const logout = () => {
  return api.post('/api/logout/');
};

// Profile
export const getProfile = () => {
  return api.get('/api/profile/');
};

export const updateProfile = (data: any) => {
  return api.patch('/api/profile/update/', data);
};

export const updateProfilePicture = (picture: string) => {
  return api.post('/api/profile/update-picture/', { profile_picture: picture });
};

export const deleteProfileField = (fieldName: string) => {
  return api.delete(`/api/profile/field/${fieldName}/`);
};

export const deleteAccount = () => {
  return api.delete('/api/profile/delete-account/');
};

export const getProfileByUserId = (userId: number) => {
  return api.get(`/api/profile/user/${userId}/`);
};

// Users
export const getAllUsers = () => {
  return api.get('/api/users/all/');
};

// Members
export const getMembers = () => {
  return api.get('/api/members/');
};

export const createMember = (data: any) => {
  return api.post('/api/members/create/', data);
};

export const updateMember = (id: number, data: any) => {
  return api.put(`/api/members/update/${id}/`, data);
};

export const deleteMember = (id: number) => {
  return api.delete(`/api/members/delete/${id}/`);
};

export const activateMember = (id: number) => {
  return api.post(`/api/members/activate/${id}/`);
};

export const deactivateMember = (id: number) => {
  return api.post(`/api/members/deactivate/${id}/`);
};

export const getMemberStatistics = () => {
  return api.get('/api/members/statistics/');
};

// Test
export const testAPI = () => {
  return api.get('/api/test/');
};

// ==================== HELPER FUNCTIONS ====================

export const setAuthToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('profile_data');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export default api;