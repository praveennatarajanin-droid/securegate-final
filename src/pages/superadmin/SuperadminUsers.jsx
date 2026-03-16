import React, { useState, useEffect, useCallback } from 'react';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { UserPlus, Search, ShieldCheck, Mail, X, Trash2, CheckSquare } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useNotification } from '../../components/NotificationProvider';

export default function SuperadminUsers() {
  const [admins, setAdmins] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  // Forms
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', society_id: '' });
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Pagination & Filtering & Bulk
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [bulkAssignSocietyId, setBulkAssignSocietyId] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsResult, societiesResult] = await Promise.all([
        apiService.getAllAdmins({ page: currentPage, limit, search: searchQuery }),
        apiService.getAllSocieties()
      ]);

      if (adminsResult.success) {
        setAdmins(adminsResult.data);
        setTotalPages(adminsResult.meta?.last_page || 1);
      }
      if (societiesResult.success) setSocieties(societiesResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const result = await apiService.createAdmin(newAdmin);
      if (result.success) {
        setShowModal(false);
        setNewAdmin({ name: '', email: '', password: '', society_id: '' });
        addNotification('Admin created successfully! Invitation sent.', 'success');
        fetchData();
      } else {
        setError(result.details ? Object.values(result.details)[0][0] : result.error || 'Failed to create admin.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Admin',
      message: 'Are you sure you want to delete this admin? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          const result = await apiService.deleteAdmin(id);
          if (result.success) fetchData();
        } catch (error) {
          console.error('Error deleting admin:', error);
        }
      }
    });
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const dataToUpdate = { ...editingAdmin };
      if (!dataToUpdate.password) delete dataToUpdate.password;

      const result = await apiService.updateAdmin(editingAdmin.id, dataToUpdate);
      if (result.success) {
        setShowEditModal(false);
        setEditingAdmin(null);
        fetchData();
      } else {
        setError(result.error || 'Failed to update admin.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvitation = (user) => {
    const isSent = user.invitation_status === 'sent';
    setConfirmDialog({
      isOpen: true,
      title: isSent ? 'Resend Invitation' : 'Send Invitation',
      message: isSent
        ? 'Are you sure you want to resend the invitation email to this admin?'
        : 'Are you sure you want to send the invitation email to this admin?',
      type: 'primary',
      confirmText: isSent ? 'Resend Invite' : 'Send Invite',
      onConfirm: async () => {
        try {
          const result = await apiService.resendAdminInvitation(user.id);
          if (result.success) {
            addNotification(isSent ? 'Invitation email resent successfully!' : 'Invitation email sent successfully!', 'success');
            fetchData();
          }
          else addNotification(result.error || 'Failed to resend invitation.', 'error');
        } catch (error) {
          addNotification('An unexpected error occurred.', 'error');
        }
      }
    });
  };

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedAdmins(admins.map(a => a.id));
    else setSelectedAdmins([]);
  };

  const handleSelectOne = (id, checked) => {
    if (checked) setSelectedAdmins(prev => [...prev, id]);
    else setSelectedAdmins(prev => prev.filter(adminId => adminId !== id));
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Bulk Delete Admins',
      message: `Are you sure you want to delete ${selectedAdmins.length} admins? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete Admins',
      onConfirm: async () => {
        try {
          const res = await apiService.bulkAdminAction({ action: 'delete', admin_ids: selectedAdmins });
          if (res.success) {
            setSelectedAdmins([]);
            fetchData();
          } else addNotification(res.error, 'error');
        } catch (err) { console.error(err); }
      }
    });
  };

  const handleBulkAssignSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiService.bulkAdminAction({ action: 'assign_society', admin_ids: selectedAdmins, society_id: bulkAssignSocietyId });
      if (res.success) {
        setShowBulkAssignModal(false);
        setSelectedAdmins([]);
        fetchData();
      } else addNotification(res.error, 'error');
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  return (
    <SuperadminLayout title="Admin Users">
      <div className="table-controls" style={{ marginBottom: '1.5rem', background: 'transparent', padding: 0 }}>
        <div className="search-bar" style={{ maxWidth: '400px' }}>
          <Search size={18} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {selectedAdmins.length > 0 && (
            <>
              <button className="admin-btn-secondary" onClick={() => setShowBulkAssignModal(true)}>
                <CheckSquare size={18} /> Assign Society
              </button>
              <button className="admin-btn-danger" onClick={handleBulkDelete}>
                <Trash2 size={18} /> Delete Selected
              </button>
            </>
          )}
          <button className="admin-btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={18} />
            Create New Admin
          </button>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedAdmins.length === admins.length && admins.length > 0}
                  />
                </th>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Assigned Society</th>
                <th>Joined At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>No admins found.</td></tr>
              ) : admins.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectOne(user.id, e.target.checked)}
                      checked={selectedAdmins.includes(user.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}>
                        {user.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)' }}>
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="var(--admin-primary)" />
                      <span style={{ fontWeight: 500 }}>{user.role}</span>
                    </div>
                  </td>
                  <td>{user.society?.name || 'Unassigned'}</td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleResendInvitation(user)}
                        className="admin-btn-secondary"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--admin-primary)', borderColor: 'var(--admin-primary-light)' }}
                        title={user.invitation_status === 'sent' ? "Resend Invitation" : "Send Invitation"}
                      >
                        <Mail size={14} style={{ marginRight: '4px' }} />
                        {user.invitation_status === 'sent' ? 'Resend' : 'Invite'}
                      </button>
                      <button
                        onClick={() => { setEditingAdmin(user); setShowEditModal(true); }}
                        className="admin-btn-secondary"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        title="Edit Admin"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(user.id)}
                        className="admin-btn-danger"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        title="Delete Admin"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="admin-btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="admin-btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Admin</h3>
              <button onClick={() => setShowEditModal(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateAdmin}>
              <div className="modal-body">
                {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--admin-error-light)', border: '1px solid var(--admin-error)', borderRadius: '8px', color: 'var(--admin-error)', fontSize: '0.875rem' }}>{error}</div>}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Full Name</label>
                  <input type="text" className="admin-input" value={editingAdmin.name} onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Email Address</label>
                  <input type="email" className="admin-input" value={editingAdmin.email} onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">New Password (leave blank to keep current)</label>
                  <input type="password" className="admin-input" value={editingAdmin.password || ''} onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })} placeholder="******" />
                </div>
                <div>
                  <label className="info-label">Assign Society</label>
                  <select className="admin-select" value={editingAdmin.society_id} onChange={(e) => setEditingAdmin({ ...editingAdmin, society_id: e.target.value })}>
                    <option value="">Select a society</option>
                    {societies.map(soc => <option key={soc.id} value={soc.id}>{soc.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowEditModal(false)} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="admin-btn-primary">{isSubmitting ? 'Updating...' : 'Update Admin'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Admin</h3>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div className="modal-body">
                {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--admin-error-light)', border: '1px solid var(--admin-error)', borderRadius: '8px', color: 'var(--admin-error)', fontSize: '0.875rem' }}>{error}</div>}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Full Name</label>
                  <input type="text" required className="admin-input" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="e.g. John Doe" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Email Address</label>
                  <input type="email" required className="admin-input" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="e.g. john@example.com" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Password</label>
                  <input type="password" required className="admin-input" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="******" />
                </div>
                <div>
                  <label className="info-label">Assign Society</label>
                  <select required className="admin-select" value={newAdmin.society_id} onChange={(e) => setNewAdmin({ ...newAdmin, society_id: e.target.value })}>
                    <option value="">Select a society</option>
                    {societies.map(soc => <option key={soc.id} value={soc.id}>{soc.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="admin-btn-primary">{isSubmitting ? 'Creating...' : 'Create Admin'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {showBulkAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assign Society to {selectedAdmins.length} Admins</h3>
              <button onClick={() => setShowBulkAssignModal(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleBulkAssignSubmit}>
              <div className="modal-body">
                <div>
                  <label className="info-label">Select Society</label>
                  <select required className="admin-select" value={bulkAssignSocietyId} onChange={(e) => setBulkAssignSocietyId(e.target.value)}>
                    <option value="">Select a society</option>
                    {societies.map(soc => <option key={soc.id} value={soc.id}>{soc.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowBulkAssignModal(false)} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="admin-btn-primary">{isSubmitting ? 'Assigning...' : 'Assign Society'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Modal */}
      {confirmDialog.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>{confirmDialog.title}</h3>
              <button onClick={closeConfirmDialog} className="close-btn"><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--admin-text)' }}>{confirmDialog.message}</p>
            </div>
            <div className="modal-footer" style={{ gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
              <button type="button" onClick={closeConfirmDialog} className="admin-btn-secondary">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  closeConfirmDialog();
                }}
                className={confirmDialog.type === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary'}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperadminLayout>
  );
}
