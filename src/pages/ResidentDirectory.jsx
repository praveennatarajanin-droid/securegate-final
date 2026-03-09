import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, MapPin, Filter, Filter as FilterIcon, ChevronUp, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';

const initialResidents = [
    { id: 1, name: "Ramesh Kumar", flat: "A-101", phone: "+91 98765 00001", email: "ramesh.k@email.com", block: "Block A", moveIn: "2023-01-15", status: "Active", family: 4, vehicle: "MH01AB1234" },
    { id: 2, name: "Sneha Reddy", flat: "B-205", phone: "+91 87654 00002", email: "sneha.r@email.com", block: "Block B", moveIn: "2024-03-22", status: "Active", family: 2, vehicle: "TS09CD5678" },
    { id: 3, name: "Vikram Joshi", flat: "C-302", phone: "+91 76543 00003", email: "vikram.j@email.com", block: "Block C", moveIn: "2022-11-05", status: "Inactive", family: 3, vehicle: "KA05EF9012" },
    { id: 4, name: "Anita Sharma", flat: "D-105", phone: "+91 65432 00004", email: "anita.s@email.com", block: "Block D", moveIn: "2025-01-10", status: "Active", family: 1, vehicle: "" },
];

export default function ResidentDirectory() {
    const location = useLocation();
    const { addNotification } = useNotification();
    const [residents, setResidents] = useState(initialResidents);
    const [searchQuery, setSearchQuery] = useState('');
    const [blockFilter, setBlockFilter] = useState('All Blocks');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentResident, setCurrentResident] = useState({
        id: null, name: '', flat: '', phone: '', email: '', block: 'Block A', moveIn: '', status: 'Active', family: 1, vehicle: ''
    });

    useEffect(() => {
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

    const deleteResident = (id) => {
        if (window.confirm('Remove this resident?')) {
            setResidents(residents.filter(r => r.id !== id));
            addNotification('Resident removed successfully', 'success');
        }
    };

    const saveResident = (e) => {
        e.preventDefault();
        addNotification(modalMode === 'add' ? 'Creating resident profile...' : 'Updating profile...', 'loading', 1500);

        setTimeout(() => {
            if (modalMode === 'add') {
                setResidents([...residents, currentResident]);
                addNotification('Resident added successfully!', 'success');
            } else {
                setResidents(residents.map(r => r.id === currentResident.id ? currentResident : r));
                addNotification('Profile updated successfully!', 'success');
            }
            setIsModalOpen(false);
        }, 1500);
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
                    <button className="btn-primary" onClick={openAddModal}>
                        <Plus size={18} /> Add Resident
                    </button>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem' }}>
                    <div className="search-bar" style={{ flex: 1, maxWidth: '400px', border: '1px solid var(--admin-border)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search name, flat or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={blockFilter}
                        onChange={(e) => setBlockFilter(e.target.value)}
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
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>{modalMode === 'add' ? 'Add New Resident' : 'Edit Resident Profile'}</h3>
                        </div>
                        <form onSubmit={saveResident}>
                            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Full Name</label>
                                    <input className="input-field" style={{ border: '1px solid var(--admin-border)' }} required value={currentResident.name} onChange={e => setCurrentResident({ ...currentResident, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Flat Number</label>
                                    <input className="input-field" style={{ border: '1px solid var(--admin-border)' }} required value={currentResident.flat} onChange={e => setCurrentResident({ ...currentResident, flat: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Block</label>
                                    <select className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={currentResident.block} onChange={e => setCurrentResident({ ...currentResident, block: e.target.value })}>
                                        <option>Block A</option><option>Block B</option><option>Block C</option><option>Block D</option>
                                    </select>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Phone Number</label>
                                    <input className="input-field" style={{ border: '1px solid var(--admin-border)' }} required value={currentResident.phone} onChange={e => setCurrentResident({ ...currentResident, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Resident</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
