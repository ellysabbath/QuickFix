// src/pages/PaymentPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Check,
  User,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Save,
  CircleCheckBig,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  Info,
  Copy,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  DollarSign,
  PhoneCall,
  QrCode,
  MessageCircle,
  CheckCheck,
  Plus
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const WHATSAPP_NUMBER = '255742578691';

// Types
interface ServiceRequest {
  id: number;
  request_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  requested_service: string;
  request_description: string | null;
  budget_minimum: number | null;
  budget_maximum: number | null;
  request_status: string;
  request_status_display?: string;
  formatted_date?: string;
  formatted_time?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  apiMethod: string;
  recipientName: string;
  recipientPhone: string;
  recipientAccount?: string;
  recipientBank?: string;
  instructions: string[];
}

interface PaymentStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
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
        return <CircleCheckBig className="w-14 h-14 sm:w-16 sm:h-16 text-green-500" />;
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

// Default Payment Methods
const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mpesa',
    name: 'Lipa Na M-Pesa',
    icon: <Smartphone className="w-5 h-5" />,
    color: '#4CAF50',
    description: 'Pay using M-Pesa mobile money',
    apiMethod: 'mpesa',
    recipientName: 'QuickFix Services',
    recipientPhone: '+255 742 5786 91',
    recipientAccount: '123456',
    instructions: [
      'Open M-Pesa on your phone',
      'Select "Lipa Na M-Pesa"',
      'Enter Paybill Number: 123456',
      'Enter Account Number: Your phone number',
      'Enter Amount',
      'Enter PIN and confirm',
      'Save the confirmation message for reference',
    ],
  },
  {
    id: 'tigo_pesa',
    name: 'Tigo Pesa',
    icon: <CreditCard className="w-5 h-5" />,
    color: '#E91E63',
    description: 'Pay using Tigo Pesa',
    apiMethod: 'tigo_pesa',
    recipientName: 'QuickFix Services',
    recipientPhone: '+255 742 5786 91',
    recipientAccount: '123456',
    instructions: [
      'Open Tigo Pesa on your phone',
      'Select "Pay"',
      'Enter Business Number: 123456',
      'Enter Reference: Your phone number',
      'Enter Amount',
      'Enter PIN and confirm',
      'Save the confirmation message for reference',
    ],
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    icon: <PhoneCall className="w-5 h-5" />,
    color: '#FF9800',
    description: 'Pay using Airtel Money',
    apiMethod: 'airtel_money',
    recipientName: 'QuickFix Services',
    recipientPhone: '+255 742 5786 91',
    recipientAccount: '123456',
    instructions: [
      'Open Airtel Money on your phone',
      'Select "Make Payment"',
      'Enter Merchant Code: 123456',
      'Enter Reference: Your phone number',
      'Enter Amount',
      'Enter PIN and confirm',
      'Save the confirmation message for reference',
    ],
  },
  {
    id: 'halo_pesa',
    name: 'Halo Pesa',
    icon: <QrCode className="w-5 h-5" />,
    color: '#9C27B0',
    description: 'Pay using Halo Pesa (TTCL)',
    apiMethod: 'halo_pesa',
    recipientName: 'QuickFix Services',
    recipientPhone: '+255 742 5786 91',
    recipientAccount: '123456',
    instructions: [
      'Open Halo Pesa on your phone',
      'Select "Payment"',
      'Enter Business ID: 123456',
      'Enter Reference: Your phone number',
      'Enter Amount',
      'Enter PIN and confirm',
      'Save the confirmation message for reference',
    ],
  },
  {
    id: 'manual',
    name: 'Manual Payment',
    icon: <Building2 className="w-5 h-5" />,
    color: '#64748B',
    description: 'Pay via bank deposit',
    apiMethod: 'manual',
    recipientName: 'QuickFix Services',
    recipientPhone: '+255 742 5786 91',
    recipientAccount: '01-1234567890',
    recipientBank: 'CRDB Bank PLC',
    instructions: [
      'Visit any CRDB Bank branch',
      'Fill deposit slip with the following details:',
      'Account Name: QuickFix Services',
      'Account Number: 01-1234567890',
      'Branch: Kariakoo Branch',
      'Amount',
      'Make the deposit',
      'Keep your deposit slip for reference',
    ],
  },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);

  // State
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);

  // Payment Confirmation Fields
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);
  const [currentPaymentCode, setCurrentPaymentCode] = useState<string>('');

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

  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  // Payment stages
  const paymentStages: PaymentStage[] = [
    { id: 'select_request', title: 'Select Request', description: 'Choose service to pay', icon: <FileText className="w-3.5 h-3.5" />, isCompleted: false, isActive: true },
    { id: 'select_method', title: 'Select Method', description: 'Choose payment option', icon: <Wallet className="w-3.5 h-3.5" />, isCompleted: false, isActive: false },
    { id: 'enter_amount', title: 'Enter Amount', description: 'Specify payment amount', icon: <DollarSign className="w-3.5 h-3.5" />, isCompleted: false, isActive: false },
    { id: 'payment_details', title: 'Payment Details', description: 'Enter sender info', icon: <User className="w-3.5 h-3.5" />, isCompleted: false, isActive: false },
    { id: 'payment_instructions', title: 'Instructions', description: 'Follow steps to pay', icon: <Info className="w-3.5 h-3.5" />, isCompleted: false, isActive: false },
    { id: 'confirm_payment', title: 'Confirm Payment', description: 'Verify & confirm', icon: <CheckCircle className="w-3.5 h-3.5" />, isCompleted: false, isActive: false },
  ];

  // Effects
  useEffect(() => {
    if (isAuthenticated && user) {
      const userPhone = user.mobile_number || '';
      const userName = user.full_name || '';
      const userEmail = user.email || '';
      if (userPhone) setSenderPhone(userPhone);
      if (userName) setSenderName(userName);
      if (userEmail) setSenderEmail(userEmail);
      fetchUserRequests();
    }
  }, [user, isAuthenticated]);

  // API Functions
  const getAuthToken = (): string | null => {
    try {
      return localStorage.getItem('access_token');
    } catch (error) {
      return null;
    }
  };

  const api = {
    getAllRequests: async (): Promise<ServiceRequest[]> => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/public-requests/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      return response.json();
    },

    getUserUnpaidRequests: async (phone: string): Promise<ServiceRequest[]> => {
      const allRequests = await api.getAllRequests();
      
      return allRequests.filter(req => {
        const phoneMatches = req.customer_phone === phone || 
                            req.customer_phone?.replace(/^\+?255/, '0') === phone.replace(/^\+?255/, '0');
        const noBudget = !req.budget_maximum || req.budget_maximum === 0 || req.budget_maximum === null;
        const isPending = req.request_status === 'pending' || req.request_status === 'processing';
        
        return phoneMatches && noBudget && isPending;
      });
    },

    createPaymentRecord: async (data: any): Promise<any> => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/pay/payment-records/me/`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }
      return response.json();
    },

    confirmPayment: async (id: number, data: any): Promise<any> => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/pay/payment-records/me/${id}/confirm/`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to confirm payment');
      }
      return response.json();
    },

    notifyWhatsApp: async (id: number): Promise<any> => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/pay/payment-records/me/${id}/notify_whatsapp/`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to notify WhatsApp');
      return response.json();
    },
  };

  const fetchUserRequests = async () => {
    if (!user?.mobile_number) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userPhone = user.mobile_number;
      const unpaidRequests = await api.getUserUnpaidRequests(userPhone);
      setServiceRequests(unpaidRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showConfirmationModal('error', 'Error', 'Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

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

  const updatePaymentStages = () => {
    return paymentStages.map((stage, index) => ({
      ...stage,
      isActive: index === currentStage,
      isCompleted: index < currentStage,
    }));
  };

  const handleSelectRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setAmount('');
    setCurrentStage(1);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStage(2);
  };

  const handleNextStage = async () => {
    if (currentStage === 0 && !selectedRequest) {
      showConfirmationModal('error', 'Error', 'Please select a service request to pay for');
      return;
    }

    if (currentStage === 1 && !selectedMethod) {
      showConfirmationModal('error', 'Error', 'Please select a payment method');
      return;
    }

    if (currentStage === 2) {
      if (!amount || parseFloat(amount) <= 0) {
        showConfirmationModal('error', 'Error', 'Please enter a valid amount');
        return;
      }
      setCurrentStage(3);
    } else if (currentStage === 3) {
      if (!senderName) {
        showConfirmationModal('error', 'Error', 'Please enter sender name');
        return;
      }
      if (!senderPhone) {
        showConfirmationModal('error', 'Error', 'Please enter sender phone number');
        return;
      }
      if (!senderEmail) {
        showConfirmationModal('error', 'Error', 'Please enter sender email');
        return;
      }
      if (selectedMethod === 'manual' && !senderAccount) {
        showConfirmationModal('error', 'Error', 'Please enter sender account number');
        return;
      }

      const saved = await savePaymentData();
      if (saved) {
        setCurrentStage(4);
      }
    } else if (currentStage === 4) {
      setCurrentStage(5);
    } else if (currentStage === 5) {
      handleConfirmPayment();
    }
  };

  const handlePrevStage = () => {
    if (currentStage === 1) {
      setSelectedMethod(null);
    }
    if (currentStage === 3) {
      setCurrentStage(2);
    } else if (currentStage === 4) {
      setCurrentStage(3);
    } else if (currentStage === 5) {
      setCurrentStage(4);
    } else {
      setCurrentStage(prev => prev - 1);
    }
  };

  const savePaymentData = async (): Promise<boolean> => {
    setIsProcessing(true);

    try {
      const paymentData = {
        service_request: selectedRequest?.id,
        payment_method: selectedMethod,
        sender_name: senderName,
        sender_phone: senderPhone,
        sender_email: senderEmail,
        sender_account: senderAccount || '',
        amount: parseFloat(amount),
        receiver_name: selectedPaymentMethod?.recipientName || 'QuickFix Services',
        receiver_phone: selectedPaymentMethod?.recipientPhone || '+255 742 5786 91',
        receiver_account: selectedPaymentMethod?.recipientAccount || '',
        screenshot_base64: '',
        screenshot_filename: '',
        screenshot_content_type: '',
      };

      const result = await api.createPaymentRecord(paymentData);
      setCurrentPaymentId(result.id);
      setCurrentPaymentCode(result.payment_id);

      showConfirmationModal('success', 'Success!', 'Payment details saved! Check your email for confirmation.');
      return true;
    } catch (error: any) {
      console.error('Error saving payment:', error);
      showConfirmationModal('error', 'Error', error.message || 'Failed to save payment details');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const openWhatsApp = () => {
    const method = selectedPaymentMethod;
    const message = `✅ *PAYMENT CONFIRMATION - QuickFix*
    
📋 *Request Code:* ${selectedRequest?.request_code}
💰 *Amount:* TZS ${parseFloat(amount).toLocaleString()}
👤 *Sender Name:* ${senderName}
📱 *Sender Phone:* ${senderPhone}
📧 *Sender Email:* ${senderEmail}
🏦 *Sender Account:* ${senderAccount || 'N/A'}
🏢 *Receiver Name:* ${method?.recipientName || 'QuickFix Services'}
📱 *Receiver Phone:* ${method?.recipientPhone || '+255 742 5786 91'}
${method?.recipientAccount ? `🏦 *Receiver Account:* ${method?.recipientAccount}` : ''}
${method?.recipientBank ? `🏛️ *Bank:* ${method?.recipientBank}` : ''}
📝 *Reference:* ${transactionReference || 'N/A'}
💳 *Method:* ${method?.name || 'N/A'}
📅 *Date:* ${new Date().toLocaleDateString()}
🕐 *Time:* ${new Date().toLocaleTimeString()}
🆔 *Payment ID:* ${currentPaymentCode}

*I have completed the payment!*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleConfirmPayment = () => {
    if (!transactionReference && !screenshotUri) {
      showConfirmationModal('error', 'Error', 'Please provide a reference number or upload a screenshot');
      return;
    }

    showConfirmationModal(
      'confirm',
      'Confirm Payment',
      'Have you completed the payment outside the app?',
      async () => {
        setIsProcessing(true);
        try {
          if (currentPaymentId) {
            const confirmData = {
              transaction_reference: transactionReference,
              status: 'confirmed',
              screenshot_base64: '',
              screenshot_filename: '',
              screenshot_content_type: '',
            };

            await api.confirmPayment(currentPaymentId, confirmData);
            await api.notifyWhatsApp(currentPaymentId);

            openWhatsApp();

            setTimeout(() => {
              setIsProcessing(false);
              setShowSuccessModal(true);
            }, 1500);
          }
        } catch (error: any) {
          console.error('Error confirming payment:', error);
          setIsProcessing(false);
          showConfirmationModal('error', 'Error', error.message || 'Failed to confirm payment');
        }
      },
      () => setConfirmationModal(prev => ({ ...prev, isOpen: false })),
      'Yes, Confirm',
      'Not Yet'
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showConfirmationModal('success', 'Copied!', 'Text copied to clipboard');
  };

  const resetPayment = () => {
    setSelectedRequest(null);
    setSelectedMethod(null);
    setAmount('');
    setCurrentStage(0);
    setShowSuccessModal(false);
    setSenderName('');
    setSenderPhone('');
    setSenderEmail('');
    setSenderAccount('');
    setTransactionReference('');
    setScreenshotUri(null);
    setCurrentPaymentId(null);
    setCurrentPaymentCode('');
    fetchUserRequests();
  };

  // Render Functions
  const renderStageIndicator = () => {
    const stages = updatePaymentStages();
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 px-4 scrollbar-hide">
        {stages.map((stage, index) => (
          <div key={`stage-${stage.id}-${index}`} className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stage.isCompleted ? 'bg-green-500' :
                stage.isActive ? 'bg-cyan-500' :
                'bg-gray-200 dark:bg-gray-700'
              }`}>
                {stage.isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={stage.isActive ? 'text-white' : 'text-gray-400'}>
                    {stage.icon}
                  </span>
                )}
              </div>
              {index < stages.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  stage.isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
            <div className="ml-2">
              <p className={`text-[10px] font-medium ${
                stage.isActive ? 'text-cyan-600 dark:text-cyan-400' :
                stage.isCompleted ? 'text-green-600 dark:text-green-400' :
                'text-gray-400'
              }`}>
                {stage.title}
              </p>
              <p className="text-[8px] text-gray-400">{stage.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRequestSelection = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="mt-3 text-sm text-gray-500">Loading your requests...</p>
        </div>
      );
    }

    if (serviceRequests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No pending payments!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            All your service requests have been paid for or have budgets set.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Create New Request
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Service Request</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose which service to pay for ({serviceRequests.length} requests without budget)
        </p>

        <div className="space-y-3">
          {serviceRequests.map((item) => (
            <div
              key={item.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-all ${
                selectedRequest?.id === item.id
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
              }`}
              onClick={() => handleSelectRequest(item)}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {item.request_code}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.request_status === 'pending'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {item.request_status_display || item.request_status}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{item.requested_service}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {item.formatted_date || 'Date not set'} at {item.formatted_time || 'Time not set'}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                  No Budget Set
                </span>
              </div>
              {selectedRequest?.id === item.id && (
                <CheckCircle className="w-5 h-5 text-cyan-500 absolute top-3 right-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMethodSelection = () => {
    return (
      <div>
        <button
          className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-700 transition-colors"
          onClick={() => setCurrentStage(0)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Choose Payment Method</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select how you want to pay</p>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? `border-[${method.color}] shadow-lg`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              style={{ borderColor: selectedMethod === method.id ? method.color : undefined }}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: method.color + '20' }}
                >
                  <span style={{ color: method.color }}>{method.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{method.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                  {method.recipientName && (
                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-0.5">
                      📱 {method.recipientName}
                    </p>
                  )}
                </div>
                {selectedMethod === method.id && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: method.color }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className={`w-full mt-4 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${
            selectedMethod
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/30'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={() => {
            if (selectedMethod) {
              setCurrentStage(2);
            } else {
              showConfirmationModal('error', 'Error', 'Please select a payment method first');
            }
          }}
          disabled={!selectedMethod}
        >
          Enter Amount
        </button>
      </div>
    );
  };

  const renderAmountInput = () => {
    if (!selectedPaymentMethod || !selectedRequest) return null;

    return (
      <div>
        <button
          className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-700 transition-colors"
          onClick={() => setCurrentStage(1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Methods
        </button>

        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedPaymentMethod.color + '20' }}
          >
            <span style={{ color: selectedPaymentMethod.color }}>{selectedPaymentMethod.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPaymentMethod.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter the amount you want to pay</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Request:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedRequest.request_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Service:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedRequest.requested_service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Receiver:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Receiver Phone:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Enter Payment Amount</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Please enter the amount you wish to pay</p>

          <div className="flex items-center border-2 border-cyan-500 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            <span className="px-4 text-sm font-bold text-cyan-600 dark:text-cyan-400">TZS</span>
            <input
              type="number"
              className="flex-1 py-3 px-2 text-base font-semibold text-gray-900 dark:text-white bg-transparent outline-none"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested Amounts:</p>
            <div className="flex flex-wrap gap-2">
              {['50000', '100000', '150000', '200000'].map((val) => (
                <button
                  key={val}
                  className="px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 rounded-full border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 transition-colors"
                  onClick={() => setAmount(val)}
                >
                  TZS {parseInt(val).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 mt-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-700 dark:text-cyan-300">
              Enter the exact amount you will pay. An email notification will be sent to you.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={handlePrevStage}
          >
            Back
          </button>
          <button
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-white font-medium text-sm shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            onClick={handleNextStage}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentDetails = () => {
    if (!selectedPaymentMethod || !selectedRequest) return null;

    return (
      <div>
        <button
          className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-700 transition-colors"
          onClick={() => setCurrentStage(2)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Amount
        </button>

        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedPaymentMethod.color + '20' }}
          >
            <span style={{ color: selectedPaymentMethod.color }}>{selectedPaymentMethod.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPaymentMethod.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter your payment details</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Request:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedRequest.request_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Service:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedRequest.requested_service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Amount:</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">TZS {parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Receiver:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Receiver Phone:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Sender Information</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Sender Full Name *</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                placeholder="Enter your full name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
              {isAuthenticated && senderName && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[10px] text-green-600">Auto-filled</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Sender Phone Number *</label>
              <input
                type="tel"
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                placeholder="Enter your phone number"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
              />
              {isAuthenticated && senderPhone && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[10px] text-green-600">Auto-filled</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Sender Email Address *</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                placeholder="Enter your email address"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              />
              {isAuthenticated && senderEmail && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[10px] text-green-600">Auto-filled</span>
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-1">You will receive email notifications at this address</p>
            </div>

            {selectedMethod === 'manual' && (
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Sender Account Number *</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter your account number"
                  value={senderAccount}
                  onChange={(e) => setSenderAccount(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
          <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Your payment details will be saved to the database. You will then see payment instructions.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={handlePrevStage}
          >
            Back
          </button>
          <button
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-white font-medium text-sm shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleNextStage}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Save & Continue
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentInstructions = () => {
    if (!selectedPaymentMethod || !selectedRequest) return null;

    return (
      <div>
        <button
          className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-700 transition-colors"
          onClick={() => setCurrentStage(3)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </button>

        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedPaymentMethod.color + '20' }}
          >
            <span style={{ color: selectedPaymentMethod.color }}>{selectedPaymentMethod.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPaymentMethod.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Follow these steps to complete payment</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Request:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedRequest.request_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Amount:</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">TZS {parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Payment ID:</span>
              <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">{currentPaymentCode}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Payment Instructions</h3>
          </div>
          <div className="space-y-3">
            {selectedPaymentMethod.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-white">{index + 1}</span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4 border border-cyan-200 dark:border-cyan-800 mb-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Recipient Information</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Name:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Phone:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientPhone}</span>
                <button onClick={() => copyToClipboard(selectedPaymentMethod.recipientPhone.replace(/\s/g, ''))}>
                  <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                </button>
              </div>
            </div>
            {selectedPaymentMethod.recipientAccount && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Account:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientAccount}</span>
                  <button onClick={() => copyToClipboard(selectedPaymentMethod.recipientAccount || '')}>
                    <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  </button>
                </div>
              </div>
            )}
            {selectedPaymentMethod.recipientBank && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Bank:</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.recipientBank}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
          <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            After completing the payment outside the app, click "I Have Paid" to confirm with reference or screenshot.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={handlePrevStage}
          >
            Back
          </button>
          <button
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-medium text-sm shadow-lg shadow-green-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            onClick={handleNextStage}
          >
            <CheckCircle className="w-4 h-4" />
            I Have Paid
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmPayment = () => {
    if (!selectedPaymentMethod || !selectedRequest) return null;

    return (
      <div>
        <button
          className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-700 transition-colors"
          onClick={() => setCurrentStage(4)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Instructions
        </button>

        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Confirm Payment</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Verify your payment details</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Payment Confirmation</h3>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Transaction Reference Number</label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
              placeholder="Enter reference number from payment"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 mt-1">Enter the reference from your payment confirmation</p>
          </div>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Upload Payment Screenshot</label>
            <button
              className="w-full mt-1 py-4 border-2 border-dashed border-cyan-400 dark:border-cyan-600 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center gap-2 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
              onClick={() => {
                setScreenshotUri('screenshot-uploaded.jpg');
                showConfirmationModal('success', 'Screenshot Uploaded', 'Payment screenshot uploaded successfully');
              }}
            >
              <ImageIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                {screenshotUri ? 'Change Screenshot' : 'Upload Screenshot'}
              </span>
            </button>
            {screenshotUri && (
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] text-green-600">Screenshot uploaded successfully</span>
              </div>
            )}
            <p className="text-[10px] text-gray-400 mt-1">Upload a screenshot of your payment confirmation</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Summary</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Request:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedRequest.request_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Amount:</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">TZS {parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Payment ID:</span>
              <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">{currentPaymentCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Method:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedPaymentMethod.name}</span>
            </div>
          </div>
        </div>

        <button
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-medium text-sm shadow-lg shadow-green-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-2"
          onClick={openWhatsApp}
        >
          <MessageCircle className="w-5 h-5" />
          I Have Paid
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[10px] text-gray-400 mb-4">
          Click "I Have Paid" to send payment confirmation via WhatsApp
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={handlePrevStage}
          >
            Back
          </button>
          <button
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-medium text-sm shadow-lg shadow-green-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            onClick={handleConfirmPayment}
          >
            <CheckCheck className="w-4 h-4" />
            Confirm Payment
          </button>
        </div>
      </div>
    );
  };

  // Success Modal
  const renderSuccessModal = () => {
    if (!showSuccessModal) return null;

    const details = [
      { label: 'Payment ID', value: currentPaymentCode },
      { label: 'Request Code', value: selectedRequest?.request_code || 'N/A' },
      { label: 'Amount Paid', value: `TZS ${parseFloat(amount).toLocaleString()}` },
      { label: 'Sender Name', value: senderName },
      { label: 'Sender Email', value: senderEmail },
      { label: 'Reference', value: transactionReference || 'N/A' },
    ];

    return (
      <ConfirmationModal
        isOpen={true}
        type="success"
        title="Payment Confirmed! 🎉"
        message={`Your payment for ${selectedRequest?.request_code} has been confirmed successfully. A confirmation email has been sent to ${senderEmail}.`}
        onCancel={() => {
          setShowSuccessModal(false);
          resetPayment();
          navigate('/bookings/list');
        }}
        cancelText="View My Bookings"
        details={details}
      />
    );
  };

  // Authentication Check
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Please Login</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">You need to be logged in to make payments</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Make Payment</h1>
            </div>
            <button
              onClick={() => navigate('/payment-history')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs sm:text-sm transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stages Indicator */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
        {renderStageIndicator()}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-32">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          {currentStage === 0 && renderRequestSelection()}
          {currentStage === 1 && renderMethodSelection()}
          {currentStage === 2 && renderAmountInput()}
          {currentStage === 3 && renderPaymentDetails()}
          {currentStage === 4 && renderPaymentInstructions()}
          {currentStage === 5 && renderConfirmPayment()}
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
        details={confirmationModal.details}
      />

      {/* Success Modal */}
      {renderSuccessModal()}

      {/* Loading Overlay */}
      {isProcessing && !showSuccessModal && !confirmationModal.isOpen && (
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