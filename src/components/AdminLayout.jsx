import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import '../styles/dashboard.css';

export default function AdminLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('securegate-dark-mode') === 'true';
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
