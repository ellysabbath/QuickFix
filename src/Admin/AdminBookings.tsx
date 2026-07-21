// src/pages/admin/AdminBookings.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  CreditCard,
  Calendar,
  Loader2,
  List,
  Trash2,
  Check,
  XCircle,
  DollarSign,
  FileText,
  Zap,
  ExternalLink,
  ChevronDown,
  Navigation,
  Map as MapIcon,
  Globe,
  Wallet,
  Image,
  Receipt,
  Send,
  MessageCircle,
  Shield,
  Award,
  Building2,
  Smartphone,
  Copy,
  QrCode
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const PUBLIC_REQUESTS_URL = `${API_BASE_URL}/public-requests/`;
const PAYMENT_RECORDS_URL = `${API_BASE_URL}/pay/payment-records/me`;

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
  details?: { label: string; value: string }[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  details
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500" />;
      case 'confirm':
        return <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-yellow-500" />;
      case 'info':
        return <Info className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-500" />;
      default:
        return <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-500" />;
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
          <div className={`p-3 rounded-full ${
            type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
            type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
            type === 'confirm' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            {getIcon()}
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {message}
        </p>

        {details && details.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 text-left w-full">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-xs text-gray-500 dark:text-gray-400">{detail.label}</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        
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
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()} ${type === 'success' ? 'shadow-green-500/30' : type === 'error' ? 'shadow-red-500/30' : type === 'confirm' ? 'shadow-yellow-500/30' : 'shadow-cyan-500/30'}`}
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

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', icon: <List className="w-3.5 h-3.5" /> },
  { value: 'pending', label: 'Pending', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: 'viewed', label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" /> },
  { value: 'offers_received', label: 'Offers', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { value: 'accepted', label: 'Accepted', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { value: 'in_progress', label: 'In Progress', icon: <Zap className="w-3.5 h-3.5" /> },
  { value: 'completed', label: 'Completed', icon: <Check className="w-3.5 h-3.5" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-3.5 h-3.5" /> },
  { value: 'expired', label: 'Expired', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-500 bg-yellow-500/10',
  confirmed: 'text-blue-500 bg-blue-500/10',
  verified: 'text-purple-500 bg-purple-500/10',
  completed: 'text-green-500 bg-green-500/10',
  failed: 'text-red-500 bg-red-500/10',
};

export default function AdminBookings() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  const getLoggedInUserName = useCallback((): string => {
    if (user) {
      const firstName = (user as any).first_name || (user as any).firstName || '';
      const lastName = (user as any).last_name || (user as any).lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      const username = (user as any).username || '';
      const email = (user as any).email || '';
      return username || email || 'Admin User';
    }
    return 'Admin User';
  }, [user]);

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
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // Confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    details?: { label: string; value: string }[];
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showConfirmationModal = (
    type: 'success' | 'error' | 'confirm' | 'info',
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
    details?: { label: string; value: string }[]
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
      details,
    });
  };

  const formatCurrency = useCallback((amount: string | null): string => {
    if (!amount || amount === '0.00') return 'TZS 0';
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
      pending: 'text-yellow-500',
      viewed: 'text-cyan-500',
      offers_received: 'text-purple-500',
      accepted: 'text-green-500',
      in_progress: 'text-indigo-500',
      completed: 'text-emerald-500',
      cancelled: 'text-red-500',
      expired: 'text-gray-500',
    };
    return map[status] || 'text-yellow-500';
  }, []);

  const getStatusBgColor = useCallback((status: string): string => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      viewed: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      offers_received: 'bg-purple-500/10 dark:bg-purple-500/20',
      accepted: 'bg-green-500/10 dark:bg-green-500/20',
      in_progress: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      completed: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      cancelled: 'bg-red-500/10 dark:bg-red-500/20',
      expired: 'bg-gray-500/10 dark:bg-gray-500/20',
    };
    return map[status] || 'bg-yellow-500/10';
  }, []);

  const getUrgencyColor = useCallback((urgency: string): string => {
    const map: Record<string, string> = {
      standard: 'text-gray-500',
      priority: 'text-yellow-500',
      emergency: 'text-red-500',
    };
    return map[urgency] || 'text-gray-500';
  }, []);

  const countByStatus = useCallback((status: string): number => {
    if (status === 'all') return requests.length;
    return requests.filter(r => r.request_status === status).length;
  }, [requests]);

  const makePhoneCall = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      showConfirmationModal('error', 'Error', 'No phone number available');
      return;
    }
    let cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    window.location.href = `tel:${cleanNumber}`;
  }, []);

  // API Functions
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(PUBLIC_REQUESTS_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const requestsList = data.results || data;
      setRequests(Array.isArray(requestsList) ? requestsList : []);
    } catch (error: any) {
      showConfirmationModal('error', 'Error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch(PAYMENT_RECORDS_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const paymentsList = data.results || data;
      setPayments(Array.isArray(paymentsList) ? paymentsList : []);
    } catch (error: any) {
      console.error('Failed to load payments:', error);
    }
  }, []);

  const fetchPaymentForRequest = useCallback(async (requestId: number) => {
    try {
      const response = await fetch(`${PAYMENT_RECORDS_URL}?service_request=${requestId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const paymentsList = data.results || data;
      if (Array.isArray(paymentsList) && paymentsList.length > 0) {
        setSelectedPayment(paymentsList[0]);
        setShowPaymentModal(true);
      } else {
        showConfirmationModal('info', 'No Payment', 'No payment records found for this request');
      }
    } catch (error: any) {
      showConfirmationModal('error', 'Error', 'Failed to load payment information');
    }
  }, []);

  const updateRequestStatus = useCallback(async (requestId: number, newStatus: string) => {
    try {
      setUpdating(requestId);
      
      const userName = getLoggedInUserName();
      const now = new Date().toISOString();
      
      const payload: any = { request_status: newStatus };
      
      if (newStatus === 'accepted') {
        payload.approved_by = userName;
        payload.approved_at = now;
      } else if (newStatus === 'in_progress' || newStatus === 'completed') {
        payload.fixed_by = userName;
        payload.fixed_at = now;
      }
      
      payload.updated_by = userName;
      
      const response = await fetch(`${PUBLIC_REQUESTS_URL}${requestId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}`);
      }
      
      await fetchRequests();
      showConfirmationModal('success', 'Success', `✓ Status updated to ${formatStatus(newStatus)}`);
      
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  }, [showConfirmationModal, formatStatus, getLoggedInUserName, fetchRequests]);

  const deleteRequest = useCallback(async () => {
    if (!selectedRequest) return;
    try {
      setUpdating(selectedRequest.id);
      const response = await fetch(`${PUBLIC_REQUESTS_URL}${selectedRequest.id}/`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) throw new Error(`HTTP ${response.status}`);
      
      await fetchRequests();
      showConfirmationModal('success', 'Deleted', 'Request deleted successfully!');
      setShowDeleteModal(false);
      setShowDetailsModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.message || 'Failed to delete request');
    } finally {
      setUpdating(null);
    }
  }, [selectedRequest, showConfirmationModal, fetchRequests]);

  // Handlers
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
    fetchPaymentForRequest(request.id);
  }, [fetchPaymentForRequest]);

  const handleStatusUpdate = useCallback((requestId: number, newStatus: string) => {
    setShowStatusDropdown(null);
    showConfirmationModal(
      'confirm',
      'Update Status',
      `Change status to "${formatStatus(newStatus)}"?`,
      () => updateRequestStatus(requestId, newStatus),
      undefined,
      'Update',
      'Cancel'
    );
  }, [formatStatus, updateRequestStatus]);

  const handleDelete = useCallback((request: PublicRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  }, []);

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

  // Render Functions
  const renderRequestCard = (request: PublicRequest) => {
    const statusColor = getStatusColor(request.request_status);
    const statusBgColor = getStatusBgColor(request.request_status);
    const urgencyColor = getUrgencyColor(request.request_urgency);
    const budgetRange = formatCurrency(request.budget_minimum) + ' - ' + formatCurrency(request.budget_maximum);
    const isUpdating = updating === request.id;
    const hasPayment = payments.some(p => p.service_request === request.id);

    return (
      <div
        key={`request-${request.id}`}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBgColor} ${statusColor}`}>
                {formatStatus(request.request_status)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                #{request.request_code}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${urgencyColor} bg-current/10`}>
                {request.urgency_display}
              </span>
              {hasPayment && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  Paid
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {request.requested_service}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {request.customer_name}
                </span>
              </div>
              <button
                onClick={() => makePhoneCall(request.customer_phone)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
              >
                <Phone className="w-3 h-3 text-cyan-500" />
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  {request.customer_phone}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                {request.vehicle_details || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">{budgetRange}</span>
              </span>
              {request.is_budget_flexible && (
                <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  Flexible
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {request.formatted_date} at {request.formatted_time}
              </span>
              {request.service_location && (
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3 h-3" />
                  {request.service_location}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleViewDetails(request)}
              className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleViewPayment(request)}
              className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              title="View Payment"
            >
              <Wallet className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(showStatusDropdown === request.id.toString() ? null : request.id.toString())}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Change Status"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showStatusDropdown === request.id.toString() && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                  {STATUS_OPTIONS.filter(opt => opt.value !== 'all').map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusUpdate(request.id, opt.value)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleDelete(request)}
              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => handleStatusUpdate(request.id, 'accepted')}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleStatusUpdate(request.id, 'in_progress')}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
          >
            Start
          </button>
          <button
            onClick={() => handleStatusUpdate(request.id, 'completed')}
            className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentCard = (payment: PaymentRecord) => {
    const statusClass = PAYMENT_STATUS_COLORS[payment.status] || 'text-gray-500 bg-gray-500/10';

    return (
      <div
        key={`payment-${payment.id}`}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusClass}`}>
                {payment.status_display || payment.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                #{payment.payment_id}
              </span>
              {payment.whatsapp_sent && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  WhatsApp Sent
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-cyan-600 dark:text-cyan-400">
              {payment.amount_formatted}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {payment.sender_name}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-purple-500" />
                <span>{payment.payment_method_name}</span>
              </span>
              {payment.transaction_reference && (
                <span className="flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Ref: {payment.transaction_reference}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateTime(payment.created_at)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setSelectedPayment(payment); setShowPaymentModal(true); }}
              className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {payment.screenshot_url && (
              <button
                onClick={() => { setSelectedPayment(payment); setShowScreenshotModal(true); }}
                className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                title="View Screenshot"
              >
                <Image className="w-4 h-4" />
              </button>
            )}

            {payment.whatsapp_sent && (
              <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <MessageCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Service Requests</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {activeTab === 'requests' ? `${filteredRequests.length} requests` : `${filteredPayments.length} payments`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'requests'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-cyan-600 dark:text-cyan-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              <FileText className="w-4 h-4" />
              Requests
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'payments'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-cyan-600 dark:text-cyan-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => { setActiveTab('payments'); fetchPayments(); }}
            >
              <Wallet className="w-4 h-4" />
              Payments
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder={activeTab === 'requests' ? "Search by name, phone, service..." : "Search by customer, payment ID..."}
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

      {/* Filters */}
      {activeTab === 'requests' && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {STATUS_OPTIONS.map((option) => {
                const isActive = statusFilter === option.value;
                return (
                  <button
                    key={`filter-${option.value}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.icon}
                    {option.label}
                    <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] ${
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
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {activeTab === 'requests' ? (
          requests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Service Requests</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customer requests will appear here</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Requests Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try a different search term' : 'No requests match the current filter'}
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => renderRequestCard(request))}
            </div>
          )
        ) : (
          payments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Payments</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment records will appear here</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Payments Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => renderPaymentCard(payment))}
            </div>
          )
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBgColor(selectedRequest.request_status)} ${getStatusColor(selectedRequest.request_status)}`}>
                    {formatStatus(selectedRequest.request_status)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    #{selectedRequest.request_code}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Customer Information */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Customer Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{selectedRequest.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Phone:</span>
                    <button onClick={() => makePhoneCall(selectedRequest.customer_phone)} className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
                      {selectedRequest.customer_phone}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.customer_email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service Details</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Service:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.requested_service}</span>
                  </div>
                  {selectedRequest.request_description && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-cyan-500 mt-0.5" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Description:</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedRequest.request_description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Vehicle:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.vehicle_details}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Plate:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.license_plate}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  {payments.filter(p => p.service_request === selectedRequest.id).length > 0 ? (
                    payments.filter(p => p.service_request === selectedRequest.id).map((payment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-purple-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Payment ID:</span>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{payment.payment_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Amount:</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{payment.amount_formatted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-cyan-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Method:</span>
                          <span className="text-sm text-gray-900 dark:text-white">{payment.payment_method_name}</span>
                        </div>
                        {payment.transaction_reference && (
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Reference:</span>
                            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{payment.transaction_reference}</span>
                          </div>
                        )}
                        <button
                          onClick={() => { setShowDetailsModal(false); setSelectedPayment(payment); setShowPaymentModal(true); }}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Payment Details
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No payment records found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{selectedPayment.payment_id}</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Payment Status */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment Status</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[selectedPayment.status] || 'text-gray-500 bg-gray-500/10'}`}>
                      {selectedPayment.status_display}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(selectedPayment.created_at)}</span>
                  </div>
                  {selectedPayment.confirmed_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Confirmed:</span>
                      <span className="text-sm text-green-600 dark:text-green-400">{formatDateTime(selectedPayment.confirmed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sender Information */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sender Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{selectedPayment.sender_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Phone:</span>
                    <button onClick={() => makePhoneCall(selectedPayment.sender_phone)} className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
                      {selectedPayment.sender_phone}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedPayment.sender_email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment Details</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Amount:</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{selectedPayment.amount_formatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Method:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedPayment.payment_method_name}</span>
                  </div>
                  {selectedPayment.transaction_reference && (
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Reference:</span>
                      <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{selectedPayment.transaction_reference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Screenshot */}
              {selectedPayment.screenshot_url && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Screenshot</h4>
                  <button
                    onClick={() => setShowScreenshotModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    View Screenshot
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshotModal && selectedPayment?.screenshot_url && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-gray-900">
            <h3 className="text-sm font-semibold text-white">Payment Screenshot</h3>
            <button
              onClick={() => setShowScreenshotModal(false)}
              className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={selectedPayment.screenshot_url}
              alt="Payment Screenshot"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          <div className="p-4 bg-gray-900 text-center">
            <p className="text-xs text-gray-400">Payment ID: {selectedPayment.payment_id}</p>
            <button
              onClick={() => setShowScreenshotModal(false)}
              className="mt-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRequest && (
        <ConfirmationModal
          isOpen={true}
          type="confirm"
          title="Delete Request"
          message={`Delete #${selectedRequest.request_code} from ${selectedRequest.customer_name}? This cannot be undone.`}
          onConfirm={deleteRequest}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

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
        details={confirmationModal.details}
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}