// src/pages/dashboard/ContactPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';

// Contact Information
const CONTACTS = {
  phone: {
    number: '+255 76969 13 84',
    rawNumber: '+255769691384',
    display: '+255 76969 13 84',
    label: 'Call Us',
    color: '#10b981',
  },
  whatsapp: {
    number: '+255 742 5786 91',
    rawNumber: '+255742578691',
    display: '+255 742 5786 91',
    label: 'WhatsApp',
    color: '#25D366',
  },
  text: {
    number: '+255 742 5786 91',
    rawNumber: '+255742578691',
    display: '+255 742 5786 91',
    label: 'Send SMS',
    color: '#0891b2',
  },
  email: {
    address: 'qfix910@gmail.com',
    label: 'Email Us',
    color: '#ef4444',
  },
};

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
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'confirm':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'info':
        return 'bg-cyan-100 dark:bg-cyan-900/30';
      default:
        return 'bg-cyan-100 dark:bg-cyan-900/30';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'confirm':
        return 'text-yellow-500';
      case 'info':
        return 'text-cyan-500';
      default:
        return 'text-cyan-500';
    }
  };

  const getIconText = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'confirm':
        return '!';
      case 'info':
        return 'i';
      default:
        return '✓';
    }
  };

  const getButtonColors = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      case 'confirm':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700';
      case 'info':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${getIconBg()} flex items-center justify-center text-3xl font-bold ${getIconColor()}`}>
            {getIconText()}
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {message}
        </p>
        
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

export default function ContactPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  // States
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [activeContact, setActiveContact] = useState<string | null>(null);

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
    cancelText?: string
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
    });
  };

  const makePhoneCall = (phoneNumber: string) => {
    setActiveContact('phone');
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    window.location.href = `tel:${cleanNumber}`;
    setTimeout(() => setActiveContact(null), 1000);
  };

  const openWhatsApp = (phoneNumber: string) => {
    setActiveContact('whatsapp');
    const cleanNumber = phoneNumber.replace(/\s/g, '').replace('+', '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
    setTimeout(() => setActiveContact(null), 1000);
  };

  const sendTextMessage = (phoneNumber: string) => {
    setActiveContact('text');
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    window.location.href = `sms:${cleanNumber}`;
    setTimeout(() => setActiveContact(null), 1000);
  };

  const sendEmail = (email: string) => {
    setActiveContact('email');
    window.location.href = `mailto:${email}`;
    setTimeout(() => setActiveContact(null), 1000);
  };

  const handleSubscribe = () => {
    if (!subscribeEmail.trim()) {
      showConfirmationModal('error', 'Error', 'Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      showConfirmationModal('error', 'Error', 'Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribeEmail('');
      showConfirmationModal('success', 'Subscribed!', 'Thank you for subscribing to our newsletter!');
    }, 1500);
  };

  const renderContactCard = (
    label: string,
    value: string,
    onPress: () => void,
    color: string,
    isActive: boolean,
    icon: string
  ) => {
    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all cursor-pointer hover:shadow-md"
        style={{ borderColor: isActive ? color : '#e2e8f0' }}
        onClick={onPress}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold"
            style={{ backgroundColor: color + '15', color }}
          >
            {icon}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="text-sm font-bold" style={{ color }}>{value}</p>
          </div>
          
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: color + '10', color }}
          >
            →
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              ←
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Contact Us</h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">We're here to help you 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-24">
        <div className="space-y-4">
          {/* Call Card */}
          {renderContactCard(
            CONTACTS.phone.label,
            CONTACTS.phone.display,
            () => makePhoneCall(CONTACTS.phone.rawNumber),
            CONTACTS.phone.color,
            activeContact === 'phone',
            '📞'
          )}

          {/* WhatsApp Card */}
          {renderContactCard(
            CONTACTS.whatsapp.label,
            CONTACTS.whatsapp.display,
            () => openWhatsApp(CONTACTS.whatsapp.rawNumber),
            CONTACTS.whatsapp.color,
            activeContact === 'whatsapp',
            '💬'
          )}

          {/* SMS Card */}
          {renderContactCard(
            CONTACTS.text.label,
            CONTACTS.text.display,
            () => sendTextMessage(CONTACTS.text.rawNumber),
            CONTACTS.text.color,
            activeContact === 'text',
            '✉'
          )}

          {/* Email Card */}
          {renderContactCard(
            CONTACTS.email.label,
            CONTACTS.email.address,
            () => sendEmail(CONTACTS.email.address),
            CONTACTS.email.color,
            activeContact === 'email',
            '📧'
          )}

          {/* Office Hours Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-lg font-bold text-cyan-600 dark:text-cyan-400">
                ⏰
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Office Hours</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monday - Friday</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saturday</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sunday</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">10:00 AM - 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
            <div className="flex justify-center gap-4 text-2xl">
              <a
                href="https://facebook.com/quickfix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-blue-600"
              >
                f
              </a>
              <a
                href="https://twitter.com/quickfix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-blue-400"
              >
                t
              </a>
              <a
                href="https://instagram.com/quickfix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors text-pink-600"
              >
                i
              </a>
              <a
                href="https://linkedin.com/company/quickfix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-blue-700"
              >
                in
              </a>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-white text-xl font-bold">
                ✉
              </div>
              <h3 className="text-lg font-bold text-white">Stay Updated</h3>
              <p className="text-xs text-white/80">Subscribe to our newsletter for exclusive offers and updates</p>
            </div>
            <div className="p-4">
              <div className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 mb-3">
                <span className="text-gray-400 mr-2">✉</span>
                <input
                  type="email"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                  placeholder="Enter your email address"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                />
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
              >
                {isSubscribing ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>✉</span>
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 text-red-500 text-xl font-bold">
                !
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Emergency</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  For urgent roadside assistance, call our emergency hotline
                </p>
                <button
                  onClick={() => makePhoneCall(CONTACTS.phone.rawNumber)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <span>📞</span>
                  Call Emergency: {CONTACTS.phone.display}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 QuickFix Automotive. All rights reserved.</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">We typically respond within 24 hours</p>
          </div>
        </div>
      </div>

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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}