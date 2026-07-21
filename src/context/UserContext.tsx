// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MyProfileData, UserProfile } from '../lib/api/profileApi';
import loginApi from '../lib/api/loginApi';
import profileApi from '../lib/api/profileApi';

// API Configuration for members endpoint
const MEMBERS_API_URL = 'http://127.0.0.1:8000/api/members';

// Extended UserProfile with role and role_display
interface ExtendedUserProfile extends UserProfile {
  role: string;
  role_display: string;
}

interface UserContextType {
  user: ExtendedUserProfile | null;
  profileData: MyProfileData | null;
  userRole: string | null;
  userFullName: string | null;
  userProfilePicture: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (mobileNumber: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<MyProfileData>) => Promise<boolean>;
  updateProfilePicture: (base64Image: string) => Promise<boolean>;
  deleteProfileField: (fieldName: string) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  clearUserData: () => Promise<void>;
  loadFromCache: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  fetchRoleFromAPI: () => Promise<string | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);
  const [profileData, setProfileData] = useState<MyProfileData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Fetch role directly from members API
  const fetchRoleFromAPI = async (): Promise<string | null> => {
    try {
      // Get current user's mobile number from storage
      const userDataStr = localStorage.getItem('user_data');
      if (!userDataStr) {
        console.log('No user data found');
        return null;
      }
      
      const currentUser = JSON.parse(userDataStr);
      const mobileNumber = currentUser.mobile_number;
      
      if (!mobileNumber) {
        console.log('No mobile number found');
        return null;
      }
      
      // Fetch all members from API
      const response = await fetch(`${MEMBERS_API_URL}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch members: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.members) {
        const currentMember = data.members.find(
          (member: any) => member.mobile_number === mobileNumber
        );
        
        if (currentMember) {
          // Update role
          if (currentMember.role) {
            setUserRole(currentMember.role);
            localStorage.setItem('user_role', currentMember.role);
          }
          
          // Update full name
          if (currentMember.full_name) {
            setUserFullName(currentMember.full_name);
          }
          
          // Update profile picture
          if (currentMember.profile_picture) {
            setUserProfilePicture(currentMember.profile_picture);
            localStorage.setItem('user_profile_picture', currentMember.profile_picture);
          }
          
          console.log('Role fetched from API:', currentMember.role);
          return currentMember.role;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching role from API:', error);
      return null;
    }
  };

  // Load user data from cache on mount
  useEffect(() => {
    loadFromCache();
  }, []);

  const loadFromCache = async (): Promise<void> => {
    try {
      const cachedUser = localStorage.getItem('cached_user');
      const cachedProfile = localStorage.getItem('cached_profile');
      const cachedRole = localStorage.getItem('user_role');
      const cachedFullName = localStorage.getItem('user_full_name');
      const cachedProfilePicture = localStorage.getItem('user_profile_picture');
      const token = localStorage.getItem('access_token');
      
      if (cachedUser && token) {
        const parsedUser = JSON.parse(cachedUser) as ExtendedUserProfile;
        setUser(parsedUser);
        
        // Set role from cache
        if (cachedRole && cachedRole !== 'undefined') {
          setUserRole(cachedRole);
        } else if (parsedUser.role) {
          setUserRole(parsedUser.role);
        }
        
        // Set full name from cache
        if (cachedFullName) {
          setUserFullName(cachedFullName);
        } else if (parsedUser.full_name) {
          setUserFullName(parsedUser.full_name);
        }
        
        // Set profile picture from cache
        if (cachedProfilePicture) {
          setUserProfilePicture(cachedProfilePicture);
        }
        
        if (cachedProfile) {
          setProfileData(JSON.parse(cachedProfile));
        }
        
        setIsAuthenticated(true);
        console.log('User loaded from cache, role:', userRole);
        
        // Refresh in background
        setTimeout(() => {
          refreshUserData();
          fetchRoleFromAPI();
        }, 100);
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Fetch fresh role from API
      await fetchRoleFromAPI();

      const response = await profileApi.getProfile();
      
      if (response.success && response.data) {
        // Update user data
        const userData: ExtendedUserProfile = {
          id: response.data.id,
          mobile_number: response.data.mobile_number,
          email: response.data.email,
          full_name: userFullName || response.data.full_name || '',
          date_joined: response.data.date_joined,
          is_active: response.data.is_active,
          role: userRole || 'customer',
          role_display: 'Customer',
        };
        
        // Update profile data
        const profileDataObj: MyProfileData = {
          profile_picture: userProfilePicture || response.data.profile?.profile_picture || null,
          bio: response.data.profile?.bio || '',
          location: response.data.profile?.location || '',
        };
        
        setUser(userData);
        setProfileData(profileDataObj);
        
        // Cache data
        localStorage.setItem('cached_user', JSON.stringify(userData));
        localStorage.setItem('cached_profile', JSON.stringify(profileDataObj));
        localStorage.setItem('cached_user_time', Date.now().toString());
        
        console.log('User data refreshed, role:', userRole);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const login = async (mobileNumber: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await loginApi.login(mobileNumber, password);
      
      if (response.success && response.user) {
        const userData: ExtendedUserProfile = {
          id: response.user.id,
          mobile_number: response.user.mobile_number,
          email: response.user.email,
          full_name: response.user.full_name || '',
          date_joined: response.user.date_joined,
          is_active: response.user.is_active,
          role: response.user.role || 'customer',
          role_display: response.user.role_display || 'Customer',
        };
        
        setUser(userData);
        setUserRole(userData.role);
        setUserFullName(userData.full_name);
        setIsAuthenticated(true);
        
        localStorage.setItem('cached_user', JSON.stringify(userData));
        if (userData.role) {
          localStorage.setItem('user_role', userData.role);
        }
        if (userData.full_name) {
          localStorage.setItem('user_full_name', userData.full_name);
        }
        localStorage.setItem('cached_user_time', Date.now().toString());
        
        // Fetch profile data and fresh role from API
        await refreshUserData();
        await fetchRoleFromAPI();
        
        console.log('User logged in with role:', userData.role);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await loginApi.logout();
      const keysToRemove = [
        'cached_user', 'cached_profile', 'cached_user_time', 
        'user_role', 'user_full_name', 'user_profile_picture'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setProfileData(null);
      setUserRole(null);
      setUserFullName(null);
      setUserProfilePicture(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<MyProfileData>): Promise<boolean> => {
    try {
      const response = await profileApi.updateProfile(data);
      
      if (response.success) {
        setProfileData(prev => ({ ...prev, ...data } as MyProfileData));
        await refreshUserData();
        await fetchRoleFromAPI();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const updateProfilePicture = async (base64Image: string): Promise<boolean> => {
    try {
      const response = await profileApi.updateProfilePicture(base64Image);
      
      if (response.success) {
        setUserProfilePicture(response.profile_picture);
        setProfileData(prev => ({ ...prev, profile_picture: response.profile_picture } as MyProfileData));
        localStorage.setItem('user_profile_picture', response.profile_picture || '');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile picture error:', error);
      return false;
    }
  };

  const deleteProfileField = async (fieldName: string): Promise<boolean> => {
    try {
      const response = await profileApi.deleteProfileField(fieldName);
      
      if (response.success) {
        setProfileData(prev => ({ ...prev, [fieldName]: '' } as MyProfileData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete profile field error:', error);
      return false;
    }
  };

  const clearUserData = async (): Promise<void> => {
    const keysToRemove = [
      'access_token', 'refresh_token', 'user_data', 
      'user_role', 'user_full_name', 'user_profile_picture',
      'cached_user', 'cached_profile', 'cached_user_time'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setUser(null);
    setProfileData(null);
    setUserRole(null);
    setUserFullName(null);
    setUserProfilePicture(null);
    setIsAuthenticated(false);
    console.log('User data cleared');
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!userRole) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

  const value: UserContextType = {
    user,
    profileData,
    userRole,
    userFullName,
    userProfilePicture,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    updateProfilePicture,
    deleteProfileField,
    refreshUserData,
    clearUserData,
    loadFromCache,
    hasRole,
    fetchRoleFromAPI,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};