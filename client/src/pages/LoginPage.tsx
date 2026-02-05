import { FaGoogle, FaDiscord } from 'react-icons/fa';
import { GiDragonHead } from 'react-icons/gi';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-bg-pattern" />

      <div className="login-card">
        <div className="login-header">
          <GiDragonHead className="login-logo" />
          <h1>Dragon Nest</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="login-divider">
          <span>Sign in to continue</span>
        </div>

        <div className="login-buttons">
          <a href="/auth/google" className="login-btn login-btn-google">
            <FaGoogle />
            <span>Continue with Google</span>
          </a>

          <a href="/auth/discord" className="login-btn login-btn-discord">
            <FaDiscord />
            <span>Continue with Discord</span>
          </a>
        </div>

        <p className="login-footer">
          Authorized administrators only. Access is logged.
        </p>
      </div>
    </div>
  );
}
