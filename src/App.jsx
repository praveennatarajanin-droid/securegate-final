import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationProvider';
import { ShieldCheck } from 'lucide-react';

import WelcomeScreen from './pages/WelcomeScreen';
import VisitorRegistrationForm from './pages/VisitorRegistrationForm';
import ApprovalWaitingScreen from './pages/ApprovalWaitingScreen';
import ResidentApprovalPage from './pages/ResidentApprovalPage';
import ResidentVerifyPage from './pages/ResidentVerifyPage';
import AuthScreen from './pages/AuthScreen';
import GateOpenScreen from './pages/GateOpenScreen';
import ExitScreen from './pages/ExitScreen';
import VideoVerificationPage from './pages/VideoVerificationPage'; // legacy demo — not in visitor flow
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import ResidentDirectory from './pages/ResidentDirectory';
import VisitorLogs from './pages/VisitorLogs';
import SecurityGuards from './pages/SecurityGuards';
import EntryLogs from './pages/EntryLogs';
import Reports from './pages/Reports';
import SecurityAlerts from './pages/SecurityAlerts';
import SystemSettings from './pages/SystemSettings';
import InfrastructureSettings from './pages/InfrastructureSettings';
import KioskSetup from './pages/KioskSetup';

// Superadmin Pages
import SuperadminDashboard from './pages/superadmin/SuperadminDashboard';
import SuperadminSocieties from './pages/superadmin/SuperadminSocieties';
import SuperadminUsers from './pages/superadmin/SuperadminUsers';
import SuperadminAuditLogs from './pages/superadmin/SuperadminAuditLogs';
import SuperadminAnnouncements from './pages/superadmin/SuperadminAnnouncements';
import SuperadminLogin from './pages/superadmin/SuperadminLogin';
import SuperadminSettings from './pages/superadmin/SuperadminSettings';

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
    </div>
  );
}

// Layout for the Gate Kiosk
function KioskLayout({ children }) {
  return (
    <div className="kiosk-container" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <KioskHeader />
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/register" element={<KioskLayout><VisitorRegistrationForm /></KioskLayout>} />
          <Route path="/waiting/:id" element={<KioskLayout><ApprovalWaitingScreen /></KioskLayout>} />
          <Route path="/auth" element={<KioskLayout><AuthScreen /></KioskLayout>} />
          <Route path="/exit" element={<KioskLayout><ExitScreen /></KioskLayout>} />
          <Route path="/kiosk/setup" element={<KioskSetup />} />

          {/* Resident verification — opened via WhatsApp link */}
          <Route path="/resident/:id" element={<ResidentVerifyPage />} />

          {/* Legacy resident approval route */}
          <Route path="/resident/approve/:id" element={<ResidentApprovalPage />} />

          {/* Legacy demo route — not part of the main visitor flow */}
          <Route path="/video-verification" element={<VideoVerificationPage />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/directory" element={<ResidentDirectory />} />
          <Route path="/visitor-logs" element={<VisitorLogs />} />
          <Route path="/alerts" element={<SecurityAlerts />} />
          <Route path="/guards" element={<SecurityGuards />} />
          <Route path="/entry-logs" element={<EntryLogs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/infrastructure" element={<InfrastructureSettings />} />
          <Route path="/settings" element={<SystemSettings />} />

          {/* Superadmin Routes */}
          <Route path="/superadmin/login" element={<SuperadminLogin />} />
          <Route path="/superadmin" element={<SuperadminDashboard />} />
          <Route path="/superadmin/societies" element={<SuperadminSocieties />} />
          <Route path="/superadmin/users" element={<SuperadminUsers />} />
          <Route path="/superadmin/announcements" element={<SuperadminAnnouncements />} />
          <Route path="/superadmin/audit-logs" element={<SuperadminAuditLogs />} />
          <Route path="/superadmin/settings" element={<SuperadminSettings />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
