import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  StarHalf,
  Star as StarOutline,
  CheckCircle,
  Clock,
  RefreshCw,
  Wrench,
  Building,
  Navigation,
  User,
  Map,
  Tag,
  CreditCard,
  LogOut,
  Settings,
  Grid,
  Home,
  Menu
} from 'lucide-react';

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

const GaragesScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
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
  const [isDark, setIsDark] = useState(false);

  // Mock user data
  const mockUser = {
    full_name: 'John Doe',
    mobile_number: '+255 712 345 678',
    role: 'customer'
  };
  const user = mockUser;
  const userDisplayName = user?.full_name || user?.mobile_number || 'User';
  const userInitials = userDisplayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const userProfilePicture = null;

  // Theme colors
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    border: isDark ? '#334155' : '#e2e8f0',
    inputBg: isDark ? '#334155' : '#f1f5f9',
    primary: '#0891b2',
    primaryDark: '#0e7490',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gold: '#fbbf24',
  };

  // Fetch workshops
  const fetchWorkshops = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockWorkshops: Workshop[] = [
        {
          id: 1,
          workshop_owner_name: 'James Mwangi',
          workshop_owner_phone: '+255 712 345 678',
          workshop_name: 'AutoCare Premium Services',
          workshop_email: 'info@autocare.co.tz',
          workshop_phone: '+255 765 432 100',
          workshop_address: 'Plot 45, Kimweri Street, Mbezi Beach',
          workshop_city: 'Dar es Salaam',
          workshop_latitude: '-6.7924',
          workshop_longitude: '39.2083',
          is_workshop_verified: true,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
          workshop_owner: 1
        },
        {
          id: 2,
          workshop_owner_name: 'Sarah Kileo',
          workshop_owner_phone: '+255 713 456 789',
          workshop_name: 'Elite Auto Garage',
          workshop_email: 'info@eliteauto.co.tz',
          workshop_phone: '+255 765 432 101',
          workshop_address: 'Block 12, Nyerere Road, Temeke',
          workshop_city: 'Dar es Salaam',
          workshop_latitude: '-6.8200',
          workshop_longitude: '39.2600',
          is_workshop_verified: true,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
          workshop_owner: 2
        },
        {
          id: 3,
          workshop_owner_name: 'Michael Masaki',
          workshop_owner_phone: '+255 714 567 890',
          workshop_name: 'QuickFix Motors',
          workshop_email: 'info@quickfix.co.tz',
          workshop_phone: '+255 765 432 102',
          workshop_address: 'Plot 78, Mandela Road, Ubungo',
          workshop_city: 'Dar es Salaam',
          workshop_latitude: '-6.7800',
          workshop_longitude: '39.1800',
          is_workshop_verified: false,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
          workshop_owner: 3
        },
        {
          id: 4,
          workshop_owner_name: 'David Mushi',
          workshop_owner_phone: '+255 715 678 901',
          workshop_name: 'Moshi Auto Service',
          workshop_email: 'info@moshiauto.co.tz',
          workshop_phone: '+255 765 432 103',
          workshop_address: 'Plot 23, Kilimanjaro Road, Moshi',
          workshop_city: 'Moshi',
          workshop_latitude: '-3.3433',
          workshop_longitude: '37.3200',
          is_workshop_verified: true,
          is_workshop_active: false,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
          workshop_owner: 4
        },
        {
          id: 5,
          workshop_owner_name: 'Grace Maro',
          workshop_owner_phone: '+255 716 789 012',
          workshop_name: 'Arusha Auto Repair',
          workshop_email: 'info@arushaauto.co.tz',
          workshop_phone: '+255 765 432 104',
          workshop_address: 'Plot 56, Sokoine Road, Arusha',
          workshop_city: 'Arusha',
          workshop_latitude: '-3.3869',
          workshop_longitude: '36.6830',
          is_workshop_verified: false,
          is_workshop_active: true,
          workshop_created: new Date().toISOString(),
          workshop_updated: new Date().toISOString(),
          workshop_owner: 5
        }
      ];
      
      setWorkshops(mockWorkshops);
    } catch (error: any) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get user location
  const getUserLocation = async () => {
    setLoadingLocation(true);
    try {
      // Simulate location fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock location (Dar es Salaam)
      const location: Coordinates = {
        latitude: -6.7924,
        longitude: 39.2083,
      };
      
      setUserLocation(location);
      setLocationPermissionDenied(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermissionDenied(true);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Calculate distance between two coordinates
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
    if (!userLocation) return 'Enable location';
    if (!workshop.workshop_latitude || !workshop.workshop_longitude) return 'Location N/A';
    
    try {
      const lat = parseFloat(workshop.workshop_latitude);
      const lng = parseFloat(workshop.workshop_longitude);
      if (isNaN(lat) || isNaN(lng)) return 'Location N/A';
      
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        lat,
        lng
      );
      
      if (distance < 1) return `${Math.round(distance * 1000)} m`;
      return `${distance.toFixed(1)} km`;
    } catch {
      return 'Location N/A';
    }
  };

  // Get opening status
  const getOpeningStatus = (workshop: Workshop): { status: string; color: string } => {
    if (workshop.is_workshop_active) {
      return { status: 'Open Now', color: colors.success };
    }
    return { status: 'Closed', color: colors.error };
  };

  // Make phone call
  const makePhoneCall = (phoneNumber: string) => {
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

  // Handle tab navigation
  const handleTabPress = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'garages':
        fetchWorkshops(true);
        break;
      case 'map':
        navigate('/map');
        break;
      case 'bookings':
        navigate('/bookings');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'deals':
        navigate('/services?tab=deals');
        break;
    }
  }, [navigate]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      fetchWorkshops(true),
      getUserLocation()
    ]);
  }, []);

  // Handle workshop card press
  const handleWorkshopCardPress = (workshop: Workshop) => {
    navigate('/bookings', { 
      state: { 
        workshopId: workshop.id,
        workshopName: workshop.workshop_name
      }
    });
  };

  // Handle call button press
  const handleCallPress = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    makePhoneCall(phone);
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

  // Render stars
  const renderStars = (verified: boolean) => {
    const rating = verified ? 4.5 : 3.5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />);
      } else {
        stars.push(<StarOutline key={i} className="w-3.5 h-3.5 text-gray-400" />);
      }
    }
    
    return stars;
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading Fix Providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-500" />
            </button>
            <div className="flex-1 mx-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Fix Providers</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Professional auto repair shops</p>
            </div>
            <button
              onClick={() => handleRefresh()}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-cyan-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="Search by name, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={getUserLocation}
        >
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
              loadingLocation ? 'bg-gray-200 dark:bg-gray-700' :
              locationPermissionDenied ? 'bg-red-100 dark:bg-red-900/20' :
              userLocation ? 'bg-green-100 dark:bg-green-900/20' : 'bg-cyan-100 dark:bg-cyan-900/20'
            }`}>
              <Navigation className={`w-5 h-5 ${
                loadingLocation ? 'text-gray-400' :
                locationPermissionDenied ? 'text-red-500' :
                userLocation ? 'text-green-500' : 'text-cyan-500'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
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
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
      </div>

      {/* Workshops List */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        {filteredWorkshops.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Providers Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'No workshops available at the moment'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
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
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white flex-1">
                        {workshop.workshop_name}
                      </h3>
                      {workshop.is_workshop_verified && (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(workshop.is_workshop_verified)}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {workshop.is_workshop_verified ? 'Verified' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {workshop.workshop_address}
                    {workshop.workshop_city && `, ${workshop.workshop_city}`}
                  </p>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" style={{ color: openingStatus.color }} />
                      <span className="text-xs font-medium" style={{ color: openingStatus.color }}>
                        {openingStatus.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                        {workshop.workshop_email}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  {workshop.workshop_phone && (
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {workshop.workshop_phone}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWorkshopCardPress(workshop)}
                      className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Fix Now
                    </button>
                    {workshop.workshop_phone && (
                      <button
                        onClick={(e) => handleCallPress(workshop.workshop_phone, e)}
                        className="w-12 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Phone className="w-4 h-4 text-white" />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 pt-2 pb-6">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Providers */}
          <button
            onClick={() => handleTabPress('garages')}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="relative">
              <Building className={`w-6 h-6 ${activeTab === 'garages' ? 'text-cyan-500' : 'text-gray-400'}`} />
              {activeTab === 'garages' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </div>
            <span className={`text-xs ${activeTab === 'garages' ? 'text-cyan-500' : 'text-gray-400'}`}>
              Providers
            </span>
          </button>

          {/* Map */}
          <button
            onClick={() => handleTabPress('map')}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="relative">
              <Map className={`w-6 h-6 ${activeTab === 'map' ? 'text-cyan-500' : 'text-gray-400'}`} />
              {activeTab === 'map' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </div>
            <span className={`text-xs ${activeTab === 'map' ? 'text-cyan-500' : 'text-gray-400'}`}>
              Map
            </span>
          </button>

          {/* Deals */}
          <button
            onClick={() => handleTabPress('deals')}
            className="flex flex-col items-center gap-1 flex-1 -mt-6"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Tag className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-cyan-500 font-medium">Deals</span>
          </button>

          {/* Bookings */}
          <button
            onClick={() => handleTabPress('bookings')}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="relative">
              <Calendar className={`w-6 h-6 ${activeTab === 'bookings' ? 'text-cyan-500' : 'text-gray-400'}`} />
              {activeTab === 'bookings' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </div>
            <span className={`text-xs ${activeTab === 'bookings' ? 'text-cyan-500' : 'text-gray-400'}`}>
              Fixes
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleTabPress('profile')}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="relative">
              {userProfilePicture ? (
                <img
                  src={userProfilePicture}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                  {userInitials}
                </div>
              )}
              <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              {activeTab === 'profile' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </div>
            <span className={`text-xs ${activeTab === 'profile' ? 'text-cyan-500' : 'text-gray-400'}`}>
              Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GaragesScreen;