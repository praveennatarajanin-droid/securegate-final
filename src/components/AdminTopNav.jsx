import React, { useState, useEffect } from 'react';
import { Search, Clock, Sun, Moon, Bell, Menu } from 'lucide-react';

export default function AdminTopNav({ isDarkMode, setIsDarkMode, toggleMobileMenu }) {
    const [currentTime, setCurrentTime] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <button className="hamburger-menu" onClick={toggleMobileMenu}>
                    <Menu size={24} />
                </button>
                <div className="search-bar">
                    <Search size={18} color="var(--admin-text-muted)" />
                    <input type="text" placeholder="Search for anything..." />
                </div>
            </div>

            <div className="nav-actions">
                <span className="time-display" style={{
                    fontWeight: 600,
                    color: 'var(--admin-text-muted)',
                    fontSize: '0.875rem',
                    marginRight: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Clock size={16} /> {currentTime}
                </span>

                <button className="action-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="action-btn">
                    <Bell size={20} />
                    <div className="notification-badge"></div>
                </button>

                <div className="user-profile-container" style={{ position: 'relative' }}>
                    <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
                        <div className="avatar">A</div>
                        <div className="user-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>Admin</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>MNG-204</span>
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu" style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            background: 'white',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-dropdown)',
                            overflow: 'hidden',
                            zIndex: 100,
                            minWidth: '160px'
                        }}>
                            <button 
                                onClick={() => window.location.href = '/admin-login'}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    color: '#EF4444',
                                    fontSize: '0.875rem',
                                    fontWeight: 500
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
