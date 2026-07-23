// components/Sidebar.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard,
  User,
  CreditCard,
  Wrench,
  Hammer,
  Users,
  Building2,
  Shield,
  Server,
  Bookmark,
  MapPin,
  UserPlus,
  Phone,
  Settings,
  HelpCircle,
  LogOut,
  Share2,
  Star,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Sparkles,
  Crown,
  UserCheck
} from 'lucide-react';

// Types
interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
  roles?: string[];
  requiresVerified?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface CachedUserData {
  userRole: string | null;
  userFullName: string | null;
  userProfilePicture: string | null;
  userName: string;
  userEmail: string | null;
  userPhone: string | null;
  timestamp: number;
}

const SIDEBAR_WIDTH = 280;
const CACHE_KEY = 'sidebar_user_data';
const CACHE_TIMESTAMP_KEY = 'sidebar_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000;

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole: contextUserRole, userFullName: contextUserFullName, userProfilePicture: contextUserProfilePicture, profileData, logout, hasRole, fetchRoleFromAPI } = useUser();
  
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [cachedUserRole, setCachedUserRole] = useState<string | null>(null);
  const [cachedUserProfilePicture, setCachedUserProfilePicture] = useState<string | null>(null);
  const [cachedUserName, setCachedUserName] = useState<string>('');
  const [cachedUserEmail, setCachedUserEmail] = useState<string | null>(null);
  const [cachedUserPhone, setCachedUserPhone] = useState<string | null>(null);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [sidebarTranslateX, setSidebarTranslateX] = useState(-SIDEBAR_WIDTH);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [scaleValue, setScaleValue] = useState(0.95);
  const [syncOpacity, setSyncOpacity] = useState(0);
  const [syncRotation, setSyncRotation] = useState(0);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Load cached data from localStorage
  const loadCachedData = async (): Promise<boolean> => {
    try {
      const cachedDataStr = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedDataStr && cachedTimestamp) {
        const cachedData: CachedUserData = JSON.parse(cachedDataStr);
        const now = Date.now();
        const isCacheValid = (now - cachedData.timestamp) < CACHE_DURATION;
        
        if (isCacheValid) {
          setCachedUserRole(cachedData.userRole);
          setCachedUserProfilePicture(cachedData.userProfilePicture);
          setCachedUserName(cachedData.userName);
          setCachedUserEmail(cachedData.userEmail);
          setCachedUserPhone(cachedData.userPhone);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading cached data:', error);
      return false;
    }
  };

  // Save data to localStorage
  const saveToCache = (data: Partial<CachedUserData>): void => {
    try {
      const existingCache = localStorage.getItem(CACHE_KEY);
      let cachedData: CachedUserData = existingCache ? JSON.parse(existingCache) : {
        userRole: null,
        userFullName: null,
        userProfilePicture: null,
        userName: '',
        userEmail: null,
        userPhone: null,
        timestamp: Date.now(),
      };
      
      const updatedData = { ...cachedData, ...data, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(updatedData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Silent sync data from API to storage
  const syncDataToStorage = async (): Promise<void> => {
    if (!user) return;
    
    setSyncOpacity(0.6);
    let rotation = 0;
    const rotateInterval = setInterval(() => {
      rotation += 45;
      setSyncRotation(rotation);
    }, 100);
    
    try {
      const freshRole = await fetchRoleFromAPI();
      
      const userData = {
        userRole: freshRole || contextUserRole || user?.role || 'customer',
        userFullName: contextUserFullName || user?.full_name,
        userProfilePicture: contextUserProfilePicture || profileData?.profile_picture || null,
        userName: contextUserFullName || user?.full_name || 'Guest User',
        userEmail: user?.email || null,
        userPhone: user?.mobile_number || null,
      };
      
      saveToCache(userData);
      
      setCachedUserRole(userData.userRole);
      setCachedUserProfilePicture(userData.userProfilePicture);
      setCachedUserName(userData.userName);
      setCachedUserEmail(userData.userEmail);
      setCachedUserPhone(userData.userPhone);
      
      setTimeout(() => {
        setSyncOpacity(0);
        clearInterval(rotateInterval);
      }, 600);
      
    } catch (error) {
      console.error('Silent sync error:', error);
      clearInterval(rotateInterval);
      setTimeout(() => setSyncOpacity(0), 200);
    }
  };

  // Handle sidebar animation
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setSidebarTranslateX(0);
      setOverlayOpacity(1);
      setScaleValue(1);
      
      if (menuContainerRef.current) {
        menuContainerRef.current.scrollTop = 0;
      }
      
      const initializeData = async () => {
        await loadCachedData();
        setTimeout(() => {
          syncDataToStorage();
        }, 100);
      };
      initializeData();
      
    } else {
      setSidebarTranslateX(-SIDEBAR_WIDTH);
      setOverlayOpacity(0);
      setScaleValue(0.95);
      setTimeout(() => setIsAnimating(false), 350);
    }
  }, [isVisible]);

  // Get user role from cached data or context
  const currentUserRole = cachedUserRole || contextUserRole || user?.role || 'customer';

  // Get user initials for avatar placeholder
  const getUserInitials = (): string => {
    const name = cachedUserName || contextUserFullName || user?.full_name || 'Guest User';
    if (name && name !== 'Guest User') {
      return name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  // User data from cache or context
  const userData = {
    name: cachedUserName || contextUserFullName || user?.full_name || 'Guest User',
    email: cachedUserEmail || user?.email,
    phone: cachedUserPhone || user?.mobile_number,
    avatarUrl: cachedUserProfilePicture || contextUserProfilePicture || profileData?.profile_picture || null,
    role: currentUserRole,
    isVerified: user?.is_active || false,
  };

  // Check if route is active
  const isRouteActive = (route: string): boolean => {
    return location.pathname === route || location.pathname.startsWith(route + '/');
  };

  // Handle menu item press
  const handleMenuItemPress = (item: MenuItem): void => {
    onClose();
    
    setTimeout(() => {
      navigate(item.route);
    }, 200);
  };

  // Handle logout
  const handleLogout = (): void => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      onClose();
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }
  };

  // Handle share app
  const handleShareApp = (): void => {
    setModalMessage('Share link copied to clipboard!');
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2500);
  };

  // Handle rate app
  const handleRateApp = (): void => {
    window.open('https://play.google.com', '_blank');
  };

  // Get role badge text
  const getRoleBadge = (): string => {
    switch (userData.role) {
      case 'admin': return 'Admin';
      case 'mechanic': return 'Mechanic';
      case 'garage_owner': return 'Garage Owner';
      default: return 'Customer';
    }
  };

  // All menu items with Lucide icons
  const allMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      route: '/dashboard',
      roles: ['mechanic', 'garage_owner', 'customer', 'admin'],
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <User className="w-4 h-4" />,
      route: '/profile',
      roles: ['mechanic', 'garage_owner', 'customer', 'admin'],
      badge: 'PRO',
      badgeColor: '#8b5cf6',
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: <CreditCard className="w-4 h-4" />,
      route: '/payments',
      roles: ['customer', 'mechanic', 'garage_owner', 'admin'],
    },
    {
      id: 'mechanic_bookings',
      title: 'Mechanic Fixes',
      icon: <Wrench className="w-4 h-4" />,
      route: '/mechanic/bookings',
      roles: ['mechanic', 'garage_owner', 'admin'],
      badge: 'WORK',
      badgeColor: '#f59e0b',
    },
    {
      id: 'admin_bookings',
      title: 'Manage Fixes',
      icon: <Hammer className="w-4 h-4" />,
      route: '/admin/bookings',
      roles: ['admin'],
      badge: 'ADMIN',
      badgeColor: '#ef4444',
    },
    {
      id: 'admin_mechanics',
      title: 'Manage Mechanics',
      icon: <Users className="w-4 h-4" />,
      route: '/admin/mechanics',
      roles: ['admin'],
    },
    {
      id: 'who_fixed',
      title: 'Who Fixed',
      icon: <UserCheck className="w-4 h-4" />,
      route: '/who-fixed',
      roles: ['admin'],
      badge: 'FIX',
      badgeColor: '#c62525',
    },
    {
      id: 'admin_garages',
      title: 'Manage Providers',
      icon: <Building2 className="w-4 h-4" />,
      route: '/admin/garages',
      roles: ['admin'],
    },
    {
      id: 'admin_users',
      title: 'Manage Users',
      icon: <Shield className="w-4 h-4" />,
      route: '/admin/users',
      roles: ['admin'],
    },
    {
      id: 'admin_services',
      title: 'Manage Services',
      icon: <Server className="w-4 h-4" />,
      route: '/admin/services',
      roles: ['admin'],
    },
    {
      id: 'bookings',
      title: 'My Fixes',
      icon: <Bookmark className="w-4 h-4" />,
      route: '/bookings',
      roles: ['customer', 'mechanic', 'garage_owner'],
    },
    {
      id: 'garages',
      title: 'Fix Providers',
      icon: <MapPin className="w-4 h-4" />,
      route: '/garages',
      roles: ['customer', 'mechanic', 'garage_owner'],
    },
    {
      id: 'requests',
      title: 'Join as Provider',
      icon: <UserPlus className="w-4 h-4" />,
      route: '/requests',
      roles: ['customer'],
      badge: 'NEW',
      badgeColor: '#10b981',
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: <Phone className="w-4 h-4" />,
      route: '/contact',
      roles: ['customer', 'mechanic', 'garage_owner', 'admin'],
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      route: '/settings',
      roles: ['customer', 'mechanic', 'garage_owner', 'admin'],
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle className="w-4 h-4" />,
      route: '/help',
      roles: ['customer', 'mechanic', 'garage_owner', 'admin'],
    },
  ];

  // Filter menu items based on user role
  const getFilteredMenuItems = (): MenuItem[] => {
    if (hasRole('admin')) {
      return allMenuItems;
    }
    
    return allMenuItems.filter(item => {
      if (item.roles && !hasRole(item.roles)) {
        return false;
      }
      if (item.requiresVerified && !userData.isVerified) {
        return false;
      }
      return true;
    });
  };

  const menuItems = getFilteredMenuItems();

  // Group menu items by category
  const menuSections = [
    {
      title: 'MAIN',
      icon: <LayoutDashboard className="w-2.5 h-2.5" />,
      items: menuItems.filter(item => ['dashboard', 'profile', 'bookings', 'garages', 'payments'].includes(item.id)),
    },
    {
      title: 'PROFESSIONAL',
      icon: <Wrench className="w-2.5 h-2.5" />,
      items: menuItems.filter(item => ['mechanic_bookings'].includes(item.id)),
    },
    {
      title: 'ADMIN',
      icon: <Shield className="w-2.5 h-2.5" />,
      items: menuItems.filter(item => item.id.startsWith('admin_') || item.id === 'who_fixed'),
    },
    {
      title: 'INFO',
      icon: <Phone className="w-2.5 h-2.5" />,
      items: menuItems.filter(item => ['requests', 'contact'].includes(item.id)),
    },
    {
      title: 'SUPPORT',
      icon: <HelpCircle className="w-2.5 h-2.5" />,
      items: menuItems.filter(item => ['settings', 'help'].includes(item.id)),
    },
  ].filter(section => section.items.length > 0);

  // Don't render if not visible and not animating
  if (!isVisible && !isAnimating) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
        style={{ opacity: overlayOpacity }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-full bg-white dark:bg-gray-900 z-50 shadow-2xl transition-all duration-300 ease-out overflow-hidden flex flex-col"
        style={{
          width: SIDEBAR_WIDTH,
          transform: `translateX(${sidebarTranslateX}px) scale(${scaleValue})`,
          maxWidth: '85vw',
          borderRadius: isVisible ? '0 20px 20px 0' : 0,
        }}
      >
        {/* Sync Indicator */}
        <div
          className="absolute top-3 left-3 z-10 w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25"
          style={{ opacity: syncOpacity }}
        >
          <RefreshCw
            className="w-3.5 h-3.5 text-white"
            style={{
              transform: `rotate(${syncRotation}deg)`,
              transition: 'transform 0.1s linear',
            }}
          />
        </div>

        {/* Header */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-indigo-600 pt-10 pb-4 px-4 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-3">
              {/* Profile Picture - Small and elegant */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full border-2 border-white/40 flex items-center justify-center overflow-hidden shadow-lg shadow-black/20 ring-2 ring-white/20 ring-offset-1 ring-offset-transparent">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
                      <span className="text-white font-bold text-base">{getUserInitials()}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md shadow-green-500/30">
                  <CheckCircle className="w-1.5 h-1.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-semibold text-sm truncate">{userData.name}</p>
                  {userData.role === 'admin' && <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                </div>
                <p className="text-white/70 text-[10px] truncate">
                  {userData.email || userData.phone || 'No contact'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Sparkles className="w-2 h-2 text-white" />
                    <span className="text-white text-[8px] font-medium">{getRoleBadge()}</span>
                  </div>
                  {!userData.isVerified && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500/30">
                      <AlertCircle className="w-2 h-2 text-yellow-300" />
                      <span className="text-yellow-200 text-[7px] font-bold">UNVERIFIED</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-1.5 mt-2.5">
              <button
                onClick={() => {
                  const profileItem = menuItems.find(item => item.id === 'profile');
                  if (profileItem) handleMenuItemPress(profileItem);
                }}
                className="flex-1 py-1.5 px-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center gap-1.5 hover:bg-white/30 transition-all hover:scale-105"
              >
                <User className="w-3 h-3 text-white" />
                <span className="text-white text-[10px] font-medium">Profile</span>
              </button>
              <button
                onClick={() => {
                  const settingsItem = menuItems.find(item => item.id === 'settings');
                  if (settingsItem) handleMenuItemPress(settingsItem);
                }}
                className="flex-1 py-1.5 px-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center gap-1.5 hover:bg-white/30 transition-all hover:scale-105"
              >
                <Settings className="w-3 h-3 text-white" />
                <span className="text-white text-[10px] font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Menu */}
        <div 
          ref={menuContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E1 transparent',
          }}
        >
          <style>{`
            .flex-1::-webkit-scrollbar { width: 3px; }
            .flex-1::-webkit-scrollbar-track { background: transparent; }
            .flex-1::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 20px; }
            .flex-1::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
            .dark .flex-1::-webkit-scrollbar-thumb { background: #475569; }
            .dark .flex-1::-webkit-scrollbar-thumb:hover { background: #64748B; }
          `}</style>

          {menuSections.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="flex items-center gap-1.5 px-1.5 mb-2">
                <span className="text-gray-400">{section.icon}</span>
                <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-widest">
                  {section.title}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = isRouteActive(item.route);
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-50 to-cyan-100/50 dark:from-cyan-900/30 dark:to-cyan-900/10' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => handleMenuItemPress(item)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                          isActive 
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-500/25' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                        }`}>
                          {item.icon}
                        </div>
                        <span className={`text-xs font-medium transition-colors truncate ${
                          isActive 
                            ? 'text-cyan-600 dark:text-cyan-400' 
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                        }`}>
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
                        {item.badge && (
                          <span 
                            className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: item.badgeColor + '20',
                              color: item.badgeColor,
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-3 h-3 transition-all ${
                          isActive 
                            ? 'text-cyan-500' 
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                      </div>

                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-r-full shadow-lg shadow-cyan-500/30" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Promotional Cards */}
          <div className="mt-3 space-y-2 pb-3">
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-3 border border-emerald-200/30 dark:border-emerald-800/30 group hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
                  <Share2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-gray-900 dark:text-white truncate">Share Quick Fix</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Help friends find auto services!</p>
                </div>
              </div>
              <button
                onClick={handleShareApp}
                className="w-full py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-all hover:scale-[1.02] shadow-md shadow-emerald-500/20"
              >
                <Share2 className="w-3 h-3" />
                Share Now
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-amber-200/30 dark:border-amber-800/30 group hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-gray-900 dark:text-white truncate">Rate Our App</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Love Quick Fix? Rate us!</p>
                </div>
              </div>
              <button
                onClick={handleRateApp}
                className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-all hover:scale-[1.02] shadow-md shadow-amber-500/20"
              >
                <Star className="w-3 h-3 fill-white" />
                Rate Now
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 pb-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-500/10 to-red-600/10 dark:from-red-900/20 dark:to-red-800/20 border border-red-200/50 dark:border-red-800/30 rounded-lg hover:bg-red-500/20 dark:hover:bg-red-900/30 transition-all group"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-red-500">Sign Out</span>
              <ChevronRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Version */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5 pb-1">
            <span className="text-gray-400 text-[9px]">⚡</span>
            <span className="text-[8px] text-gray-400">Quick Fix v2.0</span>
            <span className="w-px h-2 bg-gray-300 dark:bg-gray-600" />
            <span className="text-[8px] text-gray-400">2026</span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/30">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Success!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{modalMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-5 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-green-500/30 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/30">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Oops!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{modalMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-5 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-red-500/30 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}