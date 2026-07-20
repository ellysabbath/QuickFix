import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader,
  ChevronDown,
  Search,
  X,
  Check,
  LogIn,
  Send,
  Info
} from 'lucide-react';

// Country data
interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  pattern: string;
}

const countries: Country[] = [
  { code: '+1', name: 'United States', flag: '🇺🇸', dialCode: '+1', pattern: '### ### ####' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', pattern: '#### ######' },
  { code: '+91', name: 'India', flag: '🇮🇳', dialCode: '+91', pattern: '##### #####' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', dialCode: '+61', pattern: '# #### ####' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255', pattern: '## ### ####' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', pattern: '### ### ###' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', pattern: '### ### ###' },
  { code: '+250', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', pattern: '### ### ###' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', pattern: '### ### ####' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', pattern: '## ### ####' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', pattern: '### ### ####' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', pattern: '# #### ####' },
  { code: '+971', name: 'UAE', flag: '🇦🇪', dialCode: '+971', pattern: '# ### ####' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', dialCode: '+49', pattern: '#### ######' },
  { code: '+33', name: 'France', flag: '🇫🇷', dialCode: '+33', pattern: '# ## ## ## ##' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', dialCode: '+81', pattern: '## #### ####' },
  { code: '+86', name: 'China', flag: '🇨🇳', dialCode: '+86', pattern: '### #### ####' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', pattern: '## ##### ####' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', pattern: '## ## ## ####' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', dialCode: '+39', pattern: '## ### ####' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', dialCode: '+34', pattern: '## ### ## ##' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', pattern: '## ### ####' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', dialCode: '+7', pattern: '### ### ## ##' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', pattern: '## ### ####' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', pattern: '### ### ####' },
];

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [error, setError] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (selectedCountry.pattern) {
      let formatted = '';
      let patternIndex = 0;
      let cleanedIndex = 0;
      
      while (patternIndex < selectedCountry.pattern.length && cleanedIndex < cleaned.length) {
        if (selectedCountry.pattern[patternIndex] === '#') {
          formatted += cleaned[cleanedIndex];
          cleanedIndex++;
          patternIndex++;
        } else {
          formatted += selectedCountry.pattern[patternIndex];
          patternIndex++;
        }
      }
      return formatted;
    }
    return cleaned;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleContinue = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }
    
    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setCheckingPhone(true);
    setError('');
    const fullNumber = `${selectedCountry.dialCode}${cleanNumber}`;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - check if phone exists
      const mockUserExists = false; // Change to true to test existing user flow
      
      if (mockUserExists) {
        // Show alert dialog (using window.confirm in browser)
        const confirm = window.confirm(
          'An account with this phone number already exists. Would you like to login instead?'
        );
        if (confirm) {
          navigate('/login');
        }
      } else {
        setShowEmailInput(true);
      }
    } catch (error) {
      setError('Failed to verify phone number. Please check your connection.');
    } finally {
      setCheckingPhone(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const fullNumber = `${selectedCountry.dialCode}${cleanNumber}`;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      const mockSuccess = true;
      
      if (mockSuccess) {
        navigate('/verify-otp', { 
          state: { 
            phoneNumber: fullNumber,
            email: email,
            fromRegistration: true
          }
        });
      } else {
        setError('Failed to send verification code');
      }
    } catch (error) {
      setError('Failed to send verification code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(false);
    setSearchQuery('');
    setPhoneNumber('');
  };

  const getCleanNumber = () => {
    return phoneNumber.replace(/\D/g, '');
  };

  const isPhoneValid = getCleanNumber().length >= 8;
  const isEmailValid = email && email.includes('@');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button 
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-lg font-semibold text-black">Register</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black text-center mb-3">Create Account</h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          {!showEmailInput 
            ? "Enter your phone number to get started" 
            : "Enter your email address to verify"}
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Phone Number Section */}
        {!showEmailInput ? (
          <>
            <div className="flex w-full border border-gray-300 rounded-xl overflow-hidden mb-6 bg-white">
              <button 
                onClick={() => setModalVisible(true)}
                className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-sm font-medium text-black">{selectedCountry.dialCode}</span>
                <ChevronDown className="w-4 h-4 text-black" />
              </button>
              
              <input
                type="tel"
                className="flex-1 px-3 py-3 text-base text-black outline-none bg-white"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </div>

            {/* Terms Agreement */}
            <button 
              className="flex items-start w-full mb-6"
              onClick={() => setAgreeToTerms(!agreeToTerms)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 transition-colors ${
                agreeToTerms ? 'bg-black border-black' : 'border-gray-300'
              }`}>
                {agreeToTerms && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-gray-500">
                I agree to the <span className="text-black font-medium">Terms & Conditions</span> and 
                <span className="text-black font-medium"> Privacy Policy</span>
              </span>
            </button>

            {/* Continue Button */}
            <button
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full transition-all ${
                isPhoneValid && agreeToTerms && !checkingPhone
                  ? 'bg-gray-100 border border-black text-black hover:bg-gray-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleContinue}
              disabled={!isPhoneValid || !agreeToTerms || checkingPhone}
            >
              {checkingPhone ? (
                <Loader className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>
                  <span className="font-semibold">Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Email Input Section */}
            <div className="flex w-full border border-gray-300 rounded-xl overflow-hidden mb-6 bg-white">
              <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="flex-1 px-3 py-3 text-base text-black outline-none bg-white"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            {/* Send Code Button */}
            <button
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full transition-all ${
                isEmailValid && !loading
                  ? 'bg-gray-100 border border-black text-black hover:bg-gray-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleEmailSubmit}
              disabled={!isEmailValid || loading}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>
                  <span className="font-semibold">Send Code</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Back to phone number */}
            <button
              className="flex items-center gap-2 mt-4 text-black hover:text-gray-600 transition-colors"
              onClick={() => setShowEmailInput(false)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to phone number</span>
            </button>
          </>
        )}

        {/* Already have account */}
        <button
          className="flex items-center gap-2 mt-6 text-black font-medium hover:text-gray-600 transition-colors"
          onClick={() => navigate('/login')}
        >
          <LogIn className="w-4 h-4" />
          <span>Already have an account? Sign in</span>
        </button>

        {/* Info Text */}
        <div className="flex items-center gap-1 mt-6 text-xs text-gray-400">
          <Info className="w-3 h-3" />
          <span>Your phone number and email will be used for account verification</span>
        </div>
      </div>

      {/* Country Picker Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-black">Select Country</h3>
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

export default RegisterScreen;