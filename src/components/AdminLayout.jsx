import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import { apiService } from '../services/apiService';
import { Megaphone, X } from 'lucide-react';
import '../styles/dashboard.css';

export default function AdminLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('securegate-dark-mode') === 'true';
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.documentElement.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.classList.remove('dark-mode');
        }
        localStorage.setItem('securegate-dark-mode', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await apiService.getActiveAnnouncements();
                if (res.success && res.data.length > 0) {
                    // Filter out dismissed announcements
                    const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
                    const active = res.data.filter(a => !dismissed.includes(a.id));
                    setAnnouncements(active);
                }
            } catch (err) { }
        };
        fetchAnnouncements();
    }, []);

    const dismissAnnouncement = (id) => {
        const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]');
        localStorage.setItem('dismissedAnnouncements', JSON.stringify([...dismissed, id]));
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    const getBannerColors = (type) => {
        switch(type) {
            case 'info': return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
            case 'warning': return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
            case 'danger': return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
            case 'success': return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
            default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
        }
    };

    return (
        <div className={`admin-layout ${isDarkMode ? 'dark-mode' : ''}`}>
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                isMobileOpen={mobileMenuOpen}
                setCollapsed={setIsSidebarCollapsed}
                setMobileOpen={setMobileMenuOpen}
            />

            <div className="main-wrapper">
                <AdminTopNav
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                />

                {announcements.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem 2rem 0 2rem', gap: '0.75rem' }}>
                        {announcements.map(announcement => {
                            const colors = getBannerColors(announcement.type);
                            return (
                                <div key={announcement.id} style={{
                                    background: `linear-gradient(to right, ${colors.bg}, #ffffff)`,
                                    border: `1px solid ${colors.border}`,
                                    borderLeft: `5px solid ${colors.text}`,
                                    color: colors.text,
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                                    animation: 'slideInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <div style={{ 
                                        background: colors.bg, 
                                        padding: '10px', 
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 4px 10px ${colors.border}`
                                    }}>
                                        <Megaphone size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{announcement.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: '#4b5563', fontWeight: 500 }}>{announcement.message}</p>
                                    </div>
                                    <button 
                                        onClick={() => dismissAnnouncement(announcement.id)}
                                        style={{ 
                                            background: '#f3f4f6', 
                                            border: 'none', 
                                            color: '#9ca3af', 
                                            cursor: 'pointer', 
                                            padding: '8px', 
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.background = '#e5e7eb';
                                            e.currentTarget.style.color = '#4b5563';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = '#f3f4f6';
                                            e.currentTarget.style.color = '#9ca3af';
                                        }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
