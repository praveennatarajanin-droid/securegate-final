import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ShieldCheck, Users, Clock, LayoutDashboard,
    Settings, FileText, ShieldAlert, User, LogOut, X, ChevronLeft, ChevronRight, Building
} from 'lucide-react';

export default function AdminSidebar({ isCollapsed, isMobileOpen, setCollapsed, setMobileOpen }) {
    const location = useLocation();

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header" style={{ padding: '0 1.5rem', borderBottom: 'none' }}>
                <div className="sidebar-logo" style={{ color: 'var(--admin-primary)', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--admin-primary)', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={24} color="white" />
                    </div>
                    {!isCollapsed && <span style={{ color: 'var(--admin-text-main)', fontSize: '1.25rem', fontWeight: 700 }}>SecureGate</span>}
                </div>
            </div>

            <nav className="sidebar-menu">
                <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`} title="Dashboard" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={20} className="icon" />
                    {!isCollapsed && <span>Dashboard</span>}
                </Link>
                <Link to="/visitor-logs" className={`menu-item ${location.pathname === '/visitor-logs' ? 'active' : ''}`} title="Visitor Logs" onClick={() => setMobileOpen(false)}>
                    <FileText size={20} className="icon" />
                    {!isCollapsed && <span>Visitor Logs</span>}
                </Link>
                <Link to="/alerts" className={`menu-item ${location.pathname === '/alerts' ? 'active' : ''}`} title="Security Alerts" onClick={() => setMobileOpen(false)}>
                    <ShieldAlert size={20} className="icon" />
                    {!isCollapsed && <span>Security Alerts</span>}
                </Link>
                <Link to="/directory" className={`menu-item ${location.pathname === '/directory' ? 'active' : ''}`} title="Residents" onClick={() => setMobileOpen(false)}>
                    <Users size={20} className="icon" />
                    {!isCollapsed && <span>Residents</span>}
                </Link>
                <Link to="/directory" state={{ openAdd: true }} className="menu-item" title="Add Resident" onClick={() => setMobileOpen(false)}>
                    <User size={20} className="icon" />
                    {!isCollapsed && <span>Add Resident</span>}
                </Link>
                <Link to="/guards" className={`menu-item ${location.pathname === '/guards' ? 'active' : ''}`} title="Security Guards" onClick={() => setMobileOpen(false)}>
                    <ShieldCheck size={20} className="icon" />
                    {!isCollapsed && <span>Security Guards</span>}
                </Link>
                <Link to="/infrastructure" className={`menu-item ${location.pathname === '/infrastructure' ? 'active' : ''}`} title="Infrastructure" onClick={() => setMobileOpen(false)}>
                    <Building size={20} className="icon" />
                    {!isCollapsed && <span>Infrastructure</span>}
                </Link>
                <Link to="/entry-logs" className={`menu-item ${location.pathname === '/entry-logs' ? 'active' : ''}`} title="Entry Logs" onClick={() => setMobileOpen(false)}>
                    <Clock size={20} className="icon" />
                    {!isCollapsed && <span>Entry Logs</span>}
                </Link>
                <Link to="/reports" className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`} title="Reports" onClick={() => setMobileOpen(false)}>
                    <FileText size={20} className="icon" />
                    {!isCollapsed && <span>Reports</span>}
                </Link>
                <Link to="/settings" className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`} style={{ marginTop: 'auto' }} title="System Settings" onClick={() => setMobileOpen(false)}>
                    <Settings size={20} className="icon" />
                    {!isCollapsed && <span>System Settings</span>}
                </Link>
                <div style={{ padding: '1rem', marginTop: '0.5rem' }}>
                    <button 
                        onClick={() => window.location.href = '/admin-login'}
                        className="menu-item" 
                        style={{ 
                            width: '100%', 
                            background: 'transparent', 
                            border: 'none', 
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            cursor: 'pointer' 
                        }}
                    >
                        <LogOut size={20} className="icon" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </nav>
        </aside>
    );
}
