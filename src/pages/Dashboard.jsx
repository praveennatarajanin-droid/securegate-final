import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend, Filler, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, Clock, CheckCircle, XCircle, Home, ShieldAlert, Zap, CheckSquare, Download, User } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useNotification } from '../components/NotificationProvider';
import { apiService } from '../services/apiService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend, Filler);

export default function Dashboard() {
    const { addNotification } = useNotification();
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const [stats, setStats] = useState({ total: 0, waiting: 0, approved: 0, rejected: 0 });

    React.useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const data = await apiService.getAllVisitors();
                if (data.success) {
                    setVisitors(data.data);

                    // Calculate stats
                    const statsObj = data.data.reduce((acc, v) => {
                        acc.total++;
                        if (v.status === 'waiting') acc.waiting++;
                        else if (v.status === 'approved') acc.approved++;
                        else if (v.status === 'denied') acc.rejected++;
                        return acc;
                    }, { total: 0, waiting: 0, approved: 0, rejected: 0 });
                    setStats(statsObj);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            }
        };

        fetchVisitors();
        const interval = setInterval(fetchVisitors, 5000); // Polling for live updates
        return () => clearInterval(interval);
    }, []);

    const trendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Visitors',
            data: [65, 59, 80, 81, 56, 120, 140],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
        }]
    };

    const hourlyData = {
        labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
        datasets: [{ label: 'Activity', data: [35, 60, 45, 20, 50, 80, 30], backgroundColor: '#10b981', borderRadius: 4 }]
    };

    const blockData = {
        labels: ['Block A', 'Block B', 'Block C', 'Block D'],
        datasets: [{ data: [40, 25, 20, 15], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'], borderWidth: 0 }]
    };

    const handleExport = () => {
        addNotification('Generating Dashboard Report...', 'loading', 2000);
        setTimeout(() => addNotification('Report exported successfully!', 'success'), 2000);
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0' }}>Overview Dashboard</h1>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Monitor your real-time security operations.</p>
                </div>
                <button className="btn-secondary" onClick={handleExport}>
                    <Download size={16} /> Export Data
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div><div className="stat-title">Total Visitors Today</div><div className="stat-value">{stats.total}</div></div>
                        <div className="stat-icon blue"><Users size={24} /></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div><div className="stat-title">Waiting Approval</div><div className="stat-value">{stats.waiting}</div></div>
                        <div className="stat-icon orange"><Clock size={24} /></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div><div className="stat-title">Approved Entry</div><div className="stat-value">{stats.approved}</div></div>
                        <div className="stat-icon green"><CheckCircle size={24} /></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div><div className="stat-title">Rejected / Denied</div><div className="stat-value">{stats.rejected}</div></div>
                        <div className="stat-icon red"><XCircle size={24} /></div>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                <div className="panel">
                    <div className="panel-header"><span className="panel-title">Weekly Trends</span></div>
                    <div className="panel-body" style={{ minHeight: '250px' }}><Line data={trendData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                </div>
                <div className="panel">
                    <div className="panel-header"><span className="panel-title">Block Traffic</span></div>
                    <div className="panel-body" style={{ minHeight: '250px' }}><Doughnut data={blockData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                </div>
            </div>

            <div className="panel" style={{ marginTop: '1.5rem' }}>
                <div className="panel-header"><span className="panel-title">Live Visitor Status</span></div>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr><th>Visitor</th><th>Flat</th><th>Purpose</th><th>Status</th><th>Time</th></tr>
                        </thead>
                        <tbody>
                            {visitors.map(v => (
                                <tr key={v.id} onClick={() => setSelectedVisitor(v)}>
                                    <td>{v.name}</td>
                                    <td>{v.flat}</td>
                                    <td>{v.purpose}</td>
                                    <td><span className={`status-badge status-${v.status === 'denied' ? 'rejected' : v.status.toLowerCase()}`}>{v.status}</span></td>
                                    <td>{v.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
