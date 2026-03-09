import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ShieldCheck, Users, Clock, LayoutDashboard,
    Settings, FileText, ShieldAlert, User, LogOut, X, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function AdminSidebar({ isCollapsed, isMobileOpen, setCollapsed, setMobileOpen }) {
    const location = useLocation();

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <ShieldCheck size={28} />
                    {!isCollapsed && <span>SecureGate</span>}
                </div>
                <button className="toggle-btn" onClick={() => setCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                {isMobileOpen && (
                    <button className="hamburger-menu mobile-only" style={{ marginLeft: 'auto' }} onClick={() => setMobileOpen(false)}>
                        <X size={20} />
                    </button>
                )}
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
                <Link to="/entry-logs" className={`menu-item ${location.pathname === '/entry-logs' ? 'active' : ''}`} title="Entry Logs" onClick={() => setMobileOpen(false)}>
                    <Clock size={20} className="icon" />
                    {!isCollapsed && <span>Entry Logs</span>}
                </Link>
                <Link to="/reports" className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`} title="Reports" onClick={() => setMobileOpen(false)}>
                    <FileText size={20} className="icon" />
                    {!isCollapsed && <span>Reports</span>}
                </Link>
                <Link to="/settings" className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`} title="System Settings" style={{ marginTop: 'auto' }} onClick={() => setMobileOpen(false)}>
                    <Settings size={20} className="icon" />
                    {!isCollapsed && <span>System Settings</span>}
                </Link>
                <button
                    onClick={() => { if (window.confirm('Are you sure you want to log out?')) window.location.href = '/admin-login'; }}
                    className="menu-item"
                    title="Logout"
                    style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', outline: 'none', color: 'var(--admin-error)' }}
                >
                    <LogOut size={20} className="icon" color="var(--admin-error)" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </nav>
        </aside>
    );
}
