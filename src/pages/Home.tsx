import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Tag,
  Shield,
  RefreshCw,
  Wrench,
  Percent,
  MapPin,
  UserPlus,
  LogIn,
  Star,
  Zap,
  Award,
  CheckCircle
} from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  // Animation state
  const [arrowTranslate, setArrowTranslate] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Animation effect
  useEffect(() => {
    let arrowInterval: number;
    let scaleInterval: number;
    let arrowDirection = 1;
    let scaleDirection = 1;

    arrowInterval = window.setInterval(() => {
      setArrowTranslate(prev => {
        const newVal = prev + arrowDirection * 0.5;
        if (newVal >= 5) arrowDirection = -1;
        if (newVal <= 0) arrowDirection = 1;
        return newVal;
      });
    }, 50);

    scaleInterval = window.setInterval(() => {
      setScaleValue(prev => {
        const newVal = prev + scaleDirection * 0.005;
        if (newVal >= 1.03) scaleDirection = -1;
        if (newVal <= 1) scaleDirection = 1;
        return newVal;
      });
    }, 50);

    return () => {
      clearInterval(arrowInterval);
      clearInterval(scaleInterval);
    };
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-500 font-medium text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white pt-10 pb-8 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 border-2 border-cyan-100">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                QF
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-700 text-center leading-tight">
              QuickFix
              <br />
              <span className="text-cyan-500">Automotive</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-500 text-sm text-center mt-2">
              Professional garage services at your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <span className="text-black font-bold text-xs tracking-wide">LIMITED TIME OFFER</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            Get fixing garage services
            <br />
            <span className="text-cyan-500">anywhere you are!</span>
          </h2>
          <div className="flex items-center justify-center gap-2 bg-cyan-50 px-4 py-2 rounded-full inline-block">
            <Tag className="w-4 h-4 text-cyan-500" />
            <span className="text-gray-600 text-sm font-medium">Starting from just $49</span>
          </div>
        </div>

        {/* Offer Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 relative border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Special Launch Offer</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Get 20% discount on all bargained services + Free refund guarantee
          </p>
          <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-1.5 rounded-full shadow-md">
            <span className="text-white font-bold text-xs tracking-wide">SAVE 20%</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl flex items-center justify-center mb-3">
              <RefreshCw className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Refund Guarantee</h4>
            <p className="text-gray-400 text-xs mt-0.5">100% money-back</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl flex items-center justify-center mb-3">
              <Wrench className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Rebuild Service</h4>
            <p className="text-gray-400 text-xs mt-0.5">Complete rebuild</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl flex items-center justify-center mb-3">
              <Percent className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">20% Discount</h4>
            <p className="text-gray-400 text-xs mt-0.5">On all services</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-cyan-500" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Anywhere Service</h4>
            <p className="text-gray-400 text-xs mt-0.5">At your location</p>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Register Button */}
          <Link to="/signup" className="col-span-1">
            <button 
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white h-14 rounded-full font-bold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                transform: `scale(${scaleValue})`
              }}
            >
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </button>
          </Link>

          {/* Login Button */}
          <Link to="/login" className="col-span-1">
            <button className="w-full h-14 rounded-full border-2 border-cyan-500 bg-white text-cyan-500 font-bold text-base hover:bg-cyan-50 hover:border-cyan-600 hover:text-cyan-600 transition-all duration-300 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mb-8">
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-gray-500 text-sm ml-2">4.9 (2.5k+ reviews)</span>
          </div>
          
          {/* Stats */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex justify-around border border-gray-200">
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-500">10k+</p>
              <p className="text-gray-400 text-xs mt-0.5">Customers</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-500">500+</p>
              <p className="text-gray-400 text-xs mt-0.5">Daily Services</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-500">98%</p>
              <p className="text-gray-400 text-xs mt-0.5">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Flash Sale */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-3.5 flex items-center justify-center gap-2 border border-yellow-200">
          <div className="p-1 bg-yellow-200 rounded-full">
            <Zap className="w-4 h-4 text-yellow-600" />
          </div>
          <span className="text-gray-700 text-xs font-medium">
            Flash Sale: <span className="font-bold text-yellow-600">20% off</span> on all services today!
          </span>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2024 QuickFix Automotive. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;