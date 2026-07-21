// src/pages/dashboard/HelpPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Shield,
  Lock,
  Mail,
  Inbox,
  Key,
  CheckCircle,
  LogIn,
  Clock,
  HelpCircle,
  MessageCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail as MailIcon,
  Send,
  FileText,
  Info,
  Check,
  AlertTriangle,
  User,
  Settings,
  BookOpen,
  Headphones,
  RefreshCw,
  Timer,
  CheckCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Zap
} from 'lucide-react';

export default function HelpPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Password Reset Steps
  const steps = [
    {
      step: "Step 1",
      title: "Tap 'Forgot Password'",
      desc: "On the login screen, tap the 'Forgot Password?' link below the password field.",
      tip: "Use the email registered with your account",
      icon: <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      step: "Step 2",
      title: "Enter Your Email",
      desc: "Enter the email address associated with your QuickFix Automotive account.",
      tip: "Double-check for typos in your email",
      icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      step: "Step 3",
      title: "Check Your Inbox",
      desc: "Open your email inbox (check spam/junk folder) for a verification email.",
      tip: "Check your spam/junk folder",
      icon: <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      step: "Step 4",
      title: "Enter OTP Code",
      desc: "Return to the app and enter the 6-digit OTP code from the email.",
      tip: "OTP codes expire in 10 minutes",
      icon: <Key className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      step: "Step 5",
      title: "Create New Password",
      desc: "Once verified, create a strong new password and confirm it.",
      tip: "Use at least 8 characters with letters, numbers, and symbols",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      step: "Step 6",
      title: "Login With New Password",
      desc: "Return to login screen and use your email with the new password.",
      tip: "You can now book services with your new credentials",
      icon: <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
    },
  ];

  // FAQ Items
  const faqs = [
    {
      q: "Didn't receive OTP email?",
      a: "Check spam/junk folder. Whitelist qfix910@gmail.com. Wait 5 minutes and request again.",
      icon: <Mail className="w-4 h-4 text-blue-500" />
    },
    {
      q: "OTP code expired?",
      a: "Request a new OTP. Codes are valid for 10 minutes only.",
      icon: <Timer className="w-4 h-4 text-yellow-500" />
    },
    {
      q: "Wrong email entered?",
      a: "Use the correct email registered with QuickFix Automotive.",
      icon: <AlertCircle className="w-4 h-4 text-red-500" />
    },
    {
      q: "Still having issues?",
      a: "Contact our support team immediately at qfix910@gmail.com",
      icon: <Headphones className="w-4 h-4 text-purple-500" />
    },
  ];

  const faqIcons = [
    <Mail className="w-5 h-5 text-blue-500" />,
    <Timer className="w-5 h-5 text-yellow-500" />,
    <AlertCircle className="w-5 h-5 text-red-500" />,
    <Headphones className="w-5 h-5 text-purple-500" />
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Password Reset Guide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32">
        {/* Intro Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Forgot Password Guide</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Follow these 6 simple steps to reset your password and regain access to your account.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">Secure Process</span>
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">6 Steps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Step-by-Step Guide</h3>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                      {step.step}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                  <div className="mt-2 flex items-start gap-1.5 text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Tip: {step.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reset Timeline</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { time: "0-2 min", action: "Request OTP" },
              { time: "1-3 min", action: "Receive Email" },
              { time: "10 min", action: "OTP Valid" },
              { time: "2 min", action: "New Password" },
              { time: "Instant", action: "Account Ready" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{item.time}</div>
                <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">{item.action}</div>
                {idx < 4 && <div className="hidden sm:block text-gray-300 dark:text-gray-600 mt-1">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Common Issues</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-lg border ${expandedFaq === index ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'} overflow-hidden`}
              >
                <button
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    {faqIcons[index]}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.q}</span>
                  </div>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="p-3 sm:p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                    {index === 3 && (
                      <button
                        className="mt-3 w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        onClick={() => window.open('mailto:qfix910@gmail.com')}
                      >
                        <MailIcon className="w-4 h-4" />
                        Contact Support Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Contact Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Need More Help?</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Contact our support team</p>
            </div>
          </div>
          <button
            className="w-full sm:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            onClick={() => window.open('mailto:qfix910@gmail.com')}
          >
            <Send className="w-4 h-4" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}