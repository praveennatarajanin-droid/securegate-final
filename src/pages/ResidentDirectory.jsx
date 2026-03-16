import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, MapPin, Filter, Filter as FilterIcon, ChevronUp, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';

export default function ResidentDirectory() {
    const location = useLocation();
    const { addNotification, removeNotification } = useNotification();
    const [residents, setResidents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [blockFilter, setBlockFilter] = useState('All Blocks');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentResident, setCurrentResident] = useState({
        id: null, name: '', flat: '', phone: '', email: '', additional_email: '', block: 'Block A', moveIn: '', status: 'Active', family: 1, vehicle: ''
    });

    const fetchResidents = async () => {
        try {
            const response = await apiService.getAllResidents();
            if (response && response.data) {
                setResidents(response.data);
            }
        } catch (err) {
            console.error("Failed to load residents", err);
        }
    };
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

    useEffect(() => {
        fetchResidents();
        if (location.state && location.state.openAdd) {
            openAddModal();
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const openAddModal = () => {
        setModalMode('add');
        setCurrentResident({ id: Date.now(), name: '', flat: '', phone: '', email: '', block: 'Block A', moveIn: new Date().toISOString().split('T')[0], status: 'Active', family: 1, vehicle: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (res) => {
        setModalMode('edit');
        setCurrentResident({ ...res });
        setIsModalOpen(true);
    };

    const deleteResident = async (id) => {
        if (window.confirm('Remove this resident?')) {
            try {
                await apiService.deleteResident(id);
                setResidents(residents.filter(r => r.id !== id));
                addNotification('Resident removed successfully', 'success');
            } catch (err) {
                addNotification('Failed to remove resident', 'error');
            }
        }
        const deleteResident = (id) => {
            setConfirmDialog({
                isOpen: true,
                title: 'Remove Resident',
                message: 'Are you sure you want to remove this resident? This action cannot be undone.',
                type: 'danger',
                confirmText: 'Remove',
                onConfirm: () => {
                    setResidents(residents.filter(r => r.id !== id));
                    addNotification('Resident removed successfully', 'success');
                }
            });
        };

        const saveResident = async (e) => {
            e.preventDefault();
            const notificationId = addNotification(modalMode === 'add' ? 'Creating resident profile...' : 'Updating profile...', 'loading', 0);

            try {
                if (modalMode === 'add') {
                    const res = await apiService.addResident(currentResident);
                    setResidents([...residents, res.data]);
                    addNotification('Resident added successfully!', 'success');
                } else {
                    const res = await apiService.updateResident(currentResident.id, currentResident);
                    setResidents(residents.map(r => r.id === currentResident.id ? res.data : r));
                    addNotification('Profile updated successfully!', 'success');
                }
                setIsModalOpen(false);
            } catch (err) {
                console.error('Save failed:', err);
                addNotification('Failed to save resident details.', 'error');
            } finally {
                removeNotification(notificationId);
            }
        };

        const filtered = residents.filter(r =>
            (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.flat.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (blockFilter === 'All Blocks' || r.block === blockFilter)
        );

        return (
            <AdminLayout>
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h1 className="panel-title">Resident Directory</h1>
                            <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Total {residents.length} registered residents</p>
                        </div>
                        <button className="btn-secondary" onClick={openAddModal}>
                            <Plus size={16} /> Add Resident
                        </button>
                    </div>

                    <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem' }}>
                        <div className="search-bar" style={{ flex: 1, maxWidth: '400px', border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                            <Search size={18} color="var(--admin-text-muted)" />
                            <input
                                type="text"
                                placeholder="Search name, flat or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'transparent', color: 'var(--admin-text-main)' }}
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={blockFilter}
                            onChange={(e) => setBlockFilter(e.target.value)}
                            style={{ background: 'var(--admin-surface)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }}
                        >
                            <option>All Blocks</option>
                            <option>Block A</option>
                            <option>Block B</option>
                            <option>Block C</option>
                            <option>Block D</option>
                        </select>
                    </div>

                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Resident Name</th>
                                    <th>Flat</th>
                                    <th>Contact Info</th>
                                    <th>Family</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(res => (
                                    <tr key={res.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>{res.name.charAt(0)}</div>
                                                <div style={{ fontWeight: 600 }}>{res.name}</div>
                                            </div>
                                        </td>
                                        <td><span className="flat-badge">{res.flat}</span></td>
                                        <td>
                                            <div style={{ fontSize: '0.875rem' }}>{res.phone}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{res.email}</div>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-muted)' }}>{res.family} Members</td>
                                        <td>
                                            <span className={`status-badge status-${res.status.toLowerCase()}`}>
                                                <div className="status-dot"></div>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button className="action-btn" onClick={() => openEditModal(res)} title="Edit"><Edit size={18} color="var(--admin-primary)" /></button>
                                                <button className="action-btn" onClick={() => deleteResident(res.id)} title="Delete"><Trash2 size={18} color="var(--admin-error)" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                            <div className="modal-header">
                                <h3>{modalMode === 'add' ? 'Add New Resident' : 'Edit Resident Profile'}</h3>
                            </div>
                            <form onSubmit={saveResident}>
                                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label className="input-label">Full Name</label>
                                        <input className="input-field" required value={currentResident.name} onChange={e => setCurrentResident({ ...currentResident, name: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="input-label">Flat Number</label>
                                            <input className="input-field" required value={currentResident.flat} onChange={e => setCurrentResident({ ...currentResident, flat: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="input-label">Block</label>
                                            <select className="input-field" value={currentResident.block} onChange={e => setCurrentResident({ ...currentResident, block: e.target.value })}>
                                                <option>Block A</option><option>Block B</option><option>Block C</option><option>Block D</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">Phone Number</label>
                                        <input className="input-field" required value={currentResident.phone} onChange={e => setCurrentResident({ ...currentResident, phone: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="input-label">Email Address</label>
                                            <input className="input-field" type="email" value={currentResident.email} onChange={e => setCurrentResident({ ...currentResident, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="input-label">Additional Email (Optional)</label>
                                            <input className="input-field" type="email" value={currentResident.additional_email || ''} onChange={e => setCurrentResident({ ...currentResident, additional_email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">Members at Home</label>
                                        <input className="input-field" type="number" min="1" value={currentResident.family} onChange={e => setCurrentResident({ ...currentResident, family: parseInt(e.target.value) || 1 })} />
                                    </div>
                                    {modalMode === 'add' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                id="generateAccount"
                                                checked={currentResident.generateAccount || false}
                                                onChange={e => setCurrentResident({ ...currentResident, generateAccount: e.target.checked })}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                            <label htmlFor="generateAccount" style={{ cursor: 'pointer', color: 'var(--admin-text-main)', fontSize: '0.9rem' }}>
                                                Generate System Account & Email Credentials
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" style={{ background: 'transparent', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Save Resident</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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
}
