import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  ChevronDown,
  ArrowRight,
  UserPlus,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';

// Country data
interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: '+1', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: '+91', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
  { code: '+250', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: '+971', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: '+33', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: '+86', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
];

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkingPhone, setCheckingPhone] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Format phone number
  const formatPhoneNumber = useCallback((text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    
    if (selectedCountry.dialCode === '+255') {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
    }
    
    return cleaned;
  }, [selectedCountry]);

  const handlePhoneChange = (text: string): void => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setError('');
  };

  // Filter countries
  const filteredCountries = useMemo((): Country[] => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
    );
  }, [searchQuery]);

  // Handle login (no auth - just navigate)
  const handleLogin = async (): Promise<void> => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }

    const fullNumber = `${selectedCountry.dialCode}${cleanNumber}`;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const mockSuccess = true;
      
      if (mockSuccess) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to login. Please check your connection.');
    } finally {
      setIsLoading(false);
      setCheckingPhone(false);
    }
  };

  const handleCreateAccount = (): void => {
    navigate('/signup');
  };

  const selectCountry = (country: Country): void => {
    setSelectedCountry(country);
    setModalVisible(false);
    setSearchQuery('');
    setPhoneNumber('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="w-8" />
        <h1 className="text-3xl font-bold text-black tracking-wide">Fix</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
            <Phone className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-black text-center mb-2">Welcome to Fix</h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          Please enter your phone number to continue
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Phone Input */}
        <div className="flex w-full border-2 border-gray-200 rounded-xl overflow-hidden mb-5 bg-white">
          <button
            onClick={() => setModalVisible(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-r border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="text-sm font-semibold text-black">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-4 h-4 text-black" />
          </button>
          
          <input
            type="tel"
            className="flex-1 px-3 py-3 text-base text-black outline-none bg-white"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Login Button */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full transition-all ${
            isLoading
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 border border-black'
          }`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin text-black" />
          ) : (
            <>
              <span className="font-semibold text-black">Continue</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-sm text-black font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Create Account Button */}
        <button
          onClick={handleCreateAccount}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-black bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <UserPlus className="w-5 h-5 text-black" />
          <span className="font-semibold text-black">Create new account</span>
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          Your phone number will be used for account verification
        </p>
      </div>

      {/* Country Picker Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-black">Select Country</h3>
              <button
                onClick={() => setModalVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-2 m-4 px-4 py-2 bg-gray-100 rounded-xl">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="flex-1 py-2 text-base text-black outline-none bg-transparent"
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
                </button>
              )}
            </div>
            
            {/* Country List */}
            <div className="flex-1 overflow-y-auto">
              {filteredCountries.map((country, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  onClick={() => selectCountry(country)}
                >
                  <span className="text-3xl">{country.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-base font-medium text-black">{country.name}</p>
                    <p className="text-sm text-gray-500">{country.dialCode}</p>
                  </div>
                  {selectedCountry.dialCode === country.dialCode && selectedCountry.name === country.name && (
                    <CheckCircle className="w-6 h-6 text-black" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;