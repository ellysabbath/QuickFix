import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  Wrench,
  AlertCircle,
  CheckCircle,
  Loader,
  Plus,
  Info,
  Navigation,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  DollarSign,
  Map,
  RefreshCw,
  Sun,
  Moon,
  Filter,
  Calendar,
  EyeOff,
  Save,
  Menu,
  FileText,
  Clock as ClockIcon,
  AlertTriangle
} from 'lucide-react';

// Types
interface ServiceRequest {
  id: number;
  request_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  requested_service: string;
  request_description: string | null;
  vehicle_brand: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  vehicle_color: string | null;
  license_plate: string | null;
  service_location: string;
  location_maps_link: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  preferred_service_date: string;
  preferred_service_time: string;
  is_urgent_request: boolean;
  request_urgency: 'standard' | 'priority' | 'emergency';
  budget_minimum: number | null;
  budget_maximum: number | null;
  is_budget_flexible: boolean;
  request_status: 'pending' | 'processing' | 'completed' | 'cancelled';
  customer_notes: string | null;
  request_created: string;
  request_updated: string;
}

interface CreateRequestData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  requested_service: string;
  request_description?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_color?: string;
  license_plate?: string;
  service_location: string;
  location_maps_link?: string;
  location_latitude?: number;
  location_longitude?: number;
  preferred_service_date: string;
  preferred_service_time: string;
  request_urgency: 'standard' | 'priority' | 'emergency';
  budget_maximum?: number;
  is_budget_flexible?: boolean;
  customer_notes?: string;
}

// Mock user data
const mockUser = {
  full_name: 'John Doe',
  mobile_number: '+255 712 345 678',
  email: 'john@example.com',
  role: 'customer'
};

const API_BASE_URL = 'https://autofix.pythonanywhere.com/api';

const CRUDScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState<Partial<ServiceRequest>>({});
  const [budgetForm, setBudgetForm] = useState({ budget_maximum: '', is_budget_flexible: true });
  const [createForm, setCreateForm] = useState<CreateRequestData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    requested_service: '',
    request_description: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_color: '',
    license_plate: '',
    service_location: '',
    location_maps_link: '',
    preferred_service_date: new Date().toISOString().split('T')[0],
    preferred_service_time: '09:00',
    request_urgency: 'standard',
    budget_maximum: undefined,
    is_budget_flexible: true,
    customer_notes: '',
  });
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  // Mock user data
  const user = mockUser;
  const isAuthenticated = true;
  const userFullName = user.full_name;

  // Fetch all requests
  const fetchAllRequests = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockRequests: ServiceRequest[] = [
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
          service_location: 'Dar es Salaam, Tanzania',
          location_maps_link: 'https://www.google.com/maps?q=-6.7924,39.2083',
          location_latitude: -6.7924,
          location_longitude: 39.2083,
          preferred_service_date: new Date().toISOString(),
          preferred_service_time: '10:00',
          is_urgent_request: false,
          request_urgency: 'standard',
          budget_minimum: 0,
          budget_maximum: 150000,
          is_budget_flexible: true,
          request_status: 'pending',
          customer_notes: 'Please call before coming',
          request_created: new Date().toISOString(),
          request_updated: new Date().toISOString(),
        },
        {
          id: 2,
          request_code: 'SR-2024-D4E5F6',
          customer_name: 'John Doe',
          customer_phone: '+255 712 345 678',
          customer_email: 'john@example.com',
          requested_service: 'Brake System Repair',
          request_description: 'Squeaking noise when braking. Need brake pads replaced.',
          vehicle_brand: 'Honda',
          vehicle_model: 'Civic',
          vehicle_year: '2019',
          vehicle_color: 'Blue',
          license_plate: 'T456DEF',
          service_location: 'Arusha, Tanzania',
          location_maps_link: null,
          location_latitude: null,
          location_longitude: null,
          preferred_service_date: new Date().toISOString(),
          preferred_service_time: '14:30',
          is_urgent_request: true,
          request_urgency: 'priority',
          budget_minimum: 0,
          budget_maximum: 200000,
          is_budget_flexible: true,
          request_status: 'processing',
          customer_notes: null,
          request_created: new Date().toISOString(),
          request_updated: new Date().toISOString(),
        },
        {
          id: 3,
          request_code: 'SR-2024-G7H8I9',
          customer_name: 'John Doe',
          customer_phone: '+255 712 345 678',
          customer_email: 'john@example.com',
          requested_service: 'Oil Change Service',
          request_description: 'Regular oil change and filter replacement.',
          vehicle_brand: 'BMW',
          vehicle_model: 'X5',
          vehicle_year: '2022',
          vehicle_color: 'Black',
          license_plate: 'T789GHI',
          service_location: 'Mwanza, Tanzania',
          location_maps_link: null,
          location_latitude: null,
          location_longitude: null,
          preferred_service_date: new Date().toISOString(),
          preferred_service_time: '09:00',
          is_urgent_request: false,
          request_urgency: 'standard',
          budget_minimum: 0,
          budget_maximum: 100000,
          is_budget_flexible: true,
          request_status: 'completed',
          customer_notes: 'Use synthetic oil',
          request_created: new Date().toISOString(),
          request_updated: new Date().toISOString(),
        },
        {
          id: 4,
          request_code: 'SR-2024-J0K1L2',
          customer_name: 'John Doe',
          customer_phone: '+255 712 345 678',
          customer_email: 'john@example.com',
          requested_service: 'AC Repair Service',
          request_description: 'AC is blowing warm air. Needs refrigerant recharge.',
          vehicle_brand: 'Mercedes',
          vehicle_model: 'C-Class',
          vehicle_year: '2021',
          vehicle_color: 'White',
          license_plate: 'T012JKL',
          service_location: 'Dodoma, Tanzania',
          location_maps_link: null,
          location_latitude: null,
          location_longitude: null,
          preferred_service_date: new Date().toISOString(),
          preferred_service_time: '16:00',
          is_urgent_request: true,
          request_urgency: 'emergency',
          budget_minimum: 0,
          budget_maximum: 250000,
          is_budget_flexible: true,
          request_status: 'cancelled',
          customer_notes: null,
          request_created: new Date().toISOString(),
          request_updated: new Date().toISOString(),
        },
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setApiError('Failed to load your requests. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllRequests();
  }, [fetchAllRequests]);

  // Handle create request
  const handleCreateRequest = async () => {
    if (!createForm.customer_name.trim()) {
      setApiError('Customer name is required');
      return;
    }
    if (!createForm.customer_phone.trim()) {
      setApiError('Phone number is required');
      return;
    }
    if (!createForm.requested_service.trim()) {
      setApiError('Service is required');
      return;
    }
    if (!createForm.service_location.trim()) {
      setApiError('Service location is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRequest: ServiceRequest = {
        id: Date.now(),
        request_code: 'SR-2024-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        customer_name: createForm.customer_name.trim(),
        customer_phone: createForm.customer_phone.trim(),
        customer_email: createForm.customer_email || null,
        requested_service: createForm.requested_service.trim(),
        request_description: createForm.request_description || null,
        vehicle_brand: createForm.vehicle_brand || null,
        vehicle_model: createForm.vehicle_model || null,
        vehicle_year: createForm.vehicle_year || null,
        vehicle_color: createForm.vehicle_color || null,
        license_plate: createForm.license_plate || null,
        service_location: createForm.service_location.trim(),
        location_maps_link: createForm.location_maps_link || null,
        location_latitude: createForm.location_latitude || null,
        location_longitude: createForm.location_longitude || null,
        preferred_service_date: createForm.preferred_service_date,
        preferred_service_time: createForm.preferred_service_time,
        is_urgent_request: createForm.request_urgency !== 'standard',
        request_urgency: createForm.request_urgency,
        budget_minimum: 0,
        budget_maximum: createForm.budget_maximum || null,
        is_budget_flexible: createForm.is_budget_flexible || true,
        request_status: 'pending',
        customer_notes: createForm.customer_notes || null,
        request_created: new Date().toISOString(),
        request_updated: new Date().toISOString(),
      };

      setRequests(prev => [newRequest, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        requested_service: '',
        request_description: '',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: '',
        vehicle_color: '',
        license_plate: '',
        service_location: '',
        location_maps_link: '',
        preferred_service_date: new Date().toISOString().split('T')[0],
        preferred_service_time: '09:00',
        request_urgency: 'standard',
        budget_maximum: undefined,
        is_budget_flexible: true,
        customer_notes: '',
      });
    } catch (error) {
      setApiError('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update budget
  const handleUpdateBudget = async () => {
    if (!selectedRequest) return;
    
    try {
      setIsSubmitting(true);
      setApiError(null);

      await new Promise(resolve => setTimeout(resolve, 800));

      const maxBudget = budgetForm.budget_maximum ? parseFloat(budgetForm.budget_maximum) : null;

      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              budget_maximum: maxBudget,
              is_budget_flexible: budgetForm.is_budget_flexible 
            }
          : req
      ));

      setShowBudgetModal(false);
      setShowViewModal(false);
    } catch (error) {
      setApiError('Failed to update budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update request
  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      setIsSubmitting(true);
      setApiError(null);

      await new Promise(resolve => setTimeout(resolve, 800));

      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, ...editForm }
          : req
      ));

      setShowEditModal(false);
      setShowViewModal(false);
    } catch (error) {
      setApiError('Failed to update request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete request
  const handleDeleteRequest = async (request: ServiceRequest) => {
    if (!window.confirm(`Delete "${request.request_code}"?`)) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      await new Promise(resolve => setTimeout(resolve, 800));

      setRequests(prev => prev.filter(req => req.id !== request.id));
      setShowViewModal(false);
    } catch (error) {
      setApiError('Failed to delete request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle make payment
  const handleMakePayment = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setPaymentAmount(request.budget_maximum?.toString() || '');
    setShowPaymentModal(true);
  };

  // Handle confirm payment
  const handleConfirmPayment = async () => {
    if (!selectedRequest) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setApiError('Please enter a valid amount');
      return;
    }
    
    setIsProcessingPayment(true);
    setApiError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowPaymentModal(false);
      setShowViewModal(false);
      
      // Update request status to processing after payment
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, request_status: 'processing' as const }
          : req
      ));
    } catch (error) {
      setApiError('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔧';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#EF4444';
      case 'priority': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchQuery === '' || 
        request.request_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requested_service?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.request_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.request_status === 'pending').length,
    processing: requests.filter(r => r.request_status === 'processing').length,
    completed: requests.filter(r => r.request_status === 'completed').length,
    cancelled: requests.filter(r => r.request_status === 'cancelled').length,
  }), [requests]);

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">My Requests</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userFullName}</p>
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
                onClick={() => navigate('/bookings')}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-5 h-5 text-cyan-500" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder={`Search your ${requests.length} requests...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-5 gap-2">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.processing}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Processing</p>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
            <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
          </div>
          <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
            <p className="text-xs text-red-600 dark:text-red-400">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {apiError && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="max-w-7xl mx-auto px-4 py-4 pb-32">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No requests found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first service request'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/bookings')}
                className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
              >
                Create Request
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-cyan-500">{request.request_code}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: getStatusColor(request.request_status) + '20', color: getStatusColor(request.request_status) }}
                    >
                      {getStatusIcon(request.request_status)} {request.request_status}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: getUrgencyColor(request.request_urgency) + '20', color: getUrgencyColor(request.request_urgency) }}
                  >
                    {request.request_urgency}
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{request.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{request.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Wrench className="w-4 h-4" />
                    <span className="truncate">{request.requested_service}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(request.preferred_service_date)} at {formatTime(request.preferred_service_time)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {request.budget_maximum ? `Up to TZS ${request.budget_maximum.toLocaleString()}` : 'No budget set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.location_latitude && request.location_longitude && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowMapModal(true);
                        }}
                        className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Map className="w-4 h-4 text-blue-500" />
                      </button>
                    )}
                    {request.request_status === 'pending' && (
                      <button
                        onClick={() => handleMakePayment(request)}
                        className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowViewModal(true);
                      }}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-cyan-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                      View
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h3>
              </div>
              <div className="flex items-center gap-2">
                {selectedRequest.location_latitude && selectedRequest.location_longitude && (
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Map className="w-5 h-5 text-blue-500" />
                  </button>
                )}
                {selectedRequest.request_status === 'pending' && (
                  <button
                    onClick={() => handleMakePayment(selectedRequest)}
                    className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <CreditCard className="w-5 h-5 text-green-500" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditForm(selectedRequest);
                    setShowEditModal(true);
                  }}
                  className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Edit className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleDeleteRequest(selectedRequest)}
                  className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Status Banner */}
              <div
                className="flex items-center gap-3 p-4 rounded-xl mb-4"
                style={{ backgroundColor: getStatusColor(selectedRequest.request_status) + '20' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getStatusColor(selectedRequest.request_status) + '30' }}
                >
                  <span className="text-2xl">{getStatusIcon(selectedRequest.request_status)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedRequest.request_status.charAt(0).toUpperCase() + selectedRequest.request_status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRequest.request_code}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Budget</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-900 dark:text-white">
                    {selectedRequest.budget_maximum 
                      ? `Up to TZS ${selectedRequest.budget_maximum.toLocaleString()}`
                      : 'No budget set'}
                  </p>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setTimeout(() => setShowBudgetModal(true), 300);
                    }}
                    className="mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Update Budget
                  </button>
                </div>
              </div>

              {/* Customer */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> {selectedRequest.customer_name}
                  </p>
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {selectedRequest.customer_phone}
                  </p>
                  {selectedRequest.customer_email && (
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> {selectedRequest.customer_email}
                    </p>
                  )}
                </div>
              </div>

              {/* Service */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-gray-400" /> {selectedRequest.requested_service}
                  </p>
                  {selectedRequest.request_description && (
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-400" /> {selectedRequest.request_description}
                    </p>
                  )}
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" /> {selectedRequest.request_urgency}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> {selectedRequest.service_location}
                  </p>
                  {selectedRequest.location_latitude && selectedRequest.location_longitude && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-400" /> Coordinates: {selectedRequest.location_latitude}, {selectedRequest.location_longitude}
                    </p>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> {formatDate(selectedRequest.preferred_service_date)} at {formatTime(selectedRequest.preferred_service_time)}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.customer_notes && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-400" /> {selectedRequest.customer_notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              {selectedRequest.request_status === 'pending' && (
                <button
                  onClick={() => handleMakePayment(selectedRequest)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Make Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Request</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                    value={editForm.request_description || ''}
                    onChange={(e) => setEditForm({ ...editForm, request_description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Location</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                    value={editForm.service_location || ''}
                    onChange={(e) => setEditForm({ ...editForm, service_location: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          editForm.request_status === status
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setEditForm({ ...editForm, request_status: status as any })}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                    value={editForm.customer_notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, customer_notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <button
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  onClick={handleUpdateRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Set Maximum Budget</h3>
              <button
                onClick={() => setShowBudgetModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set your maximum budget (minimum is TZS 0)
            </p>

            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4 mb-4">
              <span className="text-gray-500 dark:text-gray-400 font-medium">TZS</span>
              <input
                type="number"
                className="flex-1 py-3 px-2 bg-transparent outline-none text-gray-900 dark:text-white"
                placeholder="Enter amount"
                value={budgetForm.budget_maximum}
                onChange={(e) => setBudgetForm({ ...budgetForm, budget_maximum: e.target.value })}
              />
            </div>

            <button
              className="flex items-center gap-2 mb-4"
              onClick={() => setBudgetForm({ ...budgetForm, is_budget_flexible: !budgetForm.is_budget_flexible })}
            >
              {budgetForm.is_budget_flexible ? (
                <CheckCircle className="w-5 h-5 text-cyan-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">I'm flexible with budget</span>
            </button>

            <button
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleUpdateBudget}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  Save Budget
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">Request Code</p>
              <p className="text-lg font-bold text-cyan-500 font-mono">{selectedRequest.request_code}</p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Payment Amount (TZS)</label>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4">
                <span className="text-gray-500 dark:text-gray-400 font-medium">TZS</span>
                <input
                  type="number"
                  className="flex-1 py-3 px-2 bg-transparent outline-none text-gray-900 dark:text-white"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              {selectedRequest.budget_maximum && (
                <button
                  className="mt-2 text-sm text-cyan-500 hover:text-cyan-600 transition-colors flex items-center gap-1"
                  onClick={() => setPaymentAmount(selectedRequest.budget_maximum?.toString() || '')}
                >
                  <RefreshCw className="w-3 h-3" />
                  Use budget amount: TZS {selectedRequest.budget_maximum.toLocaleString()}
                </button>
              )}
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl mb-4">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-600 dark:text-blue-400">You will receive a payment prompt on your phone.</p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment || !paymentAmount}
              >
                {isProcessingPayment ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm & Pay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && selectedRequest && selectedRequest.location_latitude && selectedRequest.location_longitude && (
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Location Map</h3>
              </div>
              <button
                onClick={() => {
                  window.open(`https://www.google.com/maps?q=${selectedRequest.location_latitude},${selectedRequest.location_longitude}`, '_blank');
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Open in Google Maps
              </button>
            </div>

            <div className="p-5">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.customer_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRequest.requested_service}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{selectedRequest.service_location}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Coordinates: {selectedRequest.location_latitude}, {selectedRequest.location_longitude}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map placeholder - shows iframe for Google Maps */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-80 relative">
                <iframe
                  src={`https://www.google.com/maps?q=${selectedRequest.location_latitude},${selectedRequest.location_longitude}&output=embed`}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Location Map"
                />
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

export default CRUDScreen;