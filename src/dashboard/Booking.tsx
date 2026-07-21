import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  Wrench,
  AlertCircle,
  CheckCircle,
  Loader,
  Plus,
  Info,
  Navigation,
  MessageCircle,
  Globe,
  Target
} from 'lucide-react';

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

// Vehicle brands
const ALL_VEHICLE_BRANDS = [
  "Abarth", "Acura", "Alfa Romeo", "Aston Martin", "Audi",
  "Bentley", "BMW", "Bugatti", "Buick", "BYD",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën",
  "Dacia", "Dodge",
  "Ferrari", "Fiat", "Ford",
  "Genesis", "GMC",
  "Honda", "Hyundai",
  "Infiniti", "Isuzu",
  "Jaguar", "Jeep",
  "Kia",
  "Lamborghini", "Land Rover", "Lexus", "Lincoln",
  "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot", "Porsche",
  "Ram", "Renault", "Rolls-Royce",
  "Saab", "Subaru", "Suzuki",
  "Tesla", "Toyota",
  "Volkswagen", "Volvo"
].sort((a, b) => a.localeCompare(b));

const CURRENT_YEAR = new Date().getFullYear();
const VEHICLE_YEARS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => (CURRENT_YEAR - i).toString());

const BookingScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedRequestCode, setSubmittedRequestCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Modal states
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [yearSearchQuery, setYearSearchQuery] = useState('');
  const [showCustomBrandInput, setShowCustomBrandInput] = useState(false);
  const [customBrand, setCustomBrand] = useState('');
  
  // Mock user data
  const mockUser = {
    full_name: 'John Doe',
    mobile_number: '+255 712 345 678',
    email: 'john@example.com'
  };

  // Form state
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    customer_phone: mockUser.mobile_number || '',
    customer_email: mockUser.email || '',
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

  // Auto-fill phone from mock user
  useEffect(() => {
    try {
      setFormData(prev => ({
        ...prev,
        customer_phone: mockUser.mobile_number || '',
        customer_email: mockUser.email || '',
      }));
    } catch (err) {
      console.error('Error setting form data:', err);
    }
  }, []);

  // Filter brands
  const filteredBrands = useMemo(() => {
    try {
      if (!brandSearchQuery.trim()) return ALL_VEHICLE_BRANDS;
      const query = brandSearchQuery.toLowerCase();
      return ALL_VEHICLE_BRANDS.filter(brand => brand.toLowerCase().includes(query));
    } catch (err) {
      return ALL_VEHICLE_BRANDS;
    }
  }, [brandSearchQuery]);

  // Filter years
  const filteredYears = useMemo(() => {
    try {
      if (!yearSearchQuery.trim()) return VEHICLE_YEARS;
      return VEHICLE_YEARS.filter(year => year.includes(yearSearchQuery));
    } catch (err) {
      return VEHICLE_YEARS;
    }
  }, [yearSearchQuery]);

  const updateFormData = (field: keyof FormData, value: any) => {
    try {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (field === 'request_urgency') {
        setFormData(prev => ({ ...prev, is_urgent_request: value !== 'standard' }));
      }
    } catch (err) {
      console.error('Error updating form data:', err);
    }
  };

  const handleAddCustomBrand = () => {
    try {
      if (customBrand.trim().length > 0) {
        updateFormData('vehicle_brand', customBrand.trim());
        setShowBrandModal(false);
        setShowCustomBrandInput(false);
        setCustomBrand('');
        setBrandSearchQuery('');
      }
    } catch (err) {
      console.error('Error adding custom brand:', err);
    }
  };

  // ============================================================================
  // REAL GEOLOCATION FUNCTIONALITY USING BROWSER'S GEOLOCATION API
  // ============================================================================
  
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  };

  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using reverse geocoding API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    setError(null);
    
    try {
      // Get current position using browser's Geolocation API
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates
      const address = await getAddressFromCoords(latitude, longitude);
      
      // Create Google Maps link
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      // Update form data
      updateFormData('service_location', address);
      updateFormData('location_maps_link', mapsLink);
      updateFormData('latitude', parseFloat(latitude.toFixed(6)));
      updateFormData('longitude', parseFloat(longitude.toFixed(6)));
      
      // Show success message
      setError(null);
      
    } catch (err: any) {
      console.error('Location error:', err);
      
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
      
      setError(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Fallback: Get location using IP (simpler, less accurate)
  const handleUseIPLocation = async () => {
    setIsGettingLocation(true);
    setError(null);
    
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        const city = data.city || '';
        const region = data.region || '';
        const country = data.country_name || '';
        const address = [city, region, country].filter(Boolean).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        
        updateFormData('service_location', address);
        updateFormData('location_maps_link', mapsLink);
        updateFormData('latitude', lat);
        updateFormData('longitude', lng);
        
        setError(null);
      } else {
        setError('Could not get location from IP. Please allow location access.');
      }
    } catch (err) {
      setError('Failed to get IP location. Please allow location access.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const validateStep = (): boolean => {
    try {
      switch (step) {
        case 1:
          if (!formData.customer_name.trim()) {
            setError('Please enter your full name');
            return false;
          }
          if (!formData.customer_phone.trim()) {
            setError('Please enter your phone number');
            return false;
          }
          const cleanedPhone = formData.customer_phone.replace(/\D/g, '');
          if (cleanedPhone.length < 8) {
            setError('Please enter a valid phone number');
            return false;
          }
          setError(null);
          return true;
        case 2:
          if (!formData.requested_service.trim()) {
            setError('Please enter the service you need');
            return false;
          }
          setError(null);
          return true;
        case 3:
          if (!formData.vehicle_brand.trim()) {
            setError('Please select or enter vehicle brand');
            return false;
          }
          if (!formData.license_plate.trim()) {
            setError('Please enter license plate');
            return false;
          }
          setError(null);
          return true;
        case 4:
          if (!formData.service_location.trim()) {
            setError('Please enter service location');
            return false;
          }
          setError(null);
          return true;
        case 5:
          setError(null);
          return true;
        default:
          return true;
      }
    } catch (err) {
      setError('Validation error');
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmittedRequestCode('SR-2024-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    try {
      setFormData({
        customer_name: '',
        customer_phone: mockUser.mobile_number || '',
        customer_email: mockUser.email || '',
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
      setStep(1);
      setSubmitSuccess(false);
      setSubmittedRequestCode('');
      setError(null);
    } catch (err) {
      console.error('Error resetting form:', err);
    }
  };

  const renderStep = () => {
    try {
      switch (step) {
        case 1:
          return (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Contact Information</h2>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Full Name *</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none mb-5"
                placeholder="Enter your full name"
                value={formData.customer_name}
                onChange={(e) => updateFormData('customer_name', e.target.value)}
              />
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Phone Number *</label>
              <input
                type="tel"
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none mb-5 ${
                  formData.customer_phone ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'
                }`}
                placeholder="Enter your phone number"
                value={formData.customer_phone}
                onChange={(e) => updateFormData('customer_phone', e.target.value)}
              />
              {formData.customer_phone && (
                <p className="text-xs text-green-500 -mt-3 mb-4 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Auto-filled from your profile (you can edit)
                </p>
              )}
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Email (Optional)</label>
              <input
                type="email"
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none ${
                  formData.customer_email ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'
                }`}
                placeholder="Enter your email address"
                value={formData.customer_email}
                onChange={(e) => updateFormData('customer_email', e.target.value)}
              />
              {formData.customer_email && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Auto-filled from your profile (you can edit)
                </p>
              )}
            </div>
          );

        case 2:
          return (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What service do you need?</h2>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Service Type *</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none mb-5"
                placeholder="e.g., Brake replacement, Oil change, Engine repair"
                value={formData.requested_service}
                onChange={(e) => updateFormData('requested_service', e.target.value)}
              />
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Description (Optional)</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none min-h-[120px]"
                placeholder="Describe the issue in detail..."
                value={formData.request_description}
                onChange={(e) => updateFormData('request_description', e.target.value)}
                rows={4}
              />
            </div>
          );

        case 3:
          return (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vehicle Information</h2>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Vehicle Brand *</label>
              <button
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-cyan-500 transition-colors mb-5"
                onClick={() => setShowBrandModal(true)}
              >
                <span className={formData.vehicle_brand ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {formData.vehicle_brand || 'Select or add brand'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Vehicle Model (Optional)</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none mb-5"
                placeholder="e.g., Corolla, Civic, F-150"
                value={formData.vehicle_model}
                onChange={(e) => updateFormData('vehicle_model', e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Year (Optional)</label>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-cyan-500 transition-colors"
                    onClick={() => setShowYearModal(true)}
                  >
                    <span className={formData.vehicle_year ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                      {formData.vehicle_year || 'Select year'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Color (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    placeholder="e.g., Red, Blue"
                    value={formData.vehicle_color}
                    onChange={(e) => updateFormData('vehicle_color', e.target.value)}
                  />
                </div>
              </div>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">License Plate *</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none uppercase"
                placeholder="ABC-1234"
                value={formData.license_plate}
                onChange={(e) => updateFormData('license_plate', e.target.value.toUpperCase())}
              />
            </div>
          );

        case 4:
          return (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Service Location</h2>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Where should the service be done? *</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none min-h-[100px] mb-4"
                placeholder="Enter full address"
                value={formData.service_location}
                onChange={(e) => updateFormData('service_location', e.target.value)}
                rows={3}
              />
              
              {/* Location Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  className="flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  onClick={handleUseCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                  <span>GPS Location</span>
                </button>
                
                <button
                  className="flex items-center justify-center gap-2 py-3 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 font-semibold rounded-xl transition-colors disabled:opacity-50"
                  onClick={handleUseIPLocation}
                  disabled={isGettingLocation}
                >
                  <Globe className="w-5 h-5" />
                  <span>IP Location</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                <Info className="w-3 h-3 inline mr-1" />
                GPS uses your device location. IP uses network location (less accurate).
              </p>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Google Maps Link (Optional)</label>
              <input
                type="url"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="https://www.google.com/maps?q=..."
                value={formData.location_maps_link}
                onChange={(e) => updateFormData('location_maps_link', e.target.value)}
              />
              
              {formData.latitude && formData.longitude && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 border border-green-500 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="text-sm text-green-700 dark:text-green-400">Location captured successfully</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Lat: {formData.latitude}, Lng: {formData.longitude}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );

        case 5:
          return (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Schedule & Urgency</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Preferred Date *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    value={formData.preferred_service_date.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (date >= new Date()) {
                        updateFormData('preferred_service_date', date);
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Preferred Time *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    value={formData.preferred_service_time.toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const time = new Date(formData.preferred_service_time);
                      time.setHours(hours, minutes);
                      updateFormData('preferred_service_time', time);
                    }}
                  />
                </div>
              </div>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">How urgent is this? *</label>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { value: 'standard', label: 'Standard', icon: '⏱️', desc: '1-3 days' },
                  { value: 'priority', label: 'Priority', icon: '⚡', desc: '24 hours' },
                  { value: 'emergency', label: 'Emergency', icon: '🚨', desc: 'Immediate' },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      formData.request_urgency === option.value
                        ? `border-${option.value === 'standard' ? 'green' : option.value === 'priority' ? 'yellow' : 'red'}-500 bg-${option.value === 'standard' ? 'green' : option.value === 'priority' ? 'yellow' : 'red'}-50 dark:bg-${option.value === 'standard' ? 'green' : option.value === 'priority' ? 'yellow' : 'red'}-900/10`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('request_urgency', option.value as any)}
                  >
                    <span className="text-3xl mb-1">{option.icon}</span>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{option.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Budget Flexible?</label>
                <button
                  className="flex items-center gap-3"
                  onClick={() => updateFormData('is_budget_flexible', !formData.is_budget_flexible)}
                >
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_budget_flexible ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${formData.is_budget_flexible ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.is_budget_flexible ? 'Yes, flexible' : 'No, fixed'}
                  </span>
                </button>
              </div>
              
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Additional Notes (Optional)</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none min-h-[100px]"
                placeholder="Any special instructions for the garage..."
                value={formData.customer_notes}
                onChange={(e) => updateFormData('customer_notes', e.target.value)}
                rows={3}
              />
            </div>
          );

        default:
          return null;
      }
    } catch (err) {
      console.error('Error rendering step:', err);
      return (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Error loading form. Please refresh.</p>
        </div>
      );
    }
  };

  // Success Modal
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Your service request has been submitted successfully.</p>
          
          <div className="bg-cyan-50 dark:bg-cyan-900/10 rounded-xl p-4 mb-6">
            <p className="text-xs text-cyan-500 mb-1">Request Code</p>
            <p className="text-xl font-bold text-cyan-500">{submittedRequestCode}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Save this code to track your request</p>
          </div>
          
          <div className="text-left mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's next?</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Garages will review your request</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-4 h-4 text-cyan-500" />
                <span>You'll receive quotes from garages</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-cyan-500" />
                <span>Garages may contact you for details</span>
              </div>
            </div>
          </div>
          
          <button
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
          
          <button
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
            onClick={resetForm}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => step > 1 ? prevStep() : navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {step > 1 ? (
                  <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                ) : (
                  <X className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {step === 1 && "Contact Info"}
                  {step === 2 && "Service Details"}
                  {step === 3 && "Vehicle Info"}
                  {step === 4 && "Location"}
                  {step === 5 && "Schedule"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Step {step} of 5</p>
              </div>
            </div>
            {step > 1 && (
              <button
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-cyan-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={prevStep}
              >
                Back
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            <div
              className="h-1 bg-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {renderStep()}
        
        {/* Navigation Buttons */}
        <div className="mt-8">
          {step < 5 ? (
            <button
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              onClick={nextStep}
            >
              Continue
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Vehicle Brand</h3>
              <button
                onClick={() => {
                  setShowBrandModal(false);
                  setShowCustomBrandInput(false);
                  setCustomBrand('');
                  setBrandSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {!showCustomBrandInput ? (
              <>
                <div className="flex items-center gap-2 m-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 py-2 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="Search brands..."
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                  />
                  {brandSearchQuery && (
                    <button onClick={() => setBrandSearchQuery('')}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
                
                <div className="max-h-[50vh] overflow-y-auto">
                  {filteredBrands.map((brand) => (
                    <button
                      key={brand}
                      className="w-full text-left px-5 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                      onClick={() => {
                        updateFormData('vehicle_brand', brand);
                        setShowBrandModal(false);
                        setBrandSearchQuery('');
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                  
                  <button
                    className="w-full flex items-center gap-3 px-5 py-4 border-t-2 border-dashed border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10 hover:bg-cyan-100 dark:hover:bg-cyan-900/20 transition-colors"
                    onClick={() => setShowCustomBrandInput(true)}
                  >
                    <Plus className="w-5 h-5 text-cyan-500" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">Brand not listed?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Add your own brand</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-cyan-500 ml-auto" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-5">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => {
                    setShowCustomBrandInput(false);
                    setCustomBrand('');
                  }}>
                    <ArrowLeft className="w-5 h-5 text-cyan-500" />
                  </button>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Add Custom Brand</h4>
                </div>
                
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Enter brand name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-cyan-500 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none mb-4"
                  placeholder="e.g., Tesla, Rivian, etc."
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  autoFocus
                />
                
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setShowCustomBrandInput(false);
                      setCustomBrand('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors ${customBrand.trim() ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={handleAddCustomBrand}
                    disabled={!customBrand.trim()}
                  >
                    Add Brand
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Year Modal */}
      {showYearModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Vehicle Year</h3>
              <button
                onClick={() => {
                  setShowYearModal(false);
                  setYearSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 m-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="flex-1 py-2 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Search year..."
                value={yearSearchQuery}
                onChange={(e) => setYearSearchQuery(e.target.value)}
              />
              {yearSearchQuery && (
                <button onClick={() => setYearSearchQuery('')}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            
            <div className="max-h-[50vh] overflow-y-auto">
              {filteredYears.map((year) => (
                <button
                  key={year}
                  className="w-full text-left px-5 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  onClick={() => {
                    updateFormData('vehicle_year', year);
                    setShowYearModal(false);
                    setYearSearchQuery('');
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingScreen;