// App.tsx - With UserProvider for authentication context

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// Public Pages
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Index from './pages/verify_otp/Index';

// Dashboard Pages
import Dashboard from './dashboard/dashboard';
import BookingScreen from './dashboard/Booking';
import List from './dashboard/list/List';
import GaragesScreen from './dashboard/Garages';
import MyLocationScreen from './users/Map';
import PaymentScreen from './pages/Payment';
import ProfileScreen from './users/Profile';
import ServiceRequest from './dashboard/Requests';
import Contact from './pages/Contact';

// Admin Pages
import AdminRequestsScreen from './mechanic/Mechanics';
import AdminBookingsScreen from './Admin/AdminBookings';
import UserManagement from './Admin/AdminDashboard';
import WorkshopsManagement from './Admin/AdminGarages';
import MemberManagement from './Admin/ManageDashboard';
import ServiceRequestsManager from './Admin/AdminMechanics';
import AdminServices from './Admin/AdminServices';
import MyRequests from './dashboard/MyRequest';
import SettingsPage from './dashboard/Settings';
import HelpPage from './dashboard/Help';


// ============================================================
// MAIN APP COMPONENT
// ============================================================

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <main className="flex-grow">
                    <Home />
                  </main>
                </>
              }
            />
            
            <Route
              path="/signup"
              element={
                <>
                  <main className="flex-grow">
                    <Registration />
                  </main>
                </>
              }
            />
            
            <Route
              path="/login"
              element={
                <>
                  <main className="flex-grow">
                    <Login />
                  </main>
                </>
              }
            />

            <Route
              path="/verify-otp"
              element={
                <>
                  <main className="flex-grow">
                    <Index />
                  </main>
                </>
              }
            />





          <Route
              path="/admin/services"
              element={
                <>
                  <main className="flex-grow">
                    <AdminServices />
                  </main>
                </>
              }
            />


          <Route
              path="/requests"
              element={
                <>
                  <main className="flex-grow">
                    <ServiceRequest />
                  </main>
                </>
              }
            />





            <Route
              path="/myrequest"
              element={
                <>
                  <main className="flex-grow">
                    <MyRequests />
                  </main>
                </>
              }
            />







                        <Route
              path="/map"
              element={
                <>
                  <main className="flex-grow">
                    <MyLocationScreen />
                  </main>
                </>
              }
            />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <main className="flex-grow">
                    <Dashboard />
                  </main>
                </>
              }
            />

            <Route
              path="/profile"
              element={
                <>
                  <main className="flex-grow">
                    <ProfileScreen />
                  </main>
                </>
              }
            />

            <Route
              path="/bookings"
              element={
                <>
                  <main className="flex-grow">
                    <BookingScreen />
                  </main>
                </>
              }
            />

            <Route
              path="/list"
              element={
                <>
                  <main className="flex-grow">
                    <List />
                  </main>
                </>
              }
            />

            <Route
              path="/garages"
              element={
                <>
                  <main className="flex-grow">
                    <GaragesScreen />
                  </main>
                </>
              }
            />

            <Route
              path="/my-location"
              element={
                <>
                  <main className="flex-grow">
                    <MyLocationScreen />
                  </main>
                </>
              }
            />

            <Route
              path="/payments"
              element={
                <>
                  <main className="flex-grow">
                    <PaymentScreen />
                  </main>
                </>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/garages"
              element={
                <>
                  <main className="flex-grow">
                    <WorkshopsManagement />
                  </main>
                </>
              }
            />

            <Route
              path="/admin/manage"
              element={
                <>
                  <main className="flex-grow">
                    <MemberManagement />
                  </main>
                </>
              }
            />

            <Route
              path="/admin/mechanics"
              element={
                <>
                  <main className="flex-grow">
                    <ServiceRequestsManager />
                  </main>
                </>
              }
            />

            <Route
              path="/mechanic/bookings"
              element={
                <>
                  <main className="flex-grow">
                    <AdminRequestsScreen />
                  </main>
                </>
              }
            />

            <Route
              path="/admin/approve"
              element={
                <>
                  <main className="flex-grow">
                    <AdminRequestsScreen />
                  </main>
                </>
              }
            />



            <Route
              path="/contacts"
              element={
                <>
                  <main className="flex-grow">
                    <Contact />
                  </main>
                </>
              }
            />





          <Route
              path="/settings"
              element={
                <>
                  <main className="flex-grow">
                    <SettingsPage />
                  </main>
                </>
              }
            />





          <Route
              path="/help"
              element={
                <>
                  <main className="flex-grow">
                    <HelpPage />
                  </main>
                </>
              }
            />



            <Route
              path="/admin/bookings"
              element={
                <>
                  <main className="flex-grow">
                    <AdminBookingsScreen />
                  </main>
                </>
              }
            />

            <Route
              path="/admin/users"
              element={
                <>
                  <main className="flex-grow">
                    <UserManagement />
                  </main>
                </>
              }
            />

            {/* 404 - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;