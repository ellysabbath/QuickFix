// components/AuthGuard.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallbackPath?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = '/login',
  fallbackPath = '/dashboard'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, refreshUserData } = useUser();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      // Wait for initial loading to complete
      if (isLoading) {
        return;
      }

      // Check authentication status
      const isAuth = isAuthenticated;
      setAuthStatus(isAuth);
      
      // If we have a token but no user data, try to refresh
      if (isAuth) {
        await refreshUserData();
      }
      
      setIsChecking(false);
    };

    verifyAuth();
  }, [isLoading, isAuthenticated, refreshUserData]);

  // Show loading spinner while checking
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !authStatus) {
    // Save the current location to redirect back after login
    const from = location.pathname + location.search;
    return <Navigate to={redirectTo} state={{ from }} replace />;
  }

  // If authentication is not required and user is authenticated
  if (!requireAuth && authStatus) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children if everything is good
  return <>{children}</>;
}