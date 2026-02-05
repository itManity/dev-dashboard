import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaDiscord } from 'react-icons/fa';
import { FiDatabase, FiServer, FiShield, FiUser } from 'react-icons/fi';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Dashboard configuration and server information</p>
      </div>

      {/* Profile */}
      <div className="card settings-section">
        <h3 className="settings-section-title">
          <FiUser /> Profile
        </h3>
        <div className="settings-grid">
          <div className="settings-item">
            <span className="settings-label">Display Name</span>
            <span className="settings-value">{user?.displayName}</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Email</span>
            <span className="settings-value">{user?.email}</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Auth Provider</span>
            <span className="settings-value flex items-center gap-1">
              {user?.provider === 'google' ? <FaGoogle /> : <FaDiscord />}
              {user?.provider}
            </span>
          </div>
        </div>
      </div>

      {/* Database Config */}
      <div className="card settings-section">
        <h3 className="settings-section-title">
          <FiDatabase /> Database Connection
        </h3>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
          Configure database connection in the <code>.env</code> file on the server.
        </p>
        <div className="settings-grid">
          <div className="settings-item">
            <span className="settings-label">Membership DB</span>
            <span className="settings-value"><code>DNMembership</code></span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Game World DB</span>
            <span className="settings-value"><code>DNWorld</code></span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Driver</span>
            <span className="settings-value">Microsoft SQL Server (mssql)</span>
          </div>
        </div>
      </div>

      {/* Auth Config */}
      <div className="card settings-section">
        <h3 className="settings-section-title">
          <FiShield /> Authentication
        </h3>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
          OAuth providers are configured in the <code>.env</code> file. Only whitelisted admins can access this dashboard.
        </p>
        <div className="settings-grid">
          <div className="settings-item">
            <span className="settings-label">Google OAuth</span>
            <span className="settings-value badge badge-online">Configured</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Discord OAuth</span>
            <span className="settings-value badge badge-online">Configured</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Admin Whitelist</span>
            <span className="settings-value">Via <code>ALLOWED_ADMINS</code> env var</span>
          </div>
        </div>
      </div>

      {/* Server Info */}
      <div className="card settings-section">
        <h3 className="settings-section-title">
          <FiServer /> Server Info
        </h3>
        <div className="settings-grid">
          <div className="settings-item">
            <span className="settings-label">Dashboard Version</span>
            <span className="settings-value">1.0.0</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">API Port</span>
            <span className="settings-value">4000</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">Client Port</span>
            <span className="settings-value">3000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
