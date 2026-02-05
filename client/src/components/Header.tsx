import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { FaGoogle, FaDiscord } from 'react-icons/fa';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        {/* Breadcrumb / context area - can be expanded later */}
      </div>

      <div className="header-right">
        {user && (
          <div className="header-user">
            <div className="header-user-info">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="header-avatar" />
              ) : (
                <div className="header-avatar header-avatar-placeholder">
                  <FiUser />
                </div>
              )}
              <div className="header-user-details">
                <span className="header-user-name">{user.displayName}</span>
                <span className="header-user-provider">
                  {user.provider === 'google' ? <FaGoogle /> : <FaDiscord />}
                  {user.email}
                </span>
              </div>
            </div>

            <button className="btn header-logout" onClick={logout} title="Logout">
              <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
