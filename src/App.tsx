// App.tsx - Only Home, Login, and Registration - No Authentication

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';

import Header from './components/Header';
// import Footer from './components/Footer';
import Index from './pages/verify_otp/Index';
import Dashboard from './dashboard/dashboard';

// ============================================================
// MAIN APP COMPONENT
// ============================================================

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Home Page with Header & Footer */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Home />
                </main>
               
              </>
            }
          />
          
          {/* Registration Page with Header & Footer */}
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Registration />
                </main>
                
              </>
            }
          />





          
          {/* Login Page with Header & Footer */}
          <Route
            path="/login"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Login />
                </main>
               
              </>
            }
          />







                    <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Dashboard />
                </main>
               
              </>
            }
          />



          <Route
            path="/verify-otp"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Index />
                </main>
               
              </>
            }
          />

          {/* 404 - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;