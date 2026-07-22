// src/pages/verify_otp/Index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
  Clock
} from 'lucide-react';

const VerifyOTPScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Create refs for each input
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const inputRef5 = useRef<HTMLInputElement>(null);
  
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3, inputRef4, inputRef5];

  // Get params from location state - only extract what's needed
  const { email } = location.state || {};

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow single digit
    const digit = text.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs[nextEmptyIndex].current?.focus();
    } else {
      inputRefs[5].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification - accept any 6 digit code for demo
      const mockSuccess = true;
      
      if (mockSuccess) {
        setSuccess(true);
        // Show success for 2 seconds then navigate
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      const mockSuccess = true;
      
      if (mockSuccess) {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
        
        // Restart timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const otpCode = otp.join('');
  const isOtpComplete = otpCode.length === 6;

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
        <h1 className="text-lg font-semibold text-black">Verify Code</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 max-w-md mx-auto w-full">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black text-center mb-3">Check your email</h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          We've sent a verification code to
          <br />
          <span className="text-black font-semibold">{email || 'your email'}</span>
        </p>

        {/* Success Message */}
        {success && (
          <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-700 font-medium">Account verified successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex gap-3 w-full mb-8 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              className={`w-14 h-14 border-2 rounded-xl text-center text-xl font-semibold text-black outline-none transition-all focus:border-black ${
                digit ? 'border-black bg-gray-50' : 'border-gray-300'
              } ${error ? 'border-red-500' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              maxLength={1}
              disabled={loading || success}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full transition-all ${
            isOtpComplete && !loading && !success
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleVerify}
          disabled={!isOtpComplete || loading || success}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin text-white" />
          ) : (
            <span className="font-semibold">Verify & Create Account</span>
          )}
        </button>

        {/* Resend Section */}
        <div className="flex items-center gap-1 mt-6">
          <span className="text-sm text-gray-500">Didn't receive the code?</span>
          {canResend ? (
            <button
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm text-black font-semibold hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              Resend Code
            </button>
          ) : (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Resend in {timer}s
            </span>
          )}
        </div>

        {/* Back Link */}
        <button
          className="flex items-center gap-2 mt-6 text-black hover:text-gray-600 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to registration</span>
        </button>

        {/* Info Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Enter the 6-digit code sent to your email address
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPScreen;