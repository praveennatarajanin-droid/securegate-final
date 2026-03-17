import React, { useState } from 'react';
import { Search, Download, Filter, ClipboardList } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';

export default function EntryLogs() {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState([]);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const society_id = user.society_id;

        const fetchLogs = async () => {
            try {
                const data = await apiService.getAllVisitors(society_id ? { society_id } : {});
                if (data.success) {
                    setLogs(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch logs:', err);
            }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleExport = () => {
        addNotification('Generating Comprehensive CSV Export...', 'loading', 2000);
        
        const headers = ["Visitor", "Phone", "Flat", "Purpose", "Entry Time", "Exit Time", "Status", "Guard"];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => [
                `"${log.name}"`,
                `"${log.phone}"`,
                `"${log.flat}"`,
                `"${log.purpose}"`,
                `"${log.timestamp}"`,
                `"${log.exit_time || '-'}"`,
                `"${log.status}"`,
                `"${log.guard || 'Ram Singh'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SecureGate_AuditLogs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        setTimeout(() => addNotification('Audit logs exported successfully', 'success'), 2000);
    };

    const downloadPhoto = async (photo, name) => {
        try {
            // Fetch image as blob so cross-origin download works in all browsers
            const response = await fetch(photo);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `Visitor_${name.replace(/\s+/g, '_')}_${new Date().getTime()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch (err) {
            console.error('Photo download failed:', err);
            addNotification('Failed to download photo. Try opening it directly.', 'error');
        }
    };

    const filteredLogs = logs.filter(log =>
        log.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.flat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.guard || 'Ram Singh').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">Gate Entry Audit Logs</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Detailed history of all entry and exit events.</p>
                    </div>
                    <button className="btn-secondary" onClick={handleExport}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="search-bar" style={{ maxWidth: '400px', border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by visitor, flat or duty guard..."
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
                                <th>Photo</th>
                                <th>Visitor</th>
                                <th>Flat Number</th>
                                <th>Entry Time</th>
                                <th>Exit Time</th>
                                <th>Status</th>
                                <th>Duty Guard</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        {log.visitor_photo ? (
                                            <div className="visitor-photo-wrapper" style={{ position: 'relative', width: '40px', height: '40px' }}>
                                                <img 
                                                    src={log.visitor_photo} 
                                                    alt="Visitor" 
                                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer', border: '1px solid var(--admin-border)' }}
                                                    onClick={() => setPreviewPhoto(log)}
                                                />
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downloadPhoto(log.visitor_photo, log.name);
                                                    }}
                                                    style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#FF5C2A', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                    title="Download Photo"
                                                >
                                                    <Download size={10} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--admin-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>-</div>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{log.name}</td>
                                    <td><span className="flat-badge">{log.flat}</span></td>
                                    <td style={{ fontSize: '0.875rem' }}>{log.timestamp}</td>
                                    <td style={{ fontSize: '0.875rem' }}>
                                        {log.exit_time ? (
                                            <span style={{ color: '#10b981', fontWeight: 600 }}>{log.exit_time}</span>
                                        ) : log.status === 'approved' ? (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        const res = await apiService.recordExit(log.id);
                                                        if (res.success) {
                                                            addNotification('Exit recorded successfully', 'success');
                                                            // Refresh logs
                                                            const data = await apiService.getAllVisitors();
                                                            if (data.success) setLogs(data.data);
                                                        }
                                                    } catch (err) {
                                                        addNotification('Failed to record exit', 'error');
                                                    }
                                                }}
                                                className="btn-secondary" 
                                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: '#FF5C2A' }}
                                            >
                                                Record Exit
                                            </button>
                                        ) : (
                                            <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            {log.status === 'approved' ? 'Allowed' : log.status === 'denied' ? 'Rejected' : log.status === 'exited' ? 'Exited' : 'Pending'}
                                            {log.status === 'denied' && log.reason && (
                                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>
                                                    {log.reason}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>{log.guard || 'Ram Singh'}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Photo Preview Modal */}
            {previewPhoto && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div style={{ background: 'var(--admin-surface)', borderRadius: '16px', overflow: 'hidden', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid var(--admin-border)' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--admin-text-main)' }}>Visitor Identification</h3>
                            <button onClick={() => setPreviewPhoto(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>&times;</button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <img src={previewPhoto.visitor_photo} alt="Visitor" style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--admin-text-main)' }}>{previewPhoto.name}</div>
                                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>{previewPhoto.flat} • {previewPhoto.timestamp}</div>
                                </div>
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => downloadPhoto(previewPhoto.visitor_photo, previewPhoto.name)}
                                    style={{ background: '#FF5C2A', color: 'white', border: 'none' }}
                                >
                                    <Download size={18} /> Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
