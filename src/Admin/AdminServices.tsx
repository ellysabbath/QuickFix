// src/pages/admin/RepairServicesManagement.tsx

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
  CheckCircle,
  AlertTriangle,
  Info,
  Building2,
  Calendar,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Power,
  PowerOff,
  Wrench,
  DollarSign,
  FileText,
  Tag,
  Filter,
  Clock as ClockIcon
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'https://autofix.pythonanywhere.com';
const REPAIR_SERVICES_ENDPOINT = `${API_BASE_URL}/api/repair-services/`;
const WORKSHOPS_ENDPOINT = `${API_BASE_URL}/api/auto-workshops/`;

// Types
interface Workshop {
  id: number;
  workshop_name: string;
  workshop_email: string;
  workshop_phone: string;
  workshop_address: string;
  workshop_city: string | null;
  is_workshop_active: boolean;
}

interface RepairService {
  id: number;
  service_title: string;
  service_description: string;
  service_category: string | null;
  service_base_price: string;
  workshop: number | null;
  workshop_name?: string;
  is_service_active: boolean;
  service_created: string;
}

interface ServiceFormData {
  service_title: string;
  service_description: string;
  service_category: string;
  service_base_price: string;
  workshop: number | null;
  is_service_active: boolean;
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

// Filter Modal Component
const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  workshops: Workshop[];
  selectedWorkshop: number | null;
  onSelectWorkshop: (id: number | null) => void;
  showInactive: boolean;
  onToggleShowInactive: (value: boolean) => void;
}> = ({
  isOpen,
  onClose,
  workshops,
  selectedWorkshop,
  onSelectWorkshop,
  showInactive,
  onToggleShowInactive
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filter Services</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Workshop</h4>
          <button
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
              selectedWorkshop === null ? 'bg-cyan-50 dark:bg-cyan-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => onSelectWorkshop(null)}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedWorkshop === null ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
            }`}>
              {selectedWorkshop === null && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">All Workshops</span>
          </button>

          {workshops.map((workshop) => (
            <button
              key={workshop.id}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                selectedWorkshop === workshop.id ? 'bg-cyan-50 dark:bg-cyan-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => onSelectWorkshop(workshop.id)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedWorkshop === workshop.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
              }`}>
                {selectedWorkshop === workshop.id && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{workshop.workshop_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{workshop.workshop_city || 'No city'}</p>
              </div>
            </button>
          ))}

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Show Inactive Services</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Display deactivated services</p>
            </div>
            <button
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showInactive ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => onToggleShowInactive(!showInactive)}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                showInactive ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => {
              onSelectWorkshop(null);
              onToggleShowInactive(false);
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Service Detail Modal
const ServiceDetailModal: React.FC<{
  isOpen: boolean;
  service: RepairService | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}> = ({ isOpen, service, onClose, onEdit, onDelete, onToggleStatus }) => {
  if (!isOpen || !service) return null;

  const statusColor = service.is_service_active ? 'text-green-500' : 'text-red-500';
  const statusBgColor = service.is_service_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const statusText = service.is_service_active ? 'Active' : 'Inactive';
  const createdDate = new Date(service.service_created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const createdTime = new Date(service.service_created).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Service Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className={`flex items-center justify-between p-3 rounded-xl ${statusBgColor} mb-4`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${service.is_service_active ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-semibold ${statusColor}`}>{statusText}</span>
            </div>
            <button
              onClick={onToggleStatus}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              {service.is_service_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Service Title</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{service.service_title}</p>
              </div>
            </div>

            {service.service_category && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                  <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                    {service.service_category}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Base Price</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  TZS {parseFloat(service.service_base_price).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Workshop</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {service.workshop_name || 'All Workshops (Global Service)'}
                </p>
              </div>
            </div>

            {service.service_description && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{service.service_description}</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {createdDate}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                <ClockIcon className="w-3.5 h-3.5" />
                {createdTime}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                <Tag className="w-3.5 h-3.5" />
                ID: {service.id}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-cyan-500/30"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{
  service: RepairService;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onPress: () => void;
}> = ({ service, onEdit, onDelete, onToggleStatus, onPress }) => {
  const statusColor = service.is_service_active ? 'text-green-500' : 'text-red-500';
  const statusBgColor = service.is_service_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onPress}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusBgColor}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${service.is_service_active ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-semibold ${statusColor}`}>{service.is_service_active ? 'Active' : 'Inactive'}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {service.is_service_active ? (
            <Power className="w-4 h-4 text-green-500" />
          ) : (
            <PowerOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-cyan-500/30">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{service.service_title}</h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {service.service_category && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                {service.service_category}
              </span>
            )}
            {service.workshop_name && (
              <span className="text-[9px] text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                <Building2 className="w-2.5 h-2.5" />
                {service.workshop_name}
              </span>
            )}
          </div>
        </div>
      </div>

      {service.service_description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {service.service_description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Base Price</p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">
            TZS {parseFloat(service.service_base_price).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex items-center gap-1 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-[10px] font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center mt-2 text-[9px] text-gray-400 gap-1">
        <Eye className="w-2.5 h-2.5" />
        Tap for details
      </div>
    </div>
  );
};

export default function RepairServicesManagement() {
  const navigate = useNavigate();
  const { user: _user } = useUser(); // Renamed to indicate intentionally unused
  const [showSidebar, setShowSidebar] = useState(false);

  // State
  const [services, setServices] = useState<RepairService[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<RepairService | null>(null);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterWorkshop, setFilterWorkshop] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);

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

  const [formData, setFormData] = useState<ServiceFormData>({
    service_title: '',
    service_description: '',
    service_category: '',
    service_base_price: '',
    workshop: null,
    is_service_active: true,
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
      const response = await fetch(`${WORKSHOPS_ENDPOINT}?is_workshop_active=true`);
      if (!response.ok) throw new Error('Failed to fetch workshops');
      const data = await response.json();
      const workshopsList = data.results || data;
      setWorkshops(workshopsList);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      let url = `${REPAIR_SERVICES_ENDPOINT}`;
      
      const params = new URLSearchParams();
      if (filterWorkshop) {
        params.append('workshop', filterWorkshop.toString());
      }
      if (!showInactive) {
        params.append('is_service_active', 'true');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const servicesList = data.results || data;
      
      const servicesWithWorkshopNames = await Promise.all(
        servicesList.map(async (service: RepairService) => {
          if (service.workshop_name) return service;
          
          if (service.workshop) {
            try {
              const workshopRes = await fetch(`${WORKSHOPS_ENDPOINT}${service.workshop}/`);
              if (workshopRes.ok) {
                const workshopData = await workshopRes.json();
                return { ...service, workshop_name: workshopData.workshop_name };
              }
            } catch (e) {}
          }
          return { ...service, workshop_name: 'All Workshops' };
        })
      );
      
      setServices(servicesWithWorkshopNames);
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      showConfirmationModal('error', 'Error', error.message || 'Failed to load services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [filterWorkshop, showInactive]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.service_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.service_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.service_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.workshop_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      service_title: '',
      service_description: '',
      service_category: '',
      service_base_price: '',
      workshop: null,
      is_service_active: true,
    });
    setShowModal(true);
  };

  const handleEdit = (service: RepairService) => {
    setEditingService(service);
    setFormData({
      service_title: service.service_title || '',
      service_description: service.service_description || '',
      service_category: service.service_category || '',
      service_base_price: service.service_base_price || '',
      workshop: service.workshop,
      is_service_active: service.is_service_active,
    });
    setShowModal(true);
  };

  const validateForm = (): boolean => {
    if (!formData.service_title.trim()) {
      showConfirmationModal('error', 'Error', 'Service title is required');
      return false;
    }
    if (!formData.service_base_price) {
      showConfirmationModal('error', 'Error', 'Base price is required');
      return false;
    }
    const price = parseFloat(formData.service_base_price);
    if (isNaN(price) || price < 0) {
      showConfirmationModal('error', 'Error', 'Please enter a valid price');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const submitData = {
      service_title: formData.service_title.trim(),
      service_description: formData.service_description.trim() || null,
      service_category: formData.service_category.trim() || null,
      service_base_price: parseFloat(formData.service_base_price),
      workshop: formData.workshop,
      is_service_active: formData.is_service_active,
    };
    
    try {
      let response;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (editingService) {
        response = await fetch(`${REPAIR_SERVICES_ENDPOINT}${editingService.id}/`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch(REPAIR_SERVICES_ENDPOINT, {
          method: 'POST',
          headers,
          body: JSON.stringify(submitData),
        });
      }
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        let errorMessage = 'Failed to save service';
        if (responseData && typeof responseData === 'object') {
          const errors = Object.entries(responseData)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
          if (errors) errorMessage = errors;
        }
        throw new Error(errorMessage);
      }
      
      showConfirmationModal('success', 'Success!', editingService ? 'Service updated successfully!' : 'Service added successfully!');
      setShowModal(false);
      fetchServices();
      
    } catch (error: any) {
      console.error('Save error:', error);
      showConfirmationModal('error', 'Error', error.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (serviceId: number) => {
    showConfirmationModal(
      'confirm',
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      async () => {
        setIsSubmitting(true);
        try {
          const response = await fetch(`${REPAIR_SERVICES_ENDPOINT}${serviceId}/`, {
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
          
          showConfirmationModal('success', 'Deleted!', 'Service deleted successfully!');
          fetchServices();
          
        } catch (error: any) {
          console.error('Delete error:', error);
          showConfirmationModal('error', 'Error', error.message || 'Failed to delete service');
        } finally {
          setIsSubmitting(false);
        }
      },
      undefined,
      'Delete',
      'Cancel'
    );
  };

  const handleToggleStatus = async (service: RepairService) => {
    setIsSubmitting(true);
    
    const submitData = {
      service_title: service.service_title,
      service_description: service.service_description,
      service_category: service.service_category,
      service_base_price: parseFloat(service.service_base_price),
      workshop: service.workshop,
      is_service_active: !service.is_service_active,
    };
    
    try {
      const response = await fetch(`${REPAIR_SERVICES_ENDPOINT}${service.id}/`, {
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
      
      showConfirmationModal('success', 'Success!', `Service ${!service.is_service_active ? 'activated' : 'deactivated'} successfully!`);
      fetchServices();
      
    } catch (error: any) {
      console.error('Status toggle error:', error);
      showConfirmationModal('error', 'Error', 'Failed to update service status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const stats = {
    total: services.length,
    active: services.filter(s => s.is_service_active).length,
    categories: [...new Set(services.map(s => s.service_category).filter(Boolean))].length,
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading repair services...</p>
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
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Repair Services</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Manage all repair services offered
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

          {/* Search and Filter */}
          <div className="flex gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="Search by title, category, workshop..."
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
            <button
              onClick={() => setShowFilterModal(true)}
              className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                (filterWorkshop !== null || showInactive)
                  ? 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              {(filterWorkshop !== null || showInactive) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white dark:border-gray-900" />
              )}
            </button>
          </div>

          {/* Active Filters */}
          {(filterWorkshop !== null || showInactive) && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              {filterWorkshop !== null && workshops.find(w => w.id === filterWorkshop) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-full text-xs text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                  Workshop: {workshops.find(w => w.id === filterWorkshop)?.workshop_name}
                  <button onClick={() => setFilterWorkshop(null)} className="hover:text-cyan-800">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {showInactive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-full text-xs text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                  Showing Inactive
                  <button onClick={() => setShowInactive(false)} className="hover:text-cyan-800">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Wrench className="w-4 h-4 text-cyan-500" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Total Services</p>
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
              <Tag className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-lg font-bold text-yellow-500">{stats.categories}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-32">
        {filteredServices.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {searchQuery || filterWorkshop ? 'No services found' : 'No services available'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || filterWorkshop 
                ? 'Try adjusting your filters or search term' 
                : 'Add your first repair service to get started'}
            </p>
            {!searchQuery && !filterWorkshop && !showInactive && (
              <button
                onClick={handleAdd}
                className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Add First Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => handleEdit(service)}
                onDelete={() => handleDelete(service.id)}
                onToggleStatus={() => handleToggleStatus(service)}
                onPress={() => {
                  setSelectedService(service);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <p className="text-xs text-white/80">
                  {editingService ? 'Update service details' : 'Register a new repair service'}
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
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Juma Automatica"
                    value={formData.service_title}
                    onChange={(e) => setFormData({...formData, service_title: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Category <span className="text-gray-400 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Engine, Transmission, Electrical"
                    value={formData.service_category}
                    onChange={(e) => setFormData({...formData, service_category: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Base Price (TZS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., 50000"
                    value={formData.service_base_price}
                    onChange={(e) => setFormData({...formData, service_base_price: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Workshop <span className="text-gray-400 text-[10px]">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        formData.workshop === null
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setFormData({...formData, workshop: null})}
                      disabled={isSubmitting}
                    >
                      All Workshops
                    </button>
                    {workshops.filter(w => w.is_workshop_active).map((workshop) => (
                      <button
                        key={workshop.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          formData.workshop === workshop.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setFormData({...formData, workshop: workshop.id})}
                        disabled={isSubmitting}
                      >
                        {workshop.workshop_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Description <span className="text-gray-400 text-[10px]">(Optional)</span>
                  </label>
                  <textarea
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                    placeholder="Describe what this service includes..."
                    rows={3}
                    value={formData.service_description}
                    onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Service Active</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available for customer bookings</p>
                  </div>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.is_service_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setFormData({...formData, is_service_active: !formData.is_service_active})}
                    disabled={isSubmitting}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.is_service_active ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
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
                    editingService ? 'UPDATE SERVICE' : 'SAVE SERVICE'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={showDetailModal}
        service={selectedService}
        onClose={() => setShowDetailModal(false)}
        onEdit={() => {
          if (selectedService) {
            setShowDetailModal(false);
            handleEdit(selectedService);
          }
        }}
        onDelete={() => {
          if (selectedService) {
            setShowDetailModal(false);
            handleDelete(selectedService.id);
          }
        }}
        onToggleStatus={() => {
          if (selectedService) {
            handleToggleStatus(selectedService);
          }
        }}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        workshops={workshops}
        selectedWorkshop={filterWorkshop}
        onSelectWorkshop={(id) => setFilterWorkshop(id)}
        showInactive={showInactive}
        onToggleShowInactive={(value) => setShowInactive(value)}
      />

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
      {isSubmitting && !confirmationModal.isOpen && !showModal && !showDetailModal && (
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
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
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