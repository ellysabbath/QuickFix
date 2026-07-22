// src/pages/dashboard/CrudPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Sidebar from '../../components/Sidebar';
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
  Phone,
  Mail,
  User,
  Calendar,
  Loader2,
  Trash2,
  Check,
  DollarSign,
  FileText,
  Zap,
  ExternalLink,
  Wallet,
  Plus,
  Inbox,
  Briefcase,
  AlertCircle,
  Save,
  Navigation,
  Smartphone,
  Moon,
  Sun,
  MapPin,
  Lock
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
  request_status_display?: string;
  urgency_display?: string;
  formatted_date?: string;
  formatted_time?: string;
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

// Payment Modal
const PaymentModal: React.FC<{
  isOpen: boolean;
  requestCode: string;
  requestId: number;
  requestName: string;
  requestPhone: string;
  onClose: () => void;
  onConfirm: (amount: number, phone: string) => void;
  isLoading: boolean;
}> = ({ isOpen, requestCode, requestId, requestName, requestPhone, onClose, onConfirm, isLoading }) => {
  const [fetchedAmount, setFetchedAmount] = useState<number | null>(null);
  const [fetchingAmount, setFetchingAmount] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(requestPhone || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && requestId) {
      fetchPaymentAmount();
      setPhoneNumber(requestPhone || '');
    }
  }, [isOpen, requestId, requestPhone]);

  const fetchPaymentAmount = async () => {
    setFetchingAmount(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/public-requests/${requestId}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const requestData = await response.json();
        if (requestData.budget_maximum && requestData.budget_maximum > 0) {
          setFetchedAmount(requestData.budget_maximum);
          setConfirmedAmount(requestData.budget_maximum.toString());
        } else {
          setError('No budget set. Please set a budget first or enter amount manually.');
        }
      } else {
        setError('Failed to fetch amount information. Please enter amount manually.');
      }
    } catch (error) {
      console.error('Error fetching amount:', error);
      setError('Network error. Please enter amount manually.');
    } finally {
      setFetchingAmount(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Payment</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4 text-center mb-4">
            <p className="text-xs text-cyan-600 dark:text-cyan-400">Request Code</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{requestCode}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{requestName}</p>
          </div>

          {fetchingAmount ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <p className="mt-3 text-sm text-gray-500">Fetching payment amount...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Amount (TZS) *</label>
                <div className="flex items-center mt-1 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <span className="px-4 text-sm font-bold text-cyan-600 dark:text-cyan-400">TZS</span>
                  <input
                    type="number"
                    className="flex-1 py-2.5 px-2 text-sm font-semibold text-gray-900 dark:text-white bg-transparent outline-none"
                    placeholder="Enter amount"
                    value={confirmedAmount}
                    onChange={(e) => setConfirmedAmount(e.target.value)}
                  />
                </div>
                {fetchedAmount && (
                  <button
                    className="flex items-center gap-1 mt-2 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 transition-colors"
                    onClick={() => setConfirmedAmount(fetchedAmount.toString())}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Use suggested amount: TZS {fetchedAmount.toLocaleString()}
                  </button>
                )}
                {error && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{error}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number (M-Pesa) *</label>
                <div className="flex items-center mt-1 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                  <Smartphone className="w-4 h-4 text-gray-400 ml-4" />
                  <input
                    type="tel"
                    className="flex-1 py-2.5 px-3 text-sm text-gray-900 dark:text-white bg-transparent outline-none"
                    placeholder="Enter M-Pesa phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">You will receive a payment prompt on this number</p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Payment will be processed via M-Pesa. You will receive a prompt on your phone to confirm the payment.
                </p>
              </div>
            </>
          )}
        </div>

        {!fetchingAmount && (
          <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const amount = parseFloat(confirmedAmount);
                if (isNaN(amount) || amount <= 0) {
                  alert('Please enter a valid amount');
                  return;
                }
                if (!phoneNumber || phoneNumber.length < 10) {
                  alert('Please enter a valid phone number');
                  return;
                }
                onConfirm(amount, phoneNumber);
              }}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-green-500/30"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Payment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Map Modal
const MapModal: React.FC<{
  isOpen: boolean;
  latitude: number | null;
  longitude: number | null;
  address: string;
  customerName: string;
  serviceType: string;
  onClose: () => void;
}> = ({ isOpen, latitude, longitude, address, customerName, serviceType, onClose }) => {
  if (!isOpen) return null;

  const lat = typeof latitude === 'number' ? latitude : parseFloat(String(latitude));
  const lng = typeof longitude === 'number' ? longitude : parseFloat(String(longitude));

  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Customer Location</h3>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ExternalLink className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{customerName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{serviceType}</p>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="w-16 h-16 text-red-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">📍 {customerName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs text-center px-4">{address}</p>
          <div className="flex gap-3 mt-4">
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
          </p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 dark:text-gray-400">{address}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Budget Modal
const BudgetModal: React.FC<{
  isOpen: boolean;
  currentBudget: number | null;
  isFlexible: boolean;
  onClose: () => void;
  onSave: (budget: number | null, flexible: boolean) => void;
  isLoading: boolean;
}> = ({ isOpen, currentBudget, isFlexible, onClose, onSave, isLoading }) => {
  const [budget, setBudget] = useState<string>(currentBudget?.toString() || '');
  const [flexible, setFlexible] = useState(isFlexible);

  useEffect(() => {
    if (isOpen) {
      setBudget(currentBudget?.toString() || '');
      setFlexible(isFlexible);
    }
  }, [isOpen, currentBudget, isFlexible]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Set Maximum Budget</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Set your maximum budget (minimum is TZS 0)</p>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 mb-4">
            <span className="px-4 text-sm font-bold text-cyan-600 dark:text-cyan-400">TZS</span>
            <input
              type="number"
              className="flex-1 py-2.5 px-2 text-sm font-semibold text-gray-900 dark:text-white bg-transparent outline-none"
              placeholder="Enter amount"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <button
            className="flex items-center gap-2 mb-4"
            onClick={() => setFlexible(!flexible)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              flexible ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 dark:border-gray-600'
            }`}>
              {flexible && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">I'm flexible with budget</span>
          </button>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const amount = budget ? parseFloat(budget) : null;
              onSave(amount, flexible);
            }}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/30"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Budget
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CrudPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Data states
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'processing': return 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'completed': return 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400';
      case 'cancelled': return 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400';
      default: return 'bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#ef4444';
      case 'priority': return '#f59e0b';
      default: return '#10b981';
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

  const safeParseFloat = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? null : num;
  };

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setApiError(null);

      const userPhone = user.mobile_number;
      if (!userPhone) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/public-requests/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const responseData = await response.json();
      let allRequests: ServiceRequest[] = [];

      if (Array.isArray(responseData)) allRequests = responseData;
      else if (responseData.results) allRequests = responseData.results;
      else if (responseData.data) allRequests = responseData.data;

      const userRequests = allRequests.filter(request => {
        const requestPhone = request.customer_phone?.trim();
        const userPhoneTrimmed = userPhone.trim();
        const requestEmail = request.customer_email?.trim();
        const userEmail = user.email?.trim();

        const phoneMatches = requestPhone === userPhoneTrimmed;
        const emailMatches = requestEmail && userEmail && requestEmail === userEmail;

        return phoneMatches || emailMatches;
      });

      const sanitizedList = userRequests.map(req => ({
        ...req,
        location_latitude: safeParseFloat(req.location_latitude),
        location_longitude: safeParseFloat(req.location_longitude),
      }));

      setRequests(sanitizedList);

    } catch (error) {
      console.error('Error fetching requests:', error);
      setApiError('Failed to load your requests. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchQuery === '' ||
      request.request_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requested_service?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.request_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Delete request
  const handleDelete = async (request: ServiceRequest) => {
    showConfirmationModal(
      'confirm',
      'Delete Request',
      `Delete "${request.request_code}"? This action cannot be undone.`,
      async () => {
        try {
          setIsSubmitting(true);
          const response = await fetch(`${API_BASE_URL}/public-requests/${request.id}/`, {
            method: 'DELETE',
          });

          if (response.status === 204 || response.ok) {
            showConfirmationModal('success', 'Success!', 'Request deleted successfully');
            setShowDetailModal(false);
            await fetchRequests();
          } else {
            showConfirmationModal('error', 'Error', 'Failed to delete request');
          }
        } catch (error) {
          showConfirmationModal('error', 'Error', 'Network error');
        } finally {
          setIsSubmitting(false);
        }
      },
      undefined,
      'Delete',
      'Cancel'
    );
  };

  // Update budget
  const handleUpdateBudget = async (budget: number | null, flexible: boolean) => {
    if (!selectedRequest) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/public-requests/${selectedRequest.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget_minimum: 0,
          budget_maximum: budget,
          is_budget_flexible: flexible,
        }),
      });

      if (response.ok) {
        showConfirmationModal('success', 'Success!', 'Budget updated successfully!');
        setShowBudgetModal(false);
        setShowDetailModal(false);
        await fetchRequests();
      } else {
        showConfirmationModal('error', 'Error', 'Failed to update budget');
      }
    } catch (error) {
      showConfirmationModal('error', 'Error', 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment - UPDATED with correct endpoint
  const handlePayment = async (amount: number, phoneNumber: string) => {
    if (!selectedRequest) return;

    setIsProcessingPayment(true);
    try {
      // Create payment record
      const paymentData = {
        service_request_id: selectedRequest.id,
        amount: amount,
        payment_method: 'mpesa',
        phone_number: phoneNumber,
        customer_name: selectedRequest.customer_name,
        request_code: selectedRequest.request_code,
        status: 'pending',
        transaction_id: `TXN-${Date.now()}-${selectedRequest.id}`,
      };

      // Try to create payment record
      const paymentResponse = await fetch(`${API_BASE_URL}/payments/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();
        
        // Update request status to processing
        await fetch(`${API_BASE_URL}/public-requests/${selectedRequest.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            request_status: 'processing',
          }),
        });

        setShowPaymentModal(false);
        setShowDetailModal(false);
        
        // Show success with transaction details
        showConfirmationModal(
          'success',
          'Payment Initiated! ✅',
          `Payment of TZS ${amount.toLocaleString()} has been initiated.\n\n📱 You will receive a payment prompt on ${phoneNumber}.\n\n🆔 Transaction ID: ${paymentResult.transaction_id || paymentData.transaction_id}`,
          () => {
            fetchRequests();
          },
          undefined,
          'OK',
          ''
        );
      } else {
        const errorData = await paymentResponse.json().catch(() => ({}));
        showConfirmationModal(
          'error',
          'Payment Error',
          errorData.error || errorData.message || 'Failed to initiate payment. Please try again.'
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      showConfirmationModal(
        'error',
        'Error',
        'Network error. Please try again.'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.request_status === 'pending').length,
    processing: requests.filter(r => r.request_status === 'processing').length,
    completed: requests.filter(r => r.request_status === 'completed').length,
    cancelled: requests.filter(r => r.request_status === 'cancelled').length,
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading user profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">Please Login</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">You need to be logged in to view your requests</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-cyan-500/30"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading && !refreshing) {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                  {user.full_name || user.mobile_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => navigate('/bookings')}
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
              placeholder="Search your requests..."
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

          {/* Filters */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] ${
                  statusFilter === status
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {status === 'all' ? requests.length : requests.filter(r => r.request_status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">My Requests</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-yellow-500">{stats.pending}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-blue-500">{stats.processing}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Processing</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-green-500">{stats.completed}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-lg font-bold text-red-500">{stats.cancelled}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {apiError ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Error Loading Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{apiError}</p>
            <button
              onClick={fetchRequests}
              className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No requests found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first service request'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/bookings')}
                className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Request
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => {
              const urgencyColor = getUrgencyColor(request.request_urgency);
              const statusBgClass = getStatusBgClass(request.request_status);
              const hasBudget = request.budget_maximum !== null && request.budget_maximum !== undefined;
              const hasLocation = request.location_latitude !== null && request.location_longitude !== null;
              const isPending = request.request_status === 'pending';

              return (
                <div
                  key={request.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {request.request_code}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusBgClass}`}>
                        {request.request_status_display || request.request_status}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: urgencyColor }}
                    >
                      {request.urgency_display || request.request_urgency}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white truncate">{request.customer_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{request.requested_service}</p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(request.preferred_service_date)} at {formatTime(request.preferred_service_time)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {hasBudget ? `Up to TZS ${request.budget_maximum?.toLocaleString()}` : 'No budget'}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {hasLocation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            setShowMapModal(true);
                          }}
                          className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                          title="View on Map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setShowBudgetModal(true);
                        }}
                        className="p-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
                        title="Update Budget"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </button>
                      {isPending && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            setShowPaymentModal(true);
                          }}
                          className="p-1 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                          title="Make Payment"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-medium text-cyan-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
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
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{selectedRequest.request_code}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {selectedRequest.location_latitude && selectedRequest.location_longitude && (
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    title="View on Map"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowBudgetModal(true);
                  }}
                  className="p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
                  title="Update Budget"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
                {selectedRequest.request_status === 'pending' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowPaymentModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    title="Make Payment"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedRequest)}
                  className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-4`} style={{ backgroundColor: getStatusColor(selectedRequest.request_status) + '20' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: getStatusColor(selectedRequest.request_status) + '40' }}>
                  <Clock className="w-5 h-5" style={{ color: getStatusColor(selectedRequest.request_status) }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedRequest.request_status_display || selectedRequest.request_status}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.request_code}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Budget</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.budget_maximum
                      ? `Up to TZS ${selectedRequest.budget_maximum.toLocaleString()}`
                      : 'No budget set'}
                  </span>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowBudgetModal(true);
                    }}
                    className="text-xs text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Customer</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-900 dark:text-white">{selectedRequest.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.customer_phone}</span>
                  </div>
                  {selectedRequest.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm text-cyan-600 dark:text-cyan-400">{selectedRequest.customer_email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Service</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.requested_service}</span>
                  </div>
                  {selectedRequest.request_description && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-cyan-500 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.request_description}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: getUrgencyColor(selectedRequest.request_urgency) }} />
                    <span className="text-sm font-medium" style={{ color: getUrgencyColor(selectedRequest.request_urgency) }}>
                      {selectedRequest.urgency_display || selectedRequest.request_urgency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.service_location}</span>
                  </div>
                  {selectedRequest.location_latitude && selectedRequest.location_longitude && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {selectedRequest.location_latitude}, {selectedRequest.location_longitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Schedule</h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedRequest.preferred_service_date)} at {formatTime(selectedRequest.preferred_service_time)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.customer_notes && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.customer_notes}</p>
                  </div>
                </div>
              )}

              {selectedRequest.request_status === 'pending' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowPaymentModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-green-500/30"
                >
                  <Wallet className="w-4 h-4" />
                  Make Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={showBudgetModal}
        currentBudget={selectedRequest?.budget_maximum || null}
        isFlexible={selectedRequest?.is_budget_flexible ?? true}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleUpdateBudget}
        isLoading={isSubmitting}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        requestCode={selectedRequest?.request_code || ''}
        requestId={selectedRequest?.id || 0}
        requestName={selectedRequest?.customer_name || ''}
        requestPhone={selectedRequest?.customer_phone || ''}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePayment}
        isLoading={isProcessingPayment}
      />

      {/* Map Modal */}
      {selectedRequest && (
        <MapModal
          isOpen={showMapModal}
          latitude={selectedRequest.location_latitude}
          longitude={selectedRequest.location_longitude}
          address={selectedRequest.service_location}
          customerName={selectedRequest.customer_name}
          serviceType={selectedRequest.requested_service}
          onClose={() => setShowMapModal(false)}
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

      {/* Loading Overlay */}
      {isSubmitting && !confirmationModal.isOpen && (
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
      `}</style>
    </div>
  );
}