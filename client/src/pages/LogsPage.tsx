import { useState, useEffect } from 'react';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import './LogsPage.css';

interface LogEntry {
  LogID: number;
  LogType: string;
  LogMessage: string;
  CharacterName: string;
  LogDate: string;
}

const LOG_TYPES = ['All', 'Login', 'Logout', 'Trade', 'Enhancement', 'Death', 'LevelUp', 'Admin'];

const demoLogs: LogEntry[] = [
  { LogID: 1, LogType: 'Login', LogMessage: 'Player logged in from 192.168.1.10', CharacterName: 'ShadowBlade', LogDate: '2024-12-01T14:22:00' },
  { LogID: 2, LogType: 'Enhancement', LogMessage: 'Enhanced Apocalypse Dagger to +12 (Success)', CharacterName: 'ShadowBlade', LogDate: '2024-12-01T14:18:00' },
  { LogID: 3, LogType: 'Trade', LogMessage: 'Sold Dragon Jade x3 for 15,000,000 gold', CharacterName: 'HolyLight', LogDate: '2024-12-01T14:10:00' },
  { LogID: 4, LogType: 'LevelUp', LogMessage: 'Reached Level 93', CharacterName: 'FireStorm', LogDate: '2024-12-01T13:55:00' },
  { LogID: 5, LogType: 'Death', LogMessage: 'Died at Green Dragon Nest (Stage 4)', CharacterName: 'SwiftArrow', LogDate: '2024-12-01T13:42:00' },
  { LogID: 6, LogType: 'Login', LogMessage: 'Player logged in from 10.0.0.5', CharacterName: 'IronShield', LogDate: '2024-12-01T13:30:00' },
  { LogID: 7, LogType: 'Logout', LogMessage: 'Player logged out (played 2h 15m)', CharacterName: 'DarkPaladin', LogDate: '2024-12-01T13:15:00' },
  { LogID: 8, LogType: 'Admin', LogMessage: 'Admin banned account SuspiciousBot for botting', CharacterName: 'SYSTEM', LogDate: '2024-12-01T12:00:00' },
  { LogID: 9, LogType: 'Enhancement', LogMessage: 'Enhanced Shadow Walker Armor to +10 (Failed → Restored)', CharacterName: 'ShadowBlade', LogDate: '2024-12-01T11:45:00' },
  { LogID: 10, LogType: 'Trade', LogMessage: 'Purchased Goddess Lustrous Ring for 80,000,000 gold', CharacterName: 'IronShield', LogDate: '2024-12-01T11:20:00' },
];

const LOG_TYPE_COLORS: Record<string, string> = {
  Login: 'badge-online',
  Logout: 'badge-offline',
  Trade: 'badge-accent',
  Enhancement: 'badge-enhancement',
  Death: 'badge-death',
  LevelUp: 'badge-levelup',
  Admin: 'badge-admin',
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const limit = 50;

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (filter !== 'All') params.type = filter;
      const res = await axios.get('/api/logs', { params, withCredentials: true });
      setLogs(res.data.data);
    } catch {
      const filtered = filter === 'All' ? demoLogs : demoLogs.filter(l => l.LogType === filter);
      setLogs(filtered);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Game Logs</h1>
        <p>Server activity and event logs</p>
      </div>

      <div className="logs-toolbar">
        <div className="log-filters">
          <FiFilter className="text-muted" />
          {LOG_TYPES.map(type => (
            <button
              key={type}
              className={`btn log-filter-btn ${filter === type ? 'log-filter-active' : ''}`}
              onClick={() => { setFilter(type); setPage(1); }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Character</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="loading-spinner"><div className="spinner" /></div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state"><p>No logs found</p></div>
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.LogID}>
                  <td className="log-time">
                    {new Date(log.LogDate).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${LOG_TYPE_COLORS[log.LogType] || 'badge-accent'}`}>
                      {log.LogType}
                    </span>
                  </td>
                  <td className="account-name">{log.CharacterName}</td>
                  <td className="text-secondary log-message">{log.LogMessage}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          <FiChevronLeft />
        </button>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={logs.length < limit}>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
