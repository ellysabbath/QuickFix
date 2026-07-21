// lib/api/profileApi.ts
import axiosInstance from './axiosInstance';
import API_CONFIG from './_config';

export interface UserProfile {
  id: number;
  mobile_number: string;
  email: string;
  full_name: string;
  date_joined: string;
  is_active: boolean;
}

export interface MyProfileData {
  id?: number;
  profile_picture: string | null;
  bio: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithProfileResponse {
  success: boolean;
  data: {
    id: number;
    mobile_number: string;
    email: string;
    full_name: string;
    date_joined: string;
    is_active: boolean;
    profile: MyProfileData;
  };
  error?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    mobile_number: string;
    email: string;
    full_name: string;
    date_joined: string;
    is_active: boolean;
    profile: MyProfileData;
  };
  errors?: any;
}

export interface UpdatePictureResponse {
  success: boolean;
  message: string;
  profile_picture: string;
  error?: string;
}

class ProfileAPI {
  /**
   * Get user profile with all data
   * GET /api/profile/
   */
  async getProfile(): Promise<UserWithProfileResponse> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.PROFILE);
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Update user profile (bio, location, profile_picture)
   * PATCH /api/profile/update/
   */
  async updateProfile(data: Partial<MyProfileData>): Promise<UpdateProfileResponse> {
    try {
      const response = await axiosInstance.patch(API_CONFIG.ENDPOINTS.PROFILE_UPDATE, data);
      
      if (response.data.success) {
        // Update cached profile data
        const cachedProfile = localStorage.getItem('cached_profile');
        if (cachedProfile) {
          const profileData = JSON.parse(cachedProfile);
          const updatedProfile = { ...profileData, ...data };
          localStorage.setItem('cached_profile', JSON.stringify(updatedProfile));
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Update profile picture using Base64
   * POST /api/profile/update-picture/
   */
  async updateProfilePicture(base64Image: string): Promise<UpdatePictureResponse> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.UPDATE_PROFILE_PICTURE, {
        profile_picture: base64Image,
      });
      
      if (response.data.success) {
        // Update cached profile
        const cachedProfile = localStorage.getItem('cached_profile');
        if (cachedProfile) {
          const profileData = JSON.parse(cachedProfile);
          profileData.profile_picture = response.data.profile_picture;
          localStorage.setItem('cached_profile', JSON.stringify(profileData));
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile picture error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Update profile picture using FormData (for file uploads)
   * POST /api/profile/update-picture/
   */
  async updateProfilePictureWithFile(file: File): Promise<UpdatePictureResponse> {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.UPDATE_PROFILE_PICTURE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success) {
        // Update cached profile
        const cachedProfile = localStorage.getItem('cached_profile');
        if (cachedProfile) {
          const profileData = JSON.parse(cachedProfile);
          profileData.profile_picture = response.data.profile_picture;
          localStorage.setItem('cached_profile', JSON.stringify(profileData));
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile picture error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Delete a specific profile field
   * DELETE /api/profile/field/<field_name>/
   */
  async deleteProfileField(fieldName: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(
        `${API_CONFIG.ENDPOINTS.DELETE_PROFILE_FIELD}${fieldName}/`
      );
      
      if (response.data.success) {
        // Update cached profile
        const cachedProfile = localStorage.getItem('cached_profile');
        if (cachedProfile) {
          const profileData = JSON.parse(cachedProfile);
          profileData[fieldName] = '';
          localStorage.setItem('cached_profile', JSON.stringify(profileData));
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Delete profile field error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Delete user account
   * DELETE /api/profile/delete-account/
   */
  async deleteAccount(): Promise<any> {
    try {
      const response = await axiosInstance.delete(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT);
      
      if (response.data.success) {
        // Clear all cached data
        const keysToRemove = [
          'cached_user',
          'cached_profile',
          'cached_user_time',
          'access_token',
          'refresh_token',
          'user_data',
          'profile_data',
          'user_role',
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Delete account error:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Save profile to cache
   */
  cacheProfile(profileData: MyProfileData): void {
    localStorage.setItem('cached_profile', JSON.stringify(profileData));
  }

  /**
   * Load profile from cache
   */
  loadCachedProfile(): MyProfileData | null {
    try {
      const cachedProfile = localStorage.getItem('cached_profile');
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }
      return null;
    } catch (error) {
      console.error('Error loading cached profile:', error);
      return null;
    }
  }

  /**
   * Clear cached profile
   */
  clearCachedProfile(): void {
    localStorage.removeItem('cached_profile');
  }

  /**
   * Get profile picture from cache or return default
   */
  getProfilePicture(): string | null {
    const profile = this.loadCachedProfile();
    return profile?.profile_picture || null;
  }

  /**
   * Update profile picture in cache only (for optimistic updates)
   */
  updateCachedProfilePicture(picture: string): void {
    const profile = this.loadCachedProfile();
    if (profile) {
      profile.profile_picture = picture;
      this.cacheProfile(profile);
    }
  }
}

export default new ProfileAPI();