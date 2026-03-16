import React from 'react';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { Building2, Users, ShieldAlert, TrendingUp, MoreVertical } from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function SuperadminDashboard() {
  const [societies, setSocieties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await apiService.getAllSocieties();
      if (result.success) {
        setSocieties(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Societies', value: societies.length, icon: Building2, change: 'Total', trend: 'up', iconColor: 'purple' },
    { label: 'Active Residents', value: societies.reduce((acc, s) => acc + (s.unit_count || 0), 0), icon: Users, change: 'Estimate', trend: 'up', iconColor: 'green' },
    { label: 'System Status', value: 'Online', icon: ShieldAlert, change: 'Stable', trend: 'up', iconColor: 'orange' },
    { label: 'Cloud Status', value: 'Healthy', icon: TrendingUp, change: 'Active', trend: 'up', iconColor: 'red' },
  ];

  return (
    <SuperadminLayout>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-header">
              <div className={`stat-icon ${stat.iconColor || 'orange'}`}>
                <stat.icon size={20} />
              </div>
              <div className="stat-trend up">{stat.change}</div>
            </div>
            <div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: '1.5rem' }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Recent Societies</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', margin: 0 }}>Manage and monitor building-level systems</p>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Society Name</th>
                <th>Location</th>
                <th>Units</th>
                <th>Type</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : societies.map((soc) => (
                <tr key={soc.id}>
                  <td style={{ fontWeight: 600 }}>{soc.name}</td>
                  <td>{soc.city}, {soc.state}</td>
                  <td>{soc.unit_count}</td>
                  <td>{soc.type}</td>
                  <td>
                    <span className={`status-badge status-${soc.status?.toLowerCase() === 'active' ? 'approved' : 'rejected'}`}>
                      {soc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperadminLayout>
  );
}
