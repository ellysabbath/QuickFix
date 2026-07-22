// src/pages/admin/ServiceRequestsManager.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
  Trash2,
  Check,
  XCircle,
  DollarSign,
  FileText,
  Zap,
  Building2,
  Plus,
  Edit2,
  Star,
  Inbox,
  Briefcase,
  AlertCircle,
  MessageCircle,
  
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'https://autofix.pythonanywhere.com/api';
const API_ENDPOINT = `${API_BASE_URL}/service-requests/`;

// Types
interface ServiceRequest {
  id: number;
  request_code: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  experience?: string;
  service_type?: string;
  status: string;
  status_display?: string;
  priority: string;
  priority_display?: string;
  is_emergency: boolean;
  created_at: string;
  submitted_at?: string;
  estimated_cost?: number;
  actual_cost?: number;
  estimated_completion_date?: string;
  garage_notes?: string;
  quote_approved?: boolean;
  user_rating?: number;
  user_feedback?: string;
  garage_name?: string;
  garage_phone?: string;
  garage_email?: string;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  vehicle_type?: string;
  vehicle_year?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  license_plate?: string;
  actual_completion_date?: string;
  updated_at?: string;
}

interface CreateRequestData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  service_type: string;
  priority: string;
  is_emergency: boolean;
  estimated_cost?: number;
  actual_cost?: number;
  estimated_completion_date?: string;
  garage_notes?: string;
  quote_approved?: boolean;
  garage_name?: string;
  garage_phone?: string;
  garage_email?: string;
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  license_plate?: string;
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
}> = ({ rating, onRatingChange, readonly = false }) => {
  const [selectedRating, setSelectedRating] = useState(rating || 0);

  const handleRating = (value: number) => {
    if (readonly) return;
    setSelectedRating(value);
    if (onRatingChange) onRatingChange(value);
  };

  useEffect(() => {
    setSelectedRating(rating || 0);
  }, [rating]);

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
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="w-6 h-6 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
};

// API Functions
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(url, {
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
  
  if (response.status === 204) {
    return { success: true };
  }
  
  return response.json();
};

const apiFunctions = {
  getServiceRequests: async (): Promise<ServiceRequest[]> => {
    try {
      const data = await apiFetch(API_ENDPOINT);
      if (data.results && Array.isArray(data.results)) return data.results;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error: any) {
      console.error('Error fetching service requests:', error);
      throw error;
    }
  },

  getServiceRequestById: async (id: number): Promise<ServiceRequest> => {
    try {
      const data = await apiFetch(`${API_ENDPOINT}${id}/`);
      return data.data || data;
    } catch (error: any) {
      console.error(`Error fetching service request ${id}:`, error);
      throw error;
    }
  },

  createServiceRequest: async (data: CreateRequestData): Promise<any> => {
    try {
      const result = await apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return result;
    } catch (error: any) {
      console.error('Error creating service request:', error);
      throw error;
    }
  },

  updateServiceRequest: async (id: number, data: Partial<CreateRequestData>): Promise<any> => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error(`Invalid request ID: ${id}`);
    }
    
    try {
      const currentData = await apiFunctions.getServiceRequestById(id);
      
      const updatedData = {
        full_name: data.full_name !== undefined ? data.full_name : currentData.full_name,
        email: data.email !== undefined ? data.email : currentData.email,
        phone: data.phone !== undefined ? data.phone : currentData.phone,
        location: data.location !== undefined ? data.location : currentData.location,
        experience: data.experience !== undefined ? data.experience : currentData.experience,
        service_type: data.service_type !== undefined ? data.service_type : currentData.service_type,
        priority: data.priority !== undefined ? data.priority : currentData.priority,
        is_emergency: data.is_emergency !== undefined ? data.is_emergency : currentData.is_emergency,
        estimated_cost: data.estimated_cost !== undefined ? data.estimated_cost : currentData.estimated_cost,
        actual_cost: data.actual_cost !== undefined ? data.actual_cost : currentData.actual_cost,
        estimated_completion_date: data.estimated_completion_date !== undefined ? data.estimated_completion_date : currentData.estimated_completion_date,
        garage_notes: data.garage_notes !== undefined ? data.garage_notes : currentData.garage_notes,
        quote_approved: data.quote_approved !== undefined ? data.quote_approved : currentData.quote_approved,
        garage_name: data.garage_name !== undefined ? data.garage_name : currentData.garage_name,
        garage_phone: data.garage_phone !== undefined ? data.garage_phone : currentData.garage_phone,
        garage_email: data.garage_email !== undefined ? data.garage_email : currentData.garage_email,
        status: currentData.status,
      };
      
      const result = await apiFetch(`${API_ENDPOINT}${id}/`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      return result;
    } catch (error: any) {
      console.error(`Error updating service request ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: number, newStatus: string): Promise<any> => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error(`Invalid request ID: ${id}`);
    }
    
    try {
      const result = await apiFetch(`${API_ENDPOINT}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      return result;
    } catch (error: any) {
      console.error(`Error updating status for request ${id}:`, error);
      throw error;
    }
  },

  deleteServiceRequest: async (id: number): Promise<any> => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error(`Invalid request ID: ${id}`);
    }
    
    try {
      const result = await apiFetch(`${API_ENDPOINT}${id}/`, {
        method: 'DELETE',
      });
      return result;
    } catch (error: any) {
      console.error(`Error deleting service request ${id}:`, error);
      throw error;
    }
  },
};

export default function ServiceRequestsManager() {
  const navigate = useNavigate();
  const { user: _user } = useUser(); // Renamed to indicate intentionally unused
  const [showSidebar, setShowSidebar] = useState(false);

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const [formData, setFormData] = useState<CreateRequestData>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    service_type: '',
    priority: 'medium',
    is_emergency: false,
    estimated_cost: undefined,
    actual_cost: undefined,
    estimated_completion_date: '',
    garage_notes: '',
    quote_approved: false,
    garage_name: '',
    garage_phone: '',
    garage_email: '',
    vehicle_type: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    license_plate: '',
  });

  const [statusModalData, setStatusModalData] = useState({
    requestId: 0,
    currentStatus: '',
    newStatus: ''
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

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b', icon: <Clock className="w-4 h-4" /> },
    { value: 'received', label: 'Received', color: '#3b82f6', icon: <Inbox className="w-4 h-4" /> },
    { value: 'in_progress', label: 'In Progress', color: '#8b5cf6', icon: <Zap className="w-4 h-4" /> },
    { value: 'completed', label: 'Completed', color: '#10b981', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'cancelled', label: 'Cancelled', color: '#64748b', icon: <XCircle className="w-4 h-4" /> },
    { value: 'rejected', label: 'Rejected', color: '#ef4444', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const filterOptions = [
    { value: 'all', label: 'All' },
    ...statusOptions,
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || '#94a3b8';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'urgent': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const loadData = useCallback(async () => {
    try {
      const data = await apiFunctions.getServiceRequests();
      setRequests(data);
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.data?.detail || error.data?.error || 'Failed to load service requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleCreate = async (data: CreateRequestData) => {
    setIsSubmitting(true);
    try {
      const result = await apiFunctions.createServiceRequest(data);
      if (result.id || result.success) {
        showConfirmationModal('success', 'Success!', 'Service request created successfully!');
        setShowFormModal(false);
        loadData();
      } else {
        throw new Error(result.error || 'Failed to create request');
      }
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.data?.detail || error.data?.error || 'Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateRequestData, id?: number) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const result = await apiFunctions.updateServiceRequest(id, data);
      if (result.id || result.success) {
        showConfirmationModal('success', 'Success!', 'Service request updated successfully!');
        setShowFormModal(false);
        setShowDetail(false);
        loadData();
      } else {
        throw new Error(result.error || 'Failed to update request');
      }
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.data?.detail || error.data?.error || 'Failed to update request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    if (typeof requestId !== 'number') {
      showConfirmationModal('error', 'Error', 'Invalid request ID');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiFunctions.updateStatus(requestId, newStatus);
      const statusDisplay = newStatus.replace('_', ' ').toUpperCase();
      showConfirmationModal('success', 'Success!', `Status changed to ${statusDisplay}`);
      await loadData();
      setShowStatusModal(false);
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.data?.detail || error.data?.error || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      await apiFunctions.deleteServiceRequest(id);
      showConfirmationModal('success', 'Deleted!', 'Service request deleted successfully!');
      setShowDetail(false);
      loadData();
    } catch (error: any) {
      showConfirmationModal('error', 'Error', error.data?.detail || error.data?.error || 'Failed to delete request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...requests];
    
    if (filter !== 'all') {
      filtered = filtered.filter(req => req.status === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.full_name?.toLowerCase().includes(query) ||
        req.email?.toLowerCase().includes(query) ||
        req.phone?.includes(query) ||
        req.request_code?.toLowerCase().includes(query) ||
        req.service_type?.toLowerCase().includes(query) ||
        req.location?.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, filter, searchQuery]);

  // Loading State
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading service requests...</p>
      </div>
    );
  }

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    urgent: requests.filter(r => r.is_emergency || r.priority === 'urgent').length,
  };

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
                  {filteredRequests.length} requests found
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    full_name: '',
                    email: '',
                    phone: '',
                    location: '',
                    experience: '',
                    service_type: '',
                    priority: 'medium',
                    is_emergency: false,
                    estimated_cost: undefined,
                    actual_cost: undefined,
                    estimated_completion_date: '',
                    garage_notes: '',
                    quote_approved: false,
                    garage_name: '',
                    garage_phone: '',
                    garage_email: '',
                    vehicle_type: '',
                    vehicle_make: '',
                    vehicle_model: '',
                    vehicle_year: '',
                    license_plate: '',
                  });
                  setShowFormModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors shadow-md shadow-cyan-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Search by name, email, phone, request code..."
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

      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Total</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-yellow-500">{stats.pending}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-purple-500">{stats.in_progress}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">In Progress</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-green-500">{stats.completed}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-red-500">{stats.rejected}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Rejected</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-red-600">{stats.urgent}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Urgent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={`filter-${option.value}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  filter === option.value
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
                {option.value !== 'all' && (
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] ${
                    filter === option.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {requests.filter(r => r.status === option.value).length}
                  </span>
                )}
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Service Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'No requests match the current filter'}
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
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSelectedRequest(request);
                  setShowDetail(true);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {request.full_name}
                    </p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                      {request.request_code}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getPriorityColor(request.priority) }}
                    >
                      {request.priority_display || request.priority?.toUpperCase()}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status_display || request.status?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    <span className="truncate">{request.service_type || 'Service not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{request.location}</span>
                  </div>
                  {request.estimated_cost && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        TZS {request.estimated_cost.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {request.is_emergency && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertCircle className="w-3 h-3" />
                      <span className="font-semibold">EMERGENCY</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateTime(request.created_at)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(request);
                      setShowDetail(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(request);
                      setStatusModalData({
                        requestId: request.id,
                        currentStatus: request.status,
                        newStatus: request.status
                      });
                      setShowStatusModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      {showDetail && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
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

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Customer Information */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Customer Information</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRequest.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.location}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service Details</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Service:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.service_type || 'Not specified'}</span>
                  </div>
                  {selectedRequest.experience && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-cyan-500 mt-0.5" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Description:</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedRequest.experience}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white`}
                      style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                    >
                      {selectedRequest.status_display || selectedRequest.status?.replace('_', ' ') || 'Unknown'}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white`}
                      style={{ backgroundColor: getPriorityColor(selectedRequest.priority) }}
                    >
                      {selectedRequest.priority_display || selectedRequest.priority?.toUpperCase()}
                    </span>
                    {selectedRequest.is_emergency && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">
                        EMERGENCY
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              {(selectedRequest.vehicle_make || selectedRequest.vehicle_model || selectedRequest.license_plate) && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                    {(selectedRequest.vehicle_make || selectedRequest.vehicle_model) && (
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Vehicle:</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {[selectedRequest.vehicle_make, selectedRequest.vehicle_model, selectedRequest.vehicle_year]
                            .filter(Boolean).join(' ')}
                        </span>
                      </div>
                    )}
                    {selectedRequest.license_plate && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Plate:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.license_plate}</span>
                      </div>
                    )}
                    {selectedRequest.vehicle_type && (
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Type:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.vehicle_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Garage Information */}
              {(selectedRequest.garage_name || selectedRequest.garage_phone) && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Garage Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                    {selectedRequest.garage_name && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Garage:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.garage_name}</span>
                      </div>
                    )}
                    {selectedRequest.garage_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Phone:</span>
                        <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.garage_phone}</span>
                      </div>
                    )}
                    {selectedRequest.garage_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                        <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.garage_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cost Information */}
              {(selectedRequest.estimated_cost || selectedRequest.actual_cost) && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cost Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                    {selectedRequest.estimated_cost && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Estimated:</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          TZS {selectedRequest.estimated_cost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedRequest.actual_cost && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Actual:</span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          TZS {selectedRequest.actual_cost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedRequest.estimated_completion_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Est. Completion:</span>
                        <span className="text-sm text-purple-600 dark:text-purple-400">{selectedRequest.estimated_completion_date}</span>
                      </div>
                    )}
                    {selectedRequest.quote_approved !== undefined && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Quote Approved:</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {selectedRequest.quote_approved ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Garage Notes */}
              {selectedRequest.garage_notes && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Garage Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.garage_notes}</p>
                  </div>
                </div>
              )}

              {/* User Feedback */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">User Feedback</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Rating:</span>
                    <StarRating rating={selectedRequest.user_rating || 0} readonly />
                  </div>
                  {selectedRequest.user_feedback && (
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-cyan-500 mt-0.5" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Feedback:</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.user_feedback}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Timeline</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-700 dark:text-gray-300">{formatDateTime(selectedRequest.created_at)}</span>
                  </div>
                  {selectedRequest.updated_at && selectedRequest.updated_at !== selectedRequest.created_at && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-700 dark:text-gray-300">{formatDateTime(selectedRequest.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setIsEditing(true);
                    setFormData({
                      full_name: selectedRequest.full_name || '',
                      email: selectedRequest.email || '',
                      phone: selectedRequest.phone || '',
                      location: selectedRequest.location || '',
                      experience: selectedRequest.experience || '',
                      service_type: selectedRequest.service_type || '',
                      priority: selectedRequest.priority || 'medium',
                      is_emergency: selectedRequest.is_emergency || false,
                      estimated_cost: selectedRequest.estimated_cost,
                      actual_cost: selectedRequest.actual_cost,
                      estimated_completion_date: selectedRequest.estimated_completion_date || '',
                      garage_notes: selectedRequest.garage_notes || '',
                      quote_approved: selectedRequest.quote_approved || false,
                      garage_name: selectedRequest.garage_name || '',
                      garage_phone: selectedRequest.garage_phone || '',
                      garage_email: selectedRequest.garage_email || '',
                      vehicle_type: selectedRequest.vehicle_type || '',
                      vehicle_make: selectedRequest.vehicle_make || '',
                      vehicle_model: selectedRequest.vehicle_model || '',
                      vehicle_year: selectedRequest.vehicle_year || '',
                      license_plate: selectedRequest.license_plate || '',
                    });
                    setShowFormModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setSelectedRequest(selectedRequest);
                    setStatusModalData({
                      requestId: selectedRequest.id,
                      currentStatus: selectedRequest.status,
                      newStatus: selectedRequest.status
                    });
                    setShowStatusModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Status
                </button>
                <button
                  onClick={() => {
                    showConfirmationModal(
                      'confirm',
                      'Delete Request',
                      `Are you sure you want to delete request ${selectedRequest.request_code}? This action cannot be undone.`,
                      () => handleDelete(selectedRequest.id),
                      undefined,
                      'Delete',
                      'Cancel'
                    );
                    setShowDetail(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal - SCROLLABLE */}
      {showStatusModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Update Status</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.request_code}</p>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {selectedRequest.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {selectedRequest.service_type || 'No service specified'}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                  >
                    {selectedRequest.status_display || selectedRequest.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Status Options */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Select New Status</p>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      statusModalData.newStatus === option.value
                        ? `border-[${option.color}] bg-[${option.color}]/10`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{
                      borderColor: statusModalData.newStatus === option.value ? option.color : undefined,
                      backgroundColor: statusModalData.newStatus === option.value ? `${option.color}10` : undefined
                    }}
                    onClick={() => setStatusModalData(prev => ({ ...prev, newStatus: option.value }))}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.value === 'pending' && 'Awaiting review'}
                        {option.value === 'received' && 'Request received'}
                        {option.value === 'in_progress' && 'Being worked on'}
                        {option.value === 'completed' && 'Work completed'}
                        {option.value === 'cancelled' && 'Request cancelled'}
                        {option.value === 'rejected' && 'Request rejected'}
                      </p>
                    </div>
                    {statusModalData.newStatus === option.value && (
                      <Check className="w-5 h-5 flex-shrink-0" style={{ color: option.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (statusModalData.newStatus !== statusModalData.currentStatus) {
                    handleStatusUpdate(statusModalData.requestId, statusModalData.newStatus);
                  } else {
                    setShowStatusModal(false);
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Request' : 'New Service Request'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter full name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email *</label>
                    <input
                      type="email"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone *</label>
                    <input
                      type="tel"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Location *</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter service location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Service Type *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Oil Change, Brake Repair"
                    value={formData.service_type}
                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Describe the service needs in detail..."
                    rows={3}
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Priority</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['low', 'medium', 'high', 'urgent'].map((priority) => (
                      <button
                        key={priority}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          formData.priority === priority
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                        }`}
                        style={{
                          backgroundColor: formData.priority === priority ? getPriorityColor(priority) : undefined
                        }}
                        onClick={() => setFormData({...formData, priority})}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Emergency Request</label>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.is_emergency ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setFormData({...formData, is_emergency: !formData.is_emergency})}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.is_emergency ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Vehicle Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Make/Brand</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="e.g., Toyota"
                        value={formData.vehicle_make}
                        onChange={(e) => setFormData({...formData, vehicle_make: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Model</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="e.g., Corolla"
                        value={formData.vehicle_model}
                        onChange={(e) => setFormData({...formData, vehicle_model: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Year</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="e.g., 2020"
                        value={formData.vehicle_year}
                        onChange={(e) => setFormData({...formData, vehicle_year: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">License Plate</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter license plate"
                        value={formData.license_plate}
                        onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Vehicle Type</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g., Sedan, SUV, Truck"
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Garage Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Garage Name</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter garage name"
                        value={formData.garage_name}
                        onChange={(e) => setFormData({...formData, garage_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Garage Phone</label>
                      <input
                        type="tel"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter garage phone"
                        value={formData.garage_phone}
                        onChange={(e) => setFormData({...formData, garage_phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Garage Email</label>
                    <input
                      type="email"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter garage email"
                      value={formData.garage_email}
                      onChange={(e) => setFormData({...formData, garage_email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Cost Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Estimated Cost (TZS)</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter estimated cost"
                        value={formData.estimated_cost || ''}
                        onChange={(e) => setFormData({...formData, estimated_cost: e.target.value ? parseFloat(e.target.value) : undefined})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Actual Cost (TZS)</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter actual cost"
                        value={formData.actual_cost || ''}
                        onChange={(e) => setFormData({...formData, actual_cost: e.target.value ? parseFloat(e.target.value) : undefined})}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Estimated Completion Date</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="dd/mm/yyyy"
                      value={formData.estimated_completion_date}
                      onChange={(e) => setFormData({...formData, estimated_completion_date: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Quote Approved</label>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.quote_approved ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      onClick={() => setFormData({...formData, quote_approved: !formData.quote_approved})}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        formData.quote_approved ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Garage Notes</label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Notes from the garage..."
                    rows={2}
                    value={formData.garage_notes}
                    onChange={(e) => setFormData({...formData, garage_notes: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <button
                onClick={() => setShowFormModal(false)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isEditing && selectedRequest) {
                    handleUpdate(formData, selectedRequest.id);
                  } else {
                    handleCreate(formData);
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  isEditing ? 'Update' : 'Create'
                )}
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