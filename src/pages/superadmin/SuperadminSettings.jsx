import React, { useState, useEffect } from 'react';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { Settings, Shield, Bell, Eye, EyeOff, Save, Key, Mail } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useNotification } from '../../components/NotificationProvider';

export default function SuperadminSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const [settings, setSettings] = useState({
    mail_mailer: 'log',
    mail_host: '',
    mail_port: '2525',
    mail_username: '',
    mail_password: '',
    mail_encryption: 'tls',
    mail_from_address: 'hello@securegate.com',
    mail_from_name: 'SecureGate'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const result = await apiService.getSettings();
      if (result.success) {
        setSettings(prev => ({ ...prev, ...result.data }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await apiService.updateSettings(settings);
      if (result.success) {
        addNotification('Settings saved successfully!', 'success');
      } else {
        addNotification(result.error || 'Failed to save settings.', 'error');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      addNotification(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SuperadminLayout title="System Settings">
      <div style={{ maxWidth: '800px' }}>
        <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
            <div style={{ padding: '8px', background: 'var(--admin-bg-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="var(--admin-primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Superadmin Profile</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Manage your global administrative credentials</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="info-label">Full Name</label>
              <input 
                type="text" 
                defaultValue="Master Admin"
                className="admin-input"
              />
            </div>
            <div>
              <label className="info-label">Email Address</label>
              <input 
                type="email" 
                defaultValue="super@securegate.com"
                disabled
                className="admin-input"
                style={{ background: 'var(--admin-bg-alt)', color: 'var(--admin-text-muted)' }}
              />
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
            <div style={{ padding: '8px', background: 'var(--admin-bg-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={20} color="var(--admin-primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Security & Password</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Change your password and security keys</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="info-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter current password"
                  className="admin-input"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="info-label">New Password</label>
                <input 
                  type="password" 
                  placeholder="Min 8 characters"
                  className="admin-input"
                />
              </div>
              <div>
                <label className="info-label">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Repeat new password"
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
            <div style={{ padding: '8px', background: 'var(--admin-bg-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} color="var(--admin-primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Mail Server (SMTP) Configuration</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Configure how the system sends invitation and alert emails</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="info-label">Mail Driver</label>
              <select 
                className="admin-select"
                value={settings.mail_mailer}
                onChange={(e) => handleSettingChange('mail_mailer', e.target.value)}
              >
                <option value="log">Log (Local Development)</option>
                <option value="smtp">SMTP (Production)</option>
              </select>
            </div>
            {settings.mail_mailer === 'smtp' && (
              <div>
                <label className="info-label">SMTP Encryption</label>
                <select 
                  className="admin-select"
                  value={settings.mail_encryption}
                  onChange={(e) => handleSettingChange('mail_encryption', e.target.value)}
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>
            )}
          </div>

          {settings.mail_mailer === 'smtp' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="info-label">SMTP Host</label>
                <input 
                  type="text" 
                  className="admin-input"
                  placeholder="e.g. smtp.gmail.com"
                  value={settings.mail_host}
                  onChange={(e) => handleSettingChange('mail_host', e.target.value)}
                />
              </div>
              <div>
                <label className="info-label">SMTP Port</label>
                <input 
                  type="text" 
                  className="admin-input"
                  placeholder="587"
                  value={settings.mail_port}
                  onChange={(e) => handleSettingChange('mail_port', e.target.value)}
                />
              </div>
            </div>
          )}

          {settings.mail_mailer === 'smtp' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="info-label">Username</label>
                <input 
                  type="text" 
                  className="admin-input"
                  placeholder="SMTP Username"
                  value={settings.mail_username}
                  onChange={(e) => handleSettingChange('mail_username', e.target.value)}
                />
              </div>
              <div>
                <label className="info-label">Password</label>
                <input 
                  type="password" 
                  className="admin-input"
                  placeholder="******"
                  value={settings.mail_password}
                  onChange={(e) => handleSettingChange('mail_password', e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="info-label">Sender Email Address</label>
              <input 
                type="email" 
                className="admin-input"
                placeholder="hello@securegate.com"
                value={settings.mail_from_address}
                onChange={(e) => handleSettingChange('mail_from_address', e.target.value)}
              />
            </div>
            <div>
              <label className="info-label">Sender Name</label>
              <input 
                type="text" 
                className="admin-input"
                placeholder="SecureGate"
                value={settings.mail_from_name}
                onChange={(e) => handleSettingChange('mail_from_name', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
            <div style={{ padding: '8px', background: 'var(--admin-bg-alt)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} color="var(--admin-primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>System Notifications</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Configure global alerts and report deliveries</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--admin-primary)' }} />
              <span style={{ fontSize: '0.95rem' }}>Email alerts for new society registrations</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--admin-primary)' }} />
              <span style={{ fontSize: '0.95rem' }}>System health status weekly reports</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--admin-primary)' }} />
              <span style={{ fontSize: '0.95rem' }}>Security breach instant SMS alerts</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="admin-btn-secondary" onClick={fetchSettings}>Reset Changes</button>
          <button className="admin-btn-primary" onClick={handleSave} disabled={isSaving}>
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </SuperadminLayout>
  );
}
