import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationProvider';
import { ShieldCheck } from 'lucide-react';

import WelcomeScreen from './pages/WelcomeScreen';
import VisitorRegistrationForm from './pages/VisitorRegistrationForm';
import ApprovalWaitingScreen from './pages/ApprovalWaitingScreen';
import ResidentApprovalPage from './pages/ResidentApprovalPage';
import AuthScreen from './pages/AuthScreen';
import GateOpenScreen from './pages/GateOpenScreen';
import ExitScreen from './pages/ExitScreen';
import VideoVerificationPage from './pages/VideoVerificationPage';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import ResidentDirectory from './pages/ResidentDirectory';

function KioskHeader() {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="kiosk-header">
      <div className="kiosk-logo">
        <ShieldCheck size={28} />
        SecureGate Control
      </div>
      <div className="kiosk-time">{time}</div>
    </div>
  );
}

// Layout for the Gate Kiosk
function KioskLayout({ children }) {
  return (
    <div className="kiosk-container">
      <KioskHeader />
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<KioskLayout><WelcomeScreen /></KioskLayout>} />
          <Route path="/register" element={<KioskLayout><VisitorRegistrationForm /></KioskLayout>} />
          <Route path="/waiting" element={<KioskLayout><ApprovalWaitingScreen /></KioskLayout>} />
          <Route path="/auth" element={<KioskLayout><AuthScreen /></KioskLayout>} />
          <Route path="/gate" element={<KioskLayout><GateOpenScreen /></KioskLayout>} />
          <Route path="/exit" element={<KioskLayout><ExitScreen /></KioskLayout>} />

          {/* External Resident Route - doesn't need kiosk container layout */}
          <Route path="/resident/approve/:id" element={<ResidentApprovalPage />} />

          {/* Demo Verification Page Route */}
          <Route path="/video-verification" element={<VideoVerificationPage />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/directory" element={<ResidentDirectory />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
