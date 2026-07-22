// src/pages/dashboard/SettingsPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Moon,
  Bell,
  MapPin,
  Fingerprint,
  RefreshCw,
  Database,
  User,
  CreditCard,
  MapPin as MapPinIcon,
  Shield,
  FileText,
  Star,
  Trash2,
  Mail,
  Globe,
  HelpCircle,
  LogOut,
  Check,
  X,
  AlertTriangle,
  Info,
  Calendar,
  Wrench,
  ChevronRight
} from 'lucide-react';

// Confirmation Modal Component
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
        return <Check className="w-12 h-12 sm:w-14 sm:h-14 text-green-500" />;
      case 'error':
        return <X className="w-12 h-12 sm:w-14 sm:h-14 text-red-500" />;
      case 'confirm':
        return <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-500" />;
      case 'info':
        return <Info className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-500" />;
      default:
        return <Check className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-500" />;
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()}`}
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

interface SettingItem {
  id: number;
  title: string;
  description: string;
  type: 'toggle' | 'button' | 'select';
  value?: boolean;
  action?: () => void;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 1,
      title: 'Dark Mode',
      description: 'Switch between light and dark theme',
      type: 'toggle',
      value: false,
    },
    {
      id: 2,
      title: 'Push Notifications',
      description: 'Receive service reminders and updates',
      type: 'toggle',
      value: true,
    },
    {
      id: 3,
      title: 'Location Services',
      description: 'Find nearby garages automatically',
      type: 'toggle',
      value: true,
    },
    {
      id: 4,
      title: 'Biometric Login',
      description: 'Use fingerprint or face ID',
      type: 'toggle',
      value: false,
    },
    {
      id: 5,
      title: 'Auto Updates',
      description: 'Download updates automatically',
      type: 'toggle',
      value: true,
    },
    {
      id: 6,
      title: 'Data Saver',
      description: 'Reduce data usage',
      type: 'toggle',
      value: false,
    },
  ]);

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

  const toggleSetting = (id: number) => {
    setSettings(settings.map(setting => {
      if (setting.id === id && setting.type === 'toggle') {
        const newValue = !setting.value;
        if (id === 1) {
          setIsDark(!isDark);
        }
        return { ...setting, value: newValue };
      }
      return setting;
    }));
  };

  const handleLogout = () => {
    showConfirmationModal(
      'confirm',
      'Logout',
      'Are you sure you want to logout?',
      () => {
        navigate('/login');
      },
      undefined,
      'Logout',
      'Cancel'
    );
  };

  const handleClearCache = () => {
    showConfirmationModal(
      'confirm',
      'Clear Cache',
      'This will remove temporary files.',
      () => {
        showConfirmationModal('success', 'Success!', 'Cache cleared successfully');
      },
      undefined,
      'Clear',
      'Cancel'
    );
  };

  const getInitials = () => {
    if (!user) return 'GU';
    const fullName = user.full_name || '';
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase() || 'GU';
  };

  const getFullName = () => {
    if (!user) return 'Guest User';
    return user.full_name || 'Guest User';
  };

  const getUserEmail = () => {
    if (!user) return 'guest@example.com';
    return user.email || 'guest@example.com';
  };

  const iconColors = [
    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  ];

  const getIconColor = (index: number) => {
    return iconColors[index % iconColors.length];
  };

  const settingsIcons = [
    <Moon className="w-5 h-5" />,
    <Bell className="w-5 h-5" />,
    <MapPin className="w-5 h-5" />,
    <Fingerprint className="w-5 h-5" />,
    <RefreshCw className="w-5 h-5" />,
    <Database className="w-5 h-5" />
  ];

  const accountIcons = [
    <User className="w-5 h-5" />,
    <CreditCard className="w-5 h-5" />,
    <MapPinIcon className="w-5 h-5" />
  ];

  const supportIcons = [
    <Shield className="w-5 h-5" />,
    <FileText className="w-5 h-5" />,
    <Star className="w-5 h-5" />,
    <Trash2 className="w-5 h-5" />
  ];

  const quickIcons = [
    <Mail className="w-5 h-5" />,
    <Globe className="w-5 h-5" />,
    <HelpCircle className="w-5 h-5" />
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className={`sticky top-0 z-30 border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
              <p className={`text-[10px] sm:text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-24">
        {/* User Profile Card */}
        <div className={`rounded-xl p-4 border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
              {getInitials()}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{getFullName()}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{getUserEmail()}</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1`}>
                <Calendar className="w-3 h-3" />
                Member since 2024
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
              PRO
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="mb-6">
          <p className={`text-sm font-semibold mb-3 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>App Preferences</p>
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {settings.map((setting, index) => (
              <div
                key={setting.id}
                className={`flex items-center justify-between p-4 ${index !== settings.length - 1 ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(index)}`}>
                    {settingsIcons[index]}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{setting.title}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{setting.description}</p>
                  </div>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${setting.value ? 'bg-cyan-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}
                  onClick={() => toggleSetting(setting.id)}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${setting.value ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <p className={`text-sm font-semibold mb-3 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Account Settings</p>
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button
              className={`flex items-center justify-between p-4 w-full text-left border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(6)}`}>
                  {accountIcons[0]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Profile</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Update personal information</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              className={`flex items-center justify-between p-4 w-full text-left border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => navigate('/payments')}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(7)}`}>
                  {accountIcons[1]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Methods</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage cards and payment options</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              className={`flex items-center justify-between p-4 w-full text-left ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
              onClick={() => navigate('/dashboard')}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(8)}`}>
                  {accountIcons[2]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Address Book</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saved service locations</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Support & Legal */}
        <div className="mb-6">
          <p className={`text-sm font-semibold mb-3 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Support & Legal</p>
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button
              className={`flex items-center justify-between p-4 w-full text-left border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => window.open('https://quickfixauto.com/privacy', '_blank')}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(9)}`}>
                  {supportIcons[0]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>How we protect your data</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              className={`flex items-center justify-between p-4 w-full text-left border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => window.open('https://quickfixauto.com/terms', '_blank')}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(10)}`}>
                  {supportIcons[1]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Terms of Service</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>App usage terms</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              className={`flex items-center justify-between p-4 w-full text-left border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.quickfixauto', '_blank')}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(11)}`}>
                  {supportIcons[2]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Rate App</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Share your experience</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              className={`flex items-center justify-between p-4 w-full text-left ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
              onClick={handleClearCache}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${getIconColor(12)}`}>
                  {supportIcons[3]}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Clear Cache</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Free up storage space</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <p className={`text-sm font-semibold mb-3 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Quick Actions</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              className={`p-4 rounded-xl border text-center ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              onClick={() => window.open('mailto:support@quickfixauto.com')}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${getIconColor(13)}`}>
                {quickIcons[0]}
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Support</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email us</p>
            </button>

            <button
              className={`p-4 rounded-xl border text-center ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              onClick={() => window.open('https://quickfixauto.com', '_blank')}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${getIconColor(14)}`}>
                {quickIcons[1]}
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Website</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Visit our site</p>
            </button>

            <button
              className={`p-4 rounded-xl border text-center ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              onClick={() => navigate('/help')}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${getIconColor(15)}`}>
                {quickIcons[2]}
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Help</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>FAQs & guides</p>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className={`rounded-xl border p-4 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Fix Auto</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Version 0.0.1 • Build 2026.12.01</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Developer</p>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Fix Auto Inc.</p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Storage</p>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>147 MB</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className={`w-full py-3.5 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-400 hover:bg-red-900/30' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Confirmation Modal */}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
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