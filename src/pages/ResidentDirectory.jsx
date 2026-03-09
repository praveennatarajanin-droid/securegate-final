import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/dashboard.css';
import {
    ShieldCheck, Users, Clock, Home, LayoutDashboard,
    Video, Bell, Search, Settings, FileText, Menu, ChevronLeft,
    Moon, Sun, ShieldAlert, ChevronRight, User, Plus, Edit, Trash2, CheckCircle, XCircle, MapPin
} from 'lucide-react';

const initialResidents = [
    { id: 1, name: "Ramesh Kumar", flat: "A-101", phone: "+91 98765 00001", email: "ramesh.k@email.com", block: "Block A", moveIn: "2023-01-15", status: "Active", family: 4, vehicle: "MH01AB1234" },
    { id: 2, name: "Sneha Reddy", flat: "B-205", phone: "+91 87654 00002", email: "sneha.r@email.com", block: "Block B", moveIn: "2024-03-22", status: "Active", family: 2, vehicle: "TS09CD5678" },
    { id: 3, name: "Vikram Joshi", flat: "C-302", phone: "+91 76543 00003", email: "vikram.j@email.com", block: "Block C", moveIn: "2022-11-05", status: "Inactive", family: 3, vehicle: "KA05EF9012" },
    { id: 4, name: "Anita Sharma", flat: "D-105", phone: "+91 65432 00004", email: "anita.s@email.com", block: "Block D", moveIn: "2025-01-10", status: "Active", family: 1, vehicle: "" },
    { id: 5, name: "Rahul Verma", flat: "A-202", phone: "+91 54321 00005", email: "rahul.v@email.com", block: "Block A", moveIn: "2021-08-30", status: "Active", family: 5, vehicle: "DL04GH3456" },
    { id: 6, name: "Priya Singh", flat: "B-306", phone: "+91 43210 00006", email: "priya.s@email.com", block: "Block B", moveIn: "2023-06-18", status: "Active", family: 2, vehicle: "MH02IJ7890" },
];

export default function ResidentDirectory() {
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    // Resident State
    const [residents, setResidents] = useState(initialResidents);
    const [searchQuery, setSearchQuery] = useState('');
    const [blockFilter, setBlockFilter] = useState('All Blocks');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentResident, setCurrentResident] = useState({
        id: null, name: '', flat: '', phone: '', email: '', block: 'Block A', moveIn: '', status: 'Active', family: 1, vehicle: ''
    });

    // Handle incoming route state (e.g. from 'Add Resident' sidebar button)
    useEffect(() => {
        if (location.state && location.state.openAdd) {
            openAddModal();
            // Clean up state so refresh doesn't pop open modal again
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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

    // Actions
    const openAddModal = () => {
        setModalMode('add');
        setCurrentResident({ id: Date.now(), name: '', flat: '', phone: '', email: '', block: 'Block A', moveIn: new Date().toISOString().split('T')[0], status: 'Active', family: 1, vehicle: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (res) => {
        setModalMode('edit');
        setCurrentResident({ ...res });
        setIsModalOpen(true);
    };

    const deleteResident = (id) => {
        if (window.confirm('Are you sure you want to remove this resident?')) {
            setResidents(residents.filter(r => r.id !== id));
        }
    };

    const saveResident = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setResidents([...residents, currentResident]);
        } else {
            setResidents(residents.map(r => r.id === currentResident.id ? currentResident : r));
        }
        setIsModalOpen(false);
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    // Derived Data
    let filtered = residents.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.flat.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBlock = blockFilter === 'All Blocks' || r.block === blockFilter;
        return matchesSearch && matchesBlock;
    });

    filtered = filtered.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

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
                    <Link to="/dashboard" className="menu-item" title="Dashboard">
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
                    <Link to="/directory" className="menu-item active" title="Resident Directory">
                        <Users size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Resident Directory</span>}
                    </Link>
                    <a onClick={openAddModal} className="menu-item" title="Add Resident" style={{ cursor: 'pointer' }}>
                        <User size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Add Resident</span>}
                    </a>
                    <div className="menu-item" title="Settings" style={{ cursor: 'pointer', marginTop: 'auto' }}>
                        <Settings size={20} className="icon" />
                        {!isSidebarCollapsed && <span>System Settings</span>}
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="main-wrapper">
                <header className="top-nav">
                    <div className="search-bar">
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search global directory..."
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
                        </button>
                        <div className="user-profile">
                            <div className="avatar">A</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>Admin</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>MNG-204</span>
                            </div>
                        </div>
                        <button className="action-btn" style={{ display: 'none' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu size={20} />
                        </button>
                    </div>
                </header>

                <main className="dashboard-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Resident Directory</h1>
                            <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Manage apartment owners and tenants.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-primary" onClick={openAddModal}>
                                <Plus size={16} /> Add Resident
                            </button>
                        </div>
                    </div>

                    <div className="panel" style={{ marginTop: '1.5rem' }}>
                        <div className="panel-header" style={{ padding: '0', borderBottom: '1px solid var(--admin-border)' }}>
                            <div className="table-controls">
                                <div className="filters-group">
                                    <select className="filter-select" value={blockFilter} onChange={e => setBlockFilter(e.target.value)}>
                                        <option>All Blocks</option>
                                        <option>Block A</option>
                                        <option>Block B</option>
                                        <option>Block C</option>
                                        <option>Block D</option>
                                    </select>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Showing {filtered.length} Residents</span>
                            </div>
                        </div>
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Resident Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                                        <th onClick={() => handleSort('flat')} style={{ cursor: 'pointer' }}>Flat {sortField === 'flat' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                                        <th>Contact Info</th>
                                        <th onClick={() => handleSort('block')} style={{ cursor: 'pointer' }}>Block {sortField === 'block' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                                        <th onClick={() => handleSort('moveIn')} style={{ cursor: 'pointer' }}>Move-in Date {sortField === 'moveIn' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(r => (
                                        <tr key={r.id}>
                                            <td>
                                                <div className="visitor-cell">
                                                    <div className="visitor-avatar" style={{ background: 'var(--admin-primary)', color: 'white' }}>{r.name.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Family: {r.family} members</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{r.flat}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem' }}>{r.phone}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{r.email}</div>
                                            </td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--admin-text-main)' }}>
                                                    <MapPin size={14} color="var(--admin-text-muted)" /> {r.block}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ color: 'var(--admin-text-muted)' }}>{r.moveIn}</span>
                                            </td>
                                            <td>
                                                <div className={`status-badge status-${r.status === 'Active' ? 'approved' : 'rejected'}`}>
                                                    <div className="status-dot"></div>
                                                    {r.status}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => openEditModal(r)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--admin-primary)', cursor: 'pointer', borderRadius: '4px' }} className="hover-bg"><Edit size={16} /></button>
                                                    <button onClick={() => deleteResident(r.id)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--admin-error)', cursor: 'pointer', borderRadius: '4px' }} className="hover-bg"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                                                No residents found matching your search.
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

            {/* ADD/EDIT RESIDENT MODAL */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{modalMode === 'add' ? 'Register New Resident' : 'Edit Resident Profile'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><XCircle size={24} /></button>
                        </div>

                        <form onSubmit={saveResident} className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                                    <input required type="text" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.name} onChange={e => setCurrentResident({ ...currentResident, name: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Flat Number</label>
                                    <input required type="text" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.flat} onChange={e => setCurrentResident({ ...currentResident, flat: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                                    <input required type="tel" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.phone} onChange={e => setCurrentResident({ ...currentResident, phone: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                                    <input required type="email" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.email} onChange={e => setCurrentResident({ ...currentResident, email: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Block / Tower</label>
                                    <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.block} onChange={e => setCurrentResident({ ...currentResident, block: e.target.value })}>
                                        <option>Block A</option>
                                        <option>Block B</option>
                                        <option>Block C</option>
                                        <option>Block D</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Family Members</label>
                                    <input type="number" min="1" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.family} onChange={e => setCurrentResident({ ...currentResident, family: Number(e.target.value) })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Vehicle Info (Optional)</label>
                                    <input type="text" placeholder="e.g. MH01AB1234" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.vehicle} onChange={e => setCurrentResident({ ...currentResident, vehicle: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Move-in Date</label>
                                    <input required type="date" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.moveIn} onChange={e => setCurrentResident({ ...currentResident, moveIn: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Resident Status</label>
                                    <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                                        value={currentResident.status} onChange={e => setCurrentResident({ ...currentResident, status: e.target.value })}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>

                            </div>

                            <div className="modal-footer" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ background: 'var(--admin-primary)' }}>
                                    <CheckCircle size={16} /> Save Resident Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .hover-bg:hover { background: var(--admin-surface-hover) !important; }
      `}</style>
        </div>
    );
}
