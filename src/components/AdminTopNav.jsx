import React, { useState, useEffect } from 'react';
import { Search, Clock, Sun, Moon, Bell, Menu } from 'lucide-react';

export default function AdminTopNav({ isDarkMode, setIsDarkMode, toggleMobileMenu }) {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="hamburger-menu" onClick={toggleMobileMenu}>
                    <Menu size={24} />
                </button>
                <div className="search-bar">
                    <Search size={18} color="var(--admin-text-muted)" />
                    <input type="text" placeholder="Search anything..." />
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

                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="user-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>Admin</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>MNG-204</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
