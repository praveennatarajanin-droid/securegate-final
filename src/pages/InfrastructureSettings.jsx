import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building, Layers, Home } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function InfrastructureSettings() {
    const { addNotification, removeNotification } = useNotification();
    const [communities, setCommunities] = useState([]);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ type: 'community', mode: 'add', current: null });
    const [formData, setFormData] = useState({ name: '', address: '', city: '', state: '', zip: '', community_id: '', block_id: '', number: '' });
    const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCommunities = async () => {
        try {
            const res = await apiService.getAllCommunities();
            if (res && res.data) {
                setCommunities(res.data);
            }
        } catch (err) {
            console.error("Failed to load infrastructure data", err);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const openModal = (type, mode, current = null, parentId = null) => {
        setModalData({ type, mode, current });
        if (mode === 'add') {
            setFormData({
                name: '', address: '', city: '', state: '', zip: '', number: '',
                community_id: type === 'block' ? parentId : '',
                block_id: type === 'apartment' ? parentId : ''
            });
        } else {
            setFormData({ ...current });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (type, id) => {
        setDeleteModal({ open: true, type, id });
    };

    const confirmDelete = async () => {
        const { type, id } = deleteModal;
        if (!id) return;

        try {
            setIsDeleting(true);
            if (type === 'community') await apiService.deleteCommunity(id);
            if (type === 'block') await apiService.deleteBlock(id);
            if (type === 'apartment') await apiService.deleteApartment(id);
            addNotification(`${type} deleted.`, 'success');
            setDeleteModal({ open: false, type: '', id: null });
            fetchCommunities();
        } catch (err) {
            addNotification(`Failed to delete ${type}.`, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const saveForm = async (e) => {
        e.preventDefault();
        const notificationId = addNotification('Saving...', 'loading', 0);
        try {
            if (modalData.type === 'community') {
                if (modalData.mode === 'add') await apiService.addCommunity(formData);
                // No update for simplicity, assuming delete/add pattern for demo or could implement update route
            } else if (modalData.type === 'block') {
                if (modalData.mode === 'add') await apiService.addBlock(formData);
            } else if (modalData.type === 'apartment') {
                if (modalData.mode === 'add') await apiService.addApartment(formData);
            }
            addNotification(`Successfully saved ${modalData.type}!`, 'success');
            setIsModalOpen(false);
            fetchCommunities();
        } catch (err) {
            console.error(err);
            addNotification(`Failed to save ${modalData.type}.`, 'error');
        } finally {
            removeNotification(notificationId);
        }
    };

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">Infrastructure Manager</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Manage Communities, Blocks, and Apartments</p>
                    </div>
                    <button className="btn-primary" onClick={() => openModal('community', 'add')}>
                        <Plus size={16} /> Add Community
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {communities.map((comm) => (
                        <div key={comm.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '8px', background: 'var(--admin-surface)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Building size={20} color="var(--admin-primary)" />
                                    <h2 style={{ margin: 0 }}>{comm.name}</h2>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginLeft: '1rem' }}>{comm.address}, {comm.city}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-secondary" onClick={() => openModal('block', 'add', null, comm.id)}><Plus size={14}/> Add Block</button>
                                    <button className="action-btn" onClick={() => handleDelete('community', comm.id)}><Trash2 size={16} color="var(--admin-error)" /></button>
                                </div>
                            </div>
                            
                            <div style={{ paddingLeft: '2rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(comm.blocks || []).map(block => (
                                    <div key={block.id} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', background: 'var(--admin-bg)', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Layers size={18} color="var(--admin-text-main)" />
                                                <h3 style={{ margin: 0 }}>{block.name}</h3>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => openModal('apartment', 'add', null, block.id)}>
                                                    <Plus size={12}/> Add Apt
                                                </button>
                                                <button className="action-btn" onClick={() => handleDelete('block', block.id)}><Trash2 size={14} color="var(--admin-error)" /></button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingLeft: '1.5rem' }}>
                                            {(block.apartments || []).map(apt => (
                                                <div key={apt.id} style={{ padding: '0.3rem 0.8rem', background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                    <Home size={14} color="var(--admin-text-muted)" />
                                                    {apt.number}
                                                    <Trash2 size={12} color="var(--admin-error)" style={{ cursor: 'pointer' }} onClick={() => handleDelete('apartment', apt.id)} />
                                                </div>
                                            ))}
                                            {(block.apartments || []).length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>No apartments.</span>}
                                        </div>
                                    </div>
                                ))}
                                {(comm.blocks || []).length === 0 && <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>No blocks added to this community yet.</span>}
                            </div>
                        </div>
                    ))}
                    {communities.length === 0 && <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>No communities found. Click "Add Community" to begin.</div>}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3>{modalData.mode === 'add' ? 'Add' : 'Edit'} {modalData.type.charAt(0).toUpperCase() + modalData.type.slice(1)}</h3>
                        </div>
                        <form onSubmit={saveForm}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {modalData.type === 'community' && (
                                    <>
                                        <div>
                                            <label className="input-label">Community Name</label>
                                            <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="input-label">Address</label>
                                            <input className="input-field" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label className="input-label">City</label>
                                                <input className="input-field" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                                            </div>
                                            <div style={{ width: '80px' }}>
                                                <label className="input-label">State</label>
                                                <input className="input-field" value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {modalData.type === 'block' && (
                                    <div>
                                        <label className="input-label">Block Name</label>
                                        <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                )}
                                {modalData.type === 'apartment' && (
                                    <div>
                                        <label className="input-label">Apartment Number</label>
                                        <input required className="input-field" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmModal 
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, type: '', id: null })}
                onConfirm={confirmDelete}
                loading={isDeleting}
                title={`Delete ${deleteModal.type.charAt(0).toUpperCase() + deleteModal.type.slice(1)}?`}
                message={`Are you sure you want to permanently delete this ${deleteModal.type}? All associated data will be removed.`}
            />
        </AdminLayout>
    );
}
