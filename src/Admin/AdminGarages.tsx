// src/pages/admin/WorkshopsManagement.tsx

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
  Building2,
  Calendar,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Power,
  PowerOff,
  Check,
  XCircle,
  DollarSign,
  FileText,
  Zap,
  ExternalLink,
  ChevronDown,
  Navigation,
  Globe,
  Shield,
  Award,
  Smartphone,
  Copy,
  QrCode,
  Briefcase,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Wrench,
  
  Car,
  Factory,
  Home,
  Users,
  Star,
  Settings
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const WORKSHOPS_ENDPOINT = `${API_BASE_URL}/api/auto-workshops/`;

// Types
interface Workshop {
  id: number;
  workshop_name: string;
  workshop_owner: number | null;
  workshop_owner_name?: string;
  workshop_owner_phone?: string;
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
}

interface WorkshopFormData {
  workshop_name: string;
  workshop_email: string;
  workshop_phone: string;
  workshop_address: string;
  workshop_city: string;
  workshop_latitude: string;
  workshop_longitude: string;
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

export default function WorkshopsManagement() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  // State
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Form Data
  const [formData, setFormData] = useState<WorkshopFormData>({
    workshop_name: '',
    workshop_email: '',
    workshop_phone: '',
    workshop_address: '',
    workshop_city: '',
    workshop_latitude: '',
    workshop_longitude: '',
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

  // Fetch workshops
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await fetch(WORKSHOPS_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const workshopsList = data.results || data;
      setWorkshops(Array.isArray(workshopsList) ? workshopsList : []);
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      showConfirmationModal('error', 'Error', error.message || 'Failed to load workshops');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWorkshops();
  }, []);

  // Filter workshops
  const filteredWorkshops = workshops.filter(workshop =>
    workshop.workshop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.workshop_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.workshop_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.workshop_phone?.includes(searchQuery)
  );

  // Open add modal
  const handleAdd = () => {
    setEditingWorkshop(null);
    setFormData({
      workshop_name: '',
      workshop_email: '',
      workshop_phone: '',
      workshop_address: '',
      workshop_city: '',
      workshop_latitude: '',
      workshop_longitude: '',
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      workshop_name: workshop.workshop_name || '',
      workshop_email: workshop.workshop_email || '',
      workshop_phone: workshop.workshop_phone || '',
      workshop_address: workshop.workshop_address || '',
      workshop_city: workshop.workshop_city || '',
      workshop_latitude: workshop.workshop_latitude || '',
      workshop_longitude: workshop.workshop_longitude || '',
    });
    setShowModal(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.workshop_name.trim()) {
      showConfirmationModal('error', 'Error', 'Workshop name is required');
      return false;
    }
    if (!formData.workshop_email.trim()) {
      showConfirmationModal('error', 'Error', 'Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workshop_email)) {
      showConfirmationModal('error', 'Error', 'Enter a valid email address');
      return false;
    }
    if (!formData.workshop_phone.trim()) {
      showConfirmationModal('error', 'Error', 'Phone number is required');
      return false;
    }
    if (!formData.workshop_address.trim()) {
      showConfirmationModal('error', 'Error', 'Address is required');
      return false;
    }
    return true;
  };

  // Save workshop
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const submitData = {
      workshop_name: formData.workshop_name.trim(),
      workshop_email: formData.workshop_email.trim(),
      workshop_phone: formData.workshop_phone.trim(),
      workshop_address: formData.workshop_address.trim(),
      workshop_city: formData.workshop_city.trim() || null,
      workshop_latitude: formData.workshop_latitude ? parseFloat(formData.workshop_latitude) : null,
      workshop_longitude: formData.workshop_longitude ? parseFloat(formData.workshop_longitude) : null,
    };
    
    try {
      let response;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (editingWorkshop) {
        response = await fetch(`${WORKSHOPS_ENDPOINT}${editingWorkshop.id}/`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch(WORKSHOPS_ENDPOINT, {
          method: 'POST',
          headers,
          body: JSON.stringify(submitData),
        });
      }
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        let errorMessage = 'Failed to save workshop';
        if (responseData && typeof responseData === 'object') {
          const errors = Object.entries(responseData)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
          if (errors) errorMessage = errors;
        }
        throw new Error(errorMessage);
      }
      
      showConfirmationModal('success', 'Success!', editingWorkshop ? 'Workshop updated successfully!' : 'Workshop added successfully!');
      setShowModal(false);
      fetchWorkshops();
      
    } catch (error: any) {
      console.error('Save error:', error);
      showConfirmationModal('error', 'Error', error.message || 'Failed to save workshop');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete workshop
  const handleDelete = (workshopId: number) => {
    showConfirmationModal(
      'confirm',
      'Delete Workshop',
      'Are you sure you want to delete this workshop? This action cannot be undone.',
      async () => {
        setIsSubmitting(true);
        try {
          const response = await fetch(`${WORKSHOPS_ENDPOINT}${workshopId}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          
          if (response.status !== 204 && !response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
          }
          
          showConfirmationModal('success', 'Deleted!', 'Workshop deleted successfully!');
          fetchWorkshops();
          
        } catch (error: any) {
          console.error('Delete error:', error);
          showConfirmationModal('error', 'Error', error.message || 'Failed to delete workshop');
        } finally {
          setIsSubmitting(false);
        }
      },
      undefined,
      'Delete',
      'Cancel'
    );
  };

  // Toggle workshop active status
  const handleToggleStatus = async (workshop: Workshop) => {
    setIsSubmitting(true);
    
    const submitData = {
      ...workshop,
      is_workshop_active: !workshop.is_workshop_active,
    };
    
    // Remove read-only fields
    delete (submitData as any).workshop_created;
    delete (submitData as any).workshop_updated;
    delete (submitData as any).workshop_owner_name;
    delete (submitData as any).workshop_owner_phone;
    
    try {
      const response = await fetch(`${WORKSHOPS_ENDPOINT}${workshop.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      showConfirmationModal('success', 'Success!', `Workshop ${!workshop.is_workshop_active ? 'activated' : 'deactivated'} successfully!`);
      fetchWorkshops();
      
    } catch (error: any) {
      console.error('Status toggle error:', error);
      showConfirmationModal('error', 'Error', 'Failed to update workshop status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const stats = {
    total: workshops.length,
    active: workshops.filter(w => w.is_workshop_active).length,
    verified: workshops.filter(w => w.is_workshop_verified).length,
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading workshops...</p>
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
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Fix Services</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Manage all auto workshop locations
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
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors shadow-md shadow-cyan-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Search by name, city, email, or phone..."
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

      {/* Stats Summary */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Building2 className="w-4 h-4 text-cyan-500" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-lg font-bold text-green-500">{stats.active}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Shield className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-lg font-bold text-yellow-500">{stats.verified}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {filteredWorkshops.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {searchQuery ? 'No workshops found' : 'No workshops available'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Add your first workshop to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAdd}
                className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Add First Workshop
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header with Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    workshop.is_workshop_active 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      workshop.is_workshop_active ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-[10px] font-semibold ${
                      workshop.is_workshop_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {workshop.is_workshop_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(workshop)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={workshop.is_workshop_active ? 'Deactivate' : 'Activate'}
                  >
                    {workshop.is_workshop_active ? (
                      <Power className="w-4 h-4 text-green-500" />
                    ) : (
                      <PowerOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Workshop Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-cyan-500/30">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {workshop.workshop_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{workshop.workshop_city || 'City not specified'}</span>
                    </div>
                    {workshop.is_workshop_verified && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Shield className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] font-medium text-yellow-500">Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 truncate">{workshop.workshop_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{workshop.workshop_phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-2">
                      {workshop.workshop_address}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400">
                    {new Date(workshop.workshop_created).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEdit(workshop)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-[10px] font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workshop.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
                </h2>
                <p className="text-xs text-white/80">
                  {editingWorkshop ? 'Update workshop details' : 'Register a new auto workshop'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {/* Workshop Name */}
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Workshop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter workshop name"
                    value={formData.workshop_name}
                    onChange={(e) => setFormData({...formData, workshop_name: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="workshop@email.com"
                      value={formData.workshop_email}
                      onChange={(e) => setFormData({...formData, workshop_email: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="+255 XXX XXX XXX"
                      value={formData.workshop_phone}
                      onChange={(e) => setFormData({...formData, workshop_phone: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Street, building, area..."
                    rows={2}
                    value={formData.workshop_address}
                    onChange={(e) => setFormData({...formData, workshop_address: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    City <span className="text-gray-400 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Dar es Salaam, Arusha"
                    value={formData.workshop_city}
                    onChange={(e) => setFormData({...formData, workshop_city: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Latitude</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="-6.7924"
                      value={formData.workshop_latitude}
                      onChange={(e) => setFormData({...formData, workshop_latitude: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Longitude</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                      placeholder="39.2083"
                      value={formData.workshop_longitude}
                      onChange={(e) => setFormData({...formData, workshop_longitude: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      editingWorkshop ? 'UPDATE WORKSHOP' : 'SAVE WORKSHOP'
                    )}
                  </button>
                </div>
              </div>
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

      {/* Loading Overlay */}
      {isSubmitting && !confirmationModal.isOpen && !showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-2xl">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Processing...</p>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}