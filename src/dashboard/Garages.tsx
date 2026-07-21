// src/pages/dashboard/GaragesPage.tsx

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  StarHalf,
  Star as StarOutline,
  CheckCircle,
  AlertCircle,
  Info,
  Map,
  Building2,
  Wrench,
  Tag,
  User,
  Settings,
  Navigation,
  Loader2,
  PhoneCall,
  Briefcase,
  Award,
  Shield,
  Truck,
  Car,
  
  Compass,
  ChevronRight,
  PlusCircle,
  Home,
  DollarSign,
  Clock as ClockIcon,
  Users,
  ThumbsUp
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const WORKSHOPS_ENDPOINT = `${API_BASE_URL}/auto-workshops/`;

// Types
interface Workshop {
  id: number;
  workshop_owner_name: string | null;
  workshop_owner_phone: string | null;
  workshop_name: string;
  workshop_email: string;
  workshop_phone: string;
  workshop_address: string;
  workshop_city: string | null;
  workshop_latitude: string | null;
  workshop_longitude: string | null;
  is_workshop_verified: boolean;
  is_workshop_active: boolean;
  workshop_created: string;
  workshop_updated: string;
  workshop_owner: number | null;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function GaragesPage() {
  const navigate = useNavigate();
  const { user, profileData } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<'garages' | 'map' | 'deals' | 'bookings' | 'profile'>('garages');
  const [isOnline, setIsOnline] = useState(true);

  // Get user's display name and initials
  const userDisplayName = user?.full_name || user?.mobile_number || 'User';
  const userInitials = userDisplayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const userProfilePicture = profileData?.profile_picture;

  // Handle tab navigation
  const handleTabPress = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'garages':
        handleRefresh();
        break;
      case 'map':
        navigate('/map');
        break;
      case 'bookings':
        navigate('/list');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'deals':
        navigate('/services?tab=deals');
        break;
    }
  }, [navigate]);

  // Fetch workshops
  const fetchWorkshops = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch(WORKSHOPS_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const workshopsList = data.results || data;
      
      if (Array.isArray(workshopsList)) {
        setWorkshops(workshopsList);
      } else {
        setWorkshops([]);
      }
      
    } catch (error: any) {
      console.error('Error fetching workshops:', error.message);
      alert(error.message || 'Failed to load workshops');
      setWorkshops([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get user location
  const getUserLocation = async () => {
    setLoadingLocation(true);
    try {
      if (!navigator.geolocation) {
        setLocationPermissionDenied(true);
        setLoadingLocation(false);
        return null;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const userLocationData: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(userLocationData);
      setLocationPermissionDenied(false);
      return userLocationData;
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermissionDenied(true);
      return null;
    } finally {
      setLoadingLocation(false);
    }
  };

  // Calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get workshop distance
  const getWorkshopDistance = (workshop: Workshop): string => {
    if (!userLocation) {
      return 'Enable location';
    }
    
    if (!workshop.workshop_latitude || !workshop.workshop_longitude) {
      return 'Location N/A';
    }
    
    try {
      const lat = parseFloat(workshop.workshop_latitude);
      const lng = parseFloat(workshop.workshop_longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return 'Location N/A';
      }
      
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        lat,
        lng
      );
      
      if (distance < 1) {
        return `${Math.round(distance * 1000)} m`;
      }
      return `${distance.toFixed(1)} km`;
    } catch (error) {
      return 'Location N/A';
    }
  };

  // Get opening status
  const getOpeningStatus = (workshop: Workshop): { status: string; color: string } => {
    if (workshop.is_workshop_active) {
      return { status: 'Open Now', color: '#10b981' };
    }
    return { status: 'Closed', color: '#ef4444' };
  };

  // Make phone call
  const makePhoneCall = async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      alert('No phone number available');
      return;
    }
    
    let cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    
    window.location.href = `tel:${cleanNumber}`;
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await fetchWorkshops(false);
      await getUserLocation();
    };
    initializeData();
  }, []);

  // Filter workshops
  useEffect(() => {
    if (!workshops.length) {
      setFilteredWorkshops([]);
      return;
    }
    
    let filtered = [...workshops];
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(workshop =>
        workshop.workshop_name?.toLowerCase().includes(query) ||
        workshop.workshop_address?.toLowerCase().includes(query) ||
        (workshop.workshop_city && workshop.workshop_city.toLowerCase().includes(query)) ||
        workshop.workshop_email?.toLowerCase().includes(query) ||
        workshop.workshop_phone?.includes(query)
      );
    }
    
    setFilteredWorkshops(filtered);
  }, [searchQuery, workshops]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      fetchWorkshops(true),
      getUserLocation()
    ]);
  }, []);

  // Handle workshop card press
  const handleWorkshopCardPress = async (workshop: Workshop) => {
    navigate(`/bookings?workshopId=${workshop.id}&workshopName=${encodeURIComponent(workshop.workshop_name)}`);
  };

  // Render stars
  const renderStars = (verified: boolean) => {
    const rating = verified ? 4.5 : 3.5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<StarOutline key={i} className="w-3.5 h-3.5 text-gray-300" />);
      }
    }
    return stars;
  };

  // Render bottom navigation
  const renderBottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="flex items-center justify-around px-4 pt-2 pb-6 max-w-md mx-auto">
        {/* Garages Tab */}
        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('garages')}
        >
          <div className="relative">
            <Building2 className={`w-5 h-5 transition-colors ${activeTab === 'garages' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
            {activeTab === 'garages' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] font-medium mt-0.5 transition-colors ${activeTab === 'garages' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Providers
          </span>
        </button>

        {/* Map Tab */}
        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('map')}
        >
          <div className="relative">
            <Map className={`w-5 h-5 transition-colors ${activeTab === 'map' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
            {activeTab === 'map' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] font-medium mt-0.5 transition-colors ${activeTab === 'map' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Map
          </span>
        </button>

        {/* Center Deals Button */}
        <button
          className="flex flex-col items-center flex-1 -mt-5"
          onClick={() => handleTabPress('deals')}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-200 hover:scale-105">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] font-semibold mt-0.5 text-cyan-600">Deals</span>
        </button>

        {/* Bookings Tab */}
        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('bookings')}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 transition-colors ${activeTab === 'bookings' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
            {activeTab === 'bookings' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] font-medium mt-0.5 transition-colors ${activeTab === 'bookings' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Fixes
          </span>
        </button>

        {/* Profile Tab */}
        <button
          className="flex flex-col items-center flex-1 group"
          onClick={() => handleTabPress('profile')}
        >
          <div className="relative">
            {userProfilePicture ? (
              <img 
                src={userProfilePicture} 
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover border-2 border-transparent group-hover:border-cyan-500 transition-all"
              />
            ) : (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${activeTab === 'profile' ? 'bg-cyan-600 text-white' : 'bg-cyan-100 text-cyan-600 group-hover:bg-cyan-200'}`}>
                {userInitials}
              </div>
            )}
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            {activeTab === 'profile' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-600" />
            )}
          </div>
          <span className={`text-[9px] font-medium mt-0.5 transition-colors ${activeTab === 'profile' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading Fix Providers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Fix Providers</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Professional auto repair shops</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Search by name, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4">
        <div 
          className={`flex items-center p-3 rounded-xl border transition-all ${
            loadingLocation 
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              : locationPermissionDenied 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : userLocation 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800'
          }`}
          onClick={getUserLocation}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            loadingLocation 
              ? 'bg-gray-200 dark:bg-gray-700'
              : locationPermissionDenied 
                ? 'bg-red-100 dark:bg-red-900/30'
                : userLocation 
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            <Navigation className={`w-5 h-5 ${
              loadingLocation 
                ? 'text-gray-500'
                : locationPermissionDenied 
                  ? 'text-red-500'
                  : userLocation 
                    ? 'text-green-500'
                    : 'text-cyan-500'
            }`} />
          </div>
          <div className="flex-1 mx-3">
            <p className={`text-sm font-medium ${
              loadingLocation 
                ? 'text-gray-600 dark:text-gray-400'
                : locationPermissionDenied 
                  ? 'text-red-600 dark:text-red-400'
                  : userLocation 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-cyan-600 dark:text-cyan-400'
            }`}>
              {loadingLocation ? 'Getting Location...' : 
               locationPermissionDenied ? 'Location Access Required' :
               userLocation ? 'Location Active' : 'Enable Location'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {loadingLocation ? 'Please wait...' : 
               locationPermissionDenied ? 'Tap to enable location access' :
               userLocation ? 'Get accurate distance and availability' : 'Get personalized results'}
            </p>
          </div>
          {userLocation && !loadingLocation && (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Workshops List */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-24">
        {filteredWorkshops.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Providers Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'Try a different search term'
                : 'No workshops available at the moment'
              }
            </p>
            {searchQuery && (
              <button
                className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkshops.map((workshop) => {
              const openingStatus = getOpeningStatus(workshop);
              const distance = getWorkshopDistance(workshop);
              
              return (
                <div
                  key={workshop.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleWorkshopCardPress(workshop)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {workshop.workshop_name}
                        </h3>
                        {workshop.is_workshop_verified && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(workshop.is_workshop_verified)}
                        <span className="text-[10px] text-gray-500 ml-1">
                          {workshop.is_workshop_verified ? 'Verified' : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {workshop.workshop_address}
                    {workshop.workshop_city && `, ${workshop.workshop_city}`}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" style={{ color: openingStatus.color }} />
                      <span className="font-medium" style={{ color: openingStatus.color }}>
                        {openingStatus.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                        {workshop.workshop_email}
                      </span>
                    </div>
                  </div>
                  
                  {workshop.workshop_phone && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Phone className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {workshop.workshop_phone}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-cyan-500/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkshopCardPress(workshop);
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      Fix Now
                    </button>
                    
                    {workshop.workshop_phone && (
                      <button
                        className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          makePhoneCall(workshop.workshop_phone);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {renderBottomNavigation()}

      {/* Custom Animations */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}