import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import '../styles/dashboard.css';

export default function AdminLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isDarkMode) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }, [isDarkMode]);

    return (
        <div className={`admin-layout ${isDarkMode ? 'dark' : ''}`}>
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
