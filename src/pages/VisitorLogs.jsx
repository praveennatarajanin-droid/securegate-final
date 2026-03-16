import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, MapPin } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';

export default function VisitorLogs() {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const society_id = user.society_id;

        const fetchVisitors = async () => {
            try {
                const data = await apiService.getAllVisitors(society_id ? { society_id } : {});
                if (data.success) {
                    setVisitors(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch visitor logs:', err);
                addNotification('Failed to fetch visitor logs.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchVisitors();
    }, []);

    const handleExport = () => {
        addNotification('Generating Visitor Logs CSV...', 'loading', 2500);
        
        const headers = ["Visitor", "Phone", "Flat", "Purpose", "Status", "Time", "Exit Time"];
        const csvContent = [
            headers.join(','),
            ...visitors.map(v => [
                `"${v.name}"`,
                `"${v.phone}"`,
                `"${v.flat}"`,
                `"${v.purpose}"`,
                `"${v.status}"`,
                `"${v.timestamp}"`,
                `"${v.exit_time || '-'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Visitor_Logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        setTimeout(() => addNotification('Logs exported successfully!', 'success'), 2500);
    };

    const filteredVisitors = visitors.filter(v => {
        const matchesSearch = v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             v.flat?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || v.status?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">Visitor Entry Logs</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>View and manage historical visitor data.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-secondary" onClick={handleExport}>
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                <div className="table-controls" style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="search-bar" style={{ width: '320px', border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by name, flat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: 'transparent', color: 'var(--admin-text-main)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Filter size={18} color="var(--admin-text-muted)" />
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ background: 'var(--admin-surface)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)' }}
                        >
                            <option value="All">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Checkout">Checked Out</option>
                        </select>
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Visitor Name</th>
                                <th>Phone Number</th>
                                <th>Flat Number</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Check-in Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading visitor logs...</td></tr>
                            ) : filteredVisitors.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No visitor records found.</td></tr>
                            ) : filteredVisitors.map(v => (
                                <tr key={v.id}>
                                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                                    <td>{v.phone}</td>
                                    <td><span className="flat-badge">{v.flat}</span></td>
                                    <td>{v.purpose}</td>
                                    <td><span className={`status-badge status-${v.status?.toLowerCase()}`}>{v.status}</span></td>
                                    <td style={{ color: 'var(--admin-text-muted)' }}>{v.timestamp} {v.exit_time && `(Exited: ${v.exit_time})`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
