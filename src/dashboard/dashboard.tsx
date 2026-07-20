import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  X,
  Calendar,
  MapPin,
  User,
  Settings,
  LogOut,
  Grid,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
  Zap,
  Plus,
  Wrench
} from 'lucide-react';

// Types
interface RepairService {
  id: number;
  service_title: string;
  service_description: string | null;
  service_created: string;
}

// Service images mapping
const serviceImages: Record<string, string> = {
  aexjchku: 'https://images.unsplash.com/photo-1487754180451-c456f719a5fc?w=400&h=300&fit=crop',
  aovwlmpe: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
  aptmjbdq: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop',
  axiofsmn: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop',
  bauwhgkp: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=400&h=300&fit=crop',
  bdovtijq: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop',
  bgfelcsw: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
  bjdimqug: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop',
  default: 'https://images.unsplash.com/photo-1487754180451-c456f719a5fc?w=400&h=300&fit=crop'
};

const allServiceImages = Object.values(serviceImages);

const ServicesScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<RepairService | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'services' | 'bookings' | 'profile' | 'map'>('services');
  const [featuredServices, setFeaturedServices] = useState<RepairService[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showSyncStatus, setShowSyncStatus] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);

  // Mock user data (no role/authentication)
  const userDisplayName: string = 'John Doe';
  const userInitials: string = 'JD';
  const userMobile: string = '+255 712 345 678';

  // Get random image for service
  const getServiceImage = useCallback((serviceId: number): string => {
    const imageIndex = serviceId % allServiceImages.length;
    return allServiceImages[imageIndex] || serviceImages.default;
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string): string => {
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

  // Fetch services
  const fetchServices = async (): Promise<void> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockServices: RepairService[] = [
        {
          id: 1,
          service_title: 'Engine Diagnostics',
          service_description: 'Complete engine diagnostic and performance check',
          service_created: new Date().toISOString()
        },
        {
          id: 2,
          service_title: 'Brake System Repair',
          service_description: 'Full brake system inspection and repair',
          service_created: new Date().toISOString()
        },
        {
          id: 3,
          service_title: 'Oil Change Service',
          service_description: 'Professional oil change and filter replacement',
          service_created: new Date().toISOString()
        },
        {
          id: 4,
          service_title: 'Transmission Service',
          service_description: 'Transmission fluid change and system check',
          service_created: new Date().toISOString()
        },
        {
          id: 5,
          service_title: 'Suspension Repair',
          service_description: 'Suspension system inspection and repair',
          service_created: new Date().toISOString()
        },
        {
          id: 6,
          service_title: 'AC Repair Service',
          service_description: 'Air conditioning system diagnosis and repair',
          service_created: new Date().toISOString()
        }
      ];
      
      setServices(mockServices);
      
      // Set featured services (first 3)
      const featured = mockServices.slice(0, 3);
      setFeaturedServices(featured);
      
      setLastSynced(new Date());
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      setSyncError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchServices();
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchServices();
  }, []);

  // Sync data
  const handleSync = useCallback(async (): Promise<void> => {
    if (!isOnline) {
      setSyncError('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    
    try {
      await fetchServices();
      setLastSynced(new Date());
      setShowSyncStatus(true);
      setTimeout(() => setShowSyncStatus(false), 3000);
    } catch (error: any) {
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  // Handle search
  const handleSearchChange = (text: string): void => {
    setSearchQuery(text);
  };

  // Handle logout (no auth, just navigate)
  const handleLogout = useCallback((): void => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle tab navigation
  const handleTabPress = useCallback((tab: typeof activeTab): void => {
    setActiveTab(tab);
    setShowProfileDropdown(false);
    
    switch (tab) {
      case 'services':
        break;
      case 'bookings':
        navigate('/dashboard/bookings');
        break;
      case 'map':
        navigate('/dashboard/map');
        break;
      case 'profile':
        navigate('/dashboard/profile');
        break;
    }
  }, [navigate]);

  // Handle create booking
  const handleCreateBooking = useCallback((): void => {
    navigate('/dashboard/bookings/create');
  }, [navigate]);

  // Filtered services
  const filteredServices = useMemo((): RepairService[] => {
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

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Top */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Menu className="w-6 h-6 text-cyan-500" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QuickFix</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Professional auto repair</p>
              </div>
            </div>

            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg"
            >
              {userInitials}
            </button>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <button
                onClick={handleCreateBooking}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Wrench className="w-5 h-5" />
                Fix Now
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Service not listed? Create custom fix
            </p>
          </div>
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfileDropdown && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowProfileDropdown(false)}
          />
          <div className="fixed top-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                {userInitials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{userDisplayName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userMobile}</p>
              </div>
            </div>

            {/* Menu Items */}
            <button
              onClick={() => {
                setShowProfileDropdown(false);
                navigate('/dashboard/profile');
              }}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <User className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">My Profile</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View and edit your profile</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowProfileDropdown(false);
                navigate('/dashboard/bookings');
              }}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">My Fixes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your service requests</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowProfileDropdown(false);
                handleCreateBooking();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Plus className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">New Service Request</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Book a new service</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowProfileDropdown(false);
                navigate('/dashboard/settings');
              }}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Settings className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">App preferences and privacy</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-500">Logout</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
              </div>
            </button>

            {/* Status */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {lastSynced && (
                <span className="text-sm text-gray-400 ml-auto">
                  Synced: {lastSynced.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Sync Status */}
      {(showSyncStatus || isSyncing || syncError) && (
        <div className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center ${
          syncError ? 'bg-red-500' : isSyncing ? 'bg-yellow-500' : 'bg-green-500'
        }`}>
          <div className="flex items-center justify-center gap-2 text-white">
            {isSyncing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Syncing data...</span>
              </>
            ) : syncError ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Sync failed: {syncError}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
                  Synced {lastSynced ? `at ${lastSynced.toLocaleTimeString()}` : 'successfully'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-32">
        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} opacity-20`} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {isOnline ? 'Online' : 'Offline'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lastSynced 
                  ? `Last synced: ${lastSynced.toLocaleTimeString()}`
                  : 'Not synced yet'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing || !isOnline}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors ${
              isSyncing || !isOnline
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-600'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Services</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Most popular repairs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  <img
                    src={getServiceImage(service.id)}
                    alt={service.service_title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {service.service_title}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateBooking();
                      }}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Fix
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Services</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredServices.length} services available
              </p>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Services Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? 'Try adjusting your search' : 'No services available at the moment'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors mb-3"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={handleCreateBooking}
                className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Create Custom Booking
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={getServiceImage(service.id)}
                    alt={service.service_title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {service.service_title}
                    </h3>
                    {service.service_description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {service.service_description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Added: {formatDate(service.service_created)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        handleCreateBooking();
                      }}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Wrench className="w-4 h-4" />
                      Fix Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            <div className="relative">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <img
                src={getServiceImage(selectedService.id)}
                alt={selectedService.service_title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-12rem)]">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedService.service_title}
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <Calendar className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Added</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedService.service_created)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <Zap className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Availability</p>
                  <p className="text-sm font-medium text-green-500">24/7</p>
                </div>
              </div>

              {selectedService.service_description && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedService.service_description}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedService(null);
                  handleCreateBooking();
                }}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Fix This Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 pt-2 pb-6">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Services */}
          <button
            onClick={() => handleTabPress('services')}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="relative">
              <Grid className={`w-6 h-6 ${activeTab === 'services' ? 'text-cyan-500' : 'text-gray-400'}`} />
              {activeTab === 'services' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </div>
            <span className={`text-xs ${activeTab === 'services' ? 'text-cyan-500' : 'text-gray-400'}`}>
              Services
            </span>
          </button>

          {/* Map */}
          <button
            onClick={() => handleTabPress('map')}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="relative">
              <MapPin className={`w-6 h-6 ${activeTab === 'map' ? 'text-cyan-500' : 'text-gray-400'}`} />
              {activeTab === 'map' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </div>
            <span className={`text-xs ${activeTab === 'map' ? 'text-cyan-500' : 'text-gray-400'}`}>
              Map
            </span>
          </button>

          {/* Fix Button */}
          <button
            onClick={handleCreateBooking}
            className="flex flex-col items-center gap-1 flex-1 -mt-6"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-cyan-500 font-medium">Fix</span>
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
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                {userInitials}
              </div>
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

export default ServicesScreen;