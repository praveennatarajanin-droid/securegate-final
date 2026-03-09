import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend, Filler, BarElement, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    ShieldCheck, Users, Clock, CheckCircle, XCircle, Home, LayoutDashboard,
    Video, Bell, Search, Settings, FileText, Download, Menu, ChevronLeft,
    Moon, Sun, ShieldAlert, Key, Zap, CheckSquare, ChevronRight, User
} from 'lucide-react';

// Register ChartJS plugins
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
    Title, ChartTooltip, Legend, Filler
);

// --- MOCK DATA ---
const sampleVisitors = [
    { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", flat: "A-101", purpose: "Delivery", status: "Approved", time: "10:30 AM", exitTime: "10:45 AM", host: "Amit Kumar", notes: "Amazon Package" },
    { id: 2, name: "Priya Singh", phone: "+91 87654 32109", flat: "B-205", purpose: "Guest", status: "Waiting", time: "11:15 AM", exitTime: "-", host: "Rohit Sharma", notes: "Friend" },
    { id: 3, name: "Suresh Patel", phone: "+91 76543 21098", flat: "C-302", purpose: "Maintenance", status: "Rejected", time: "09:45 AM", exitTime: "-", host: "Anjali Gupta", notes: "Plumber - Did not pick up" },
    { id: 4, name: "Sneha Reddy", phone: "+91 65432 10987", flat: "A-404", purpose: "Other", status: "Checkout", time: "08:00 AM", exitTime: "11:30 AM", host: "Vikram Singh", notes: "Maid" },
    { id: 5, name: "Vikram Joshi", phone: "+91 54321 09876", flat: "D-105", purpose: "Delivery", status: "Approved", time: "07:30 AM", exitTime: "07:35 AM", host: "Rao Family", notes: "Milk Delivery" },
    { id: 6, name: "Neha Gupta", phone: "+91 43210 98765", flat: "B-306", purpose: "Guest", status: "Waiting", time: "11:45 AM", exitTime: "-", host: "Verma Family", notes: "Relative" },
    { id: 7, name: "Arjun Das", phone: "+91 32109 87654", flat: "C-101", purpose: "Maintenance", status: "Checkout", time: "09:00 AM", exitTime: "12:15 PM", host: "Society Admin", notes: "Electrician" },
    { id: 8, name: "Kiran Rao", phone: "+91 21098 76543", flat: "A-202", purpose: "Delivery", status: "Approved", time: "12:30 PM", exitTime: "-", host: "Menon Family", notes: "Zomato" },
];

const activityFeed = [
    { id: 1, time: "2 min ago", text: "Security Guard 'Ram Singh' verified a delivery.", icon: <User size={16} /> },
    { id: 2, time: "15 min ago", text: "New visitor registered for Flat B-205.", icon: <CheckSquare size={16} /> },
    { id: 3, time: "45 min ago", text: "Multiple failed verification attempts at Main Gate.", icon: <ShieldAlert size={16} color="var(--admin-error)" /> },
    { id: 4, time: "1 hr ago", text: "System backup completed successfully.", icon: <Zap size={16} /> },
];

export default function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedVisitor, setSelectedVisitor] = useState(null);

    // Update Real-time Clock
    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Theme tracking
    useEffect(() => {
        if (isDarkMode) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }, [isDarkMode]);

    // Chart Configurations
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: isDarkMode ? '#1e293b' : '#fff', titleColor: isDarkMode ? '#fff' : '#000', bodyColor: isDarkMode ? '#94a3b8' : '#6b7280', borderColor: '#e5e7eb', borderWidth: 1 }
        },
        scales: {
            x: { grid: { display: false, drawBorder: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: isDarkMode ? '#334155' : '#e5e7eb', drawBorder: false }, ticks: { color: '#94a3b8' } }
        }
    };

    const trendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Visitors',
            data: [65, 59, 80, 81, 56, 120, 140],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#3b82f6',
            pointBorderWidth: 2,
        }]
    };

    const hourlyData = {
        labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
        datasets: [{
            label: 'Activity',
            data: [35, 60, 45, 20, 50, 80, 30],
            backgroundColor: '#10b981',
            borderRadius: 4,
        }]
    };

    const blockData = {
        labels: ['Block A', 'Block B', 'Block C', 'Block D'],
        datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const doughnutOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: isDarkMode ? '#f8fafc' : '#111827', usePointStyle: true, boxWidth: 8 } } },
        cutout: '70%'
    };

    // Derived filtered data
    let filteredVisitors = sampleVisitors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.flat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`admin-layout ${isDarkMode ? 'dark' : ''}`}>
            {/* SIDEBAR */}
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <ShieldCheck size={28} />
                        {!isSidebarCollapsed && <span>SecureGate</span>}
                    </div>
                    <button className="toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="sidebar-menu">
                    <Link to="/dashboard" className="menu-item active" title="Dashboard">
                        <LayoutDashboard size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Dashboard</span>}
                    </Link>
                    <Link to="/register" className="menu-item" title="Visitor Registration">
                        <FileText size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Visitor Entry Form</span>}
                    </Link>
                    <Link to="/video-verification" className="menu-item" title="Video Verification">
                        <Video size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Live Monitoring</span>}
                    </Link>
                    <div className="menu-item" title="Security Alerts" style={{ cursor: 'pointer' }}>
                        <ShieldAlert size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Security Alerts</span>}
                    </div>
                    <Link to="/directory" className="menu-item" title="Resident Directory">
                        <Users size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Resident Directory</span>}
                    </Link>
                    <Link to="/directory" state={{ openAdd: true }} className="menu-item" title="Add Resident">
                        <User size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Add Resident</span>}
                    </Link>
                    <div className="menu-item" title="Settings" style={{ cursor: 'pointer', marginTop: 'auto' }}>
                        <Settings size={20} className="icon" />
                        {!isSidebarCollapsed && <span>System Settings</span>}
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="main-wrapper">
                {/* TOP NAV BAR */}
                <header className="top-nav">
                    <div className="search-bar">
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search visitors, flats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="nav-actions">
                        <span style={{ fontWeight: 600, color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} /> {currentTime}
                        </span>
                        <button className="action-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="action-btn">
                            <Bell size={20} />
                            <div className="notification-badge"></div>
                        </button>
                        <div className="user-profile">
                            <div className="avatar">A</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>Admin</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Security Head</span>
                            </div>
                        </div>

                        {/* Mobile menu toggle */}
                        <button className="action-btn" style={{ display: 'none' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu size={20} />
                        </button>
                    </div>
                </header>

                {/* SCROLLABLE DASHBOARD AREA */}
                <main className="dashboard-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Overview Dashboard</h1>
                            <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Monitor your real-time security operations.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-secondary" style={{ background: 'var(--admin-primary)', color: 'white', borderColor: 'var(--admin-primary)' }}>
                                <CheckSquare size={16} /> Quick Approve
                            </button>
                            <button className="btn-secondary">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    {/* STATS RACK */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div>
                                    <div className="stat-title">Total Visitors Today</div>
                                    <div className="stat-value">124</div>
                                    <div className="stat-trend up">↑ 12% vs yesterday</div>
                                </div>
                                <div className="stat-icon blue"><Users size={24} /></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div>
                                    <div className="stat-title">Waiting Approval</div>
                                    <div className="stat-value">12</div>
                                    <div className="stat-trend down">↓ 2 pending long</div>
                                </div>
                                <div className="stat-icon orange"><Clock size={24} /></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div>
                                    <div className="stat-title">Approved Entry</div>
                                    <div className="stat-value">98</div>
                                    <div className="stat-trend up">↑ Smooth flow</div>
                                </div>
                                <div className="stat-icon green"><CheckCircle size={24} /></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div>
                                    <div className="stat-title">Rejected / Denied</div>
                                    <div className="stat-value">14</div>
                                    <div className="stat-trend down">↑ 4 suspicious</div>
                                </div>
                                <div className="stat-icon red"><XCircle size={24} /></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div>
                                    <div className="stat-title">Total Residents</div>
                                    <div className="stat-value">448</div>
                                    <div className="stat-trend up">↑ 4 new this month</div>
                                </div>
                                <div className="stat-icon blue"><Home size={24} /></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <div>
                                    <div className="stat-title">Active Flats</div>
                                    <div className="stat-value">212</div>
                                    <div className="stat-trend up">Occupancy: 85%</div>
                                </div>
                                <div className="stat-icon green"><CheckSquare size={24} /></div>
                            </div>
                        </div>
                        <div className="stat-card" style={{ gridColumn: window.innerWidth > 1400 ? 'span 2' : 'span 1' }}>
                            <div className="stat-header" style={{ marginBottom: 0 }}>
                                <div>
                                    <div className="stat-title">Block-wise Residents</div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                                        <div style={{ background: 'var(--admin-surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block' }}>Block A</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6' }}>120</span>
                                        </div>
                                        <div style={{ background: 'var(--admin-surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block' }}>Block B</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#10b981' }}>145</span>
                                        </div>
                                        <div style={{ background: 'var(--admin-surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block' }}>Block C</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b' }}>98</span>
                                        </div>
                                        <div style={{ background: 'var(--admin-surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block' }}>Block D</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#8b5cf6' }}>85</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHARTS ROW */}
                    <div className="charts-grid">
                        <div className="panel">
                            <div className="panel-header">
                                <span className="panel-title">Weekly Visitor Trends</span>
                                <select className="filter-select"><option>Last 7 Days</option><option>This Month</option></select>
                            </div>
                            <div className="panel-body" style={{ minHeight: '280px' }}>
                                <Line data={trendData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-header">
                                <span className="panel-title">Block Traffic</span>
                            </div>
                            <div className="panel-body" style={{ minHeight: '280px', display: 'flex', justifyContent: 'center' }}>
                                <div style={{ width: '100%', maxWidth: '220px', margin: '0 auto' }}>
                                    <Doughnut data={blockData} options={doughnutOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGETS ROW */}
                    <div className="widgets-grid">
                        <div className="panel">
                            <div className="panel-header">
                                <span className="panel-title">Hourly Activity</span>
                            </div>
                            <div className="panel-body" style={{ minHeight: '200px' }}>
                                <Bar data={hourlyData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-header">
                                <span className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-error)' }}>
                                    <ShieldAlert size={20} /> Active Alerts (2)
                                </span>
                                <span style={{ fontSize: '0.75rem', cursor: 'pointer', color: 'var(--admin-primary)' }}>View All</span>
                            </div>
                            <div className="panel-body">
                                <div style={{ background: 'var(--admin-error-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--admin-error)', fontSize: '0.875rem' }}>Tailgating Detected</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-main)' }}>Main Gate Camera 2 detected multiple persons on single entry log.</p>
                                </div>
                                <div style={{ background: 'var(--admin-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--admin-warning)', fontSize: '0.875rem' }}>Long Wait Time</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-main)' }}>Flat C-302 unresponsive for 15+ minutes.</p>
                                </div>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-header">
                                <span className="panel-title">Guard Activity Feed</span>
                            </div>
                            <div className="panel-body">
                                <div className="feed-list">
                                    {activityFeed.map((item) => (
                                        <div className="feed-item" key={item.id}>
                                            <div className="feed-icon" style={{ background: 'var(--admin-surface-hover)' }}>
                                                {item.icon}
                                            </div>
                                            <div className="feed-content" style={{ flex: 1 }}>
                                                <p>{item.text}</p>
                                                <div className="feed-time">{item.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MASTER DATA TABLE */}
                    <div className="panel">
                        <div className="panel-header" style={{ padding: '0' }}>
                            <div className="table-controls">
                                <div className="filters-group">
                                    <select className="filter-select">
                                        <option>All Statuses</option>
                                        <option>Approved</option>
                                        <option>Waiting</option>
                                        <option>Rejected</option>
                                    </select>
                                    <select className="filter-select">
                                        <option>All Purposes</option>
                                        <option>Delivery</option>
                                        <option>Guest</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Showing {filteredVisitors.length} Visitors</span>
                            </div>
                        </div>
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Visitor Profile</th>
                                        <th>Contact</th>
                                        <th>Destination</th>
                                        <th>Purpose</th>
                                        <th>Status</th>
                                        <th>Time In</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVisitors.map(v => (
                                        <tr key={v.id} onClick={() => setSelectedVisitor(v)}>
                                            <td>
                                                <div className="visitor-cell">
                                                    <div className="visitor-avatar">{v.name.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{v.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>ID: #{3040 + v.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{v.phone}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{v.flat}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{v.host}</div>
                                            </td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {v.purpose === 'Delivery' ? <FileText size={14} /> : v.purpose === 'Maintenance' ? <Settings size={14} /> : <User size={14} />}
                                                    {v.purpose}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={`status-badge status-${v.status.toLowerCase()}`}>
                                                    <div className="status-dot"></div>
                                                    {v.status}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{v.time}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredVisitors.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                                                <Search size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                                <br />No visitors found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-footer">
                            <span>Page 1 of 1</span>
                            <div className="pagination">
                                <button className="page-btn"><ChevronLeft size={16} /></button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            {/* VISITOR DETAILS MODAL */}
            {selectedVisitor && (
                <div className="modal-overlay" onClick={() => setSelectedVisitor(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Visitor Details Dashboard</h3>
                            <button className="close-btn" onClick={() => setSelectedVisitor(null)}><XCircle size={24} /></button>
                        </div>

                        <div className="modal-body">
                            <div className="profile-header">
                                <div className="profile-avatar-large">
                                    {selectedVisitor.name.charAt(0)}
                                </div>
                                <div className="profile-info">
                                    <div className={`status-badge status-${selectedVisitor.status.toLowerCase()}`} style={{ marginBottom: '0.5rem' }}>
                                        <div className="status-dot"></div>
                                        {selectedVisitor.status}
                                    </div>
                                    <h2>{selectedVisitor.name}</h2>
                                    <span style={{ color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={16} /> {selectedVisitor.phone}
                                    </span>
                                </div>
                            </div>

                            <div className="info-grid">
                                <div className="info-block" style={{ gridColumn: 'span 2', background: 'var(--admin-bg)', padding: '1rem', borderRadius: '8px', border: `1px solid var(--admin-border)` }}>
                                    <div className="info-label">Security Notes</div>
                                    <div className="info-value" style={{ marginTop: '0.25rem' }}>"{selectedVisitor.notes}"</div>
                                </div>

                                <div className="info-block">
                                    <div className="info-label">Destination</div>
                                    <div className="info-value"><Home size={16} color="var(--admin-text-muted)" /> Flat {selectedVisitor.flat}</div>
                                </div>

                                <div className="info-block">
                                    <div className="info-label">Host Resident</div>
                                    <div className="info-value"><Users size={16} color="var(--admin-text-muted)" /> {selectedVisitor.host}</div>
                                </div>

                                <div className="info-block">
                                    <div className="info-label">Check-In Time</div>
                                    <div className="info-value"><Clock size={16} color="var(--admin-text-muted)" /> {selectedVisitor.time}</div>
                                </div>

                                <div className="info-block">
                                    <div className="info-label">Check-Out Time</div>
                                    <div className="info-value"><Clock size={16} color="var(--admin-text-muted)" /> {selectedVisitor.exitTime}</div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedVisitor(null)}>Close</button>
                            {selectedVisitor.status === 'Approved' && (
                                <button className="btn-primary" style={{ background: 'var(--admin-info)' }}>Force Checkout</button>
                            )}
                            {selectedVisitor.status === 'Waiting' && (
                                <button className="btn-primary" style={{ background: 'var(--admin-success)' }}>Approve Override</button>
                            )}
                            <button className="btn-secondary" style={{ color: 'var(--admin-error)' }}>Flag Suspicious</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
