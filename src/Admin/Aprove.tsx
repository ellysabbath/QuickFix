import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  Check,
  AlertCircle,
  Loader,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Car,
  DollarSign,
  Info,
  Shield,
  CheckCircle,
  Clock as ClockIcon,
  Send,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Smartphone,
  Briefcase,
  FileText,
  Plus,
  Star,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Menu,
  Home,
  Grid,
  LogOut,
  Settings,
  HelpCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Map,
  Navigation,
  Building,
  CreditCard,
  Tag,
  Users,
  Award,
  AlertTriangle,
  Locate,
  MapPin as MapPinIcon,
  SendHorizontal,
  PersonAdd
} from 'lucide-react';

// Types
interface LocationData {
  latitude: number | null;
  longitude: number | null;
  location_address: string;
  location_city: string;
  location_country: string;
}

interface ApproveRecord {
  id: number;
  updated_by: string;
  phone_number?: string;
  request_code?: string;
  appointment_code?: string;
  previous_status?: string;
  new_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  location_city?: string;
  location_country?: string;
}

interface CustomerRequest {
  id: number;
  request_code: string;
  requested_service: string;
  request_status: string;
  service_location: string;
  preferred_service_date: string;
  preferred_service_time: string;
  vehicle_brand: string;
  vehicle_model: string;
  customer_info: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  service_appointment?: {
    id: number;
    appointment_code: string;
    appointment_status: string;
    appointment_date: string;
    appointment_time: string;
    appointment_service: string;
    agreed_price: string;
    service_workshop: {
      id: number;
      workshop_name: string;
      workshop_phone: string;
    };
  } | null;
}

// Mock user data
const mockUser = {
  full_name: 'Admin User',
  phone: '+255 712 345 678',
  role: 'admin',
  username: 'admin',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User'
};

const ApprovePage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [updatedBy, setUpdatedBy] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);
  const [requestCode, setRequestCode] = useState('');
  const [appointmentCode, setAppointmentCode] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [previousStatus, setPreviousStatus] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isDark, setIsDark] = useState(false);
  
  // Location state
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    location_address: '',
    location_city: '',
    location_country: '',
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allApprovals, setAllApprovals] = useState<ApproveRecord[]>([]);
  const [myApprovals, setMyApprovals] = useState<ApproveRecord[]>([]);
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<ApproveRecord | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showRequestSelector, setShowRequestSelector] = useState(false);

  // Mock user
  const user = mockUser;

  // Colors
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#0891b2',
    primaryDark: '#0e7490',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    indigo: '#6366f1',
  };

  // Get user functions
  const getUserFullName = useCallback((): string => {
    if (user) {
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      return user.username || user.email || '';
    }
    return '';
  }, [user]);

  const getUserPhone = useCallback((): string => {
    if (user) {
      return user.phone || '';
    }
    return '';
  }, [user]);

  // Mock data
  const mockCustomerRequests: CustomerRequest[] = [
    {
      id: 1,
      request_code: 'SR-2024-A1B2C3',
      requested_service: 'Engine Diagnostics',
      request_status: 'pending',
      service_location: 'Dar es Salaam, Tanzania',
      preferred_service_date: new Date().toISOString(),
      preferred_service_time: '10:00',
      vehicle_brand: 'Toyota',
      vehicle_model: 'Corolla',
      customer_info: {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+255 712 345 678',
        email: 'john@example.com',
      },
      service_appointment: {
        id: 1,
        appointment_code: 'APP-2024-001',
        appointment_status: 'scheduled',
        appointment_date: new Date().toISOString(),
        appointment_time: '10:00',
        appointment_service: 'Engine Diagnostics',
        agreed_price: '150000',
        service_workshop: {
          id: 1,
          workshop_name: 'QuickFix Auto',
          workshop_phone: '+255 765 432 100',
        },
      },
    },
    {
      id: 2,
      request_code: 'SR-2024-D4E5F6',
      requested_service: 'Brake System Repair',
      request_status: 'accepted',
      service_location: 'Arusha, Tanzania',
      preferred_service_date: new Date().toISOString(),
      preferred_service_time: '14:30',
      vehicle_brand: 'Honda',
      vehicle_model: 'Civic',
      customer_info: {
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+255 713 456 789',
        email: 'jane@example.com',
      },
      service_appointment: {
        id: 2,
        appointment_code: 'APP-2024-002',
        appointment_status: 'confirmed',
        appointment_date: new Date().toISOString(),
        appointment_time: '14:30',
        appointment_service: 'Brake System Repair',
        agreed_price: '200000',
        service_workshop: {
          id: 2,
          workshop_name: 'Elite Auto Garage',
          workshop_phone: '+255 765 432 101',
        },
      },
    },
  ];

  const mockApprovals: ApproveRecord[] = [
    {
      id: 1,
      updated_by: 'Admin User',
      phone_number: '+255 712 345 678',
      request_code: 'SR-2024-A1B2C3',
      appointment_code: 'APP-2024-001',
      previous_status: 'pending',
      new_status: 'accepted',
      notes: 'Approved with budget adjustment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      location_address: 'Dar es Salaam, Tanzania',
      location_city: 'Dar es Salaam',
      location_country: 'Tanzania',
    },
  ];

  // Fetch customer requests
  const fetchCustomerRequests = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomerRequests(mockCustomerRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }, []);

  // Fetch approvals
  const fetchApprovals = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllApprovals(mockApprovals);
      const currentUserName = getUserFullName();
      const userApprovals = mockApprovals.filter(
        approval => approval.updated_by === currentUserName
      );
      setMyApprovals(userApprovals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    }
  }, [getUserFullName]);

  // Initialize
  useEffect(() => {
    setUpdatedBy(getUserFullName());
    setPhoneNumber(getUserPhone());
    fetchCustomerRequests();
    fetchApprovals();
  }, [getUserFullName, getUserPhone, fetchCustomerRequests, fetchApprovals]);

  // Get current location using browser API
  const getCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        setIsGettingLocation(false);
        return false;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      // Get address using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        let formattedAddress = '';
        let city = '';
        let country = '';
        
        if (data && data.address) {
          const addr = data.address;
          formattedAddress = [
            addr.road || addr.name,
            addr.suburb || addr.district,
            addr.city || addr.town || addr.village,
            addr.state || addr.region,
            addr.country,
          ].filter(Boolean).join(', ');
          city = addr.city || addr.town || addr.village || '';
          country = addr.country || '';
        } else {
          formattedAddress = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
        }
        
        setLocation({
          latitude,
          longitude,
          location_address: formattedAddress,
          location_city: city,
          location_country: country,
        });
        
        alert('Location set successfully');
      } catch (err) {
        setLocation({
          latitude,
          longitude,
          location_address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
          location_city: '',
          location_country: '',
        });
        alert('Location set with coordinates only');
      }
      return true;
    } catch (err: any) {
      console.error('Location error:', err);
      let errorMessage = 'Unable to get your location. ';
      if (err.code === 1) {
        errorMessage += 'Please allow location access in your browser settings.';
      } else if (err.code === 2) {
        errorMessage += 'Location unavailable. Please check your GPS or try again.';
      } else if (err.code === 3) {
        errorMessage += 'Location request timed out. Please try again.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      alert(errorMessage);
      return false;
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  // Handle map location selection
  const handleMapLocationSelect = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      let formattedAddress = '';
      let city = '';
      let country = '';
      
      if (data && data.address) {
        const addr = data.address;
        formattedAddress = [
          addr.road || addr.name,
          addr.suburb || addr.district,
          addr.city || addr.town || addr.village,
          addr.state || addr.region,
          addr.country,
        ].filter(Boolean).join(', ');
        city = addr.city || addr.town || addr.village || '';
        country = addr.country || '';
      } else {
        formattedAddress = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      }
      
      setLocation({
        latitude: lat,
        longitude: lng,
        location_address: formattedAddress,
        location_city: city,
        location_country: country,
      });
      setShowMapModal(false);
      alert('Location saved');
    } catch (error) {
      console.error('Reverse geocode error:', error);
      alert('Unable to get address for selected location');
    }
  }, []);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation({
      latitude: null,
      longitude: null,
      location_address: '',
      location_city: '',
      location_country: '',
    });
  }, []);

  // Select request
  const selectRequest = useCallback((request: CustomerRequest) => {
    setSelectedRequest(request);
    setRequestCode(request.request_code);
    setPreviousStatus(request.request_status);
    
    if (request.service_appointment) {
      setAppointmentCode(request.service_appointment.appointment_code);
      setAppointmentDetails({
        appointment_code: request.service_appointment.appointment_code,
        appointment_status: request.service_appointment.appointment_status,
        appointment_date: request.service_appointment.appointment_date,
        appointment_time: request.service_appointment.appointment_time,
        appointment_service: request.service_appointment.appointment_service,
        agreed_price: request.service_appointment.agreed_price,
        workshop_name: request.service_appointment.service_workshop?.workshop_name,
        workshop_phone: request.service_appointment.service_workshop?.workshop_phone,
      });
    } else {
      setAppointmentCode('');
      setAppointmentDetails(null);
    }
    setShowRequestSelector(false);
  }, []);

  // Reset selection
  const resetSelection = useCallback(() => {
    setSelectedRequest(null);
    setRequestCode('');
    setAppointmentCode('');
    setAppointmentDetails(null);
    setPreviousStatus('');
  }, []);

  // Submit approval
  const submitApproval = useCallback(async () => {
    if (!updatedBy.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!selectedRequest) {
      alert('Please select a customer request');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const submittedRecord: ApproveRecord = {
        id: Date.now(),
        updated_by: updatedBy.trim(),
        phone_number: phoneNumber.trim(),
        request_code: requestCode,
        previous_status: previousStatus || null,
        new_status: newStatus || null,
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location_address: location.location_address || '',
        location_city: location.location_city || '',
        location_country: location.location_country || '',
        latitude: location.latitude || undefined,
        longitude: location.longitude || undefined,
      };

      setLastSubmitted(submittedRecord);
      setShowSuccessModal(true);
      await fetchApprovals();
      resetSelection();
      setNewStatus('');
      setNotes('');
      clearLocation();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit approval');
    } finally {
      setLoading(false);
    }
  }, [updatedBy, phoneNumber, selectedRequest, requestCode, previousStatus, newStatus, notes, location, fetchApprovals, resetSelection, clearLocation]);

  // Reset form
  const resetForm = useCallback(() => {
    setUpdatedBy(getUserFullName());
    setPhoneNumber(getUserPhone());
    resetSelection();
    setNewStatus('');
    setNotes('');
    setEditMode(false);
    clearLocation();
  }, [getUserFullName, getUserPhone, resetSelection, clearLocation]);

  // Delete approval
  const deleteApproval = useCallback(async (id: number, name: string) => {
    const currentUserName = getUserFullName();
    if (name !== currentUserName) {
      alert('You can only delete your own approvals');
      return;
    }
    
    if (window.confirm('Delete your approval?')) {
      setAllApprovals(prev => prev.filter(item => item.id !== id));
      setMyApprovals(prev => prev.filter(item => item.id !== id));
      alert('Approval record removed');
    }
  }, [getUserFullName]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const colorsMap: Record<string, string> = {
      scheduled: '#f59e0b',
      confirmed: '#0891b2',
      in_progress: '#6366f1',
      completed: '#10b981',
      cancelled: '#ef4444',
      awaiting: '#f59e0b',
    };
    return colorsMap[status] || '#f59e0b';
  };

  // Render map modal
  const renderMapModal = () => {
    if (!showMapModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Your Location</h3>
            <button
              onClick={() => setShowMapModal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-80 relative">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Click on the map to select location</p>
                  <p className="text-xs text-gray-400">Or use the "Get Current Location" button</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Locate className="w-5 h-5" />
                    Use My Location
                  </>
                )}
              </button>
              <button
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                onClick={() => {
                  // Simulate selecting a location
                  const lat = -6.7924 + (Math.random() - 0.5) * 0.01;
                  const lng = 39.2083 + (Math.random() - 0.5) * 0.01;
                  handleMapLocationSelect(lat, lng);
                }}
              >
                Select Current Location
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render location section
  const renderLocationSection = () => (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
        <MapPinIcon className="w-4 h-4" />
        Approval Location
      </label>
      
      <div className="flex gap-3 mb-3">
        <button
          className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Locate className="w-4 h-4" />
              Use My Location
            </>
          )}
        </button>
        <button
          className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          onClick={() => setShowMapModal(true)}
        >
          <Map className="w-4 h-4" />
          Choose on Map
        </button>
      </div>

      {location.location_address ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-green-700 dark:text-green-400">Selected Location</span>
            </div>
            <button onClick={clearLocation} className="text-red-500 hover:text-red-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-900 dark:text-white">{location.location_address}</p>
          {location.location_city && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              📍 {location.location_city}, {location.location_country}
            </p>
          )}
          {location.latitude && location.longitude && (
            <p className="text-xs text-gray-400 mt-1">
              📌 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Add your approval location</p>
          <p className="text-xs text-gray-400">This helps track where you approved the request</p>
        </div>
      )}
    </div>
  );

  // Render request selector modal
  const renderRequestSelector = () => {
    if (!showRequestSelector) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Request</h3>
            <button
              onClick={() => setShowRequestSelector(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh] p-4">
            {customerRequests.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No requests found</p>
              </div>
            ) : (
              customerRequests.map((req) => (
                <button
                  key={req.id}
                  className="w-full text-left bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700 hover:border-cyan-500 transition-colors"
                  onClick={() => selectRequest(req)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono font-bold text-cyan-500">{req.request_code}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: getStatusColor(req.request_status) + '20', color: getStatusColor(req.request_status) }}
                    >
                      {req.request_status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{req.requested_service}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    👤 {req.customer_info?.first_name} {req.customer_info?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🚗 {req.vehicle_brand} {req.vehicle_model}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render success modal
  const renderSuccessModal = () => {
    if (!showSuccessModal || !lastSubmitted) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Approval Submitted!</h2>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-400">Submitted by:</p>
            <p className="font-semibold text-cyan-500">{lastSubmitted.updated_by}</p>
            {lastSubmitted.request_code && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">📋 {lastSubmitted.request_code}</p>
            )}
            {lastSubmitted.location_address && (
              <p className="text-xs text-gray-500 dark:text-gray-400">📍 {lastSubmitted.location_address.substring(0, 40)}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
              onClick={() => { setShowSuccessModal(false); resetForm(); }}
            >
              New Approval
            </button>
            <button
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render header
  const renderHeader = () => (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-500" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Approval Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Record your approval location</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={() => { fetchApprovals(); fetchCustomerRequests(); }}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-cyan-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render form section
  const renderFormSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
          <PersonAdd className="w-5 h-5 text-cyan-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">New Approval</h2>
        {editMode && (
          <button
            onClick={resetForm}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Full Name */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Full Name</label>
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4">
          <User className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="flex-1 py-3 px-3 bg-transparent outline-none text-gray-900 dark:text-white"
            placeholder="Your full name"
            value={updatedBy}
            onChange={(e) => setUpdatedBy(e.target.value)}
            readOnly={!editMode}
          />
          <button onClick={() => setEditMode(true)} className="text-cyan-500 hover:text-cyan-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Phone Number</label>
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4">
          <Phone className="w-5 h-5 text-gray-400" />
          <input
            type="tel"
            className="flex-1 py-3 px-3 bg-transparent outline-none text-gray-900 dark:text-white"
            placeholder="Your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            readOnly={!editMode}
          />
        </div>
      </div>

      {/* Customer Request */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Customer Request</label>
        {selectedRequest ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono font-bold text-cyan-500">{selectedRequest.request_code}</span>
              <button onClick={resetSelection} className="text-red-500 hover:text-red-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRequest.requested_service}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">👤 {selectedRequest.customer_info?.first_name} {selectedRequest.customer_info?.last_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">🚗 {selectedRequest.vehicle_brand} {selectedRequest.vehicle_model}</p>
          </div>
        ) : (
          <button
            className="w-full flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4 py-3 hover:border-cyan-500 transition-colors"
            onClick={() => setShowRequestSelector(true)}
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">Select a request</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {selectedRequest && (
        <>
          {/* New Status */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">New Status (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="e.g., confirmed, completed"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Notes (Optional)</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none min-h-[80px]"
              placeholder="Add notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Location Section */}
          {renderLocationSection()}
        </>
      )}

      {/* Submit Button */}
      <button
        className={`w-full py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
          selectedRequest
            ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={submitApproval}
        disabled={loading || !selectedRequest}
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <SendHorizontal className="w-5 h-5" />
            Submit Approval
          </>
        )}
      </button>
    </div>
  );

  // Render recent approvals
  const renderRecentApprovals = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <ClockIcon className="w-5 h-5 text-cyan-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex-1">My Approvals</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">({myApprovals.length})</span>
      </div>

      {myApprovals.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No approvals yet</p>
          <p className="text-xs text-gray-400">Your approvals will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {myApprovals.slice().reverse().map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.updated_by}</p>
                {item.request_code && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">📋 {item.request_code}</p>
                )}
                {item.location_address && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">📍 {item.location_address.substring(0, 35)}</p>
                )}
                <p className="text-xs text-gray-400">{formatDate(item.created_at)}</p>
              </div>
              <button
                onClick={() => deleteApproval(item.id, item.updated_by)}
                className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {renderHeader()}
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {renderFormSection()}
        <div className="h-4" />
        {renderRecentApprovals()}
      </div>

      {renderRequestSelector()}
      {renderMapModal()}
      {renderSuccessModal()}
    </div>
  );
};

export default ApprovePage;