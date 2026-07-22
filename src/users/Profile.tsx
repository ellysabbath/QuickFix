// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Check,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Shield,
  Calendar,
  CheckCircle,
  LogOut,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
  X,
  Loader2,
  RefreshCw,
  Save,
  Award,
  CircleCheckBig
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api/members';

interface LocalProfile {
  full_name: string;
  profile_picture: string | null;
  bio: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  role_display: string;
  member_id: number;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Reusable Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CircleCheckBig className="w-14 h-14 sm:w-16 sm:h-16 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500" />;
      case 'confirm':
        return <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-500" />;
      default:
        return <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-500" />;
    }
  };

  const getButtonColors = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      case 'confirm':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700';
      case 'info':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl animate-scale-in">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${
            type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
            type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
            type === 'confirm' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            {getIcon()}
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()} ${type === 'success' ? 'shadow-green-500/30' : type === 'error' ? 'shadow-red-500/30' : type === 'confirm' ? 'shadow-yellow-500/30' : 'shadow-cyan-500/30'}`}
            >
              {confirmText}
            </button>
          )}
          {!onConfirm && type === 'success' && (
            <button
              onClick={onCancel}
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()}`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { 
    user, 
    profileData, 
    updateProfile, 
    deleteProfileField,
    refreshUserData, 
    isLoading: contextLoading, 
    logout
  } = useUser();
  
  const [profile, setProfile] = useState<LocalProfile>({
    full_name: '',
    profile_picture: null,
    bio: '',
    email: '',
    phone: '',
    location: '',
    role: 'customer',
    role_display: 'Customer',
    member_id: 0,
  });
  
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Confirmation Modal States
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Load profile from API and context
  useEffect(() => {
    loadProfileData();
  }, [user, profileData]);

  const loadProfileData = async () => {
    try {
      if (user) {
        setProfile(prev => ({
          ...prev,
          full_name: user.full_name || '',
          email: user.email || '',
          phone: user.mobile_number || '',
          role: user.role || 'customer',
          role_display: user.role_display || 'Customer',
          member_id: user.id || 0,
        }));
      }
      
      if (profileData) {
        setProfile(prev => ({
          ...prev,
          profile_picture: profileData.profile_picture || null,
          bio: profileData.bio || '',
          location: profileData.location || '',
        }));
      }
      
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setIsInitialLoad(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    await loadProfileData();
    setRefreshing(false);
  };

  // Update full_name
  const updateFullName = async (newFullName: string): Promise<boolean> => {
    try {
      const userDataStr = localStorage.getItem('user');
      if (!userDataStr) {
        showConfirmationModal('error', 'Error', 'User data not found');
        return false;
      }
      
      const currentUser = JSON.parse(userDataStr);
      const mobileNumber = currentUser.mobile_number;
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (data.success && data.members) {
        const currentMember = data.members.find(
          (member: any) => member.mobile_number === mobileNumber
        );
        
        if (currentMember && currentMember.id) {
          const updateResponse = await fetch(`${API_BASE_URL}/update/${currentMember.id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: newFullName }),
          });
          
          const updateData = await updateResponse.json();
          
          if (updateData.success) {
            setProfile(prev => ({ ...prev, full_name: newFullName }));
            
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              userData.full_name = newFullName;
              localStorage.setItem('user', JSON.stringify(userData));
            }
            
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating full name:', error);
      return false;
    }
  };

  const updateBio = async (newBio: string): Promise<boolean> => {
    try {
      const success = await updateProfile({ bio: newBio });
      if (success) {
        setProfile(prev => ({ ...prev, bio: newBio }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating bio:', error);
      return false;
    }
  };

  const updateLocation = async (newLocation: string): Promise<boolean> => {
    try {
      const success = await updateProfile({ location: newLocation });
      if (success) {
        setProfile(prev => ({ ...prev, location: newLocation }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating location:', error);
      return false;
    }
  };

  const saveProfile = async (showAlert: boolean = true) => {
    setIsLoading(true);
    try {
      const bioSuccess = await updateProfile({
        bio: profile.bio,
        location: profile.location,
      });
      
      if (bioSuccess && showAlert) {
        showConfirmationModal('success', 'Success!', 'Profile saved successfully!');
      } else if (!bioSuccess && showAlert) {
        showConfirmationModal('error', 'Error', 'Failed to save profile');
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
  };

  const saveEditField = async () => {
    if (!editField) return;
    
    setIsLoading(true);
    let success = false;
    let fieldName = editField.replace('_', ' ');
    
    try {
      if (editField === 'full_name') {
        success = await updateFullName(editValue);
        if (success) {
          setProfile(prev => ({ ...prev, full_name: editValue }));
        }
      } else if (editField === 'bio') {
        success = await updateBio(editValue);
        if (success) {
          setProfile(prev => ({ ...prev, bio: editValue }));
        }
      } else if (editField === 'location') {
        success = await updateLocation(editValue);
        if (success) {
          setProfile(prev => ({ ...prev, location: editValue }));
        }
      }
      
      if (success) {
        showConfirmationModal('success', 'Success!', `${fieldName} updated successfully!`);
        setEditField(null);
        setEditValue('');
        await refreshUserData();
        await loadProfileData();
      } else {
        showConfirmationModal('error', 'Error', `Failed to update ${fieldName}`);
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', `Failed to update ${fieldName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteField = (field: string) => {
    setFieldToDelete(field);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteField = async () => {
    if (!fieldToDelete) return;
    
    setIsLoading(true);
    let success = false;
    let fieldName = fieldToDelete.replace('_', ' ');
    
    try {
      if (fieldToDelete === 'bio') {
        success = await deleteProfileField('bio');
        if (success) {
          setProfile(prev => ({ ...prev, bio: '' }));
        }
      } else if (fieldToDelete === 'location') {
        success = await deleteProfileField('location');
        if (success) {
          setProfile(prev => ({ ...prev, location: '' }));
        }
      }
      
      if (success) {
        showConfirmationModal('success', 'Success!', `${fieldName} has been removed`);
        setShowDeleteConfirm(false);
        setFieldToDelete(null);
        await refreshUserData();
      } else {
        showConfirmationModal('error', 'Error', `Failed to delete ${fieldName}`);
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', `Failed to delete ${fieldName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      showConfirmationModal('success', 'Logged Out', 'You have been successfully logged out');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowAccountDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    setIsLoading(true);
    try {
      showConfirmationModal('success', 'Account Deleted', 'Your account has been permanently deleted');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowAccountDeleteConfirm(false);
    }
  };

  const handleContinue = async () => {
    if (!profile.full_name.trim()) {
      showConfirmationModal('error', 'Error', 'Please enter your name');
      return;
    }
    
    await saveProfile(false);
    navigate('/dashboard');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const showConfirmationModal = (
    type: 'success' | 'error' | 'confirm' | 'info',
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    setConfirmationModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      onCancel: onCancel || (() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))),
      confirmText,
      cancelText,
    });
  };

  // Render field component
  const renderField = (
    label: string, 
    value: string, 
    icon: React.ReactNode, 
    fieldKey: string, 
    placeholder: string, 
    editable: boolean = true
  ) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          {icon}
        </div>
        <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        {editable && editField === fieldKey ? (
          <input
            type="text"
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 dark:text-white border-b-2 border-cyan-500 outline-none py-1 px-0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
            onBlur={saveEditField}
            onKeyDown={(e) => e.key === 'Enter' && saveEditField()}
          />
        ) : (
          <span className={`flex-1 text-sm sm:text-base ${value ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500 italic'}`}>
            {value || `No ${label.toLowerCase()} added`}
          </span>
        )}
        
        {editable && editField !== fieldKey && (
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => handleEditField(fieldKey, value)}
              className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-green-600 dark:text-green-400"
            >
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            {value && (
              <button
                onClick={() => deleteField(fieldKey)}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isInitialLoad && contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Profile</h1>
            </div>
            <button
              onClick={() => saveProfile(true)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-32">
        {/* Refresh Button */}
        <div className="flex justify-end mb-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-cyan-500 shadow-lg shadow-cyan-500/20">
              {profile.profile_picture ? (
                <img 
                  src={profile.profile_picture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-md hover:bg-cyan-600 transition-colors"
              onClick={() => {
                // Image picker functionality
                showConfirmationModal('info', 'Coming Soon', 'Profile picture upload feature will be available soon');
              }}
            >
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2">Tap to change profile photo</p>
        </div>

        {/* Role Badge */}
        <div className="flex justify-center mt-3 sm:mt-4">
          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              {profile.role_display}
            </span>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mt-4 sm:mt-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">Basic Information</h2>
          
          {renderField('Name', profile.full_name, <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 'full_name', 'Enter your name', true)}
          {renderField('Bio', profile.bio, <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 'bio', 'Tell something about yourself', true)}
          {renderField('Email', profile.email, <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 'email', 'your@email.com', false)}
          {renderField('Phone', profile.phone, <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 'phone', '+1234567890', false)}
          {renderField('Location', profile.location, <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 'location', 'City, Country', true)}
        </div>

        {/* Account Information */}
        <div className="mt-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">Account Information</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 mb-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Member since: {formatDate(user?.date_joined)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Status: {user?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Member ID: #{profile.member_id}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="text-sm sm:text-base font-semibold text-red-500">Logout</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 pb-4">
          <h3 className="text-sm sm:text-base font-bold text-red-500 mb-2">Danger Zone</h3>
          <button
            onClick={() => setShowDangerZone(!showDangerZone)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            {showDangerZone ? (
              <ChevronUp className="w-4 h-4 text-red-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs sm:text-sm font-semibold text-red-500">
              {showDangerZone ? 'Hide Danger Zone' : 'Show Danger Zone'}
            </span>
          </button>

          {showDangerZone && (
            <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30">
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete Account
              </button>
              <p className="text-[10px] sm:text-xs text-red-500 dark:text-red-400 text-center mt-2">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:shadow-xl"
        >
          <span>Continue to Dashboard</span>
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
        </button>
      </div>

      {/* Edit Modal */}
      {editField && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                Edit {editField.replace('_', ' ')}
              </h3>
              <button
                onClick={() => setEditField(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <input
              type="text"
              className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-cyan-500 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-900 dark:text-white outline-none transition-colors"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={`Enter ${editField.replace('_', ' ')}`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && saveEditField()}
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditField(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveEditField}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 w-full max-w-sm text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 capitalize">
              Delete {fieldToDelete?.replace('_', ' ')}?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to delete your {fieldToDelete?.replace('_', ' ')}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteField}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 w-full max-w-sm text-center">
            <LogOut className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Logout?</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showAccountDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 w-full max-w-sm text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Account?</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5">
              This action is permanent and cannot be undone. All your data will be deleted forever.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAccountDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        type={confirmationModal.type}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
      />

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}