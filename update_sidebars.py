import os
import re

files = [
    'Dashboard.jsx', 'VisitorLogs.jsx', 'SecurityAlerts.jsx',
    'ResidentDirectory.jsx', 'SecurityGuards.jsx', 'EntryLogs.jsx', 'Reports.jsx'
]

sidebar_replacement = """<nav className="sidebar-menu">
                    <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`} title="Dashboard">
                        <LayoutDashboard size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Dashboard</span>}
                    </Link>
                    <Link to="/visitor-logs" className={`menu-item ${location.pathname === '/visitor-logs' ? 'active' : ''}`} title="Visitor Logs">
                        <FileText size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Visitor Logs</span>}
                    </Link>
                    <Link to="/alerts" className={`menu-item ${location.pathname === '/alerts' ? 'active' : ''}`} title="Security Alerts">
                        <ShieldAlert size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Security Alerts</span>}
                    </Link>
                    <Link to="/directory" className={`menu-item ${location.pathname === '/directory' ? 'active' : ''}`} title="Residents">
                        <Users size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Residents</span>}
                    </Link>
                    <Link to="/directory" state={{ openAdd: true }} className="menu-item" title="Add Resident">
                        <User size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Add Resident</span>}
                    </Link>
                    <Link to="/guards" className={`menu-item ${location.pathname === '/guards' ? 'active' : ''}`} title="Security Guards">
                        <ShieldCheck size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Security Guards</span>}
                    </Link>
                    <Link to="/entry-logs" className={`menu-item ${location.pathname === '/entry-logs' ? 'active' : ''}`} title="Entry Logs">
                        <Clock size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Entry Logs</span>}
                    </Link>
                    <Link to="/reports" className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`} title="Reports">
                        <FileText size={20} className="icon" />
                        {!isSidebarCollapsed && <span>Reports</span>}
                    </Link>
                    <Link to="/settings" className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`} title="System Settings" style={{ marginTop: 'auto' }}>
                        <Settings size={20} className="icon" />
                        {!isSidebarCollapsed && <span>System Settings</span>}
                    </Link>
                    <button onClick={() => { if(window.confirm('Are you sure you want to log out?')) window.location.href = '/admin-login'; }} className="menu-item" title="Logout" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', outline: 'none', color: 'var(--admin-error)' }}>
                        <LogOut size={20} className="icon" color="var(--admin-error)" />
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </button>
                </nav>"""

for filename in files:
    path = os.path.join('d:/projects/securegate-project/src/pages', filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        content = re.sub(r'<nav className="sidebar-menu">.*?</nav>', sidebar_replacement, content, flags=re.DOTALL)
        
        if 'LogOut' not in content:
            content = re.sub(r'(\}\s*from\s*[\'"]lucide-react[\'"])', r', LogOut \1', content)
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filename}')
