import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, ShieldCheck, Phone, MapPin, User } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';

const initialGuards = [
    { id: 1, name: "Ram Singh", phone: "+91 91234 56780", shift: "Morning (6AM - 2PM)", gate: "Main Gate", status: "Active" },
    { id: 2, name: "Abdul Khan", phone: "+91 81234 56781", shift: "Morning (6AM - 2PM)", gate: "Back Gate", status: "Active" },
    { id: 3, name: "Suresh Yadav", phone: "+91 71234 56782", shift: "Evening (2PM - 10PM)", gate: "Main Gate", status: "Active" },
    { id: 4, name: "Manish Tiwari", phone: "+91 61234 56783", shift: "Evening (2PM - 10PM)", gate: "Back Gate", status: "On Leave" },
];

export default function SecurityGuards() {
    const { addNotification } = useNotification();
    const [guards, setGuards] = useState(initialGuards);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGuard, setCurrentGuard] = useState({ id: null, name: '', phone: '', shift: 'Morning (6AM - 2PM)', gate: 'Main Gate', status: 'Active' });

    const openAddModal = () => {
        setCurrentGuard({ id: Date.now(), name: '', phone: '', shift: 'Morning (6AM - 2PM)', gate: 'Main Gate', status: 'Active' });
        setIsModalOpen(true);
    };

    const deleteGuard = (id) => {
        if (window.confirm('Remove this guard from service?')) {
            setGuards(guards.filter(g => g.id !== id));
            addNotification('Guard removed from system', 'success');
        }
    };

    const saveGuard = (e) => {
        e.preventDefault();
        const existing = guards.find(g => g.id === currentGuard.id);
        if (existing) {
            setGuards(guards.map(g => g.id === currentGuard.id ? currentGuard : g));
            addNotification('Guard profile updated', 'success');
        } else {
            setGuards([...guards, currentGuard]);
            addNotification('New guard registered successfully', 'success');
        }
        setIsModalOpen(false);
    };

    const filteredGuards = guards.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.gate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">Security Personnel</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Manage security staff and gate assignments.</p>
                    </div>
                    <button className="btn-secondary" onClick={openAddModal}>
                        <Plus size={18} /> Add Guard
                    </button>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="search-bar" style={{ maxWidth: '400px', border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by guard name or gate..."
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
                                <th>Guard Name</th>
                                <th>Contact Status</th>
                                <th>Shift Assignment</th>
                                <th>Gate / Post</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuards.map(guard => (
                                <tr key={guard.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="avatar" style={{ width: '32px', height: '32px', background: 'var(--admin-surface-hover)', border: '1px solid var(--admin-border)', color: 'var(--admin-primary)' }}>
                                                <User size={16} />
                                            </div>
                                            <div style={{ fontWeight: 600 }}>{guard.name}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                                            <Phone size={14} color="var(--admin-text-muted)" /> {guard.phone}
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: '0.875rem' }}>{guard.shift}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
                                            <MapPin size={14} /> {guard.gate}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${guard.status.toLowerCase().replace(' ', '-')}`}>
                                            <div className="status-dot"></div>
                                            {guard.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="action-btn" onClick={() => { setCurrentGuard(guard); setIsModalOpen(true); }}><Edit size={18} /></button>
                                            <button className="action-btn" onClick={() => deleteGuard(guard.id)}><Trash2 size={18} color="var(--admin-error)" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h3>{currentGuard.id ? 'Edit Guard Assignment' : 'New Guard Registration'}</h3>
                        </div>
                        <form onSubmit={saveGuard}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="input-label">Guard Name</label>
                                    <input className="input-field" style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text-main)' }} required value={currentGuard.name} onChange={e => setCurrentGuard({ ...currentGuard, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Phone Number</label>
                                    <input className="input-field" style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text-main)' }} required value={currentGuard.phone} onChange={e => setCurrentGuard({ ...currentGuard, phone: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="input-label">Shift</label>
                                        <select className="input-field" style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text-main)' }} value={currentGuard.shift} onChange={e => setCurrentGuard({ ...currentGuard, shift: e.target.value })}>
                                            <option>Morning (6AM - 2PM)</option>
                                            <option>Evening (2PM - 10PM)</option>
                                            <option>Night (10PM - 6AM)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">Gate Post</label>
                                        <select className="input-field" style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text-main)' }} value={currentGuard.gate} onChange={e => setCurrentGuard({ ...currentGuard, gate: e.target.value })}>
                                            <option>Main Gate</option>
                                            <option>Back Gate</option>
                                            <option>Service Entry</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Service Status</label>
                                    <select className="input-field" style={{ border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text-main)' }} value={currentGuard.status} onChange={e => setCurrentGuard({ ...currentGuard, status: e.target.value })}>
                                        <option value="Active">Active Duty</option>
                                        <option value="On Leave">On Leave</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-secondary" style={{ background: 'transparent', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-secondary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
