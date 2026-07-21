// lib/api/loginApi.ts
import axiosInstance from './axiosInstance';
import API_CONFIG from './_config';

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    mobile_number: string;
    email: string;
    full_name: string;
    date_joined: string;
    is_active: boolean;
    role: 'customer' | 'mechanic' | 'garage_owner' | 'admin';
    role_display: string;
    bio?: string;
    location?: string;
    profile_picture?: string | null;
  };
  tokens: {
    refresh: string;
    access: string;
  };
  errors?: any;
}

export interface CheckPhoneResponse {
  success: boolean;
  valid: boolean;
  user_exists: boolean;
  mobile_number: string;
  message?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  email?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  user?: any;
  tokens?: {
    refresh: string;
    access: string;
  };
}

class LoginAPI {
  /**
   * Check if phone number exists and is valid
   * @param mobileNumber - The phone number with country code
   */
  async checkPhoneNumber(mobileNumber: string): Promise<CheckPhoneResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.CHECK_PHONE, {
        mobile_number: mobileNumber,
      });
      return response.data;
    } catch (error: any) {
      console.error('Check phone number error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Send OTP to email
   * @param mobileNumber - The phone number with country code
   * @param email - The email address to send OTP to
   */
  async sendOTP(mobileNumber: string, email: string): Promise<SendOTPResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.SEND_OTP, {
        mobile_number: mobileNumber,
        email: email,
      });
      return response.data;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Verify OTP and register user
   * @param mobileNumber - The phone number with country code
   * @param email - The email address
   * @param otp - The OTP code
   */
  async verifyOTPAndRegister(mobileNumber: string, email: string, otp: string): Promise<VerifyOTPResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.VERIFY_OTP, {
        mobile_number: mobileNumber,
        email: email,
        otp_code: otp,
      });
      
      if (response.data.success) {
        // Store tokens and user data
        if (response.data.tokens) {
          localStorage.setItem('access_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
        }
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
          if (response.data.user.role) {
            localStorage.setItem('user_role', response.data.user.role);
          }
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Resend OTP
   * @param mobileNumber - The phone number with country code
   * @param email - The email address
   */
  async resendOTP(mobileNumber: string, email: string): Promise<SendOTPResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.RESEND_OTP, {
        mobile_number: mobileNumber,
        email: email,
      });
      return response.data;
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Login with phone number
   * @param mobileNumber - The phone number with country code
   * @param password - Optional password
   */
  async login(mobileNumber: string, password?: string): Promise<LoginResponse> {
    try {
      const payload: any = { mobile_number: mobileNumber };
      if (password) {
        payload.password = password;
      }
      
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, payload);
      
      if (response.data.success) {
        // Store tokens
        if (response.data.tokens) {
          localStorage.setItem('access_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
        }
        
        // Store user data
        const userData = response.data.user;
        if (userData) {
          localStorage.setItem('user_data', JSON.stringify(userData));
          if (userData.role) {
            localStorage.setItem('user_role', userData.role);
          }
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGOUT, {
          refresh_token: refreshToken,
        });
      }
      // Remove all auth data
      this.clearAuthData();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Clear all authentication data from localStorage
   */
  clearAuthData(): void {
    const keysToRemove = [
      'access_token',
      'refresh_token',
      'user_data',
      'profile_data',
      'user_role',
      'cached_user',
      'cached_profile',
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): any {
    try {
      const userStr = localStorage.getItem('user_data');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get user role from storage
   */
  getUserRole(): string | null {
    try {
      const role = localStorage.getItem('user_role');
      if (!role || role === 'undefined') {
        return null;
      }
      return role;
    } catch (error) {
      console.error('Get user role error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('access_token');
      const user = this.getCurrentUser();
      return !!(token && user);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string | string[]): boolean {
    try {
      const userRole = this.getUserRole();
      if (!userRole) return false;
      
      if (Array.isArray(role)) {
        return role.includes(userRole);
      }
      return userRole === role;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user is mechanic
   */
  isMechanic(): boolean {
    return this.hasRole('mechanic');
  }

  /**
   * Check if user is garage owner
   */
  isGarageOwner(): boolean {
    return this.hasRole('garage_owner');
  }

  /**
   * Check if user is customer
   */
  isCustomer(): boolean {
    return this.hasRole('customer');
  }

  /**
   * Get auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }
}

export default new LoginAPI();