// lib/api/registerApi.ts
import axiosInstance from './axiosInstance';
import API_CONFIG from './_config';

export interface CheckPhoneResponse {
  valid: boolean;
  user_exists: boolean;
  mobile_number: string;
  message?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  email: string;
  expires_in: number;
  errors?: any;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    mobile_number: string;
    email: string;
    full_name: string;
    date_joined: string;
    is_active: boolean;
    role?: string;
    role_display?: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
  errors?: any;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
  expires_in?: number;
}

class RegisterAPI {
  /**
   * Step 1: Check if phone number is valid
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
   * Step 2: Send OTP to email
   * @param mobileNumber - The phone number with country code
   * @param email - User's email address
   */
  async sendOTP(mobileNumber: string, email: string): Promise<SendOTPResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.SEND_OTP, {
        mobile_number: mobileNumber,
        email: email,
      });
      
      // Store email temporarily for OTP verification (web - localStorage)
      if (response.data.success) {
        localStorage.setItem('temp_registration_email', email);
        localStorage.setItem('temp_registration_phone', mobileNumber);
      }
      
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
   * Step 3: Verify OTP and create account
   * @param mobileNumber - The phone number with country code
   * @param email - User's email address
   * @param otpCode - The 6-digit OTP code
   */
  async verifyOTP(mobileNumber: string, email: string, otpCode: string): Promise<VerifyOTPResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.VERIFY_OTP, {
        mobile_number: mobileNumber,
        email: email,
        otp_code: otpCode,
      });
      
      if (response.data.success) {
        // Store tokens and user data (web - localStorage)
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        if (response.data.user.role) {
          localStorage.setItem('user_role', response.data.user.role);
        }
        
        // Clear temporary registration data
        localStorage.removeItem('temp_registration_email');
        localStorage.removeItem('temp_registration_phone');
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
   * Resend OTP code
   * @param mobileNumber - The phone number with country code
   * @param email - User's email address
   */
  async resendOTP(mobileNumber: string, email: string): Promise<ResendOTPResponse> {
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
   * Clear temporary registration data
   */
  clearTempData(): void {
    localStorage.removeItem('temp_registration_email');
    localStorage.removeItem('temp_registration_phone');
  }

  /**
   * Get temporary registration email
   */
  getTempEmail(): string | null {
    return localStorage.getItem('temp_registration_email');
  }

  /**
   * Get temporary registration phone
   */
  getTempPhone(): string | null {
    return localStorage.getItem('temp_registration_phone');
  }

  /**
   * Check if there is a pending registration
   */
  hasPendingRegistration(): boolean {
    return !!(localStorage.getItem('temp_registration_email') && 
              localStorage.getItem('temp_registration_phone'));
  }
}

export default new RegisterAPI();