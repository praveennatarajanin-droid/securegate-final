import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Megaphone, CheckCircle, X } from 'lucide-react';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { apiService } from '../../services/apiService';
import { useNotification } from '../../components/NotificationProvider';

export default function SuperadminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info', is_active: true, expires_at: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const result = await apiService.getAllAnnouncements();
      if (result.success) setAnnouncements(result.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        message: announcement.message,
        type: announcement.type,
        is_active: announcement.is_active,
        expires_at: announcement.expires_at ? new Date(announcement.expires_at).toISOString().slice(0, 16) : ''
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({ title: '', message: '', type: 'info', is_active: true, expires_at: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.expires_at) payload.expires_at = null; // Send null if empty
      else payload.expires_at = new Date(payload.expires_at).toISOString();

      let result;
      if (editingAnnouncement) {
        result = await apiService.updateAnnouncement(editingAnnouncement.id, payload);
      } else {
        result = await apiService.createAnnouncement(payload);
      }

      if (result.success) {
        setShowModal(false);
        addNotification(`Announcement ${editingAnnouncement ? 'updated' : 'created'} successfully!`, 'success');
        fetchAnnouncements();
      } else {
        addNotification(result.error || 'Operation failed', 'error');
      }
    } catch (err) {
      addNotification('An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Announcement',
      message: 'Are you sure you want to delete this announcement? This action is permanent.',
      onConfirm: async () => {
        try {
          const result = await apiService.deleteAnnouncement(id);
          if (result.success) {
            addNotification('Announcement deleted successfully!', 'success');
            fetchAnnouncements();
          }
        } catch (error) {
          addNotification('Error deleting announcement.', 'error');
        }
      }
    });
  };

  const handleToggleActive = async (announcement) => {
    try {
      const result = await apiService.updateAnnouncement(announcement.id, { is_active: !announcement.is_active });
      if (result.success) {
        addNotification(`Announcement ${result.data.is_active ? 'activated' : 'deactivated'}!`, 'success');
        fetchAnnouncements();
      }
    } catch (err) {
      addNotification('Failed to toggle status', 'error');
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'info': return { bg: '#e0f2fe', color: '#0369a1' };
      case 'warning': return { bg: '#fef3c7', color: '#b45309' };
      case 'danger': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'success': return { bg: '#dcfce7', color: '#15803d' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <SuperadminLayout title="Global Announcements">
      <div className="table-controls" style={{ marginBottom: '1.5rem', background: 'transparent', padding: 0, justifyContent: 'flex-end' }}>
        <button className="admin-btn-primary" onClick={() => openForm()}>
          <Plus size={18} />
          Create Announcement
        </button>
      </div>

      <div className="panel" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title & Message</th>
                <th>Type</th>
                <th>Status</th>
                <th>Expires</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : announcements.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--admin-text-muted)' }}>No announcements found.</td></tr>
              ) : (
                announcements.map((item) => {
                  const badge = getBadgeColor(item.type);
                  const isExpired = item.expires_at && new Date(item.expires_at) < new Date();
                  return (
                    <tr key={item.id} style={{ opacity: (!item.is_active || isExpired) ? 0.6 : 1 }}>
                      <td>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.message}
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          background: badge.bg, color: badge.color, 
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' 
                        }}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleActive(item)}
                          style={{
                            background: item.is_active ? 'var(--admin-success)' : 'var(--admin-border)',
                            color: item.is_active ? 'white' : 'var(--admin-text-muted)',
                            border: 'none', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          <CheckCircle size={12} />
                          {item.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: isExpired ? 'var(--admin-danger)' : 'var(--admin-text-muted)' }}>
                        {item.expires_at ? new Date(item.expires_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}
                        {isExpired && ' (Expired)'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button className="admin-btn-secondary" style={{ padding: '0.5rem' }} onClick={() => openForm(item)}>
                            <Edit size={16} />
                          </button>
                          <button className="admin-btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="info-label">Announcement Title *</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Scheduled System Maintenance"
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="info-label">Message Content *</label>
                  <textarea 
                    className="admin-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Details of the announcement..."
                    rows={4}
                    style={{ minHeight: '120px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <label className="info-label">Display Type</label>
                    <select 
                      className="admin-select"
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Yellow)</option>
                      <option value="danger">Danger (Red)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="info-label">Expires At (Optional)</label>
                    <input 
                      type="datetime-local" 
                      className="admin-input"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', marginTop: '0' }}>
                <button type="button" className="admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={isSubmitting}>
                  <Megaphone size={18} />
                  {isSubmitting ? 'Saving...' : (editingAnnouncement ? 'Update Announcement' : 'Publish Announcement')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>{confirmDialog.title}</h3>
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--admin-text)' }}>{confirmDialog.message}</p>
            </div>
            <div className="modal-footer" style={{ gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
              <button 
                type="button" 
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }} 
                className="admin-btn-danger"
              >
                Delete Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperadminLayout>
  );
}
