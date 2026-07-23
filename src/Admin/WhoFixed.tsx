// src/pages/admin/ApproveManagement.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Search,
  X,
  Phone,
  User,
  Calendar,
  Clock,
  FileText,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Info,
  Lock,
  Save,
} from 'lucide-react';

// API Configuration
const APPROVE_API_URL = 'https://autofix.pythonanywhere.com/api/approvals/';

// Types
interface ApproveRecord {
  id: number;
  updated_by: string;
  phone_number: string;
  request_code: string;
  appointment_code: string;
  previous_status: string;
  new_status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  formatted_date: string;
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

export default function ApproveManagement() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  // State
  const [records, setRecords] = useState<ApproveRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ApproveRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ApproveRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  // Edit form state
  const [editForm, setEditForm] = useState({
    updated_by: '',
    phone_number: '',
    request_code: '',
    appointment_code: '',
    previous_status: '',
    new_status: '',
    notes: '',
  });

  // Create form state
  const [createForm, setCreateForm] = useState({
    updated_by: '',
    phone_number: '',
    request_code: '',
    appointment_code: '',
    previous_status: '',
    new_status: '',
    notes: '',
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

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }, []);

  const getStatusColor = (status: string | null): string => {
    if (!status) return '#94A3B8';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approve') || statusLower.includes('accept')) return '#10B981';
    if (statusLower.includes('progress')) return '#0891B2';
    if (statusLower.includes('complete')) return '#14B8A6';
    if (statusLower.includes('cancel')) return '#EF4444';
    if (statusLower.includes('view')) return '#06B6D4';
    return '#F59E0B';
  };

  const getStatusBgColor = (status: string | null): string => {
    if (!status) return '#F1F5F9';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approve') || statusLower.includes('accept')) return '#D1FAE5';
    if (statusLower.includes('progress')) return '#CFFAFE';
    if (statusLower.includes('complete')) return '#CCFBF1';
    if (statusLower.includes('cancel')) return '#FEE2E2';
    if (statusLower.includes('view')) return '#E0F2FE';
    return '#FEF3C7';
  };

  const formatStatus = (status: string | null): string => {
    if (!status) return '—';
    return status.replace(/_/g, ' ').toUpperCase();
  };

  const cleanPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/[\s\-\(\)]/g, '');
  };

  const handleCall = (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      showConfirmationModal('error', 'Error', 'No phone number available');
      return;
    }
    const cleanedNumber = cleanPhoneNumber(phoneNumber);
    window.location.href = `tel:${cleanedNumber}`;
  };

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
    try {
      return localStorage.getItem('access_token');
    } catch {
      return null;
    }
  };

  // API Calls
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        showConfirmationModal('error', 'Error', 'Please login to view records');
        return;
      }
      
      const token = getAuthToken();
      if (!token) {
        showConfirmationModal('error', 'Error', 'Authentication token not found');
        return;
      }

      const response = await fetch(APPROVE_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        showConfirmationModal('error', 'Error', 'Session expired. Please login again.');
        return;
      }
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
      showConfirmationModal('error', 'Error', 'Failed to load records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  const createRecord = async () => {
    if (!createForm.updated_by || !createForm.phone_number || !createForm.request_code) {
      showConfirmationModal('error', 'Error', 'Please fill required fields');
      return;
    }
    
    setIsSubmitting(true);
    const token = getAuthToken();
    
    try {
      const response = await fetch(APPROVE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updated_by: createForm.updated_by,
          phone_number: createForm.phone_number,
          request_code: createForm.request_code,
          appointment_code: createForm.appointment_code,
          previous_status: createForm.previous_status,
          new_status: createForm.new_status || null,
          notes: createForm.notes || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Create failed');
      }
      
      await fetchRecords();
      setShowCreateModal(false);
      setCreateForm({
        updated_by: '',
        phone_number: '',
        request_code: '',
        appointment_code: '',
        previous_status: '',
        new_status: '',
        notes: '',
      });
      showConfirmationModal('success', 'Success!', 'Record created successfully');
    } catch (error) {
      console.error('Error creating record:', error);
      showConfirmationModal('error', 'Error', 'Failed to create record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRecord = async () => {
    if (!selectedRecord) return;
    
    setIsSubmitting(true);
    const token = getAuthToken();
    
    try {
      const response = await fetch(`${APPROVE_API_URL}${selectedRecord.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updated_by: editForm.updated_by,
          phone_number: editForm.phone_number,
          request_code: editForm.request_code,
          appointment_code: editForm.appointment_code,
          previous_status: editForm.previous_status,
          new_status: editForm.new_status || null,
          notes: editForm.notes || null,
        }),
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      await fetchRecords();
      setShowEditModal(false);
      setSelectedRecord(null);
      showConfirmationModal('success', 'Success!', 'Record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      showConfirmationModal('error', 'Error', 'Failed to update record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRecord = async () => {
    if (!selectedRecord) return;
    
    setIsSubmitting(true);
    const token = getAuthToken();
    
    try {
      const response = await fetch(`${APPROVE_API_URL}${selectedRecord.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      await fetchRecords();
      setSelectedRecord(null);
      setShowModal(false);
      showConfirmationModal('success', 'Deleted!', 'Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      showConfirmationModal('error', 'Error', 'Failed to delete record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  const handleViewDetails = (record: ApproveRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleEdit = (record: ApproveRecord) => {
    setSelectedRecord(record);
    setEditForm({
      updated_by: record.updated_by,
      phone_number: record.phone_number,
      request_code: record.request_code,
      appointment_code: record.appointment_code || '',
      previous_status: record.previous_status,
      new_status: record.new_status || '',
      notes: record.notes || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = (record: ApproveRecord) => {
    setSelectedRecord(record);
    showConfirmationModal(
      'confirm',
      'Delete Record',
      `Are you sure you want to delete record #${record.request_code}? This action cannot be undone.`,
      deleteRecord,
      undefined,
      'Delete',
      'Cancel'
    );
  };

  // Filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecords(records);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = records.filter(record =>
        record.updated_by.toLowerCase().includes(query) ||
        record.phone_number.includes(query) ||
        record.request_code.toLowerCase().includes(query) ||
        (record.appointment_code && record.appointment_code.toLowerCase().includes(query)) ||
        (record.previous_status && record.previous_status.toLowerCase().includes(query))
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, records]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    } else {
      setLoading(false);
    }
  }, [fetchRecords, isAuthenticated]);

  // Stats
  const stats = {
    total: records.length,
    withPhone: records.filter(r => r.phone_number).length,
    withAppointment: records.filter(r => r.appointment_code).length,
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading approval records...</p>
      </div>
    );
  }

  // Auth required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <Lock className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Authentication Required</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please login to access approval records</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
        >
          Go to Login
        </button>
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
                onClick={() => navigate('/admin/bookings')}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Approval Records</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  {filteredRecords.length} records found
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
                onClick={() => setShowCreateModal(true)}
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
              placeholder="Search by name, phone, or request code..."
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

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center gap-2 flex-shrink-0">
              <FileText className="w-4 h-4 text-cyan-500" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Total Records</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Phone className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-lg font-bold text-green-500">{stats.withPhone}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">With Phone</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-lg font-bold text-yellow-500">{stats.withAppointment}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {records.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Records Yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Approval records will appear here</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Create First Record
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Results Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try a different search term</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record) => {
              const statusColor = getStatusColor(record.previous_status);
              const statusBgColor = getStatusBgColor(record.previous_status);
              const hasAppointment = record.appointment_code && record.appointment_code.length > 0;

              return (
                <div
                  key={record.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewDetails(record)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold`}
                        style={{ backgroundColor: statusBgColor, color: statusColor }}
                      >
                        {formatStatus(record.previous_status)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        #{record.request_code}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(record.phone_number);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full text-[10px] font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Updated By</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{record.updated_by}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">{record.phone_number}</p>
                      </div>
                    </div>
                    {hasAppointment && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Appointment</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{record.appointment_code}</p>
                        </div>
                      </div>
                    )}
                    {record.notes && (
                      <div className="flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Notes</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{record.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(record.created_at)}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(record);
                        }}
                        className="p-1 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(record);
                        }}
                        className="p-1 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Record Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Request Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Request Code</span>
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">#{selectedRecord.request_code}</span>
                    </div>
                    {selectedRecord.appointment_code && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Appointment Code</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRecord.appointment_code}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Previous Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold`}
                        style={{ backgroundColor: getStatusBgColor(selectedRecord.previous_status), color: getStatusColor(selectedRecord.previous_status) }}
                      >
                        {formatStatus(selectedRecord.previous_status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">New Status</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRecord.new_status ? formatStatus(selectedRecord.new_status) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Person Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Updated By</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRecord.updated_by}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Phone Number</span>
                      <button
                        onClick={() => handleCall(selectedRecord.phone_number)}
                        className="flex items-center gap-1 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        {selectedRecord.phone_number}
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {selectedRecord.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRecord.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Timestamps</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(selectedRecord.created_at)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Updated</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(selectedRecord.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleEdit(selectedRecord);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleDelete(selectedRecord);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => handleCall(selectedRecord.phone_number)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Record</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Updated By *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter name"
                    value={editForm.updated_by}
                    onChange={(e) => setEditForm({...editForm, updated_by: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter phone number"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Request Code *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter request code"
                    value={editForm.request_code}
                    onChange={(e) => setEditForm({...editForm, request_code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Appointment Code</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter appointment code"
                    value={editForm.appointment_code}
                    onChange={(e) => setEditForm({...editForm, appointment_code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Previous Status</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter previous status"
                    value={editForm.previous_status}
                    onChange={(e) => setEditForm({...editForm, previous_status: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">New Status</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter new status"
                    value={editForm.new_status}
                    onChange={(e) => setEditForm({...editForm, new_status: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Enter notes"
                    rows={3}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={updateRecord}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
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
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Record</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Updated By *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter name"
                    value={createForm.updated_by}
                    onChange={(e) => setCreateForm({...createForm, updated_by: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter phone number"
                    value={createForm.phone_number}
                    onChange={(e) => setCreateForm({...createForm, phone_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Request Code *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter request code"
                    value={createForm.request_code}
                    onChange={(e) => setCreateForm({...createForm, request_code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Appointment Code</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter appointment code"
                    value={createForm.appointment_code}
                    onChange={(e) => setCreateForm({...createForm, appointment_code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Previous Status</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter previous status"
                    value={createForm.previous_status}
                    onChange={(e) => setCreateForm({...createForm, previous_status: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">New Status</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter new status"
                    value={createForm.new_status}
                    onChange={(e) => setCreateForm({...createForm, new_status: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Enter notes"
                    rows={3}
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({...createForm, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={createRecord}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create
                    </>
                  )}
                </button>
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