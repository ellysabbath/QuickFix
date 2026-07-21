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
  Image as ImageIcon,
  Receipt,
  Wallet,
  TrendingUp
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

interface PaymentRecord {
  id: number;
  payment_id: string;
  service_request: number;
  request_code: string;
  customer_name: string;
  customer_phone: string;
  payment_method: string;
  payment_method_name: string;
  sender_name: string;
  sender_phone: string;
  sender_email: string;
  sender_account: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_account: string;
  amount: number;
  amount_formatted: string;
  transaction_reference: string;
  transaction_id: string;
  screenshot_base64: string | null;
  screenshot_url: string | null;
  proof_uri: string | null;
  status: string;
  status_display: string;
  whatsapp_sent: boolean;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  verified_at: string | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
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

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', icon: <FileText className="w-3.5 h-3.5" /> },
  { value: 'pending', label: 'Pending', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: 'viewed', label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" /> },
  { value: 'offers_received', label: 'Offers', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { value: 'accepted', label: 'Accepted', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { value: 'in_progress', label: 'In Progress', icon: <Loader className="w-3.5 h-3.5" /> },
  { value: 'completed', label: 'Completed', icon: <Check className="w-3.5 h-3.5" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <X className="w-3.5 h-3.5" /> },
  { value: 'expired', label: 'Expired', icon: <AlertCircle className="w-3.5 h-3.5" /> },
];

const PAYMENT_STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  verified: '#8b5cf6',
  completed: '#10b981',
  failed: '#ef4444',
};

const AdminBookingsScreen: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [requests, setRequests] = useState<PublicRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PublicRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PublicRequest | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'requests' | 'payments'>('requests');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // Map States
  const [customerLocation, setCustomerLocation] = useState<UserLocation | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Notification
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  // Edit Form
  const [editForm, setEditForm] = useState<Partial<PublicRequest>>({
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
    location_latitude: '',
    location_longitude: '',
    preferred_service_date: '',
    preferred_service_time: '',
    request_urgency: 'standard',
    budget_minimum: '',
    budget_maximum: '',
    is_budget_flexible: false,
    request_status: 'pending',
    customer_notes: '',
  });

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

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getLoggedInUserName = useCallback((): string => {
    if (user) {
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      return user.username || user.email || 'Admin User';
    }
    return 'Admin User';
  }, [user]);

  const formatCurrency = useCallback((amount: string | null): string => {
    if (!amount || amount === '0.00' || amount === '0') return 'TZS 0';
    return `TZS ${new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 0 }).format(parseFloat(amount))}`;
  }, []);

  const formatStatus = useCallback((status: string): string => {
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
  }, []);

  const formatDateTime = useCallback((dateString: string | null | undefined): string => {
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
  }, []);

  const getStatusColor = useCallback((status: string): string => {
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
  }, [colors]);

  const getStatusBgColor = useCallback((status: string): string => {
    const colorMap: Record<string, string> = {
      pending: colors.warning,
      viewed: colors.cyan,
      offers_received: colors.purple,
      accepted: colors.success,
      in_progress: colors.indigo,
      completed: colors.green,
      cancelled: colors.error,
      expired: colors.textSecondary,
    };
    const bgColor = colorMap[status] || colors.warning;
    return isDark ? `${bgColor}20` : `${bgColor}15`;
  }, [isDark, colors]);

  const getUrgencyColor = useCallback((urgency: string): string => {
    const map: Record<string, string> = {
      standard: colors.textSecondary,
      priority: colors.warning,
      emergency: colors.error,
    };
    return map[urgency] || colors.textSecondary;
  }, [colors]);

  const countByStatus = useCallback((status: string): number => {
    if (status === 'all') return requests.length;
    return requests.filter(r => r.request_status === status).length;
  }, [requests]);

  const getCoordinatesFromRequest = useCallback((request: PublicRequest): UserLocation | null => {
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
  }, []);

  const makePhoneCall = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      alert('No phone number available');
      return;
    }
    let cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    window.location.href = `tel:${cleanNumber}`;
  }, []);

  // ============================================================================
  // NOTIFICATION
  // ============================================================================

  const showNotification = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage(null);
    }, 3000);
  }, []);

  // ============================================================================
  // API FUNCTIONS - Mock
  // ============================================================================

  const mockRequests: PublicRequest[] = [
    {
      id: 1,
      request_code: 'SR-2024-A1B2C3',
      customer_name: 'John Doe',
      customer_phone: '+255 712 345 678',
      customer_email: 'john@example.com',
      requested_service: 'Engine Diagnostics',
      request_description: 'Check engine light is on',
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
      request_description: 'Squeaking noise when braking',
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
  ];

  const mockPayments: PaymentRecord[] = [
    {
      id: 1,
      payment_id: 'PAY-2024-001',
      service_request: 1,
      request_code: 'SR-2024-A1B2C3',
      customer_name: 'John Doe',
      customer_phone: '+255 712 345 678',
      payment_method: 'mpesa',
      payment_method_name: 'M-Pesa',
      sender_name: 'John Doe',
      sender_phone: '+255 712 345 678',
      sender_email: 'john@example.com',
      sender_account: '',
      receiver_name: 'QuickFix Services',
      receiver_phone: '+255 742 5786 91',
      receiver_account: '123456',
      amount: 150000,
      amount_formatted: 'TZS 150,000',
      transaction_reference: 'MPS-2024-001234',
      transaction_id: 'TXN-123456',
      screenshot_base64: null,
      screenshot_url: null,
      proof_uri: null,
      status: 'confirmed',
      status_display: 'Confirmed',
      whatsapp_sent: true,
      email_sent: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      verified_at: null,
    },
    {
      id: 2,
      payment_id: 'PAY-2024-002',
      service_request: 2,
      request_code: 'SR-2024-D4E5F6',
      customer_name: 'Jane Smith',
      customer_phone: '+255 713 456 789',
      payment_method: 'airtel_money',
      payment_method_name: 'Airtel Money',
      sender_name: 'Jane Smith',
      sender_phone: '+255 713 456 789',
      sender_email: 'jane@example.com',
      sender_account: '',
      receiver_name: 'QuickFix Services',
      receiver_phone: '+255 742 5786 91',
      receiver_account: '123456',
      amount: 200000,
      amount_formatted: 'TZS 200,000',
      transaction_reference: 'ATM-2024-005678',
      transaction_id: 'TXN-789012',
      screenshot_base64: null,
      screenshot_url: null,
      proof_uri: null,
      status: 'pending',
      status_display: 'Pending',
      whatsapp_sent: false,
      email_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confirmed_at: null,
      verified_at: null,
    },
  ];

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequests(mockRequests);
    } catch (error) {
      showNotification('error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showNotification]);

  const fetchPayments = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  }, []);

  const updateRequestStatus = useCallback(async (requestId: number, newStatus: string) => {
    try {
      setUpdating(requestId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userName = getLoggedInUserName();
      const now = new Date().toISOString();
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              request_status: newStatus,
              request_status_display: formatStatus(newStatus),
              updated_by: userName,
              request_updated: now
            }
          : req
      ));
      
      showNotification('success', `Status updated to ${formatStatus(newStatus)}`);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  }, [showNotification, formatStatus, getLoggedInUserName]);

  const updateFullRequest = useCallback(async () => {
    if (!selectedRequest) return;
    try {
      setUpdating(selectedRequest.id);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userName = getLoggedInUserName();
      
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              ...editForm,
              updated_by: userName,
              request_updated: new Date().toISOString()
            }
          : req
      ));
      
      showNotification('success', 'Request updated successfully!');
      setShowEditModal(false);
      setShowDetailsModal(false);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update request');
    } finally {
      setUpdating(null);
    }
  }, [selectedRequest, editForm, showNotification]);

  const deleteRequest = useCallback(async () => {
    if (!selectedRequest) return;
    try {
      setUpdating(selectedRequest.id);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      showNotification('success', 'Request deleted successfully!');
      setShowDeleteModal(false);
      setShowDetailsModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete request');
    } finally {
      setUpdating(null);
    }
  }, [selectedRequest, showNotification]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
    fetchPayments();
  }, [fetchRequests, fetchPayments]);

  const handleViewDetails = useCallback((request: PublicRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  }, []);

  const handleViewPayment = useCallback((request: PublicRequest) => {
    const payment = payments.find(p => p.service_request === request.id);
    if (payment) {
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    } else {
      alert('No payment records found for this request');
    }
  }, [payments]);

  const handleEdit = useCallback((request: PublicRequest) => {
    setEditForm({
      customer_name: request.customer_name,
      customer_phone: request.customer_phone,
      customer_email: request.customer_email,
      requested_service: request.requested_service,
      request_description: request.request_description || '',
      vehicle_brand: request.vehicle_brand,
      vehicle_model: request.vehicle_model,
      vehicle_year: request.vehicle_year,
      vehicle_color: request.vehicle_color,
      license_plate: request.license_plate,
      service_location: request.service_location,
      location_maps_link: request.location_maps_link || '',
      location_latitude: request.location_latitude,
      location_longitude: request.location_longitude,
      preferred_service_date: request.preferred_service_date,
      preferred_service_time: request.preferred_service_time,
      request_urgency: request.request_urgency,
      budget_minimum: request.budget_minimum,
      budget_maximum: request.budget_maximum,
      is_budget_flexible: request.is_budget_flexible,
      request_status: request.request_status,
      customer_notes: request.customer_notes || '',
    });
    setSelectedRequest(request);
    setShowEditModal(true);
  }, []);

  const handleStatusUpdate = useCallback((requestId: number, newStatus: string) => {
    if (window.confirm(`Change status to "${formatStatus(newStatus)}"?`)) {
      updateRequestStatus(requestId, newStatus);
    }
  }, [formatStatus, updateRequestStatus]);

  const handleDelete = useCallback((request: PublicRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchRequests();
    fetchPayments();
  }, []);

  useEffect(() => {
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
    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter]);

  useEffect(() => {
    let filtered = [...payments];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.customer_name.toLowerCase().includes(query) ||
        p.sender_name.toLowerCase().includes(query) ||
        p.request_code.toLowerCase().includes(query) ||
        p.payment_id.toLowerCase().includes(query)
      );
    }
    setFilteredPayments(filtered);
  }, [payments, searchQuery]);

  // ============================================================================
  // OPEN MAP MODAL
  // ============================================================================

  const openMapModal = useCallback((request: PublicRequest) => {
    setSelectedRequest(request);
    setMapLoading(true);
    const coords = getCoordinatesFromRequest(request);
    if (coords) {
      setCustomerLocation(coords);
    }
    setMapLoading(false);
    setShowMapModal(true);
  }, [getCoordinatesFromRequest]);

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

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

  const renderRequestCard = (request: PublicRequest) => {
    const statusColor = getStatusColor(request.request_status);
    const urgencyColor = getUrgencyColor(request.request_urgency);
    const hasLocation = !!(request.location_latitude || request.location_maps_link);
    const budgetRange = formatCurrency(request.budget_minimum) + ' - ' + formatCurrency(request.budget_maximum);
    const isUpdating = updating === request.id;
    const hasPayment = payments.some(p => p.service_request === request.id);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow mb-4">
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

        {/* Customer */}
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
        <div className="flex flex-wrap gap-1.5">
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => handleEdit(request)}
            disabled={isUpdating}
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => handleStatusUpdate(request.id, 'accepted')}
            disabled={isUpdating}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => handleStatusUpdate(request.id, 'in_progress')}
            disabled={isUpdating}
          >
            <Loader className="w-3.5 h-3.5" />
            Start
          </button>
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => handleStatusUpdate(request.id, 'completed')}
            disabled={isUpdating}
          >
            <Check className="w-3.5 h-3.5" />
            Complete
          </button>
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => handleViewPayment(request)}
            disabled={isUpdating}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Payment
          </button>
          {hasLocation && (
            <button
              className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg transition-colors"
              onClick={() => openMapModal(request)}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
          )}
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => handleDelete(request)}
            disabled={isUpdating}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Del
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentCard = (payment: PaymentRecord) => {
    const statusColor = PAYMENT_STATUS_COLORS[payment.status as keyof typeof PAYMENT_STATUS_COLORS] || '#6b7280';
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow mb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: statusColor + '20', color: statusColor }}
            >
              {payment.status_display || payment.status}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">#{payment.payment_id}</span>
          </div>
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: payment.email_sent ? '#10b98120' : '#f59e0b20' }}>
            <Mail className="w-3 h-3" style={{ color: payment.email_sent ? '#10b981' : '#f59e0b' }} />
            <span style={{ color: payment.email_sent ? '#10b981' : '#f59e0b' }}>
              {payment.email_sent ? 'Email Sent' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Amount */}
        <p className="text-lg font-bold text-gray-900 dark:text-white">{payment.amount_formatted}</p>

        {/* Sender */}
        <div className="flex items-center gap-2 mb-1">
          <User className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-sm font-bold text-cyan-500">{payment.sender_name}</span>
        </div>

        {/* Method */}
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-xs font-semibold text-cyan-500">{payment.payment_method_name}</span>
        </div>

        {/* Reference */}
        {payment.transaction_reference && (
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Ref: {payment.transaction_reference}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1 mb-3">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(payment.created_at)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg transition-colors"
            onClick={() => { setSelectedPayment(payment); setShowPaymentModal(true); }}
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
          {payment.screenshot_url && (
            <button
              className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors"
              onClick={() => { setSelectedPayment(payment); setShowScreenshotModal(true); }}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Screenshot
            </button>
          )}
          {payment.whatsapp_sent && (
            <div className="flex-1 min-w-[50px] flex items-center justify-center gap-1 py-1.5 bg-green-500/70 text-white text-xs font-medium rounded-lg">
              <Send className="w-3.5 h-3.5" />
              Sent
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeTab === 'requests' ? `${filteredRequests.length} requests` : `${filteredPayments.length} payments`}
                </p>
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

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-3">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              <FileText className="w-4 h-4" />
              Requests
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'payments'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => { setActiveTab('payments'); fetchPayments(); }}
            >
              <CreditCard className="w-4 h-4" />
              Payments
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder={activeTab === 'requests' ? "Search by name, phone, service..." : "Search by customer, payment ID..."}
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
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
            {STATUS_OPTIONS.map((option) => {
              const isActive = statusFilter === option.value;
              const color = option.value === 'all' ? colors.primary : getStatusColor(option.value);
              return (
                <button
                  key={option.value}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.icon}
                  {option.label}
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {countByStatus(option.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 py-4 pb-32">
        {activeTab === 'requests' ? (
          requests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Service Requests</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customer requests will appear here</p>
            </div>
          ) : filteredRequests.length === 0 ? (
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
              {filteredRequests.map((request) => renderRequestCard(request))}
            </div>
          )
        ) : (
          payments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Payments</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment records will appear here</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Payments Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPayments.map((payment) => renderPaymentCard(payment))}
            </div>
          )
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: getStatusBgColor(selectedRequest.request_status), color: getStatusColor(selectedRequest.request_status) }}
                    >
                      {formatStatus(selectedRequest.request_status)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">#{selectedRequest.request_code}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Customer Info */}
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

              {/* Service Info */}
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

              {/* Vehicle Info */}
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

              {/* Payment Info */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  {payments.filter(p => p.service_request === selectedRequest.id).length > 0 ? (
                    payments.filter(p => p.service_request === selectedRequest.id).map((payment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Payment ID:</span>
                          <span className="text-sm font-bold text-purple-500">{payment.payment_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                          <span className="text-sm font-bold text-green-500">{payment.amount_formatted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-cyan-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
                          <span className="text-sm text-gray-900 dark:text-white">{payment.payment_method_name}</span>
                        </div>
                        {payment.transaction_reference && (
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Reference:</span>
                            <span className="text-sm text-gray-900 dark:text-white">{payment.transaction_reference}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                          <span className="text-sm font-bold" style={{ color: PAYMENT_STATUS_COLORS[payment.status as keyof typeof PAYMENT_STATUS_COLORS] || colors.text }}>
                            {payment.status_display}
                          </span>
                        </div>
                        <button
                          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                          onClick={() => { setShowDetailsModal(false); setSelectedPayment(payment); setShowPaymentModal(true); }}
                        >
                          <Eye className="w-4 h-4" />
                          View Payment Details
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No payment records found</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => { setShowDetailsModal(false); handleEdit(selectedRequest); }}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => { setShowDetailsModal(false); handleViewPayment(selectedRequest); }}
                >
                  <CreditCard className="w-4 h-4" />
                  Payment
                </button>
                <button
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => { setShowDetailsModal(false); handleDelete(selectedRequest); }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Details</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">#{selectedPayment.payment_id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Payment Status */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Status</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: PAYMENT_STATUS_COLORS[selectedPayment.status as keyof typeof PAYMENT_STATUS_COLORS] || colors.text }} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="text-sm font-bold" style={{ color: PAYMENT_STATUS_COLORS[selectedPayment.status as keyof typeof PAYMENT_STATUS_COLORS] || colors.text }}>
                      {selectedPayment.status_display}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(selectedPayment.created_at)}</span>
                  </div>
                  {selectedPayment.confirmed_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Confirmed:</span>
                      <span className="text-sm text-green-500">{formatDateTime(selectedPayment.confirmed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sender Info */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sender Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-bold text-cyan-500">{selectedPayment.sender_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                    <button onClick={() => makePhoneCall(selectedPayment.sender_phone)}>
                      <span className="text-sm font-bold text-cyan-500">{selectedPayment.sender_phone}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedPayment.sender_email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Details</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                    <span className="text-lg font-bold text-green-500">{selectedPayment.amount_formatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedPayment.payment_method_name}</span>
                  </div>
                  {selectedPayment.transaction_reference && (
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Reference:</span>
                      <span className="text-sm font-bold text-yellow-500">{selectedPayment.transaction_reference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Screenshot */}
              {selectedPayment.screenshot_url && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Screenshot</h4>
                  <button
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => setShowScreenshotModal(true)}
                  >
                    <ImageIcon className="w-5 h-5" />
                    View Screenshot
                  </button>
                </div>
              )}

              <button
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                onClick={() => setShowPaymentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshotModal && selectedPayment?.screenshot_url && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Screenshot</h3>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPayment.screenshot_url}
                alt="Payment Screenshot"
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '70vh' }}
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Payment ID: {selectedPayment.payment_id}</span>
              <button
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                onClick={() => setShowScreenshotModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 text-center">
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
                onClick={deleteRequest}
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
              {customerLocation && (
                <button
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  onClick={() => {
                    window.open(`https://www.google.com/maps?q=${customerLocation.latitude},${customerLocation.longitude}`, '_blank');
                  }}
                >
                  Open in Google Maps
                </button>
              )}
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
                {customerLocation ? (
                  <iframe
                    src={`https://www.google.com/maps?q=${customerLocation.latitude},${customerLocation.longitude}&output=embed`}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No location data available</p>
                      <p className="text-xs text-gray-400">This request doesn't have coordinates</p>
                    </div>
                  </div>
                )}
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

export default AdminBookingsScreen;