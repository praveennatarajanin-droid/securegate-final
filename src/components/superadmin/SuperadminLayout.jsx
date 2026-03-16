import React from 'react';
import SuperadminSidebar from './SuperadminSidebar';
import SuperadminTopNav from './SuperadminTopNav';
import '../../styles/dashboard.css';
import '../../styles/superadmin.css';

export default function SuperadminLayout({ children, title }) {
  return (
    <div className="admin-layout">
      <SuperadminSidebar />
      <div className="main-wrapper">
        <SuperadminTopNav title={title} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
