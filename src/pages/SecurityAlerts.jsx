import React, { useState } from 'react';
import { Search, ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, Trash2, XCircle } from 'lucide-react';
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

    // Custom Confirm Modal State
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'danger',
        confirmText: 'Confirm'
    });
    const closeConfirmDialog = () => setConfirmDialog(prev => ({ ...prev, isOpen: false }));

    const markResolved = (id) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
        addNotification('Alert marked as resolved', 'success');
    };

    const deleteAlert = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Alert',
            message: 'Are you sure you want to permanently delete this alert? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete Alert',
            onConfirm: () => {
                setAlerts(alerts.filter(a => a.id !== id));
                addNotification('Alert deleted permanently', 'success');
            }
        });
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
                    <button className="btn-secondary" onClick={() => addNotification('Manual alert system triggered', 'info')}>
                        Add Security Alert
                    </button>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="search-bar" style={{ maxWidth: '400px', border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Filter by location or message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: 'transparent', color: 'var(--admin-text-main)' }}
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
            {/* Confirm Modal */}
            {confirmDialog.isOpen && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>{confirmDialog.title}</h3>
                            <button onClick={closeConfirmDialog} className="action-btn" style={{ padding: 0 }}><XCircle size={20} color="var(--admin-text-muted)" /></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--admin-text)' }}>{confirmDialog.message}</p>
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
                            <button type="button" onClick={closeConfirmDialog} className="btn-secondary">Cancel</button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    confirmDialog.onConfirm();
                                    closeConfirmDialog();
                                }} 
                                className="btn-primary"
                                style={confirmDialog.type === 'danger' ? { background: 'var(--admin-error)' } : {}}
                            >
                                {confirmDialog.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
