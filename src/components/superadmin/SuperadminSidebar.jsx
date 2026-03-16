import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  ShieldCheck,
  LogOut,
  FileText,
  Megaphone
} from 'lucide-react';

export default function SuperadminSidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/superadmin', icon: LayoutDashboard },
    { name: 'Societies', path: '/superadmin/societies', icon: Building2 },
    { name: 'Admin Users', path: '/superadmin/users', icon: Users },
    { name: 'Announcements', path: '/superadmin/announcements', icon: Megaphone },
    { name: 'Audit Logs', path: '/superadmin/audit-logs', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <ShieldCheck size={24} color="white" />
          </div>
          <span className="logo-text">SecureGate</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`menu-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="icon" size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
          <Link to="/superadmin/settings" className={`menu-item ${location.pathname === '/superadmin/settings' ? 'active' : ''}`}>
            <Settings className="icon" size={20} />
            <span>Settings</span>
          </Link>
          <button 
            onClick={() => { localStorage.removeItem('user'); window.location.href = '/superadmin/login'; }}
            className="menu-item logout-btn"
          >
            <LogOut className="icon" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
