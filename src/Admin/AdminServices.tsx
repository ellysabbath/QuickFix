import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Mock data
const mockWorkshops: Workshop[] = [
  {
    id: 1,
    workshop_name: 'AutoCare Premium Services',
    workshop_email: 'info@autocare.co.tz',
    workshop_phone: '+255 765 432 100',
    workshop_address: 'Plot 45, Kimweri Street, Mbezi Beach',
    workshop_city: 'Dar es Salaam',
    is_workshop_active: true,
  },
  {
    id: 2,
    workshop_name: 'Elite Auto Garage',
    workshop_email: 'info@eliteauto.co.tz',
    workshop_phone: '+255 765 432 101',
    workshop_address: 'Block 12, Nyerere Road, Temeke',
    workshop_city: 'Dar es Salaam',
    is_workshop_active: true,
  },
  {
    id: 3,
    workshop_name: 'QuickFix Motors',
    workshop_email: 'info@quickfix.co.tz',
    workshop_phone: '+255 765 432 102',
    workshop_address: 'Plot 78, Mandela Road, Ubungo',
    workshop_city: 'Dar es Salaam',
    is_workshop_active: true,
  },
];

const mockServices: RepairService[] = [
  {
    id: 1,
    service_title: 'Engine Diagnostics',
    service_description: 'Complete engine diagnostic and performance check with computer analysis',
    service_category: 'Engine',
    service_base_price: '150000',
    workshop: 1,
    workshop_name: 'AutoCare Premium Services',
    is_service_active: true,
    service_created: new Date().toISOString(),
  },
  {
    id: 2,
    service_title: 'Brake System Repair',
    service_description: 'Full brake system inspection, pad replacement, and rotor resurfacing',
    service_category: 'Brakes',
    service_base_price: '80000',
    workshop: 2,
    workshop_name: 'Elite Auto Garage',
    is_service_active: true,
    service_created: new Date().toISOString(),
  },
  {
    id: 3,
    service_title: 'Oil Change Service',
    service_description: 'Professional oil change with filter replacement and fluid check',
    service_category: 'Maintenance',
    service_base_price: '45000',
    workshop: null,
    workshop_name: 'All Workshops',
    is_service_active: true,
    service_created: new Date().toISOString(),
  },
  {
    id: 4,
    service_title: 'Transmission Service',
    service_description: 'Transmission fluid change, filter replacement, and system inspection',
    service_category: 'Transmission',
    service_base_price: '200000',
    workshop: 3,
    workshop_name: 'QuickFix Motors',
    is_service_active: false,
    service_created: new Date().toISOString(),
  },
];

// Success Modal
const SuccessModal: React.FC<{
  visible: boolean;
  message: string;
  onClose: () => void;
}> = ({ visible, message, onClose }) => {
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
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
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
  isDestructive?: boolean;
}> = ({ visible, message, onConfirm, onCancel, isDestructive = false }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDestructive 
              ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30' 
              : 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30'
          }`}>
            <span className={`text-4xl font-bold ${isDestructive ? 'text-red-500' : 'text-cyan-500'}`}>
              {isDestructive ? '!' : '?'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isDestructive ? 'Delete Service' : 'Confirm Action'}
          </h3>
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
            className={`flex-1 py-3.5 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg ${
              isDestructive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/30' 
                : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-cyan-500/30'
            }`}
            onClick={onConfirm}
          >
            {isDestructive ? 'Delete' : 'Confirm'}
          </button>
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
  const statusBg = service.is_service_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const statusText = service.is_service_active ? 'Active' : 'Inactive';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer mb-4"
      onClick={onPress}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${statusBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
          <span className={`text-xs font-semibold ${statusColor}`}>{statusText}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
          className={`text-sm font-medium ${service.is_service_active ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'} transition-colors`}
        >
          {service.is_service_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {/* Service Info */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <span className="text-white text-xl font-bold">WS</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
            {service.service_title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {service.service_category && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                {service.service_category}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {service.workshop_name || 'All Workshops'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {service.service_description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {service.service_description}
        </p>
      )}

      {/* Price & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-400">Base Price</p>
          <p className="text-lg font-bold text-green-500">
            TZS {parseFloat(service.service_base_price).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            Edit
          </button>
          <button
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Tap Hint */}
      <div className="flex items-center justify-center gap-1 mt-3 pt-2 text-xs text-gray-400">
        <span>View</span> Tap for details
      </div>
    </div>
  );
};

// Filter Modal
const FilterModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  workshops: Workshop[];
  selectedWorkshop: number | null;
  onSelectWorkshop: (id: number | null) => void;
  showInactive: boolean;
  onToggleShowInactive: (value: boolean) => void;
}> = ({ visible, onClose, workshops, selectedWorkshop, onSelectWorkshop, showInactive, onToggleShowInactive }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filter Services</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-2xl">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Workshop</h4>
          
          <button
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              selectedWorkshop === null ? 'bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => onSelectWorkshop(null)}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedWorkshop === null ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selectedWorkshop === null && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="font-medium text-gray-900 dark:text-white">All Workshops</span>
          </button>

          {workshops.map((workshop) => (
            <button
              key={workshop.id}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                selectedWorkshop === workshop.id ? 'bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => onSelectWorkshop(workshop.id)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedWorkshop === workshop.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedWorkshop === workshop.id && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">{workshop.workshop_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{workshop.workshop_city || 'No city'}</p>
              </div>
            </button>
          ))}

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Show Inactive Services</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Display deactivated services</p>
            </div>
            <button
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                showInactive ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => onToggleShowInactive(!showInactive)}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                showInactive ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`} />
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-cyan-500 font-semibold transition-all duration-200"
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
  visible: boolean;
  service: RepairService | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}> = ({ visible, service, onClose, onEdit, onDelete, onToggleStatus }) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [visible]);

  if (!visible || !service) return null;

  const statusColor = service.is_service_active ? 'text-green-500' : 'text-red-500';
  const statusBg = service.is_service_active ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xl font-bold">WS</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Service Details</h3>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-2xl">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${statusBg} mb-4`}>
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className={`font-semibold ${statusColor}`}>{statusText}</span>
            <div className="flex-1" />
            <button
              onClick={onToggleStatus}
              className={`text-sm font-medium px-3 py-1 rounded-lg ${
                service.is_service_active 
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
              } transition-colors`}
            >
              {service.is_service_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* Title */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-500 font-bold">T</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Service Title</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{service.service_title}</p>
            </div>
          </div>

          {/* Category */}
          {service.service_category && (
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-500 font-bold">C</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Category</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  {service.service_category}
                </span>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-500 font-bold">$</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Base Price</p>
              <p className="text-xl font-bold text-green-500">
                TZS {parseFloat(service.service_base_price).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Workshop */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-500 font-bold">W</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Associated Workshop</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {service.workshop_name || 'All Workshops (Global Service)'}
              </p>
            </div>
          </div>

          {/* Description */}
          {service.service_description && (
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-500 font-bold">D</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Description</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.service_description}
                </p>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
              <span>Date:</span> {createdDate}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
              <span>Time:</span> {createdTime}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
              <span>ID:</span> {service.id}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => { onClose(); onDelete(); }}
            >
              Delete
            </button>
            <button
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => { onClose(); onEdit(); }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RepairServicesManagement: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [services, setServices] = useState<RepairService[]>(mockServices);
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedService, setSelectedService] = useState<RepairService | null>(null);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterWorkshop, setFilterWorkshop] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Form Data
  const [formData, setFormData] = useState<ServiceFormData>({
    service_title: '',
    service_description: '',
    service_category: '',
    service_base_price: '',
    workshop: null,
    is_service_active: true,
  });

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = services;
    
    if (filterWorkshop) {
      filtered = filtered.filter(s => s.workshop === filterWorkshop);
    }
    
    if (!showInactive) {
      filtered = filtered.filter(s => s.is_service_active);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.service_title.toLowerCase().includes(query) ||
        (s.service_description?.toLowerCase() || '').includes(query) ||
        (s.service_category?.toLowerCase() || '').includes(query) ||
        (s.workshop_name?.toLowerCase() || '').includes(query)
      );
    }
    
    return filtered;
  }, [services, searchQuery, filterWorkshop, showInactive]);

  // Stats
  const stats = {
    total: services.length,
    active: services.filter(s => s.is_service_active).length,
    categories: [...new Set(services.map(s => s.service_category).filter(Boolean))].length,
  };

  // Handle add
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

  // Handle edit
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

  // Handle save
  const handleSave = async () => {
    if (!formData.service_title.trim()) {
      alert('Service title is required');
      return;
    }
    if (!formData.service_base_price) {
      alert('Base price is required');
      return;
    }
    const price = parseFloat(formData.service_base_price);
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newService: RepairService = {
      id: editingService?.id || Date.now(),
      service_title: formData.service_title.trim(),
      service_description: formData.service_description.trim() || '',
      service_category: formData.service_category.trim() || null,
      service_base_price: formData.service_base_price,
      workshop: formData.workshop,
      workshop_name: formData.workshop ? workshops.find(w => w.id === formData.workshop)?.workshop_name : 'All Workshops',
      is_service_active: formData.is_service_active,
      service_created: editingService?.service_created || new Date().toISOString(),
    };

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? newService : s));
      setSuccessMessage('Service updated successfully!');
    } else {
      setServices(prev => [newService, ...prev]);
      setSuccessMessage('Service added successfully!');
    }

    setShowSuccessModal(true);
    setShowModal(false);
    setIsSubmitting(false);
  };

  // Handle delete
  const handleDelete = (serviceId: number) => {
    setServiceToDelete(serviceId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setServices(prev => prev.filter(s => s.id !== serviceToDelete));
    setSuccessMessage('Service deleted successfully!');
    setShowSuccessModal(true);
    setShowDeleteModal(false);
    setServiceToDelete(null);
    setIsSubmitting(false);
  };

  // Handle toggle status
  const handleToggleStatus = async (service: RepairService) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setServices(prev => prev.map(s =>
      s.id === service.id ? { ...s, is_service_active: !s.is_service_active } : s
    ));
    
    setSuccessMessage(`Service ${service.is_service_active ? 'deactivated' : 'activated'} successfully!`);
    setShowSuccessModal(true);
    setIsSubmitting(false);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  // Handle card press
  const handleCardPress = (service: RepairService) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

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
                  Repair Services
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage all repair services offered</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              >
                Refresh
              </button>
              <button
                onClick={handleAdd}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                +
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 bg-white dark:bg-gray-700/50 rounded-2xl px-5 py-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                placeholder="Search by title, category, workshop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-lg font-bold">
                  ✕
                </button>
              )}
            </div>
            <button
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 relative"
              onClick={() => setShowFilterModal(true)}
            >
              <span className="text-gray-600 dark:text-gray-300 text-lg">⚙</span>
              {(filterWorkshop !== null || showInactive) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {(filterWorkshop !== null || showInactive) && (
            <div className="flex gap-2 pb-3 overflow-x-auto">
              {filterWorkshop !== null && workshops.find(w => w.id === filterWorkshop) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-500 rounded-full">
                  <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                    Workshop: {workshops.find(w => w.id === filterWorkshop)?.workshop_name}
                  </span>
                  <button onClick={() => setFilterWorkshop(null)} className="text-cyan-500 hover:text-cyan-600">
                    ✕
                  </button>
                </div>
              )}
              {showInactive && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-500 rounded-full">
                  <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Showing Inactive</span>
                  <button onClick={() => setShowInactive(false)} className="text-cyan-500 hover:text-cyan-600">
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Services</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.categories}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        {filteredServices.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-5xl font-bold text-gray-400 dark:text-gray-500">S</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery || filterWorkshop ? 'No services found' : 'No services available'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || filterWorkshop 
                ? 'Try adjusting your filters or search term' 
                : 'Add your first repair service to get started'}
            </p>
            {!searchQuery && !filterWorkshop && !showInactive && (
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
              >
                + Add First Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => handleEdit(service)}
                onDelete={() => handleDelete(service.id)}
                onToggleStatus={() => handleToggleStatus(service)}
                onPress={() => handleCardPress(service)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <p className="text-sm text-white/90">
                  {editingService ? 'Update service details' : 'Register a new repair service'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl font-bold transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="e.g., Engine Diagnostics"
                    value={formData.service_title}
                    onChange={(e) => setFormData({...formData, service_title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Category <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="e.g., Engine, Transmission, Electrical"
                    value={formData.service_category}
                    onChange={(e) => setFormData({...formData, service_category: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Base Price (TZS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none"
                    placeholder="50000"
                    value={formData.service_base_price}
                    onChange={(e) => setFormData({...formData, service_base_price: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Workshop <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.workshop === null
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setFormData({...formData, workshop: null})}
                    >
                      All Workshops
                    </button>
                    {workshops.filter(w => w.is_workshop_active).map((workshop) => (
                      <button
                        key={workshop.id}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          formData.workshop === workshop.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setFormData({...formData, workshop: workshop.id})}
                      >
                        {workshop.workshop_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Description <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 outline-none resize-none min-h-[80px]"
                    placeholder="Describe what this service includes..."
                    value={formData.service_description}
                    onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Service Active</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available for customer bookings</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      formData.is_service_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setFormData({...formData, is_service_active: !formData.is_service_active})}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                      formData.is_service_active ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (editingService ? 'Update Service' : 'Save Service')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        workshops={workshops}
        selectedWorkshop={filterWorkshop}
        onSelectWorkshop={(id) => setFilterWorkshop(id)}
        showInactive={showInactive}
        onToggleShowInactive={(value) => setShowInactive(value)}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedService && (
        <ServiceDetailModal
          visible={showDetailModal}
          service={selectedService}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            if (selectedService) {
              handleEdit(selectedService);
            }
          }}
          onDelete={() => {
            if (selectedService) {
              handleDelete(selectedService.id);
            }
          }}
          onToggleStatus={() => {
            if (selectedService) {
              handleToggleStatus(selectedService);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        message="Are you sure you want to delete this service? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setServiceToDelete(null);
        }}
        isDestructive={true}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Loading Overlay */}
      {isSubmitting && !showSuccessModal && !showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center min-w-[180px]">
            <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairServicesManagement;