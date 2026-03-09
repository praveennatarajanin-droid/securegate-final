import React, { useState } from 'react';
import { Download, CloudDownload, Calendar, BarChart2, CheckCircle, FileText } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';

export default function Reports() {
    const { addNotification } = useNotification();
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportType, setReportType] = useState('daily-visitors');

    const handleExport = (format) => {
        addNotification(`Generating ${reportType} report in ${format.toUpperCase()}...`, 'loading', 2000);

        setTimeout(() => {
            if (format === 'csv') {
                const headers = "Name,Phone,Flat,Status,Time\n";
                const rows = "Rahul Sharma,+91 98765 43210,A-101,Approved,10:30 AM\nPriya Singh,+91 87654 32109,B-205,Waiting,11:15 AM";
                const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `securegate_${reportType}_${startDate}.csv`;
                a.click();
            } else {
                addNotification('Report opened in new tab for printing', 'info', 3000);
                const docTemplate = `<html><body style="font-family: Arial; padding: 2rem;"><h1>SecureGate Report - ${reportType}</h1><p>Period: ${startDate} to ${endDate}</p></body></html>`;
                const blob = new Blob([docTemplate], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            }
            addNotification('Report exported successfully!', 'success');
        }, 2000);
    };

    return (
        <AdminLayout>
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h1 className="panel-title">System Analysis & Reports</h1>
                        <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Generate and export deep-dive insights.</p>
                    </div>
                </div>

                <div className="panel-body" style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="report-config-card" style={{ background: 'var(--admin-surface-hover)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div className="stat-icon blue" style={{ width: '40px', height: '40px' }}><Calendar size={20} /></div>
                                <h3 style={{ margin: 0 }}>Report Parameters</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label className="input-label">Report Type</label>
                                    <select className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={reportType} onChange={e => setReportType(e.target.value)}>
                                        <option value="daily-visitors">Daily Visitor Traffic</option>
                                        <option value="resident-activity">Resident Entry/Exit Habits</option>
                                        <option value="security-incidents">Security Incident Log</option>
                                        <option value="guard-performance">Guard Performance Metrics</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="input-label">Start Date</label>
                                        <input type="date" className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="input-label">End Date</label>
                                        <input type="date" className="input-field" style={{ border: '1px solid var(--admin-border)' }} value={endDate} onChange={e => setEndDate(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="export-options-card" style={{ background: 'var(--admin-surface-hover)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Export Format</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button className="panel" style={{ padding: '1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', border: '1px solid var(--admin-border)' }} onClick={() => handleExport('pdf')}>
                                    <FileText size={32} color="var(--admin-error)" style={{ marginBottom: '0.75rem' }} />
                                    <div style={{ fontWeight: 600 }}>PDF Report</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Professional Layout</div>
                                </button>
                                <button className="panel" style={{ padding: '1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', border: '1px solid var(--admin-border)' }} onClick={() => handleExport('csv')}>
                                    <BarChart2 size={32} color="var(--admin-success)" style={{ marginBottom: '0.75rem' }} />
                                    <div style={{ fontWeight: 600 }}>CSV / Excel</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Raw Audit Data</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
