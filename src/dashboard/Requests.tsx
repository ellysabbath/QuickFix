// src/pages/dashboard/ServiceRequest.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Car,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  ChevronDown,
  Loader2,
  Clock,
  Flame,
  Send,
  Check,
  FileText,
  Zap
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
interface ServiceType {
  id: number;
  name: string;
  description: string;
  estimated_duration: string;
  base_price: number;
  is_active: boolean;
}

interface Garage {
  id: number;
  workshop_name: string;
  workshop_email: string;
  workshop_phone: string;
  workshop_address: string;
  workshop_city: string;
}

interface FormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  profile_picture: string | null;
  experience: string;
  service_type: string;
  vehicle_type: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  license_plate: string;
  garage_name: string;
  garage_phone: string;
  garage_email: string;
  selected_garage_id: number | null;
  priority: string;
  is_emergency: boolean;
  agreed_to_terms: boolean;
}

interface FormErrors {
  [key: string]: string | undefined;
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
        return <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500" />;
      case 'confirm':
        return <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-yellow-500" />;
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

// Success Modal
const SuccessModal: React.FC<{
  isOpen: boolean;
  requestCode: string;
  email: string;
  onClose: () => void;
  onViewRequests: () => void;
  onSubmitAnother: () => void;
}> = ({ isOpen, requestCode, email, onViewRequests, onSubmitAnother }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl animate-scale-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted! 🎉</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your service request has been submitted successfully.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
          <p className="text-xs text-green-600 dark:text-green-400">Request ID</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{requestCode || 'N/A'}</p>
          
          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" />
              Notification sent to: {email}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1 mt-1">
              <Building2 className="w-3 h-3" />
              All garages have been notified
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onViewRequests}
            className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-cyan-500/30"
          >
            View My Requests
          </button>
          <button
            onClick={onSubmitAnother}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-semibold text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Submit Another
          </button>
        </div>
      </div>
    </div>
  );
};

// Select Modal
const SelectModal: React.FC<{
  isOpen: boolean;
  title: string;
  items: { id: string | number; name: string; description?: string; price?: number; extra?: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  loading?: boolean;
  emptyMessage?: string;
}> = ({ isOpen, title, items, selectedValue, onSelect, onClose, loading, emptyMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <p className="mt-3 text-sm text-gray-500">Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{emptyMessage || 'No items available'}</p>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selectedValue === item.name
                    ? 'bg-cyan-50 dark:bg-cyan-900/30 border-2 border-cyan-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
                }`}
                onClick={() => {
                  onSelect(item.name);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                    )}
                    {item.price && item.price > 0 && (
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">
                        From TZS {item.price.toLocaleString()}
                      </p>
                    )}
                    {item.extra && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.extra}</p>
                    )}
                  </div>
                  {selectedValue === item.name && (
                    <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Priority Options
const priorityOptions = [
  { value: 'low', label: 'Low', color: '#10b981', icon: <Clock className="w-4 h-4" />, desc: 'Standard response (1-3 days)' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', icon: <Clock className="w-4 h-4" />, desc: 'Priority handling (24 hours)' },
  { value: 'high', label: 'High', color: '#ef4444', icon: <Flame className="w-4 h-4" />, desc: 'Fast track service (12 hours)' },
  { value: 'urgent', label: 'Urgent', color: '#dc2626', icon: <Zap className="w-4 h-4" />, desc: 'Immediate attention (ASAP)' },
];

const vehicleTypes = [
  'Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Electric', 'Hybrid',
  'Luxury', 'Sports Car', 'Hatchback', 'Convertible', 'Other'
];

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { user, profileData, isAuthenticated, isLoading: userLoading } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  // State
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    profile_picture: null,
    experience: '',
    service_type: '',
    vehicle_type: '',
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    license_plate: '',
    garage_name: '',
    garage_phone: '',
    garage_email: '',
    selected_garage_id: null,
    priority: 'medium',
    is_emergency: false,
    agreed_to_terms: false,
  });

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(true);
  const [loadingGarages, setLoadingGarages] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<any>(null);

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

  const maxCharacters = 1000;

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

  // Fetch service types
  const fetchServiceTypes = async () => {
    try {
      setLoadingServiceTypes(true);
      const response = await fetch(`${API_BASE_URL}/service-types/?is_active=true`);
      if (!response.ok) throw new Error('Failed to fetch service types');
      const data = await response.json();
      const results = data.results || data;
      setServiceTypes(results.filter((s: ServiceType) => s.is_active));
    } catch (error) {
      console.error('Error fetching service types:', error);
    } finally {
      setLoadingServiceTypes(false);
    }
  };

  // Fetch garages
  const fetchGarages = async () => {
    try {
      setLoadingGarages(true);
      const response = await fetch(`${API_BASE_URL}/auto-workshops/?is_workshop_active=true`);
      if (!response.ok) throw new Error('Failed to fetch garages');
      const data = await response.json();
      const results = data.results || data;
      const formattedGarages = results.map((g: any) => ({
        id: g.id,
        workshop_name: g.workshop_name,
        workshop_email: g.workshop_email,
        workshop_phone: g.workshop_phone,
        workshop_address: g.workshop_address,
        workshop_city: g.workshop_city || '',
      }));
      setGarages(formattedGarages);
    } catch (error) {
      console.error('Error fetching garages:', error);
    } finally {
      setLoadingGarages(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
    fetchGarages();
  }, []);

  // Auto-fill user data
  useEffect(() => {
    if (isAuthenticated && user && !userLoading) {
      const fullName = user.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      let profilePic = null;
      if (profileData?.profile_picture) {
        const pic = profileData.profile_picture;
        if (pic.startsWith('data:image') || pic.startsWith('http')) {
          profilePic = pic;
        } else if (pic.startsWith('/')) {
          profilePic = pic;
        } else {
          profilePic = `data:image/jpeg;base64,${pic}`;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.mobile_number || '',
        location: profileData?.location || '',
        profile_picture: profilePic,
        first_name: firstName,
        last_name: lastName,
      }));
    }
  }, [user, profileData, isAuthenticated, userLoading]);

  const handleGarageSelect = (garage: Garage) => {
    setFormData(prev => ({
      ...prev,
      selected_garage_id: garage.id,
      garage_name: garage.workshop_name,
      garage_phone: garage.workshop_phone,
      garage_email: garage.workshop_email,
    }));
    setShowGarageModal(false);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    if (field === 'experience' && typeof value === 'string') {
      const newValue = value.length > maxCharacters ? value.substring(0, maxCharacters) : value;
      setCharacterCount(newValue.length);
      value = newValue;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Please describe your service needs';
    else if (formData.experience.trim().length < 10) newErrors.experience = 'Please provide more details (minimum 10 characters)';
    if (!formData.agreed_to_terms) newErrors.agreed_to_terms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showConfirmationModal('error', 'Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const submissionData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        middle_name: formData.middle_name.trim() || '',
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        experience: formData.experience.trim(),
        service_type: formData.service_type,
        vehicle_type: formData.vehicle_type,
        vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year) : null,
        vehicle_make: formData.vehicle_make,
        vehicle_model: formData.vehicle_model,
        license_plate: formData.license_plate.toUpperCase(),
        garage_name: formData.garage_name,
        garage_phone: formData.garage_phone,
        garage_email: formData.garage_email,
        priority: formData.priority,
        is_emergency: formData.is_emergency,
        profile_picture: formData.profile_picture,
        agreed_to_terms: formData.agreed_to_terms,
      };

      const response = await fetch(`${API_BASE_URL}/service-requests/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const apiErrors: FormErrors = {};
        if (responseData && responseData.errors) {
          Object.keys(responseData.errors).forEach(key => {
            if (Array.isArray(responseData.errors[key])) {
              apiErrors[key] = responseData.errors[key][0];
            } else {
              apiErrors[key] = responseData.errors[key];
            }
          });
        }
        if (Object.keys(apiErrors).length > 0) {
          setErrors(apiErrors);
          throw new Error('Please check the form for errors');
        }
        throw new Error(responseData.message || `Server error: ${response.status}`);
      }

      setSubmissionResponse(responseData);
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      showConfirmationModal('error', 'Error', error.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const fullName = user?.full_name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    let profilePic = null;
    if (profileData?.profile_picture) {
      const pic = profileData.profile_picture;
      if (pic.startsWith('data:image') || pic.startsWith('http')) {
        profilePic = pic;
      } else if (pic.startsWith('/')) {
        profilePic = pic;
      } else {
        profilePic = `data:image/jpeg;base64,${pic}`;
      }
    }
    
    setFormData({
      first_name: firstName,
      middle_name: '',
      last_name: lastName,
      email: user?.email || '',
      phone: user?.mobile_number || '',
      location: profileData?.location || '',
      profile_picture: profilePic,
      experience: '',
      service_type: '',
      vehicle_type: '',
      vehicle_year: '',
      vehicle_make: '',
      vehicle_model: '',
      license_plate: '',
      garage_name: '',
      garage_phone: '',
      garage_email: '',
      selected_garage_id: null,
      priority: 'medium',
      is_emergency: false,
      agreed_to_terms: false,
    });
    setCharacterCount(0);
    setErrors({});
    setShowSuccessModal(false);
  };

  // Render form field
  const renderFormField = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    isRequired: boolean = true,
    type: string = 'text',
    isAutoFilled: boolean = false,
    multiline: boolean = false,
    rows: number = 1
  ) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {isAutoFilled && (
          <span className="text-[10px] font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
            Auto-filled
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          className={`w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white outline-none transition-colors resize-none ${
            errors[field] 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 border-2' 
              : isAutoFilled 
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 border' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          }`}
          placeholder={placeholder}
          value={formData[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          rows={rows}
          disabled={isAutoFilled}
        />
      ) : (
        <input
          type={type}
          className={`w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white outline-none transition-colors ${
            errors[field] 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 border-2' 
              : isAutoFilled 
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 border' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          }`}
          placeholder={placeholder}
          value={formData[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={isAutoFilled}
        />
      )}
      {errors[field] && (
        <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
      )}
    </div>
  );

  // Render select field
  const renderSelectField = (
    label: string,
    value: string,
    onPress: () => void,
    placeholder: string,
    isRequired: boolean = true
  ) => (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <button
        onClick={onPress}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white hover:border-cyan-500 transition-colors"
      >
        <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );

  if (userLoading) {
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
      <div className="sticky top-0 z-30 bg-gradient-to-r from-cyan-500 to-cyan-600">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">Service Request</h1>
              <p className="text-[10px] sm:text-xs text-white/80">Submit your vehicle service request</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Profile Picture */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">Profile Picture</label>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowImageModal(true)}
                className="relative group"
              >
                {formData.profile_picture ? (
                  <div className="relative">
                    <img
                      src={formData.profile_picture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-3 border-cyan-500 shadow-lg shadow-cyan-500/20"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, profile_picture: null }));
                      }}
                      className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center hover:border-cyan-500 transition-colors bg-gray-50 dark:bg-gray-800">
                    <Camera className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                  </div>
                )}
              </button>
              {isAuthenticated && formData.profile_picture && (
                <p className="text-[10px] text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Profile picture loaded from your profile
                </p>
              )}
            </div>
          </div>

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Submitting as Guest</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500">Login to auto-fill your information</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Login
              </button>
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h2>
              <span className="text-[10px] font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">Editable</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderFormField('First Name', 'first_name', 'Enter first name', true, 'text', false)}
              {renderFormField('Last Name', 'last_name', 'Enter last name', true, 'text', false)}
            </div>
            {renderFormField('Middle Name', 'middle_name', 'Enter middle name (optional)', false, 'text', false)}
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Contact Information</h2>
              <span className="text-[10px] font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Auto-filled</span>
            </div>
            {renderFormField('Email Address', 'email', 'your@email.com', true, 'email', true)}
            {renderFormField('Phone Number', 'phone', '+255 XXX XXX XXX', true, 'tel', true)}
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Location</h2>
              <span className="text-[10px] font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Auto-filled</span>
            </div>
            {renderFormField('Location', 'location', 'e.g., Dar es Salaam', true, 'text', true)}
          </div>

          {/* Garage Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Preferred Garage</h2>
              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            {renderSelectField('Choose Garage', formData.garage_name, () => setShowGarageModal(true), 'Select a garage from list', false)}
            {formData.selected_garage_id && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Selected Garage:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.garage_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formData.garage_phone}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formData.garage_email}</p>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Car className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Vehicle Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderFormField('Year', 'vehicle_year', 'e.g., 2020', false, 'number')}
              {renderFormField('Make', 'vehicle_make', 'e.g., Toyota', false, 'text')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderFormField('Model', 'vehicle_model', 'e.g., Camry', false, 'text')}
              {renderFormField('License Plate', 'license_plate', 'T 123 ABC', false, 'text')}
            </div>
            {renderSelectField('Vehicle Type', formData.vehicle_type, () => setShowVehicleTypeModal(true), 'Select vehicle type', false)}
            {renderSelectField('Service Type', formData.service_type, () => setShowServiceTypeModal(true), 'Select service type', false)}
          </div>

          {/* Priority Settings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Priority Settings</h2>
            </div>
            {renderSelectField('Priority Level', formData.priority, () => setShowPriorityModal(true), 'Select priority', true)}
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 mt-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Emergency Service</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">All garages will be notified immediately</p>
              </div>
              <button
                className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_emergency ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                onClick={() => handleInputChange('is_emergency', !formData.is_emergency)}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_emergency ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Service Description</h2>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                Describe Your Issue <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white outline-none transition-colors resize-none min-h-[120px] ${
                  errors.experience 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 border-2' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
                placeholder="Describe your vehicle issue, required service, and any special instructions..."
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={5}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                  {characterCount}/{maxCharacters} characters
                </span>
              </div>
              {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
            </div>
          </div>

          {/* Terms */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <button
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  formData.agreed_to_terms 
                    ? 'bg-cyan-500 border-cyan-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onClick={() => handleInputChange('agreed_to_terms', !formData.agreed_to_terms)}
              >
                {formData.agreed_to_terms && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the <span className="text-cyan-600 dark:text-cyan-400 font-medium">Terms of Service</span> and{' '}
                  <span className="text-cyan-600 dark:text-cyan-400 font-medium">Privacy Policy</span>
                </p>
                {errors.agreed_to_terms && <p className="text-xs text-red-500 mt-1">{errors.agreed_to_terms}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>

          {/* Notification Info */}
          <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
            <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              What happens next?
            </p>
            <ul className="text-xs text-cyan-600 dark:text-cyan-300 mt-1 space-y-1">
              <li>1. You'll receive a confirmation email at {formData.email || 'your email'}</li>
              <li>2. All registered garages will be notified of your request</li>
              <li>3. Garages will respond with quotes and availability</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help? Contact support at support@quickfix.com
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            © 2025 QuickFix Automotive. All rights reserved.
          </p>
        </div>
      </div>

      {/* Select Modals */}
      <SelectModal
        isOpen={showGarageModal}
        title="Select Garage"
        items={garages.map(g => ({
          id: g.id,
          name: g.workshop_name,
          description: g.workshop_phone,
          extra: g.workshop_address
        }))}
        selectedValue={formData.garage_name}
        onSelect={(value) => {
          const garage = garages.find(g => g.workshop_name === value);
          if (garage) handleGarageSelect(garage);
        }}
        onClose={() => setShowGarageModal(false)}
        loading={loadingGarages}
        emptyMessage="No garages available"
      />

      <SelectModal
        isOpen={showServiceTypeModal}
        title="Select Service Type"
        items={serviceTypes.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          price: s.base_price
        }))}
        selectedValue={formData.service_type}
        onSelect={(value) => handleInputChange('service_type', value)}
        onClose={() => setShowServiceTypeModal(false)}
        loading={loadingServiceTypes}
        emptyMessage="No service types available"
      />

      <SelectModal
        isOpen={showVehicleTypeModal}
        title="Select Vehicle Type"
        items={vehicleTypes.map(v => ({ id: v, name: v }))}
        selectedValue={formData.vehicle_type}
        onSelect={(value) => handleInputChange('vehicle_type', value)}
        onClose={() => setShowVehicleTypeModal(false)}
        emptyMessage="No vehicle types available"
      />

      {/* Priority Modal */}
      {showPriorityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Priority</h2>
              <button onClick={() => setShowPriorityModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-center gap-3 ${
                    formData.priority === option.value
                      ? 'bg-cyan-50 dark:bg-cyan-900/30 border-2 border-cyan-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
                  }`}
                  onClick={() => {
                    handleInputChange('priority', option.value);
                    setShowPriorityModal(false);
                  }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: option.color + '20' }}>
                    <span style={{ color: option.color }}>{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                  </div>
                  {formData.priority === option.value && (
                    <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4">Profile Picture</h3>
            <button
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                setShowImageModal(false);
              }}
            >
              <ImageIcon className="w-5 h-5 text-cyan-500" />
              <span className="text-gray-700 dark:text-gray-300">Choose from Gallery</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                setShowImageModal(false);
              }}
            >
              <Camera className="w-5 h-5 text-cyan-500" />
              <span className="text-gray-700 dark:text-gray-300">Take a Photo</span>
            </button>
            {formData.profile_picture && (
              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
                onClick={() => {
                  setFormData(prev => ({ ...prev, profile_picture: null }));
                  setShowImageModal(false);
                }}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
                <span className="text-red-500">Remove Picture</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        requestCode={submissionResponse?.request_code || submissionResponse?.data?.request_code || 'N/A'}
        email={formData.email}
        onClose={() => setShowSuccessModal(false)}
        onViewRequests={() => {
          setShowSuccessModal(false);
          navigate('/myrequest');
        }}
        onSubmitAnother={resetForm}
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
      `}</style>
    </div>
  );
}