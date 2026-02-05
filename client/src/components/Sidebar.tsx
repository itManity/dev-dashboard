import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdSword,
  MdTimeline,
  MdSettings,
} from 'react-icons/md';
import { GiDragonHead, GiSwordman } from 'react-icons/gi';
import { FiUsers, FiActivity, FiSettings, FiGrid } from 'react-icons/fi';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: <FiGrid />, label: 'Dashboard', end: true },
  { to: '/accounts', icon: <FiUsers />, label: 'Accounts' },
  { to: '/characters', icon: <GiSwordman />, label: 'Characters' },
  { to: '/logs', icon: <FiActivity />, label: 'Game Logs' },
  { to: '/settings', icon: <FiSettings />, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <GiDragonHead className="sidebar-logo" />
        <div>
          <h1 className="sidebar-title">Dragon Nest</h1>
          <span className="sidebar-subtitle">Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-server-status">
          <div className="status-dot status-dot-online" />
          <span>Server Online</span>
        </div>
      </div>
    </aside>
  );
}
