import React, { useState } from 'react';
import { Search, ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';

const initialAlerts = [
    { id: 1, type: "High", message: "Tailgating suspected at Gate 2. Vehicle MH04XX1234 without RFID.", time: "10:45 AM, Today", status: "Unresolved", location: "Gate 2" },
    { id: 2, type: "Medium", message: "Visitor ID #3045 overstayed beyond allowed 2 hours.", time: "09:30 AM, Today", status: "Unresolved", location: "Block C" },
    { id: 3, type: "High", message: "Multiple failed PIN attempts at Block A Lobby.", time: "02:15 AM, Today", status: "Resolved", location: "Block A Lobby" },
    { id: 4, type: "Low", message: "Camera #4 (Basement) feed disconnected for 5 minutes.", time: "Yesterday, 11:45 PM", status: "Resolved", location: "Basement Parking" },
];

export default function SecurityAlerts() {
    const { addNotification } = useNotification();
    const [alerts, setAlerts] = useState(initialAlerts);
    const [searchQuery, setSearchQuery] = useState('');

    const markResolved = (id) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
        addNotification('Alert marked as resolved', 'success');
    };

    const deleteAlert = (id) => {
        if (window.confirm('Delete this alert?')) {
            setAlerts(alerts.filter(a => a.id !== id));
            addNotification('Alert deleted permanently', 'success');
        }
    };

    const filteredAlerts = alerts.filter(a =>
        a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShieldAlert color="var(--admin-error)" /> Security Incident Alerts
                        </h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Priority incidents requiring attention or review.</p>
                    </div>
                    {/* Fixed: Small and aligned button as requested */}
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => addNotification('Manual alert system triggered', 'info')}>
                        Add Security Alert
                    </button>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="search-bar" style={{ maxWidth: '400px', border: '1px solid var(--admin-border)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Filter by location or message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Priority</th>
                                <th>Incident Message</th>
                                <th>Location</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map(alert => (
                                <tr key={alert.id}>
                                    <td>
                                        <span className={`status-badge ${alert.type === 'High' ? 'status-rejected' : alert.type === 'Medium' ? 'status-waiting' : 'status-approved'}`} style={{ minWidth: '80px', textAlign: 'center' }}>
                                            {alert.type}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '400px' }}>
                                        <div style={{ fontWeight: 500 }}>{alert.message}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-muted)' }}>
                                            <AlertCircle size={14} /> {alert.location}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>{alert.time}</td>
                                    <td>
                                        <div className={`status-badge status-${alert.status.toLowerCase()}`}>
                                            <div className="status-dot"></div>
                                            {alert.status}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {alert.status !== 'Resolved' && (
                                                <button className="action-btn" title="Mark Resolved" onClick={() => markResolved(alert.id)}>
                                                    <CheckCircle size={18} color="var(--admin-success)" />
                                                </button>
                                            )}
                                            <button className="action-btn" title="Delete" onClick={() => deleteAlert(alert.id)}>
                                                <Trash2 size={18} color="var(--admin-error)" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
