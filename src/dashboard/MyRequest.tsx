// src/pages/dashboard/MyRequests.tsx

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
  QrCode,
  Plus,
  Edit2,
  Star,
  StarHalf,
  Inbox,
  UserPlus,
  Briefcase,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Filter,
  Grid,
  List as ListIcon,
  Menu,
  Settings,
  Home,
  LogOut,
  User as UserIcon
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
interface ServiceRequest {
  id: number;
  request_code: string;
  full_name: string;
  location: string;
  email?: string;
  phone?: string;
  experience?: string;
  garage_name?: string;
  garage_phone?: string;
  garage_email?: string;
  profile_picture?: string;
  status: string;
  status_display?: string;
  priority: string;
  priority_display?: string;
  is_emergency?: boolean;
  estimated_cost?: number;
  actual_cost?: number;
  quote_approved?: boolean;
  created_at: string;
  submitted_at: string;
  user_rating?: number;
  user_feedback?: string;
  user_email?: string;
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
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30';
      case 'confirm':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-yellow-500/30';
      case 'info':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/30';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/30';
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
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${getButtonColors()}`}
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

// Star Rating Component
const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const [selectedRating, setSelectedRating] = useState(rating || 0);

  const handleRating = (value: number) => {
    if (readonly) return;
    setSelectedRating(value);
    if (onRatingChange) onRatingChange(value);
  };

  useEffect(() => {
    setSelectedRating(rating || 0);
  }, [rating]);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          disabled={readonly}
          className="p-1 transition-transform hover:scale-110"
        >
          {star <= selectedRating ? (
            <Star className={`${sizes[size]} fill-yellow-400 text-yellow-400`} />
          ) : (
            <Star className={`${sizes[size]} text-gray-300`} />
          )}
        </button>
      ))}
    </div>
  );
};

// Get auth token
const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
};

// API Functions
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `HTTP ${response.status}` };
    }
    throw { status: response.status, data: errorData };
  }
  
  return response.json();
};

const apiFunctions = {
  getMyRequests: async (): Promise<ServiceRequest[]> => {
    try {
      const data = await apiFetch('/service-requests/');
      if (data.results && Array.isArray(data.results)) return data.results;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  getRequestById: async (id: number): Promise<ServiceRequest> => {
    try {
      const data = await apiFetch(`/service-requests/${id}/`);
      return data.data || data;
    } catch (error: any) {
      console.error(`Error fetching request ${id}:`, error);
      throw error;
    }
  },

  updateRequest: async (id: number, data: any): Promise<any> => {
    try {
      const response = await apiFetch(`/service-requests/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error: any) {
      console.error(`Error updating request ${id}:`, error);
      throw error;
    }
  },

  deleteRequest: async (id: number): Promise<void> => {
    try {
      await apiFetch(`/service-requests/${id}/`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      console.error(`Error deleting request ${id}:`, error);
      throw error;
    }
  },

  submitRating: async (id: number, rating: number, feedback: string): Promise<any> => {
    try {
      const response = await apiFetch(`/service-requests/${id}/add_rating/`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
      });
      return response;
    } catch (error: any) {
      console.error(`Error submitting rating for ${id}:`, error);
      throw error;
    }
  },
};

// Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'received': return '#3b82f6';
    case 'in_progress': return '#8b5cf6';
    case 'completed': return '#10b981';
    case 'cancelled': return '#64748b';
    case 'rejected': return '#ef4444';
    default: return '#94a3b8';
  }
};

const getStatusBgClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
    case 'received': return 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
    case 'in_progress': return 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400';
    case 'completed': return 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400';
    case 'cancelled': return 'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400';
    case 'rejected': return 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400';
    default: return 'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400';
  }
};

export default function MyRequests() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    garage_notes: '',
    estimated_cost: '',
    actual_cost: '',
  });

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

  // Success Modal
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
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

  const showSuccess = (title: string, message: string) => {
    setSuccessModal({ isOpen: true, title, message });
    setTimeout(() => {
      setSuccessModal(prev => ({ ...prev, isOpen: false }));
    }, 2500);
  };

  const loadRequests = useCallback(async () => {
    try {
      const data = await apiFunctions.getMyRequests();
      setRequests(data);
      setFilteredRequests(filter === 'all' ? data : data.filter(r => r.status === filter));
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.data?.detail || 'Failed to load your requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isAuthenticated) loadRequests();
    else if (!userLoading) navigate('/login');
  }, [isAuthenticated, userLoading]);

  useEffect(() => {
    setFilteredRequests(filter === 'all' ? requests : requests.filter(r => r.status === filter));
  }, [filter, requests]);

  const handleDelete = async (request: ServiceRequest) => {
    try {
      await apiFunctions.deleteRequest(request.id);
      await loadRequests();
      showSuccess('Deleted', 'Request deleted successfully');
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to delete request');
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      await apiFunctions.updateRequest(id, data);
      await loadRequests();
      showSuccess('Updated', 'Request updated successfully');
      setShowEdit(false);
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to update request');
    }
  };

  const handleRating = async (id: number, rating: number, feedback: string) => {
    try {
      await apiFunctions.submitRating(id, rating, feedback);
      await loadRequests();
      showSuccess('Thank You!', 'Your feedback has been submitted');
      setShowRating(false);
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Failed to submit rating');
    }
  };

  const getCounts = () => {
    const counts: Record<string, number> = { all: requests.length };
    requests.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  };

  const counts = getCounts();

  const statusOptions = ['all', 'pending', 'received', 'in_progress', 'completed', 'cancelled', 'rejected'];

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (userLoading || (loading && !refreshing)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">My Requests</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {filteredRequests.length} requests found
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/service-request')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors shadow-md shadow-cyan-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{counts.all || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Total</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-yellow-500">{counts.pending || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-blue-500">{counts.received || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Received</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-purple-500">{counts.in_progress || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">In Progress</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-green-500">{counts.completed || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-red-500">{counts.cancelled || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Cancelled</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-gray-500">{counts.rejected || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  filter === status
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] ${
                  filter === status
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {counts[status] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No service requests found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Submit your first service request</p>
            <button
              onClick={() => navigate('/dashboard/service-request')}
              className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-cyan-500/30"
            >
              Submit Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => {
              const statusColor = getStatusColor(request.status);
              const statusBgClass = getStatusBgClass(request.status);

              return (
                <div
                  key={request.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDetail(true);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {request.profile_picture ? (
                      <img
                        src={request.profile_picture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {request.full_name}
                        </p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${statusBgClass}`}>
                          {request.status_display || request.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">{request.request_code}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{request.location}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                        setShowDetail(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-[10px] font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                        setEditFormData({
                          garage_notes: request.garage_notes || '',
                          estimated_cost: request.estimated_cost?.toString() || '',
                          actual_cost: request.actual_cost?.toString() || '',
                        });
                        setShowEdit(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showConfirmationModal(
                          'confirm',
                          'Delete Request',
                          `Delete this request? This action cannot be undone.`,
                          () => handleDelete(request),
                          undefined,
                          'Delete',
                          'Cancel'
                        );
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                    {request.status === 'completed' && !request.user_rating && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setShowRating(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg text-[10px] font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
                      >
                        <Star className="w-3 h-3" />
                        Rate
                      </button>
                    )}
                    {request.user_rating && request.user_rating > 0 && (
                      <div className="flex items-center gap-0.5 px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-medium text-yellow-600">{request.user_rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      {showDetail && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{selectedRequest.request_code}</p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                {selectedRequest.profile_picture ? (
                  <img
                    src={selectedRequest.profile_picture}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.full_name}</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">{selectedRequest.request_code}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBgClass(selectedRequest.status)}`}>
                  {selectedRequest.status_display || selectedRequest.status?.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getStatusColor(selectedRequest.status) }}>
                  {selectedRequest.priority_display || selectedRequest.priority?.toUpperCase()}
                </span>
                {selectedRequest.is_emergency && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">
                    EMERGENCY
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Contact Information</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.location}</span>
                    </div>
                    {selectedRequest.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.email}</span>
                      </div>
                    )}
                    {selectedRequest.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRequest.experience && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service Details</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.experience}</p>
                  </div>
                )}

                {selectedRequest.garage_name && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Assigned Garage</h4>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.garage_name}</p>
                    {selectedRequest.garage_phone && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">📞 {selectedRequest.garage_phone}</p>
                    )}
                    {selectedRequest.garage_email && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">✉️ {selectedRequest.garage_email}</p>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Financial Info</h4>
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-gray-500">Estimated Cost:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Tsh {selectedRequest.estimated_cost?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-gray-500">Actual Cost:</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Tsh {selectedRequest.actual_cost?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Timeline</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted: {new Date(selectedRequest.submitted_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last Updated: {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedRequest.user_rating && selectedRequest.user_rating > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Rating</h4>
                    <StarRating rating={selectedRequest.user_rating} readonly />
                    {selectedRequest.user_feedback && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{selectedRequest.user_feedback}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowDetail(false)}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-cyan-500/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Request</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.request_code}</p>
              </div>
              <button
                onClick={() => setShowEdit(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Garage Notes</label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Add notes..."
                    rows={3}
                    value={editFormData.garage_notes}
                    onChange={(e) => setEditFormData({...editFormData, garage_notes: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Estimated Cost (Tsh)</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="0"
                    value={editFormData.estimated_cost}
                    onChange={(e) => setEditFormData({...editFormData, estimated_cost: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Actual Cost (Tsh)</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="0"
                    value={editFormData.actual_cost}
                    onChange={(e) => setEditFormData({...editFormData, actual_cost: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(selectedRequest.id, {
                  garage_notes: editFormData.garage_notes,
                  estimated_cost: editFormData.estimated_cost ? parseFloat(editFormData.estimated_cost) : undefined,
                  actual_cost: editFormData.actual_cost ? parseFloat(editFormData.actual_cost) : undefined,
                })}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-cyan-500/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Rate Your Experience</h2>
              <button
                onClick={() => setShowRating(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{selectedRequest.request_code}</p>
              <div className="flex justify-center mb-4">
                <StarRating
                  rating={0}
                  onRatingChange={(rating) => {
                    // Store rating in a ref or state
                  }}
                  size="lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Feedback (Optional)</label>
                <textarea
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Share your experience..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Get rating from state
                  showConfirmationModal('success', 'Thank You!', 'Your feedback has been submitted');
                  setShowRating(false);
                }}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-cyan-500/30"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
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

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{successModal.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{successModal.message}</p>
          </div>
        </div>
      )}

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