import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Mock data
const mockRequests: ServiceRequest[] = [
  {
    id: 1,
    request_code: 'SR-2024-001',
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '+255 712 345 678',
    location: 'Dar es Salaam, Tanzania',
    experience: 'Engine making strange noise',
    service_type: 'Engine Diagnostics',
    status: 'pending',
    status_display: 'Pending',
    priority: 'high',
    priority_display: 'High',
    is_emergency: true,
    created_at: new Date().toISOString(),
    estimated_cost: 150000,
    quote_approved: false,
    vehicle_make: 'Toyota',
    vehicle_model: 'Corolla',
    vehicle_year: '2020',
    license_plate: 'T123ABC',
  },
  {
    id: 2,
    request_code: 'SR-2024-002',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+255 713 456 789',
    location: 'Arusha, Tanzania',
    experience: 'Brake pads need replacement',
    service_type: 'Brake Repair',
    status: 'in_progress',
    status_display: 'In Progress',
    priority: 'medium',
    priority_display: 'Medium',
    is_emergency: false,
    created_at: new Date().toISOString(),
    estimated_cost: 80000,
    quote_approved: true,
    garage_name: 'Elite Auto Garage',
    garage_phone: '+255 765 432 101',
    garage_email: 'info@eliteauto.co.tz',
    vehicle_make: 'Honda',
    vehicle_model: 'Civic',
    vehicle_year: '2019',
    license_plate: 'T456DEF',
  },
  {
    id: 3,
    request_code: 'SR-2024-003',
    full_name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+255 714 567 890',
    location: 'Mwanza, Tanzania',
    experience: 'Regular oil change and filter',
    service_type: 'Oil Change',
    status: 'completed',
    status_display: 'Completed',
    priority: 'low',
    priority_display: 'Low',
    is_emergency: false,
    created_at: new Date().toISOString(),
    estimated_cost: 50000,
    actual_cost: 45000,
    quote_approved: true,
    garage_name: 'QuickFix Motors',
    garage_phone: '+255 765 432 102',
    vehicle_make: 'BMW',
    vehicle_model: 'X5',
    vehicle_year: '2022',
    license_plate: 'T789GHI',
  },
];

// Status options
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: '#64748b' },
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'received', label: 'Received', color: '#3b82f6' },
  { value: 'in_progress', label: 'In Progress', color: '#8b5cf6' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelled', color: '#64748b' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' },
];

const ServiceRequestsManager: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>(mockRequests);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
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

  const [statusForm, setStatusForm] = useState('pending');

  // Filter requests
  useEffect(() => {
    let filtered = requests;
    
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.status === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.full_name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.phone.includes(query) ||
        r.location.toLowerCase().includes(query) ||
        r.request_code.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, filter, searchQuery]);

  // Get status color
  const getStatusColor = (status: string): string => {
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

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'urgent': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Handle create
  const handleCreate = async (data: CreateRequestData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRequest: ServiceRequest = {
      id: Date.now(),
      request_code: 'SR-2024-' + String(Date.now()).slice(-4),
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      experience: data.experience,
      service_type: data.service_type,
      status: 'pending',
      status_display: 'Pending',
      priority: data.priority,
      priority_display: data.priority.charAt(0).toUpperCase() + data.priority.slice(1),
      is_emergency: data.is_emergency,
      created_at: new Date().toISOString(),
      estimated_cost: data.estimated_cost,
      quote_approved: data.quote_approved || false,
      garage_name: data.garage_name,
      garage_phone: data.garage_phone,
      garage_email: data.garage_email,
      vehicle_make: data.vehicle_make,
      vehicle_model: data.vehicle_model,
      vehicle_year: data.vehicle_year,
      license_plate: data.license_plate,
    };

    setRequests(prev => [newRequest, ...prev]);
    setSuccessMessage('Service request created successfully!');
    setShowSuccessModal(true);
    setShowFormModal(false);
    setIsSubmitting(false);
  };

  // Handle update
  const handleUpdate = async (data: CreateRequestData, id?: number) => {
    if (!id) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, ...data } : r
    ));
    
    setSuccessMessage('Service request updated successfully!');
    setShowSuccessModal(true);
    setShowFormModal(false);
    setShowDetail(false);
    setIsSubmitting(false);
  };

  // Handle status update
  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const statusDisplay = STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: newStatus, status_display: statusDisplay } : r
    ));
    
    setSuccessMessage(`Status changed to ${statusDisplay}`);
    setShowSuccessModal(true);
    setShowStatusModal(false);
    setIsSubmitting(false);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setRequests(prev => prev.filter(r => r.id !== id));
    setSuccessMessage('Service request deleted successfully!');
    setShowSuccessModal(true);
    setShowDetail(false);
    setShowDeleteModal(false);
    setIsSubmitting(false);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  // Open edit modal
  const openEditModal = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setFormData({
      full_name: request.full_name || '',
      email: request.email || '',
      phone: request.phone || '',
      location: request.location || '',
      experience: request.experience || '',
      service_type: request.service_type || '',
      priority: request.priority || 'medium',
      is_emergency: request.is_emergency || false,
      estimated_cost: request.estimated_cost,
      actual_cost: request.actual_cost,
      estimated_completion_date: request.estimated_completion_date || '',
      garage_notes: request.garage_notes || '',
      quote_approved: request.quote_approved || false,
      garage_name: request.garage_name || '',
      garage_phone: request.garage_phone || '',
      garage_email: request.garage_email || '',
      vehicle_type: request.vehicle_type || '',
      vehicle_make: request.vehicle_make || '',
      vehicle_model: request.vehicle_model || '',
      vehicle_year: request.vehicle_year || '',
      license_plate: request.license_plate || '',
    });
    setIsEditing(true);
    setShowFormModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    setSelectedRequest(null);
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
    setIsEditing(false);
    setShowFormModal(true);
  };

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    urgent: requests.filter(r => r.is_emergency || r.priority === 'urgent').length,
  };

  // Star Rating component
  const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }> = ({ 
    rating, onRatingChange, readonly = false 
  }) => {
    const [selectedRating, setSelectedRating] = useState(rating || 0);

    useEffect(() => {
      setSelectedRating(rating || 0);
    }, [rating]);

    const handleRating = (value: number) => {
      if (readonly) return;
      setSelectedRating(value);
      if (onRatingChange) onRatingChange(value);
    };

    return (
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            disabled={readonly}
            className="text-2xl focus:outline-none"
          >
            <span className={star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Success Modal
  const SuccessModal: React.FC<{ visible: boolean; message: string; onClose: () => void }> = ({ visible, message, onClose }) => {
    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => onClose(), 2500);
        return () => clearTimeout(timer);
      }
    }, [visible]);

    if (!visible) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30 animate-pulse">
            <span className="text-white text-5xl font-light">✓</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  };

  // Confirmation Modal
  const ConfirmationModal: React.FC<{
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }> = ({ visible, message, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-red-500">!</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/30 transition-all duration-200"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Service Request Card
  const ServiceRequestCard: React.FC<{ request: ServiceRequest }> = ({ request }) => {
    const statusColor = getStatusColor(request.status);
    const priorityColor = getPriorityColor(request.priority);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        onClick={() => {
          setSelectedRequest(request);
          setShowDetail(true);
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30 flex items-center justify-center flex-shrink-0">
            <span className="text-cyan-600 dark:text-cyan-400 text-xl font-bold">
              {request.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {request.full_name}
                </h3>
                <p className="text-xs text-cyan-500 font-mono">{request.request_code}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: priorityColor + '20', color: priorityColor }}>
                  {request.priority_display || request.priority.toUpperCase()}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: statusColor }}>
                  {request.status_display || request.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
              <span className="flex items-center gap-0.5">📍 {request.location}</span>
              <span className="flex items-center gap-0.5">🔧 {request.service_type || 'Not specified'}</span>
            </div>
            
            {request.estimated_cost && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Est: TZS {request.estimated_cost.toLocaleString()}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-gray-400">
                {formatDate(request.created_at)}
              </span>
              <button
                className="flex items-center gap-1 text-[10px] text-cyan-500 hover:text-cyan-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRequest(request);
                  setStatusForm(request.status);
                  setShowStatusModal(true);
                }}
              >
                <span>⟳</span> Change Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Status Update Modal
  const StatusUpdateModal: React.FC<{
    visible: boolean;
    request: ServiceRequest | null;
    onClose: () => void;
    onUpdate: (id: number, status: string) => Promise<void>;
    isLoading: boolean;
  }> = ({ visible, request, onClose, onUpdate, isLoading }) => {
    const [status, setStatus] = useState('pending');

    useEffect(() => {
      if (visible && request) {
        setStatus(request.status);
      }
    }, [visible, request]);

    if (!visible || !request) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update Status</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Request: <span className="font-bold text-gray-900 dark:text-white">{request.full_name}</span>
            </p>
            <p className="text-xs text-cyan-500">{request.request_code}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Current Status:</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: getStatusColor(request.status) }}>
                {request.status_display || request.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select New Status</h4>

          <div className="space-y-2 mb-6">
            {STATUS_OPTIONS.filter(opt => opt.value !== 'all').map((option) => (
              <button
                key={option.value}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                  status === option.value
                    ? 'border-' + option.color.replace('#', '') + ' bg-' + option.color.replace('#', '') + '10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                style={{
                  borderColor: status === option.value ? option.color : '',
                  backgroundColor: status === option.value ? option.color + '20' : '',
                }}
                onClick={() => setStatus(option.value)}
                disabled={isLoading}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: option.color }}>
                  <span className="text-white text-sm font-bold">
                    {option.label.charAt(0)}
                  </span>
                </div>
                <span className="flex-1 text-left font-medium" style={{ color: status === option.value ? option.color : '#0f172a' }}>
                  {option.label}
                </span>
                {status === option.value && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className={`flex-1 py-3.5 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/30 ${
                isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
              }`}
              onClick={() => onUpdate(request.id, status)}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Detail View Modal
  const DetailViewModal: React.FC<{
    visible: boolean;
    request: ServiceRequest | null;
    onClose: () => void;
    onEdit: (request: ServiceRequest) => void;
    onDelete: (id: number) => void;
    onStatusUpdate: (request: ServiceRequest) => void;
  }> = ({ visible, request, onClose, onEdit, onDelete, onStatusUpdate }) => {
    const [userRating, setUserRating] = useState(0);
    const [isUpdatingRating, setIsUpdatingRating] = useState(false);

    useEffect(() => {
      if (visible && request) {
        setUserRating(request.user_rating || 0);
      }
    }, [visible, request]);

    if (!visible || !request) return null;

    const handleRatingUpdate = async (rating: number) => {
      setIsUpdatingRating(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserRating(rating);
      setIsUpdatingRating(false);
      // Update in parent
      setRequests(prev => prev.map(r =>
        r.id === request.id ? { ...r, user_rating: rating } : r
      ));
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Request Details</h3>
              <p className="text-sm text-white/90">{request.request_code}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl font-bold transition-all duration-200 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Customer Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium text-gray-900 dark:text-white">{request.full_name}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="font-medium text-cyan-500">{request.email}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Phone:</span> <span className="font-medium text-cyan-500">{request.phone}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Location:</span> <span className="font-medium text-gray-900 dark:text-white">{request.location}</span></div>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <span className="text-xs px-3 py-1 rounded-full font-bold text-white" style={{ backgroundColor: getStatusColor(request.status) }}>
                    {request.status_display || request.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                  <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ backgroundColor: getPriorityColor(request.priority) + '20', color: getPriorityColor(request.priority) }}>
                    {request.priority_display || request.priority.toUpperCase()}
                  </span>
                </div>
                {request.is_emergency && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                    🚨 EMERGENCY
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Details</h4>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{request.service_type || 'Not specified'}</p>
              {request.experience && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{request.experience}</p>
              )}
            </div>

            {/* Vehicle Info */}
            {(request.vehicle_make || request.vehicle_model || request.license_plate) && (
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vehicle Information</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {request.vehicle_make && <div><span className="text-gray-500 dark:text-gray-400">Make:</span> <span className="font-medium text-gray-900 dark:text-white">{request.vehicle_make}</span></div>}
                  {request.vehicle_model && <div><span className="text-gray-500 dark:text-gray-400">Model:</span> <span className="font-medium text-gray-900 dark:text-white">{request.vehicle_model}</span></div>}
                  {request.vehicle_year && <div><span className="text-gray-500 dark:text-gray-400">Year:</span> <span className="font-medium text-gray-900 dark:text-white">{request.vehicle_year}</span></div>}
                  {request.license_plate && <div><span className="text-gray-500 dark:text-gray-400">Plate:</span> <span className="font-medium text-gray-900 dark:text-white">{request.license_plate}</span></div>}
                </div>
              </div>
            )}

            {/* Garage Info */}
            {request.garage_name && (
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Garage Information</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium text-gray-900 dark:text-white">{request.garage_name}</span></div>
                  {request.garage_phone && <div><span className="text-gray-500 dark:text-gray-400">Phone:</span> <span className="font-medium text-cyan-500">{request.garage_phone}</span></div>}
                  {request.garage_email && <div><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="font-medium text-cyan-500">{request.garage_email}</span></div>}
                </div>
              </div>
            )}

            {/* Cost Info */}
            {(request.estimated_cost || request.actual_cost) && (
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cost Information</h4>
                <div className="space-y-1 text-sm">
                  {request.estimated_cost && <div><span className="text-gray-500 dark:text-gray-400">Estimated:</span> <span className="font-medium text-gray-900 dark:text-white">TZS {request.estimated_cost.toLocaleString()}</span></div>}
                  {request.actual_cost && <div><span className="text-gray-500 dark:text-gray-400">Actual:</span> <span className="font-medium text-green-500">TZS {request.actual_cost.toLocaleString()}</span></div>}
                  {request.quote_approved !== undefined && (
                    <div><span className="text-gray-500 dark:text-gray-400">Quote Approved:</span> <span className={`font-medium ${request.quote_approved ? 'text-green-500' : 'text-red-500'}`}>{request.quote_approved ? 'Yes' : 'No'}</span></div>
                  )}
                </div>
              </div>
            )}

            {/* Garage Notes */}
            {request.garage_notes && (
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Garage Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{request.garage_notes}</p>
              </div>
            )}

            {/* User Rating */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">User Feedback</h4>
              <StarRating rating={userRating} onRatingChange={handleRatingUpdate} readonly={isUpdatingRating} />
              {request.user_feedback && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{request.user_feedback}</p>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Timeline</h4>
              <div className="space-y-1 text-xs">
                <div><span className="text-gray-500 dark:text-gray-400">Created:</span> <span className="text-gray-700 dark:text-gray-300">{formatDate(request.created_at)}</span></div>
                {request.updated_at && request.updated_at !== request.created_at && (
                  <div><span className="text-gray-500 dark:text-gray-400">Last Updated:</span> <span className="text-gray-700 dark:text-gray-300">{formatDate(request.updated_at)}</span></div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  onEdit(request);
                }}
              >
                ✏ Edit
              </button>
              <button
                className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  onStatusUpdate(request);
                }}
              >
                ⟳ Status
              </button>
              <button
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  onDelete(request.id);
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading service requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-cyan-500/30"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  Service Requests
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              >
                ⟳
              </button>
              <button
                onClick={openAddModal}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                +
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-700/50 rounded-2xl px-5 py-3 mb-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <span className="text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
              placeholder="Search by name, email, phone, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-lg font-bold">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-2xl font-bold text-purple-500">{stats.in_progress}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rejected</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Urgent</p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === option.value
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        {filteredRequests.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-5xl font-bold text-gray-400 dark:text-gray-500">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No service requests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first service request'}
            </p>
            {!searchQuery && (
              <button
                onClick={openAddModal}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                + Add First Request
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((request) => (
              <ServiceRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Request' : 'New Service Request'}
                </h3>
                <p className="text-sm text-white/90">
                  {isEditing ? 'Update service request details' : 'Create a new service request'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedRequest(null);
                  setIsEditing(false);
                }}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl font-bold transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="Enter full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="+255 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="e.g., Oil Change, Brake Repair"
                    value={formData.service_type}
                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Priority</label>
                  <div className="flex gap-2 flex-wrap">
                    {['low', 'medium', 'high', 'urgent'].map((priority) => (
                      <button
                        key={priority}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          formData.priority === priority
                            ? `bg-${priority === 'low' ? 'green' : priority === 'medium' ? 'yellow' : priority === 'high' ? 'orange' : 'red'}-500 text-white`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setFormData({...formData, priority})}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emergency Switch */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Emergency Request</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mark as emergency for immediate attention</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      formData.is_emergency ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setFormData({...formData, is_emergency: !formData.is_emergency})}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                      formData.is_emergency ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </button>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Service Description</label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none resize-none min-h-[80px]"
                    placeholder="Describe the service needs in detail..."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    rows={3}
                  />
                </div>

                {/* Vehicle Info */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Vehicle Information</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Make/Brand"
                      value={formData.vehicle_make}
                      onChange={(e) => setFormData({...formData, vehicle_make: e.target.value})}
                    />
                    <input
                      type="text"
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Model"
                      value={formData.vehicle_model}
                      onChange={(e) => setFormData({...formData, vehicle_model: e.target.value})}
                    />
                    <input
                      type="text"
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Year"
                      value={formData.vehicle_year}
                      onChange={(e) => setFormData({...formData, vehicle_year: e.target.value})}
                    />
                    <input
                      type="text"
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="License Plate"
                      value={formData.license_plate}
                      onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Garage Info */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Garage Information</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Garage Name"
                      value={formData.garage_name}
                      onChange={(e) => setFormData({...formData, garage_name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
                        className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                        placeholder="Garage Phone"
                        value={formData.garage_phone}
                        onChange={(e) => setFormData({...formData, garage_phone: e.target.value})}
                      />
                      <input
                        type="email"
                        className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                        placeholder="Garage Email"
                        value={formData.garage_email}
                        onChange={(e) => setFormData({...formData, garage_email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Info */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Cost Information</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Estimated Cost"
                      value={formData.estimated_cost || ''}
                      onChange={(e) => setFormData({...formData, estimated_cost: e.target.value ? parseFloat(e.target.value) : undefined})}
                    />
                    <input
                      type="number"
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                      placeholder="Actual Cost"
                      value={formData.actual_cost || ''}
                      onChange={(e) => setFormData({...formData, actual_cost: e.target.value ? parseFloat(e.target.value) : undefined})}
                    />
                  </div>
                </div>

                {/* Quote Approved */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quote Approved</label>
                  <button
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      formData.quote_approved ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setFormData({...formData, quote_approved: !formData.quote_approved})}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                      formData.quote_approved ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </button>
                </div>

                {/* Garage Notes */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Garage Notes</label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none resize-none min-h-[60px]"
                    placeholder="Notes from the garage..."
                    value={formData.garage_notes}
                    onChange={(e) => setFormData({...formData, garage_notes: e.target.value})}
                    rows={2}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
                    onClick={() => {
                      setShowFormModal(false);
                      setSelectedRequest(null);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50"
                    onClick={() => {
                      if (isEditing && selectedRequest) {
                        handleUpdate(formData, selectedRequest.id);
                      } else {
                        handleCreate(formData);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Request' : 'Create Request')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedRequest && (
        <StatusUpdateModal
          visible={showStatusModal}
          request={selectedRequest}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdate}
          isLoading={isSubmitting}
        />
      )}

      {/* Detail View Modal */}
      {showDetail && selectedRequest && (
        <DetailViewModal
          visible={showDetail}
          request={selectedRequest}
          onClose={() => setShowDetail(false)}
          onEdit={openEditModal}
          onDelete={(id) => {
            setShowDetail(false);
            setSelectedRequest(requests.find(r => r.id === id) || null);
            setShowDeleteModal(true);
          }}
          onStatusUpdate={(req) => {
            setShowDetail(false);
            setSelectedRequest(req);
            setShowStatusModal(true);
          }}
        />
      )}

      {/* Delete Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        message="Are you sure you want to delete this service request? This action cannot be undone."
        onConfirm={() => {
          if (selectedRequest) {
            handleDelete(selectedRequest.id);
          }
        }}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default ServiceRequestsManager;