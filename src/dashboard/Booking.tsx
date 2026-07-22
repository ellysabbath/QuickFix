// src/pages/dashboard/CustomerServiceRequest.tsx

import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Calendar,
  Clock,
  
  Navigation,

  AlertCircle,
  Info,
  CheckCircle,
  Search,
  ChevronDown,
 
  Loader2,
  
  Zap,
  
  Clock as ClockIcon,

  Plus,

} from 'lucide-react';

// Vehicle Brands Database
const ALL_VEHICLE_BRANDS = [
  "Abarth", "Acura", "Alfa Romeo", "Alpina", "Alpine", "Aston Martin", "Audi",
  "BAIC", "Bentley", "BMW", "Bugatti", "Buick", "BYD",
  "Cadillac", "Caterham", "Changan", "Chery", "Chevrolet", "Chrysler", "Citroën", "Cupra",
  "Dacia", "Daewoo", "Daihatsu", "Datsun", "Dodge", "Dongfeng",
  "Ferrari", "Fiat", "Fisker", "Ford", "Foton",
  "GAC", "Geely", "Genesis", "GMC", "Great Wall",
  "Haval", "Honda", "Hongqi", "Hummer", "Hyundai",
  "Infiniti", "Isuzu",
  "JAC", "Jaguar", "Jeep",
  "Kia", "Koenigsegg",
  "Lada", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lifan", "Lincoln", "Lotus", "Lucid",
  "Mahindra", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan",
  "Nio", "Nissan",
  "Opel",
  "Pagani", "Peugeot", "Polestar", "Pontiac", "Porsche",
  "Ram", "Renault", "Rivian", "Rolls-Royce",
  "Saab", "SEAT", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki",
  "Tata", "Tesla", "Toyota",
  "Vauxhall", "VinFast", "Volkswagen", "Volvo",
  "Xiaomi", "Xpeng",
  "Zotye"
].sort((a, b) => a.localeCompare(b));

// Group brands alphabetically
const BRAND_SECTIONS = ALL_VEHICLE_BRANDS.reduce((sections: { title: string; data: string[] }[], brand) => {
  const firstLetter = brand[0].toUpperCase();
  const existingSection = sections.find(section => section.title === firstLetter);
  
  if (existingSection) {
    existingSection.data.push(brand);
  } else {
    sections.push({ title: firstLetter, data: [brand] });
  }
  
  return sections.sort((a, b) => a.title.localeCompare(b.title));
}, []);

// Vehicle years
const CURRENT_YEAR = new Date().getFullYear();
const VEHICLE_YEARS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => (CURRENT_YEAR - i).toString());

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
interface FormData {
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
  service_location: string;
  location_maps_link: string;
  latitude: number | null;
  longitude: number | null;
  preferred_service_date: Date;
  preferred_service_time: Date;
  request_urgency: 'standard' | 'priority' | 'emergency';
  is_urgent_request: boolean;
  budget_minimum: string;
  budget_maximum: string;
  is_budget_flexible: boolean;
  customer_notes: string;
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
  onClose: () => void;
  onViewRequests: () => void;
  onSubmitAnother: () => void;
}> = ({ isOpen, requestCode, onClose, onViewRequests, onSubmitAnother }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

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

        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4 mb-6">
          <p className="text-xs text-cyan-600 dark:text-cyan-400">Request Code</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{requestCode || 'N/A'}</p>
          
          <div className="mt-3 pt-3 border-t border-cyan-200 dark:border-cyan-800">
            <p className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1">
              <ClockIcon className="w-3 h-3" />
              Garages will review your request
            </p>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1 mt-1">
              You'll receive quotes from garages
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

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

// Select Modal Component - Fixed version
const SelectModal: React.FC<{
  isOpen: boolean;
  title: string;
  items?: { id: string | number; name: string; }[];
  sections?: { title: string; data: string[] }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  searchPlaceholder?: string;
  showCustom?: boolean;
  onAddCustom?: () => void;
}> = ({ 
  isOpen, 
  title, 
  items = [], 
  sections, 
  selectedValue, 
  onSelect, 
  onClose,
  searchPlaceholder = 'Search...',
  showCustom = false,
  onAddCustom
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  if (!isOpen) return null;

  const filteredSections = sections ? sections.map(section => ({
    ...section,
    data: section.data.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(section => section.data.length > 0) : [];

  const filteredItems = !sections ? items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleAddCustom = () => {
    if (customValue.trim() && onAddCustom) {
      onAddCustom();
      setCustomValue('');
      setShowCustomInput(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!showCustomInput ? (
            <>
              <div className="relative p-3">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="px-2 pb-2">
                {sections && sections.length > 0 ? (
                  filteredSections.length > 0 ? (
                    filteredSections.map((section) => (
                      <div key={section.title}>
                        <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg mb-1">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{section.title}</span>
                        </div>
                        {section.data.map((item) => (
                          <button
                            key={item}
                            className={`w-full text-left p-3 rounded-xl transition-colors ${
                              selectedValue === item
                                ? 'bg-cyan-50 dark:bg-cyan-900/30 border-2 border-cyan-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
                            }`}
                            onClick={() => {
                              onSelect(item);
                              onClose();
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
                              {selectedValue === item && (
                                <Check className="w-5 h-5 text-cyan-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No results found</p>
                    </div>
                  )
                ) : (
                  filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
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
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                          {selectedValue === item.name && (
                            <Check className="w-5 h-5 text-cyan-500" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No items available</p>
                    </div>
                  )
                )}

                {showCustom && !searchQuery && (
                  <button
                    className="w-full flex items-center gap-3 p-3 mt-2 rounded-xl border-2 border-dashed border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                    onClick={() => setShowCustomInput(true)}
                  >
                    <Plus className="w-5 h-5 text-cyan-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Not listed?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Add your own</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-cyan-500 ml-auto" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-4">
              <button
                className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-4"
                onClick={() => setShowCustomInput(false)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter value</p>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                placeholder="Enter custom value..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomValue('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    customValue.trim() 
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleAddCustom}
                  disabled={!customValue.trim()}
                >
                  Add Value
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CustomerServiceRequest() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedRequestCode, setSubmittedRequestCode] = useState('');

  // Modal states
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);

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

  // Form State
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    requested_service: '',
    request_description: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_color: '',
    license_plate: '',
    service_location: '',
    location_maps_link: '',
    latitude: null,
    longitude: null,
    preferred_service_date: new Date(),
    preferred_service_time: new Date(),
    request_urgency: 'standard',
    is_urgent_request: false,
    budget_minimum: '',
    budget_maximum: '',
    is_budget_flexible: true,
    customer_notes: '',
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

  // Auto-fill phone number from user context
  useEffect(() => {
    if (isAuthenticated && user && !userLoading) {
      setFormData(prev => ({
        ...prev,
        customer_phone: user.mobile_number || '',
        customer_email: user.email || '',
      }));
    }
  }, [user, isAuthenticated, userLoading]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'request_urgency') {
      setFormData(prev => ({ ...prev, is_urgent_request: value !== 'standard' }));
    }
  };

  // Location handling
  const handleUseCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      if (!navigator.geolocation) {
        showConfirmationModal('error', 'Error', 'Geolocation is not supported by your browser');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Reverse geocode using Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        let address = '';
        if (data && data.display_name) {
          address = data.display_name;
        } else {
          address = `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        updateFormData('service_location', address);
        updateFormData('location_maps_link', mapsLink);
        updateFormData('latitude', parseFloat(latitude.toFixed(6)));
        updateFormData('longitude', parseFloat(longitude.toFixed(6)));

        showConfirmationModal('success', 'Success!', 'Your current location has been added successfully!');
      } catch (err) {
        updateFormData('service_location', `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        updateFormData('location_maps_link', mapsLink);
        updateFormData('latitude', parseFloat(latitude.toFixed(6)));
        updateFormData('longitude', parseFloat(longitude.toFixed(6)));
        showConfirmationModal('success', 'Success!', 'Your current location has been added successfully!');
      }

    } catch (err: any) {
      let errorMessage = 'Failed to get your location. ';
      if (err.code === 1) {
        errorMessage += 'Please allow location access in your browser settings.';
      } else if (err.code === 2) {
        errorMessage += 'Location unavailable. Please check your GPS or try again.';
      } else if (err.code === 3) {
        errorMessage += 'Location request timed out. Please try again.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      showConfirmationModal('error', 'Error', errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Validate step
  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.customer_name.trim()) {
          showConfirmationModal('error', 'Error', 'Please enter your full name');
          return false;
        }
        if (!formData.customer_phone.trim()) {
          showConfirmationModal('error', 'Error', 'Please enter your phone number');
          return false;
        }
        const cleanedPhone = formData.customer_phone.replace(/\D/g, '');
        if (cleanedPhone.length < 8) {
          showConfirmationModal('error', 'Error', 'Please enter a valid phone number');
          return false;
        }
        return true;

      case 2:
        if (!formData.requested_service.trim()) {
          showConfirmationModal('error', 'Error', 'Please enter the service you need');
          return false;
        }
        return true;

      case 3:
        if (!formData.vehicle_brand.trim()) {
          showConfirmationModal('error', 'Error', 'Please select or enter vehicle brand');
          return false;
        }
        if (!formData.license_plate.trim()) {
          showConfirmationModal('error', 'Error', 'Please enter license plate');
          return false;
        }
        return true;

      case 4:
        if (!formData.service_location.trim()) {
          showConfirmationModal('error', 'Error', 'Please enter service location');
          return false;
        }
        return true;

      case 5:
        const selectedDateTime = new Date(
          formData.preferred_service_date.getFullYear(),
          formData.preferred_service_date.getMonth(),
          formData.preferred_service_date.getDate(),
          formData.preferred_service_time.getHours(),
          formData.preferred_service_time.getMinutes()
        );
        if (selectedDateTime < new Date()) {
          showConfirmationModal('error', 'Error', 'Cannot select past date/time');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);

    try {
      const formattedDate = formData.preferred_service_date.toISOString().split('T')[0];
      const formattedTime = formData.preferred_service_time.toTimeString().split(' ')[0].substring(0, 5);

      const submissionData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || '',
        requested_service: formData.requested_service.trim(),
        request_description: formData.request_description.trim() || '',
        vehicle_brand: formData.vehicle_brand.trim(),
        vehicle_model: formData.vehicle_model.trim() || '',
        vehicle_year: formData.vehicle_year.trim() || '',
        vehicle_color: formData.vehicle_color.trim() || '',
        license_plate: formData.license_plate.trim().toUpperCase(),
        service_location: formData.service_location.trim(),
        location_maps_link: formData.location_maps_link.trim() || '',
        location_latitude: formData.latitude,
        location_longitude: formData.longitude,
        preferred_service_date: formattedDate,
        preferred_service_time: formattedTime,
        request_urgency: formData.request_urgency,
        is_urgent_request: formData.request_urgency !== 'standard',
        budget_minimum: formData.budget_minimum ? parseFloat(formData.budget_minimum) : undefined,
        budget_maximum: formData.budget_maximum ? parseFloat(formData.budget_maximum) : undefined,
        is_budget_flexible: formData.is_budget_flexible,
        customer_notes: formData.customer_notes.trim() || '',
      };

      const response = await fetch(`${API_BASE_URL}/public-requests/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat().join('\n');
          showConfirmationModal('error', 'Validation Error', errorMessages);
        } else {
          throw new Error(responseData.message || 'Failed to submit request');
        }
        return;
      }

      if (responseData.success) {
        setSubmittedRequestCode(responseData.request_code);
        setSubmitSuccess(true);
      } else {
        showConfirmationModal('error', 'Error', responseData.errors ? JSON.stringify(responseData.errors) : 'Failed to submit request');
      }

    } catch (error) {
      console.error('Submission error:', error);
      showConfirmationModal('error', 'Error', 'Failed to create service request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (isAuthenticated && user) {
      setFormData({
        customer_name: '',
        customer_phone: user.mobile_number || '',
        customer_email: user.email || '',
        requested_service: '',
        request_description: '',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: '',
        vehicle_color: '',
        license_plate: '',
        service_location: '',
        location_maps_link: '',
        latitude: null,
        longitude: null,
        preferred_service_date: new Date(),
        preferred_service_time: new Date(),
        request_urgency: 'standard',
        is_urgent_request: false,
        budget_minimum: '',
        budget_maximum: '',
        is_budget_flexible: true,
        customer_notes: '',
      });
    } else {
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        requested_service: '',
        request_description: '',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_year: '',
        vehicle_color: '',
        license_plate: '',
        service_location: '',
        location_maps_link: '',
        latitude: null,
        longitude: null,
        preferred_service_date: new Date(),
        preferred_service_time: new Date(),
        request_urgency: 'standard',
        is_urgent_request: false,
        budget_minimum: '',
        budget_maximum: '',
        is_budget_flexible: true,
        customer_notes: '',
      });
    }
    setStep(1);
    setSubmitSuccess(false);
    setSubmittedRequestCode('');
  };

  // Render login prompt
  const renderLoginPrompt = () => {
    if (isAuthenticated) return null;

    return (
      <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4 mb-4 flex items-center gap-3">
        <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
        <p className="text-sm text-cyan-700 dark:text-cyan-300 flex-1">
          Log in to auto-fill your contact information
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Login
        </button>
      </div>
    );
  };

  // Render form step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Contact Information</h2>
            {renderLoginPrompt()}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter your full name"
                  value={formData.customer_name}
                  onChange={(e) => updateFormData('customer_name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                  {isAuthenticated && formData.customer_phone && (
                    <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>
                  )}
                </label>
                <input
                  type="tel"
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors ${
                    isAuthenticated && formData.customer_phone
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="Enter your phone number"
                  value={formData.customer_phone}
                  onChange={(e) => updateFormData('customer_phone', e.target.value)}
                />
                {isAuthenticated && formData.customer_phone && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Auto-filled from your profile (you can edit)
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-gray-400 text-xs">(Optional)</span>
                  {isAuthenticated && formData.customer_email && (
                    <span className="text-xs text-green-600 ml-2">(Auto-filled)</span>
                  )}
                </label>
                <input
                  type="email"
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors ${
                    isAuthenticated && formData.customer_email
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="Enter your email address"
                  value={formData.customer_email}
                  onChange={(e) => updateFormData('customer_email', e.target.value)}
                />
                {isAuthenticated && formData.customer_email && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Auto-filled from your profile (you can edit)
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What service do you need?</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g., Brake replacement, Oil change, Engine repair"
                  value={formData.requested_service}
                  onChange={(e) => updateFormData('requested_service', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  value={formData.request_description}
                  onChange={(e) => updateFormData('request_description', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Vehicle Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vehicle Brand <span className="text-red-500">*</span>
                </label>
                <button
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors flex items-center justify-between"
                  onClick={() => setShowBrandModal(true)}
                >
                  <span className={formData.vehicle_brand ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                    {formData.vehicle_brand || 'Select or add brand'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vehicle Model <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g., Corolla, Civic, F-150"
                  value={formData.vehicle_model}
                  onChange={(e) => updateFormData('vehicle_model', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Year <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <button
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors flex items-center justify-between"
                    onClick={() => setShowYearModal(true)}
                  >
                    <span className={formData.vehicle_year ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                      {formData.vehicle_year || 'Select year'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Color <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Red, Blue, White"
                    value={formData.vehicle_color}
                    onChange={(e) => updateFormData('vehicle_color', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  License Plate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  placeholder="ABC-1234"
                  value={formData.license_plate}
                  onChange={(e) => updateFormData('license_plate', e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Service Location</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Where should the service be done? <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Enter full address"
                  rows={3}
                  value={formData.service_location}
                  onChange={(e) => updateFormData('service_location', e.target.value)}
                />
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-50 dark:bg-cyan-900/20 border-2 border-dashed border-cyan-400 dark:border-cyan-600 rounded-xl text-cyan-600 dark:text-cyan-400 font-medium text-sm hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors disabled:opacity-50"
                onClick={handleUseCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {isGettingLocation ? 'Getting location...' : 'Use My Current Location'}
              </button>

              {formData.latitude && formData.longitude && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-300">Location captured successfully</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Google Maps Link <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.location_maps_link}
                  onChange={(e) => updateFormData('location_maps_link', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Schedule & Urgency</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <button
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors flex items-center justify-between"
                    onClick={() => setShowDatePicker(true)}
                  >
                    <span>
                      {formData.preferred_service_date.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <button
                    className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors flex items-center justify-between"
                    onClick={() => setShowTimePicker(true)}
                  >
                    <span>
                      {formData.preferred_service_time.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  How urgent is this? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { value: 'standard', label: 'Standard', icon: <ClockIcon className="w-5 h-5" />, desc: '1-3 days', color: 'bg-green-500' },
                    { value: 'priority', label: 'Priority', icon: <Zap className="w-5 h-5" />, desc: '24 hours', color: 'bg-yellow-500' },
                    { value: 'emergency', label: 'Emergency', icon: <AlertCircle className="w-5 h-5" />, desc: 'Immediate', color: 'bg-red-500' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.request_urgency === option.value
                          ? `border-${option.color} bg-${option.color}/10`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData('request_urgency', option.value as any)}
                    >
                      <div className="flex justify-center mb-1">{option.icon}</div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Flexible?</label>
                <div className="flex items-center gap-3">
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.is_budget_flexible ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => updateFormData('is_budget_flexible', !formData.is_budget_flexible)}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.is_budget_flexible ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.is_budget_flexible ? 'Yes, flexible' : 'No, fixed'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Additional Notes <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Any special instructions for the garage..."
                  rows={3}
                  value={formData.customer_notes}
                  onChange={(e) => updateFormData('customer_notes', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Date/Time pickers
  const renderDateTimePickers = () => {
    return (
      <>
        {showDatePicker && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Date</h3>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                value={formData.preferred_service_date.toISOString().split('T')[0]}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    updateFormData('preferred_service_date', date);
                    setShowDatePicker(false);
                  }
                }}
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
                  onClick={() => setShowDatePicker(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {showTimePicker && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Time</h3>
              <input
                type="time"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                value={formData.preferred_service_time.toTimeString().slice(0, 5)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const date = new Date(formData.preferred_service_time);
                  date.setHours(hours, minutes);
                  updateFormData('preferred_service_time', date);
                  setShowTimePicker(false);
                }}
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setShowTimePicker(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
                  onClick={() => setShowTimePicker(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Loading state
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
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step > 1 ? prevStep() : navigate('/dashboard')}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {step === 1 && "Contact Info"}
                {step === 2 && "Service Details"}
                {step === 3 && "Vehicle Info"}
                {step === 4 && "Location"}
                {step === 5 && "Schedule"}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Step {step} of 5
              </p>
            </div>
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-6">
            {step < 5 ? (
              <button
                onClick={nextStep}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md shadow-green-500/30'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SelectModal
        isOpen={showBrandModal}
        title="Select Vehicle Brand"
        items={[]}
        sections={BRAND_SECTIONS}
        selectedValue={formData.vehicle_brand}
        onSelect={(value) => updateFormData('vehicle_brand', value)}
        onClose={() => setShowBrandModal(false)}
        searchPlaceholder="Search brands..."
        showCustom={true}
        onAddCustom={() => {
          setShowBrandModal(false);
        }}
      />

      <SelectModal
        isOpen={showYearModal}
        title="Select Vehicle Year"
        items={VEHICLE_YEARS.map(year => ({ id: year, name: year }))}
        selectedValue={formData.vehicle_year}
        onSelect={(value) => updateFormData('vehicle_year', value)}
        onClose={() => setShowYearModal(false)}
        searchPlaceholder="Search year..."
      />

      {renderDateTimePickers()}

      {/* Success Modal */}
      <SuccessModal
        isOpen={submitSuccess}
        requestCode={submittedRequestCode}
        onClose={() => setSubmitSuccess(false)}
        onViewRequests={() => {
          setSubmitSuccess(false);
          navigate('/list');
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