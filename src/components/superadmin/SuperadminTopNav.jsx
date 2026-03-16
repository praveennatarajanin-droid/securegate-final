import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function SuperadminTopNav({ title }) {
  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{title || 'Master Admin'}</h2>
        <div className="search-bar">
          <Search size={18} color="var(--admin-text-muted)" />
          <input 
            type="text" 
            placeholder="Search societies..." 
          />
        </div>
      </div>

      <div className="nav-actions">
        <button className="action-btn">
          <Bell size={20} />
          <div className="notification-badge"></div>
        </button>
        <div className="user-profile">
          <div className="avatar">M</div>
          <div className="user-details" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>Master Admin</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>System Supervisor</span>
          </div>
        </div>
      </div>
    </header>
  );
}
