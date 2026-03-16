import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Activity, FileText } from 'lucide-react';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { apiService } from '../../services/apiService';

export default function SuperadminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, actionFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAdminAuditLogs({ 
        page: currentPage, 
        limit, 
        search: searchQuery,
        action: actionFilter 
      });
      
      if (response.success) {
        setLogs(response.data);
        setTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    // Basic CSV generation for current view
    if (logs.length === 0) return;
    const headers = ['Date', 'Action', 'Description', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        `"${new Date(log.created_at).toLocaleString()}"`,
        `"${log.action}"`,
        `"${log.description.replace(/"/g, '""')}"`,
        `"${log.ip_address || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getActionColor = (action) => {
    if (action.includes('Delete') || action.includes('Removed')) return 'var(--admin-danger)';
    if (action.includes('Create') || action.includes('Added')) return 'var(--admin-success, #10b981)';
    if (action.includes('Update') || action.includes('Assign')) return 'var(--admin-primary)';
    return 'var(--admin-text)';
  };

  return (
    <SuperadminLayout title="Audit Logs">
      <div className="table-controls" style={{ marginBottom: '1.5rem', background: 'transparent', padding: 0 }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          <div className="search-bar" style={{ maxWidth: '400px', flex: 1 }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder="Search descriptions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="search-bar" style={{ maxWidth: '250px', position: 'relative' }}>
            <Filter size={18} color="var(--admin-text-muted)" />
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--admin-text)',
                paddingLeft: '0.5rem',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Actions</option>
              <option value="Admin Created">Admin Created</option>
              <option value="Admin Updated">Admin Updated</option>
              <option value="Admin Deleted">Admin Deleted</option>
              <option value="Bulk Delete">Bulk Delete</option>
              <option value="Bulk Assign">Bulk Assign</option>
              <option value="Society Created">Society Created</option>
              <option value="Society Deleted">Society Deleted</option>
            </select>
          </div>
        </div>

        <div>
          <button className="admin-btn-secondary" onClick={downloadCSV}>
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-muted)' }}>
                    <Activity size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-muted)' }}>
                    <FileText size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                    No audit logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                      {new Date(log.created_at).toLocaleString([], {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 600, 
                        color: getActionColor(log.action),
                        backgroundColor: `${getActionColor(log.action)}15`,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ maxWidth: '400px', lineHeight: 1.5 }}>{log.description}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--admin-text-muted)' }}>{log.ip_address || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      {!loading && totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i + 1}
                  className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </SuperadminLayout>
  );
}
