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
  Save
} from 'lucide-react';

// Types
interface PublicRequest {
  id: number;
  request_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  requested_service: string;
  request_description: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  license_plate: string;
  vehicle_details: string;
  service_location: string;
  location_maps_link: string;
  location_latitude: string;
  location_longitude: string;
  preferred_service_date: string;
  preferred_service_time: string;
  formatted_date: string;
  formatted_time: string;
  request_urgency: string;
  urgency_display: string;
  is_urgent_request: boolean;
  budget_minimum: string;
  budget_maximum: string;
  is_budget_flexible: boolean;
  request_status: string;
  request_status_display: string;
  customer_notes: string;
  request_created: string;
  request_updated: string;
  approved_by?: string | null;
  approved_at?: string | null;
  fixed_by?: string | null;
  fixed_at?: string | null;
  updated_by?: string | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Mock user data
const mockUser = {
  full_name: 'Admin User',
  mobile_number: '+255 712 345 678',
  email: 'admin@example.com',
  role: 'admin'
};

const AdminRequestsScreen: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [requests, setRequests] = useState<PublicRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PublicRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PublicRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [editStatus, setEditStatus] = useState('pending');

  // Mock user
  const user = mockUser;

  // Colors
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
    purple: '#8b5cf6',
    indigo: '#6366f1',
    green: '#22c55e',
    cyan: '#06b6d4',
  };

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All', icon: <FileText className="w-3.5 h-3.5" />, color: colors.text },
    { value: 'pending', label: 'Pending', icon: <ClockIcon className="w-3.5 h-3.5" />, color: colors.warning },
    { value: 'viewed', label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" />, color: colors.cyan },
    { value: 'offers_received', label: 'Offers', icon: <DollarSign className="w-3.5 h-3.5" />, color: colors.purple },
    { value: 'accepted', label: 'Accepted', icon: <CheckCircle className="w-3.5 h-3.5" />, color: colors.success },
    { value: 'in_progress', label: 'In Progress', icon: <Loader className="w-3.5 h-3.5" />, color: colors.indigo },
    { value: 'completed', label: 'Completed', icon: <Check className="w-3.5 h-3.5" />, color: colors.green },
    { value: 'cancelled', label: 'Cancelled', icon: <X className="w-3.5 h-3.5" />, color: colors.error },
    { value: 'expired', label: 'Expired', icon: <AlertCircle className="w-3.5 h-3.5" />, color: colors.textSecondary },
  ];

  // Mock data
  const mockRequests: PublicRequest[] = [
    {
      id: 1,
      request_code: 'SR-2024-A1B2C3',
      customer_name: 'John Doe',
      customer_phone: '+255 712 345 678',
      customer_email: 'john@example.com',
      requested_service: 'Engine Diagnostics',
      request_description: 'Check engine light is on. Car is shaking while idling.',
      vehicle_brand: 'Toyota',
      vehicle_model: 'Corolla',
      vehicle_year: '2020',
      vehicle_color: 'Silver',
      license_plate: 'T123ABC',
      vehicle_details: 'Toyota Corolla 2020 - Silver',
      service_location: 'Dar es Salaam, Tanzania',
      location_maps_link: 'https://www.google.com/maps?q=-6.7924,39.2083',
      location_latitude: '-6.7924',
      location_longitude: '39.2083',
      preferred_service_date: new Date().toISOString(),
      preferred_service_time: '10:00',
      formatted_date: 'Jul 20, 2024',
      formatted_time: '10:00 AM',
      request_urgency: 'standard',
      urgency_display: 'Standard',
      is_urgent_request: false,
      budget_minimum: '50000',
      budget_maximum: '150000',
      is_budget_flexible: true,
      request_status: 'pending',
      request_status_display: 'Pending',
      customer_notes: 'Please call before coming',
      request_created: new Date().toISOString(),
      request_updated: new Date().toISOString(),
      approved_by: null,
      approved_at: null,
      fixed_by: null,
      fixed_at: null,
      updated_by: null,
    },
    {
      id: 2,
      request_code: 'SR-2024-D4E5F6',
      customer_name: 'Jane Smith',
      customer_phone: '+255 713 456 789',
      customer_email: 'jane@example.com',
      requested_service: 'Brake System Repair',
      request_description: 'Squeaking noise when braking. Need brake pads replaced.',
      vehicle_brand: 'Honda',
      vehicle_model: 'Civic',
      vehicle_year: '2019',
      vehicle_color: 'Blue',
      license_plate: 'T456DEF',
      vehicle_details: 'Honda Civic 2019 - Blue',
      service_location: 'Arusha, Tanzania',
      location_maps_link: null,
      location_latitude: '-3.3869',
      location_longitude: '36.6830',
      preferred_service_date: new Date().toISOString(),
      preferred_service_time: '14:30',
      formatted_date: 'Jul 21, 2024',
      formatted_time: '2:30 PM',
      request_urgency: 'priority',
      urgency_display: 'Priority',
      is_urgent_request: true,
      budget_minimum: '80000',
      budget_maximum: '200000',
      is_budget_flexible: true,
      request_status: 'accepted',
      request_status_display: 'Accepted',
      customer_notes: null,
      request_created: new Date().toISOString(),
      request_updated: new Date().toISOString(),
      approved_by: 'Admin User',
      approved_at: new Date().toISOString(),
      fixed_by: null,
      fixed_at: null,
      updated_by: 'Admin User',
    },
    {
      id: 3,
      request_code: 'SR-2024-G7H8I9',
      customer_name: 'Bob Johnson',
      customer_phone: '+255 714 567 890',
      customer_email: 'bob@example.com',
      requested_service: 'Oil Change Service',
      request_description: 'Regular oil change and filter replacement.',
      vehicle_brand: 'BMW',
      vehicle_model: 'X5',
      vehicle_year: '2022',
      vehicle_color: 'Black',
      license_plate: 'T789GHI',
      vehicle_details: 'BMW X5 2022 - Black',
      service_location: 'Mwanza, Tanzania',
      location_maps_link: null,
      location_latitude: '-2.5164',
      location_longitude: '32.9175',
      preferred_service_date: new Date().toISOString(),
      preferred_service_time: '09:00',
      formatted_date: 'Jul 22, 2024',
      formatted_time: '9:00 AM',
      request_urgency: 'standard',
      urgency_display: 'Standard',
      is_urgent_request: false,
      budget_minimum: '30000',
      budget_maximum: '100000',
      is_budget_flexible: true,
      request_status: 'in_progress',
      request_status_display: 'In Progress',
      customer_notes: 'Use synthetic oil',
      request_created: new Date().toISOString(),
      request_updated: new Date().toISOString(),
      approved_by: 'Admin User',
      approved_at: new Date().toISOString(),
      fixed_by: 'Mechanic User',
      fixed_at: new Date().toISOString(),
      updated_by: 'Mechanic User',
    },
    {
      id: 4,
      request_code: 'SR-2024-J0K1L2',
      customer_name: 'Alice Williams',
      customer_phone: '+255 715 678 901',
      customer_email: 'alice@example.com',
      requested_service: 'AC Repair Service',
      request_description: 'AC is blowing warm air. Needs refrigerant recharge.',
      vehicle_brand: 'Mercedes',
      vehicle_model: 'C-Class',
      vehicle_year: '2021',
      vehicle_color: 'White',
      license_plate: 'T012JKL',
      vehicle_details: 'Mercedes C-Class 2021 - White',
      service_location: 'Dodoma, Tanzania',
      location_maps_link: null,
      location_latitude: '-6.1629',
      location_longitude: '35.7516',
      preferred_service_date: new Date().toISOString(),
      preferred_service_time: '16:00',
      formatted_date: 'Jul 23, 2024',
      formatted_time: '4:00 PM',
      request_urgency: 'emergency',
      urgency_display: 'Emergency',
      is_urgent_request: true,
      budget_minimum: '100000',
      budget_maximum: '250000',
      is_budget_flexible: false,
      request_status: 'completed',
      request_status_display: 'Completed',
      customer_notes: null,
      request_created: new Date().toISOString(),
      request_updated: new Date().toISOString(),
      approved_by: 'Admin User',
      approved_at: new Date().toISOString(),
      fixed_by: 'Mechanic User',
      fixed_at: new Date().toISOString(),
      updated_by: 'Mechanic User',
    },
  ];

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showNotification('error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage(null);
    }, 3000);
  };

  // Format currency
  const formatCurrency = (amount: string | null): string => {
    if (!amount || amount === '0.00' || amount === '0') return 'TZS 0';
    return `TZS ${new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 0 }).format(parseFloat(amount))}`;
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const map: Record<string, string> = {
      pending: colors.warning,
      viewed: colors.cyan,
      offers_received: colors.purple,
      accepted: colors.success,
      in_progress: colors.indigo,
      completed: colors.green,
      cancelled: colors.error,
      expired: colors.textSecondary,
    };
    return map[status] || colors.warning;
  };

  // Get urgency color
  const getUrgencyColor = (urgency: string): string => {
    const map: Record<string, string> = {
      standard: colors.textSecondary,
      priority: colors.warning,
      emergency: colors.error,
    };
    return map[urgency] || colors.textSecondary;
  };

  // Format status
  const formatStatus = (status: string): string => {
    const map: Record<string, string> = {
      pending: 'Pending',
      viewed: 'Viewed',
      offers_received: 'Offers Received',
      accepted: 'Accepted',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      expired: 'Expired',
    };
    return map[status] || status;
  };

  // Format date time
  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Count by status
  const countByStatus = (status: string): number => {
    if (status === 'all') return requests.length;
    return requests.filter(r => r.request_status === status).length;
  };

  // Make phone call
  const makePhoneCall = (phoneNumber: string) => {
    if (!phoneNumber) {
      alert('No phone number available');
      return;
    }
    let cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    window.location.href = `tel:${cleanNumber}`;
  };

  // Update request status
  const updateRequestStatus = (requestId: number, newStatus: string) => {
    if (window.confirm(`Change status to "${formatStatus(newStatus)}"?`)) {
      setUpdatingRequest(requestId);
      
      setTimeout(() => {
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                request_status: newStatus,
                request_status_display: formatStatus(newStatus),
                updated_by: user.full_name || 'Admin User',
                request_updated: new Date().toISOString()
              }
            : req
        ));
        showNotification('success', `Status updated to ${formatStatus(newStatus)}`);
        setUpdatingRequest(null);
      }, 500);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  // Handle view details
  const handleViewDetails = (request: PublicRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Handle edit
  const handleEdit = (request: PublicRequest) => {
    setSelectedRequest(request);
    setEditStatus(request.request_status);
    setShowEditModal(true);
  };

  // Handle update full request
  const updateFullRequest = () => {
    if (!selectedRequest) return;
    
    setUpdatingRequest(selectedRequest.id);
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              request_status: editStatus,
              request_status_display: formatStatus(editStatus),
              updated_by: user.full_name || 'Admin User',
              request_updated: new Date().toISOString()
            }
          : req
      ));
      showNotification('success', 'Request updated successfully!');
      setShowEditModal(false);
      setShowModal(false);
      setUpdatingRequest(null);
    }, 500);
  };

  // Handle delete
  const handleDelete = (request: PublicRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!selectedRequest) return;
    
    setUpdatingRequest(selectedRequest.id);
    setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      showNotification('success', 'Request deleted successfully!');
      setShowDeleteModal(false);
      setShowModal(false);
      setSelectedRequest(null);
      setUpdatingRequest(null);
    }, 500);
  };

  // Filter requests
  const filtered = useMemo(() => {
    let filtered = [...requests];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.request_status === statusFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.customer_name.toLowerCase().includes(query) ||
        r.customer_phone.includes(query) ||
        r.requested_service.toLowerCase().includes(query) ||
        r.request_code.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [requests, searchQuery, statusFilter]);

  // Get coordinates from request
  const getCoordinates = (request: PublicRequest): UserLocation | null => {
    if (request.location_latitude && request.location_longitude) {
      const lat = parseFloat(request.location_latitude);
      const lng = parseFloat(request.location_longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
    if (request.location_maps_link) {
      const match = request.location_maps_link.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
    }
    return null;
  };

  // Open map modal
  const openMapModal = (request: PublicRequest) => {
    setSelectedRequest(request);
    setShowMapModal(true);
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading service requests...</p>
        </div>
      </div>
    );
  }

  // Render notification
  const renderNotification = () => {
    if (!showMessage || !message) return null;
    
    const bgColors = {
      success: isDark ? 'bg-green-900/20' : 'bg-green-50',
      error: isDark ? 'bg-red-900/20' : 'bg-red-50',
      info: isDark ? 'bg-cyan-900/20' : 'bg-cyan-50',
    };
    
    const textColors = {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      info: 'text-cyan-600 dark:text-cyan-400',
    };
    
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      error: <AlertCircle className="w-5 h-5 text-red-500" />,
      info: <Info className="w-5 h-5 text-cyan-500" />,
    };

    return (
      <div className={`fixed top-4 left-4 right-4 z-50 ${bgColors[message.type]} border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg flex items-center gap-3`}>
        {icons[message.type]}
        <span className={`text-sm font-medium ${textColors[message.type]}`}>{message.text}</span>
      </div>
    );
  };

  // Render request card
  const renderRequestCard = (request: PublicRequest) => {
    const statusColor = getStatusColor(request.request_status);
    const urgencyColor = getUrgencyColor(request.request_urgency);
    const hasLocation = !!(request.location_latitude || request.location_maps_link);
    const budgetRange = formatCurrency(request.budget_minimum) + ' - ' + formatCurrency(request.budget_maximum);
    const isUpdating = updatingRequest === request.id;

    return (
      <div
        key={request.id}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow mb-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: statusColor + '20', color: statusColor }}
            >
              {formatStatus(request.request_status)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">#{request.request_code}</span>
          </div>
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: urgencyColor + '20', color: urgencyColor }}>
            <AlertTriangle className="w-3 h-3" />
            {request.urgency_display}
          </div>
        </div>

        {/* Service Name */}
        <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">{request.requested_service}</p>

        {/* Customer - BOLDED */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <User className="w-3.5 h-3.5 text-cyan-500" />
          <button
            onClick={() => makePhoneCall(request.customer_phone)}
            className="text-sm font-bold text-cyan-500 hover:underline"
          >
            {request.customer_name}
          </button>
          <Phone className="w-3.5 h-3.5 text-cyan-500 ml-2" />
          <button
            onClick={() => makePhoneCall(request.customer_phone)}
            className="text-sm font-bold text-cyan-500 hover:underline"
          >
            {request.customer_phone}
          </button>
        </div>

        {/* Vehicle Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{request.vehicle_details}</p>

        {/* Budget */}
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-xs font-semibold text-cyan-500">{budgetRange}</span>
          {request.is_budget_flexible && (
            <span className="text-[10px] bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">Flexible</span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 mb-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{request.formatted_date} at {request.formatted_time}</span>
        </div>

        {/* Location */}
        {request.service_location && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{request.service_location}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => updateRequestStatus(request.id, 'accepted')}
            disabled={isUpdating}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => updateRequestStatus(request.id, 'in_progress')}
            disabled={isUpdating}
          >
            <Loader className="w-3.5 h-3.5" />
            Start
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => updateRequestStatus(request.id, 'completed')}
            disabled={isUpdating}
          >
            <Check className="w-3.5 h-3.5" />
            Complete
          </button>
          {hasLocation && (
            <button
              className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors"
              onClick={() => openMapModal(request)}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification */}
      {renderNotification()}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-500" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Service Requests</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{filtered.length} requests found</p>
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
                onClick={handleRefresh}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-cyan-500" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="Search by name, phone, service..."
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === option.value
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setStatusFilter(option.value)}
            >
              {option.icon}
              {option.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                statusFilter === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {countByStatus(option.value)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="max-w-7xl mx-auto px-4 py-4 pb-32">
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Service Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customer requests will appear here</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Requests Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'No requests match the current filter'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((request) => renderRequestCard(request))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: getStatusColor(selectedRequest.request_status) + '20', color: getStatusColor(selectedRequest.request_status) }}
                    >
                      {formatStatus(selectedRequest.request_status)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">#{selectedRequest.request_code}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Customer Information */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                    <button onClick={() => makePhoneCall(selectedRequest.customer_phone)}>
                      <span className="text-sm font-bold text-cyan-500">{selectedRequest.customer_name}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                    <button onClick={() => makePhoneCall(selectedRequest.customer_phone)}>
                      <span className="text-sm font-bold text-cyan-500">{selectedRequest.customer_phone}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.customer_email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Details</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Service:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.requested_service}</span>
                  </div>
                  {selectedRequest.request_description && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">{selectedRequest.request_description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vehicle Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Vehicle:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.vehicle_details}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Plate:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.license_plate}</span>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Budget</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Range:</span>
                    <span className="text-sm font-bold text-green-500">
                      {formatCurrency(selectedRequest.budget_minimum)} - {formatCurrency(selectedRequest.budget_maximum)}
                    </span>
                  </div>
                  {selectedRequest.is_budget_flexible && (
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Flexible:</span>
                      <span className="text-sm text-yellow-500">Yes, negotiable</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.formatted_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Time:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.formatted_time}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              {selectedRequest.service_location && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedRequest.service_location}</span>
                    </div>
                    {(selectedRequest.location_latitude || selectedRequest.location_maps_link) && (
                      <button
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        onClick={() => { setShowModal(false); openMapModal(selectedRequest); }}
                      >
                        <Map className="w-4 h-4" />
                        View on Map
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Assignment Info */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assignment Info</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  {selectedRequest.fixed_by && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fixed By:</span>
                      <span className="text-sm font-bold text-purple-500">{selectedRequest.fixed_by}</span>
                    </div>
                  )}
                  {selectedRequest.fixed_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fixed At:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(selectedRequest.fixed_at)}</span>
                    </div>
                  )}
                  {selectedRequest.approved_by && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Approved By:</span>
                      <span className="text-sm font-bold text-green-500">{selectedRequest.approved_by}</span>
                    </div>
                  )}
                  {selectedRequest.approved_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Approved At:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(selectedRequest.approved_at)}</span>
                    </div>
                  )}
                  {selectedRequest.updated_by && (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated By:</span>
                      <span className="text-sm font-bold text-cyan-500">{selectedRequest.updated_by}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(selectedRequest.request_updated)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedRequest.customer_notes && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.customer_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Request</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.filter(opt => opt.value !== 'all').map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                      editStatus === option.value
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setEditStatus(option.value)}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-2 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={updateFullRequest}
                disabled={updatingRequest !== null}
              >
                {updatingRequest !== null ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Request</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Delete #{selectedRequest.request_code} from {selectedRequest.customer_name}? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Customer Location</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">#{selectedRequest.request_code}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const coords = getCoordinates(selectedRequest);
                  if (coords) {
                    window.open(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`, '_blank');
                  }
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Open in Google Maps
              </button>
            </div>

            <div className="p-5">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <button onClick={() => makePhoneCall(selectedRequest.customer_phone)}>
                      <p className="text-sm font-bold text-cyan-500">{selectedRequest.customer_name} • {selectedRequest.customer_phone}</p>
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRequest.service_location || 'Location not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-80 relative">
                {(() => {
                  const coords = getCoordinates(selectedRequest);
                  if (coords) {
                    return (
                      <iframe
                        src={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&output=embed`}
                        className="w-full h-full"
                        allowFullScreen
                        loading="lazy"
                        title="Location Map"
                      />
                    );
                  } else {
                    return (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">No location data available</p>
                          <p className="text-xs text-gray-400">This request doesn't have coordinates</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              <button
                onClick={() => setShowMapModal(false)}
                className="w-full mt-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequestsScreen;