import React, { useState, useEffect } from 'react';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { Plus, Search, Filter, MoreVertical, Building2, X } from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function SuperadminSocieties() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [newSociety, setNewSociety] = useState({ 
    name: '', 
    type: 'Residential',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    unit_count: ''
  });
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

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const result = await apiService.getAllSocieties();
      if (result.success) {
        setSocieties(result.data);
      }
    } catch (error) {
      console.error('Error fetching societies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSociety = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const result = await apiService.createSociety(newSociety);
      if (result.success) {
        setShowModal(false);
        setStep(1);
        setNewSociety({ 
          name: '', 
          type: 'Residential',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          postal_code: '',
          unit_count: ''
        });
        fetchSocieties();
      } else {
        setError(result.error || 'Failed to create society.');
      }
    } catch (err) {
      console.error('Error creating society:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSociety = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Society',
      message: 'Are you sure you want to delete this society? All associated data will be lost.',
      type: 'danger',
      confirmText: 'Delete Society',
      onConfirm: async () => {
        try {
          const result = await apiService.deleteSociety(id);
          if (result.success) {
            fetchSocieties();
          }
        } catch (error) {
          console.error('Error deleting society:', error);
        }
      }
    });
  };

  const [editingSociety, setEditingSociety] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleUpdateSociety = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await apiService.updateSociety(editingSociety.id, editingSociety);
      if (result.success) {
        setShowEditModal(false);
        setEditingSociety(null);
        fetchSocieties();
      }
    } catch (error) {
      console.error('Error updating society:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <SuperadminLayout title="Manage Societies">
      <div className="table-controls" style={{ marginBottom: '1.5rem', background: 'transparent', padding: 0 }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          <div className="search-bar" style={{ maxWidth: '300px' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Filter societies..." 
            />
          </div>
          <button className="admin-btn-secondary">
            <Filter size={18} />
            Filters
          </button>
        </div>
        <button className="admin-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add New Society
        </button>
      </div>

      <div className="panel">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Society</th>
                <th>Type</th>
                <th>Location</th>
                <th>Units</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : societies.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No societies found.</td></tr>
              ) : societies.map((soc) => (
                <tr key={soc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'var(--admin-bg-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={18} color="var(--admin-primary)" />
                      </div>
                      <div style={{ fontWeight: 600 }}>{soc.name}</div>
                    </div>
                  </td>
                  <td>{soc.type}</td>
                  <td>{soc.city}</td>
                  <td>{soc.unit_count}</td>
                  <td>
                    <span className={`status-badge status-${soc.status?.toLowerCase() === 'active' ? 'approved' : 'rejected'}`}>
                      {soc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => { setEditingSociety(soc); setShowEditModal(true); }}
                        className="admin-btn-secondary"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        title="Edit Society"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteSociety(soc.id)}
                        className="admin-btn-danger"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        title="Delete Society"
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

      {showEditModal && editingSociety && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Society</h3>
              <button onClick={() => setShowEditModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSociety}>
              <div className="modal-body">
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Society Name</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    value={editingSociety.name}
                    onChange={(e) => setEditingSociety({...editingSociety, name: e.target.value})}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="info-label">Society Type</label>
                    <select 
                      className="admin-select"
                      value={editingSociety.type}
                      onChange={(e) => setEditingSociety({...editingSociety, type: e.target.value})}
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="info-label">Units</label>
                    <input 
                      type="number" 
                      className="admin-input"
                      value={editingSociety.unit_count}
                      onChange={(e) => setEditingSociety({...editingSociety, unit_count: e.target.value})}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="info-label">Email</label>
                  <input 
                    type="email" 
                    className="admin-input"
                    value={editingSociety.email}
                    onChange={(e) => setEditingSociety({...editingSociety, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="info-label">Address</label>
                  <textarea 
                    className="admin-textarea"
                    style={{ minHeight: '80px' }}
                    value={editingSociety.address}
                    onChange={(e) => setEditingSociety({...editingSociety, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowEditModal(false)} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
                  {isSubmitting ? 'Updating...' : 'Update Society'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Add New Society</h3>
                <button onClick={() => { setShowModal(false); setStep(1); }} className="close-btn">
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ height: '4px', flex: 1, borderRadius: '2px', background: step >= s ? 'var(--admin-primary)' : 'var(--admin-border)' }} />
                ))}
              </div>
            </div>

            <div className="modal-body">
              {step === 1 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Basic Information</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="info-label">Society Name *</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={newSociety.name}
                      onChange={(e) => setNewSociety({...newSociety, name: e.target.value})}
                      placeholder="e.g. Casagrand Crescendo" 
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="info-label">Society Type *</label>
                    <select 
                      className="admin-select"
                      value={newSociety.type}
                      onChange={(e) => setNewSociety({...newSociety, type: e.target.value})}
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="info-label">Number of Units/Members *</label>
                    <input 
                      type="number" 
                      className="admin-input"
                      value={newSociety.unit_count}
                      onChange={(e) => setNewSociety({...newSociety, unit_count: e.target.value})}
                      placeholder="e.g. 450" 
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Contact Information</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="info-label">Email *</label>
                    <input 
                      type="email" 
                      className="admin-input"
                      value={newSociety.email}
                      onChange={(e) => setNewSociety({...newSociety, email: e.target.value})}
                      placeholder="e.g. contact@society.com" 
                    />
                  </div>
                  <div>
                    <label className="info-label">Phone Number *</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={newSociety.phone}
                      onChange={(e) => setNewSociety({...newSociety, phone: e.target.value})}
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Location Details</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="info-label">Address *</label>
                    <textarea 
                      className="admin-textarea"
                      style={{ minHeight: '60px' }}
                      value={newSociety.address}
                      onChange={(e) => setNewSociety({...newSociety, address: e.target.value})}
                      placeholder="Full street address" 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="info-label">City *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={newSociety.city}
                        onChange={(e) => setNewSociety({...newSociety, city: e.target.value})}
                        placeholder="e.g. Chennai" 
                      />
                    </div>
                    <div>
                      <label className="info-label">State *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={newSociety.state}
                        onChange={(e) => setNewSociety({...newSociety, state: e.target.value})}
                        placeholder="e.g. Tamil Nadu" 
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="info-label">Postal Code *</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={newSociety.postal_code}
                      onChange={(e) => setNewSociety({...newSociety, postal_code: e.target.value})}
                      placeholder="e.g. 600001" 
                    />
                  </div>
                  {error && (
                    <div style={{ padding: '0.75rem', background: 'var(--admin-error-light)', border: '1px solid var(--admin-error)', borderRadius: '8px', color: 'var(--admin-error)', fontSize: '0.875rem' }}>
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              {step === 1 && (
                <>
                  <button onClick={() => setShowModal(false)} className="admin-btn-secondary">Cancel</button>
                  <button onClick={nextStep} disabled={!newSociety.name || !newSociety.unit_count} className="admin-btn-primary">Next</button>
                </>
              )}
              {step === 2 && (
                <>
                  <button onClick={prevStep} className="admin-btn-secondary">Back</button>
                  <button onClick={nextStep} disabled={!newSociety.email || !newSociety.phone} className="admin-btn-primary">Next</button>
                </>
              )}
              {step === 3 && (
                <>
                  <button onClick={prevStep} className="admin-btn-secondary">Back</button>
                  <button 
                    onClick={handleCreateSociety} 
                    disabled={isSubmitting || !newSociety.address || !newSociety.city || !newSociety.state || !newSociety.postal_code} 
                    className="admin-btn-primary"
                  >
                    {isSubmitting ? <span className="animate-spin">⌛</span> : null}
                    {isSubmitting ? 'Creating...' : 'Create Society'}
                  </button>
                </>
              )}
            </div>
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
