import React, { useState } from 'react';
import { ShieldCheck, Bell, Lock, CheckCircle, Smartphone, LayoutDashboard } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';

export default function SystemSettings() {
    const { addNotification } = useNotification();

    // Form states
    const [general, setGeneral] = useState({ name: 'SecureGate Residences', address: '123 Secure Avenue, Tech Park', phone: '+91 98765 43210' });
    const [security, setSecurity] = useState({ timeout: '15', maxVisitors: '50', autoReject: true });
    const [notifications, setNotifications] = useState({ resident: true, sms: true, email: false });
    const [admin, setAdmin] = useState({ password: '', confirm: '', email: 'admin@securegate.com' });

    const handleSave = (e) => {
        e.preventDefault();
        addNotification('Applying system configuration...', 'loading', 1500);
        setTimeout(() => addNotification('Configuration saved successfully', 'success'), 1500);
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>System Configuration</h1>
                    <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.95rem' }}>Manage your society access variables, integrations, and administration protocols.</p>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
                            <LayoutDashboard size={20} color="var(--admin-primary)" /> General Information
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="input-label">Society Name</label>
                                <input className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={general.name} onChange={e => setGeneral({ ...general, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="input-label">Contact Support</label>
                                <input className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={general.phone} onChange={e => setGeneral({ ...general, phone: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                <label className="input-label">Official Address</label>
                                <input className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
                            <ShieldCheck size={20} color="var(--admin-primary)" /> Security & Gate Rules
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label className="input-label">Visitor Timeout (Mins)</label>
                                <input type="number" className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={security.timeout} onChange={e => setSecurity({ ...security, timeout: e.target.value })} />
                            </div>
                            <div>
                                <label className="input-label">Max Visitors Daily</label>
                                <input type="number" className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={security.maxVisitors} onChange={e => setSecurity({ ...security, maxVisitors: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={security.autoReject} onChange={e => setSecurity({ ...security, autoReject: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                    <span style={{ fontWeight: 600 }}>Enable Auto-Reject for unresponsive residents</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
                            <Lock size={20} color="var(--admin-error)" /> Manager Access
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label className="input-label">Admin Email</label>
                                <input type="email" className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={admin.email} onChange={e => setAdmin({ ...admin, email: e.target.value })} />
                            </div>
                            <button type="button" className="btn-secondary" style={{ width: 'fit-content' }} onClick={() => addNotification('Password reset link sent to admin email', 'info')}>
                                Change Password
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem' }}>
                            Update Configuration
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
