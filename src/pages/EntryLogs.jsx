import React, { useState } from 'react';
import { Search, Download, Filter, ClipboardList } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';

const entryLogData = [
    { id: 1, visitor: "Rahul Sharma", flat: "A-101", entry: "2023-10-25 10:30 AM", exit: "2023-10-25 10:45 AM", approvedBy: "Ramesh Kumar", guard: "Ram Singh" },
    { id: 2, visitor: "Priya Singh", flat: "B-205", entry: "2023-10-25 11:15 AM", exit: "-", approvedBy: "Sneha Reddy", guard: "Ram Singh" },
    { id: 3, visitor: "Suresh Patel", flat: "C-302", entry: "2023-10-25 09:45 AM", exit: "-", approvedBy: "Auto-Rejected", guard: "Abdul Khan" },
    { id: 4, visitor: "Sneha Reddy", flat: "A-404", entry: "2023-10-25 08:00 AM", exit: "2023-10-25 11:30 AM", approvedBy: "Vikram Singh", guard: "Abdul Khan" },
];

export default function EntryLogs() {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');

    const handleExport = () => {
        addNotification('Preparing audit logs export...', 'loading', 2000);
        setTimeout(() => addNotification('Audit logs exported successfully', 'success'), 2000);
    };

    const filteredLogs = entryLogData.filter(log =>
        log.visitor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.flat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.guard.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <div className="search-bar" style={{ maxWidth: '400px', border: '1px solid var(--admin-border)' }}>
                        <Search size={18} color="var(--admin-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by visitor, flat or duty guard..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Visitor</th>
                                <th>Flat Number</th>
                                <th>Entry Time</th>
                                <th>Exit Time</th>
                                <th>Approved By</th>
                                <th>Duty Guard</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ fontWeight: 600 }}>{log.visitor}</td>
                                    <td><span className="flat-badge">{log.flat}</span></td>
                                    <td style={{ fontSize: '0.875rem' }}>{log.entry}</td>
                                    <td style={{ fontSize: '0.875rem', color: log.exit === '-' ? 'var(--admin-warning)' : 'inherit' }}>
                                        {log.exit}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}>{log.approvedBy}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>{log.guard}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
