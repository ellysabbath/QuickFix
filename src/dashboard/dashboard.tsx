// src/pages/ServicesPage.tsx

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  Menu,
  Search,
  X,
  ArrowRight,
  Calendar,
  User,
  Settings,
  LogOut,
  Grid,
  MapPin,
  Bookmark,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  Zap,
  Clock,
  Star,
  Wrench,
  Briefcase,
  Award,
  Shield,
  ChevronRight,
  Construction,
  Info
} from 'lucide-react';

// Import images from assets/new folder
import aexjchku from '../../assets/new/aexjchku.jpg';
import aovwlmpe from '../../assets/new/aovwlmpe.jpg';
import aptmjbdq from '../../assets/new/aptmjbdq.jpg';
import axiofsmn from '../../assets/new/axiofsmn.jpg';
import bauwhgkp from '../../assets/new/bauwhgkp.jpg';
import bdovtijq from '../../assets/new/bdovtijq.jpg';
import bgfelcsw from '../../assets/new/bgfelcsw.jpg';
import bjdimqug from '../../assets/new/bjdimqug.jpg';
import bsehykod from '../../assets/new/bsehykod.jpg';
import ceigwqln from '../../assets/new/ceigwqln.jpg';
import cjsahrft from '../../assets/new/cjsahrft.jpg';
import ctkawhde from '../../assets/new/ctkawhde.jpg';
import cvjlxfym from '../../assets/new/cvjlxfym.jpg';
import dfihxcyb from '../../assets/new/dfihxcyb.jpg';
import dfmyczsv from '../../assets/new/dfmyczsv.jpg';
import dgvmrpuh from '../../assets/new/dgvmrpuh.jpg';
import djyvnlqz from '../../assets/new/djyvnlqz.jpg';
import dqyjhitr from '../../assets/new/dqyjhitr.jpg';
import dsbznyip from '../../assets/new/dsbznyip.jpg';
import dswcnhpy from '../../assets/new/dswcnhpy.jpg';
import duycmaqh from '../../assets/new/duycmaqh.jpg';
import emvaopih from '../../assets/new/emvaopih.jpg';
import fkmvqwsp from '../../assets/new/fkmvqwsp.jpg';
import fkxtjhgw from '../../assets/new/fkxtjhgw.jpg';
import grcxtdwu from '../../assets/new/grcxtdwu.jpg';
import gthoyafr from '../../assets/new/gthoyafr.jpg';
import gwlmjzhf from '../../assets/new/gwlmjzhf.jpg';
import gxzcybtq from '../../assets/new/gxzcybtq.jpg';
import gythrmec from '../../assets/new/gythrmec.jpg';
import hsfkvabz from '../../assets/new/hsfkvabz.jpg';
import hsyetcmb from '../../assets/new/hsyetcmb.jpg';
import hvzmoexb from '../../assets/new/hvzmoexb.jpg';
import iekjprtw from '../../assets/new/iekjprtw.jpg';
import igmdlquh from '../../assets/new/igmdlquh.jpg';
import jcadtisf from '../../assets/new/jcadtisf.jpg';
import jpbzmhne from '../../assets/new/jpbzmhne.jpg';
import jwaqvftl from '../../assets/new/jwaqvftl.jpg';
import kyivhptu from '../../assets/new/kyivhptu.jpg';
import ojunxhai from '../../assets/new/ojunxhai.jpg';
import pfmgxzqr from '../../assets/new/pfmgxzqr.jpg';
import pgltncda from '../../assets/new/pgltncda.jpg';
import pncymdwu from '../../assets/new/pncymdwu.jpg';
import qfzcnrdg from '../../assets/new/qfzcnrdg.jpg';
import qjamnhpz from '../../assets/new/qjamnhpz.jpg';
import qmzgusxk from '../../assets/new/qmzgusxk.jpg';
import tvaidbxf from '../../assets/new/tvaidbxf.jpg';
import udoeflqg from '../../assets/new/udoeflqg.jpg';
import uyjzrgvm from '../../assets/new/uyjzrgvm.jpg';
import uyzvnqpk from '../../assets/new/uyzvnqpk.jpg';
import wadtybjc from '../../assets/new/wadtybjc.jpg';
import xvwszbpu from '../../assets/new/xvwszbpu.jpg';
import zobakwpt from '../../assets/new/zobakwpt.jpg';
import zweagvxl from '../../assets/new/zweagvxl.jpg';

// Type definitions for Repair Service API
interface RepairService {
  id: number;
  service_title: string;
  service_description: string | null;
  service_created: string;
}

const REPAIR_SERVICES_URL = 'http://127.0.0.1:8000/api/repair-services/';

// Service images mapping
const serviceImages = {
  aexjchku,
  aovwlmpe,
  aptmjbdq,
  axiofsmn,
  bauwhgkp,
  bdovtijq,
  bgfelcsw,
  bjdimqug,
  bsehykod,
  ceigwqln,
  cjsahrft,
  ctkawhde,
  cvjlxfym,
  dfihxcyb,
  dfmyczsv,
  dgvmrpuh,
  djyvnlqz,
  dqyjhitr,
  dsbznyip,
  dswcnhpy,
  duycmaqh,
  emvaopih,
  fkmvqwsp,
  fkxtjhgw,
  grcxtdwu,
  gthoyafr,
  gwlmjzhf,
  gxzcybtq,
  gythrmec,
  hsfkvabz,
  hsyetcmb,
  hvzmoexb,
  iekjprtw,
  igmdlquh,
  jcadtisf,
  jpbzmhne,
  jwaqvftl,
  kyivhptu,
  ojunxhai,
  pfmgxzqr,
  pgltncda,
  pncymdwu,
  qfzcnrdg,
  qjamnhpz,
  qmzgusxk,
  tvaidbxf,
  udoeflqg,
  uyjzrgvm,
  uyzvnqpk,
  wadtybjc,
  xvwszbpu,
  zobakwpt,
  zweagvxl,
  default: aexjchku,
};

const allServiceImages = Object.values(serviceImages);

export default function ServicesPage() {
  const { user, profileData, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState<RepairService | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'bookings' | 'profile' | 'map'>('services');
  const [featuredServices, setFeaturedServices] = useState<RepairService[]>([]);
  
  // Online status states
  const [isOnline] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showSyncStatus, setShowSyncStatus] = useState(false);

  // Get user's display name and initials
  const userDisplayName = user?.full_name || user?.mobile_number || 'User';
  const userInitials = userDisplayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get random image for service
  const getServiceImage = useCallback((serviceId: number) => {
    const imageIndex = serviceId % allServiceImages.length;
    return allServiceImages[imageIndex] || serviceImages.default;
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  }, []);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(REPAIR_SERVICES_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const servicesList = data.results || data;
      
      const mappedServices: RepairService[] = (Array.isArray(servicesList) ? servicesList : []).map((item: any) => ({
        id: item.id,
        service_title: item.service_title || 'Untitled Service',
        service_description: item.service_description || null,
        service_created: item.service_created || new Date().toISOString(),
      }));
      
      setServices(mappedServices);
      
      const featured = [...mappedServices]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      setFeaturedServices(featured);
      
      setLastSynced(new Date());
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      setSyncError(error.message);
      alert(error.message || 'Failed to load services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize data
  const initializeData = useCallback(async () => {
    await fetchServices();
  }, []);

  useEffect(() => {
    initializeData();
  }, []);

  // Refresh handler


  // Sync data with server
  const handleSync = useCallback(async () => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please check your internet connection.');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      await fetchServices();
      setLastSynced(new Date());
      setSyncError(null);
      setShowSyncStatus(true);
      setTimeout(() => setShowSyncStatus(false), 3000);
    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setShowProfileDropdown(false);
      setShowSidebar(false);
      await logout();
      window.location.href = '/login';
    }
  }, [logout]);

  // Handle tab navigation
  const handleTabPress = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    setShowProfileDropdown(false);
    
    switch (tab) {
      case 'services':
        break;
      case 'bookings':
        window.location.href = '/list';
        break;
      case 'map':
        window.location.href = '/map';
        break;
      case 'profile':
        window.location.href = '/profile';
        break;
    }
  }, []);

  // Navigate to create booking
  const handleCreateBooking = useCallback(() => {
    setShowProfileDropdown(false);
    window.location.href = '/bookings';
  }, []);

  // Memoized filtered services
  const filteredServices = useMemo(() => {
    if (!services.length) return [];
    
    let filtered = [...services];
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (service: RepairService) => 
          service.service_title?.toLowerCase().includes(query) ||
          service.service_description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [services, searchQuery]);

  // Render service card
  const renderServiceCard = (item: RepairService) => {
    const createdDate = formatDate(item.service_created);
    const imageSource = getServiceImage(item.id);

    return (
      <div
        key={item.id}
        className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
        onClick={() => setSelectedService(item)}
      >
        <div className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden">
          <img 
            src={typeof imageSource === 'string' ? imageSource : imageSource} 
            alt={item.service_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-cyan-600 shadow-sm flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
            Top Rated
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 line-clamp-1">
            {item.service_title}
          </h3>

          {item.service_description && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
              {item.service_description}
            </p>
          )}

          <div className="flex items-center gap-3 mb-2.5 text-[10px] sm:text-xs text-gray-500">
            <div className="flex items-center gap-0.5">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-500" />
              <span>{createdDate}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              <span>24/7</span>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateBooking();
            }}
          >
            <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Fix Now
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render profile dropdown
  const renderProfileDropdown = () => {
    if (!showProfileDropdown) return null;

    return (
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowProfileDropdown(false)}
      >
        <div 
          className="absolute top-16 right-3 sm:right-4 w-[280px] sm:w-80 bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center p-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden mr-3 border-2 border-cyan-500 shadow-md flex-shrink-0">
              {profileData?.profile_picture ? (
                <img 
                  src={profileData.profile_picture} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                  <span className="text-lg sm:text-xl font-bold">{userInitials}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">{userDisplayName}</h3>
              <p className="text-xs text-gray-600 truncate">{user?.mobile_number || ''}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          <button
            className="w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            onClick={() => {
              setShowProfileDropdown(false);
              window.location.href = '/profile';
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-100 group-hover:bg-cyan-200 flex items-center justify-center mr-3 transition-colors flex-shrink-0">
              <User className="text-cyan-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">My Profile</p>
              <p className="text-[10px] text-gray-500">View and edit your profile</p>
            </div>
            <ChevronRight className="text-gray-400 w-3.5 h-3.5" />
          </button>

          <button
            className="w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            onClick={() => {
              setShowProfileDropdown(false);
              window.location.href = '/list';
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mr-3 transition-colors flex-shrink-0">
              <Bookmark className="text-blue-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">My Fixes</p>
              <p className="text-[10px] text-gray-500">Track your service requests</p>
            </div>
            <ChevronRight className="text-gray-400 w-3.5 h-3.5" />
          </button>

          <button
            className="w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            onClick={() => {
              setShowProfileDropdown(false);
              handleCreateBooking();
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-100 group-hover:bg-yellow-200 flex items-center justify-center mr-3 transition-colors flex-shrink-0">
              <PlusCircle className="text-yellow-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">New Service Request</p>
              <p className="text-[10px] text-gray-500">Book a new service</p>
            </div>
            <ChevronRight className="text-gray-400 w-3.5 h-3.5" />
          </button>

          <button
            className="w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            onClick={() => {
              setShowProfileDropdown(false);
              window.location.href = '/settings';
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mr-3 transition-colors flex-shrink-0">
              <Settings className="text-gray-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">Settings</p>
              <p className="text-[10px] text-gray-500">App preferences and privacy</p>
            </div>
            <ChevronRight className="text-gray-400 w-3.5 h-3.5" />
          </button>

          <button
            className="w-full flex items-center p-3 hover:bg-red-50 transition-colors group"
            onClick={handleLogout}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-colors flex-shrink-0">
              <LogOut className="text-red-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-medium text-sm text-red-600">Logout</p>
              <p className="text-[10px] text-gray-500">Sign out of your account</p>
            </div>
            <ChevronRight className="text-red-400 w-3.5 h-3.5" />
          </button>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-700">{isOnline ? 'Online' : 'Offline'}</span>
              {lastSynced && (
                <span className="text-[10px] text-gray-400 ml-auto">
                  Last synced: {lastSynced.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render featured services
  const renderFeaturedSection = () => (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between items-center px-0.5 mb-3 sm:mb-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1.5">
            <Star className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500" />
            Featured Services
          </h2>
          <p className="text-[10px] sm:text-sm text-gray-600">Most popular repairs chosen by our customers</p>
        </div>
        <button className="text-cyan-600 font-semibold text-[10px] sm:text-sm hover:text-cyan-700 transition-colors flex items-center gap-0.5">
          View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide">
        {featuredServices.map((item) => (
          <div
            key={`featured-${item.id}`}
            className="flex-shrink-0 w-36 sm:w-48 bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => setSelectedService(item)}
          >
            <div className="relative w-full h-24 sm:h-32 overflow-hidden">
              <img 
                src={typeof getServiceImage(item.id) === 'string' ? getServiceImage(item.id) : getServiceImage(item.id)} 
                alt={item.service_title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-1.5 right-1.5 bg-cyan-500 text-white text-[8px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                POPULAR
              </div>
            </div>
            <div className="p-2 sm:p-3">
              <p className="text-[10px] sm:text-sm font-semibold text-gray-900 truncate">{item.service_title}</p>
              <button
                className="w-full mt-1.5 sm:mt-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-[9px] sm:text-xs font-semibold transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBooking();
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render sync status bar
  const renderSyncStatusBar = () => {
    if (!showSyncStatus && !isSyncing && !syncError) return null;
    
    const bgColor = syncError ? 'bg-red-500' : isSyncing ? 'bg-yellow-500' : 'bg-green-500';
    
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 py-1.5 sm:py-2.5 px-3 sm:px-4 ${bgColor}`}>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {isSyncing ? (
            <>
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-spin" />
              <span className="text-white text-[10px] sm:text-sm font-medium">Syncing data...</span>
            </>
          ) : syncError ? (
            <>
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-white text-[10px] sm:text-sm font-medium">Sync failed: {syncError}</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-white text-[10px] sm:text-sm font-medium">
                Synced {lastSynced ? `at ${lastSynced.toLocaleTimeString()}` : 'successfully'}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render online status card
  const renderOnlineStatusCard = () => (
    <div className="flex items-center justify-between p-3 sm:p-4 mx-0.5 sm:mx-1 mb-3 sm:mb-4 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center flex-1">
        <div className="relative mr-2 sm:mr-3">
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
            <div className={`absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-ping ${isOnline ? 'bg-green-500/30' : 'bg-gray-400/30'}`} />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-1.5">
            {isOnline ? 'Online' : 'Offline'}
            {isOnline && <span className="text-[8px] sm:text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Live</span>}
          </h4>
          <p className="text-[10px] sm:text-xs text-gray-500">
            {lastSynced 
              ? `Last synced: ${lastSynced.toLocaleTimeString()}`
              : 'Not synced yet'
            }
          </p>
        </div>
      </div>
      
      <button
        className={`flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-[10px] sm:text-sm font-semibold transition-all duration-200 ${
          isSyncing || !isOnline 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-md hover:shadow-lg'
        }`}
        onClick={handleSync}
        disabled={isSyncing || !isOnline}
      >
        <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
      </button>
    </div>
  );

  // Render bottom navigation
  const renderBottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-around px-3 sm:px-4 pt-2 sm:pt-3 pb-4 sm:pb-6 max-w-md mx-auto">
        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('services')}
        >
          <div className="relative">
            <Grid className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${activeTab === 'services' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
            {activeTab === 'services' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] sm:text-xs font-medium mt-0.5 transition-colors ${activeTab === 'services' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Services
          </span>
        </button>

        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('map')}
        >
          <div className="relative">
            <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${activeTab === 'map' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
            {activeTab === 'map' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] sm:text-xs font-medium mt-0.5 transition-colors ${activeTab === 'map' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Map
          </span>
        </button>

        <button
          className="flex flex-col items-center flex-1 -mt-5 sm:-mt-8"
          onClick={handleCreateBooking}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-200 hover:scale-105">
            <Construction className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <span className="text-[9px] sm:text-xs font-semibold mt-0.5 text-cyan-600">Fix</span>
        </button>

        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('bookings')}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${activeTab === 'bookings' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
            {activeTab === 'bookings' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] sm:text-xs font-medium mt-0.5 transition-colors ${activeTab === 'bookings' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Fixes
          </span>
        </button>

        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('profile')}
        >
          <div className="relative">
            {profileData?.profile_picture ? (
              <img 
                src={profileData.profile_picture} 
                alt="Profile"
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-transparent group-hover:border-cyan-500 transition-all"
              />
            ) : (
              <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[8px] sm:text-xs font-bold transition-all ${activeTab === 'profile' ? 'bg-cyan-600 text-white' : 'bg-cyan-100 text-cyan-600 group-hover:bg-cyan-200'}`}>
                {userInitials}
              </div>
            )}
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            {activeTab === 'profile' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] sm:text-xs font-medium mt-0.5 transition-colors ${activeTab === 'profile' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-3 sm:mt-4 text-gray-700 font-medium text-base sm:text-lg">Loading services...</p>
        <p className="text-gray-500 text-xs sm:text-sm">Please wait</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24 sm:pb-32">
      {/* Sidebar */}
      <Sidebar 
        isVisible={showSidebar} 
        onClose={() => setShowSidebar(false)} 
      />

      {/* Sync Status Bar */}
      {renderSyncStatusBar()}

      {/* Profile Dropdown */}
      {renderProfileDropdown()}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="pt-6 sm:pt-8 pb-2 sm:pb-3 px-3 sm:px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center flex-1 min-w-0">
              <button 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center mr-2 sm:mr-3 transition-colors flex-shrink-0"
                onClick={() => setShowSidebar(true)}
              >
                <Menu className="text-cyan-600 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent truncate">
                  QuickFix
                </h1>
                <p className="text-[9px] sm:text-xs text-gray-500 truncate">Professional auto repair services</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button 
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-cyan-500/20 hover:ring-cyan-500/40 transition-all"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                {profileData?.profile_picture ? (
                  <img 
                    src={profileData.profile_picture} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-base sm:text-lg">
                    {userInitials}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-1">
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-500 transition-all">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 min-w-0"
                placeholder="Search for auto repair services..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              
              {searchQuery !== '' && (
                <button 
                  className="p-0.5 sm:p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              )}

              <button 
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-[10px] sm:text-sm font-semibold transition-all duration-200 ml-1.5 sm:ml-2 shadow-md hover:shadow-lg flex-shrink-0"
                onClick={handleCreateBooking}
              >
                <Wrench className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Fix Now</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <p className="text-[9px] sm:text-xs text-gray-500 mt-1 sm:mt-1.5 ml-1 sm:ml-2 flex items-center gap-0.5 sm:gap-1">
              <PlusCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Service not listed? Create a custom fix request
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-20 sm:pb-24 pt-3 sm:pt-4">
        {/* Online Status Card */}
        {renderOnlineStatusCard()}

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-1.5">
              <Briefcase className="text-cyan-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{services.length}</p>
            <p className="text-[8px] sm:text-xs text-gray-500">Total Services</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1.5">
              <Award className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-[8px] sm:text-xs text-gray-500">Availability</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-1.5">
              <Shield className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">100%</p>
            <p className="text-[8px] sm:text-xs text-gray-500">Satisfaction</p>
          </div>
        </div>

        {/* Featured Section */}
        {featuredServices.length > 0 && renderFeaturedSection()}

        {/* All Services Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center px-0.5 mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1.5">
                <Grid className="text-cyan-600 w-4 h-4 sm:w-5 sm:h-5" />
                All Services
              </h2>
              <p className="text-[10px] sm:text-sm text-gray-600">{filteredServices.length} services available</p>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Construction className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1">No Services Found</h3>
              <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                {searchQuery
                  ? 'We couldn\'t find any services matching your search. Try adjusting your search terms.'
                  : 'No services are currently available. Please check back later.'}
              </p>
              {searchQuery && (
                <button
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs sm:text-sm transition-colors mb-2.5"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
              
              <button
                className="flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-xs sm:text-sm transition-colors mx-auto"
                onClick={handleCreateBooking}
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Create Custom Booking
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredServices.map((service) => renderServiceCard(service))}
            </div>
          )}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="w-full max-w-lg max-h-[85%] bg-white rounded-t-2xl sm:rounded-t-3xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-colors"
                onClick={() => setSelectedService(null)}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>

              <div className="w-full h-44 sm:h-56">
                <img 
                  src={typeof getServiceImage(selectedService.id) === 'string' ? getServiceImage(selectedService.id) : getServiceImage(selectedService.id)} 
                  alt={selectedService.service_title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-11rem)] sm:max-h-[calc(85vh-14rem)]">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                {selectedService.service_title}
              </h2>

              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-0.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" />
                  <span>{formatDate(selectedService.service_created)}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-700">4.9</span>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-3 sm:my-4" />

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-100">
                  <Calendar className="text-cyan-600 w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5" />
                  <p className="text-[10px] sm:text-xs text-gray-500">Added On</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">
                    {formatDate(selectedService.service_created)}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-100">
                  <Zap className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5" />
                  <p className="text-[10px] sm:text-xs text-gray-500">Availability</p>
                  <p className="text-xs sm:text-sm font-semibold text-green-600">24/7 Service</p>
                </div>
              </div>

              {selectedService.service_description && (
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1.5 flex items-center gap-1.5">
                    <Info className="text-cyan-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Service Description
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
                    {selectedService.service_description}
                  </p>
                </div>
              )}

              <div className="flex gap-2 sm:gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => {
                    setSelectedService(null);
                    handleCreateBooking();
                  }}
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  Book This Service
                </button>
                <button
                  className="px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedService(null)}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {renderBottomNavigation()}

      {/* Custom styles */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}