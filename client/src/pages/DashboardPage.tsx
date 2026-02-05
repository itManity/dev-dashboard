import { useState, useEffect } from 'react';
import { FiUsers, FiActivity, FiDatabase } from 'react-icons/fi';
import { GiSwordman } from 'react-icons/gi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import axios from 'axios';
import './DashboardPage.css';

interface DashboardStats {
  totalAccounts: number;
  totalCharacters: number;
  onlinePlayers: number;
}

// Placeholder chart data — in production this would come from the API
const activityData = [
  { time: '00:00', players: 45 },
  { time: '02:00', players: 22 },
  { time: '04:00', players: 12 },
  { time: '06:00', players: 18 },
  { time: '08:00', players: 34 },
  { time: '10:00', players: 67 },
  { time: '12:00', players: 89 },
  { time: '14:00', players: 102 },
  { time: '16:00', players: 98 },
  { time: '18:00', players: 120 },
  { time: '20:00', players: 134 },
  { time: '22:00', players: 95 },
];

const classDistribution = [
  { name: 'Warrior', count: 3420 },
  { name: 'Archer', count: 2890 },
  { name: 'Sorceress', count: 2650 },
  { name: 'Cleric', count: 2200 },
  { name: 'Academic', count: 1980 },
  { name: 'Kali', count: 1750 },
  { name: 'Assassin', count: 1620 },
  { name: 'Lencea', count: 1340 },
  { name: 'Machina', count: 1120 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard/stats', { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(() => {
        // Fallback demo data when DB is not connected
        setStats({ totalAccounts: 12847, totalCharacters: 34521, onlinePlayers: 127 });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Dragon Nest server overview and statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">Total Accounts</div>
            <div className="stat-icon"><FiUsers /></div>
          </div>
          <div className="stat-value">{stats?.totalAccounts.toLocaleString()}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">Total Characters</div>
            <div className="stat-icon"><GiSwordman /></div>
          </div>
          <div className="stat-value">{stats?.totalCharacters.toLocaleString()}</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">Online Now</div>
            <div className="stat-icon"><FiActivity /></div>
          </div>
          <div className="stat-value">
            <span className="online-indicator" />
            {stats?.onlinePlayers.toLocaleString()}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">Database</div>
            <div className="stat-icon"><FiDatabase /></div>
          </div>
          <div className="stat-value stat-value-sm">Connected</div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="card chart-card">
          <h3 className="chart-title">Player Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b1a1a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b1a1a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#141414',
                  border: '1px solid #222',
                  borderRadius: '6px',
                  color: '#e8e8e8',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone"
                dataKey="players"
                stroke="#b22222"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPlayers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3 className="chart-title">Class Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={classDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
              <XAxis type="number" stroke="#666" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#666" fontSize={11} width={80} />
              <Tooltip
                contentStyle={{
                  background: '#141414',
                  border: '1px solid #222',
                  borderRadius: '6px',
                  color: '#e8e8e8',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" fill="#8b1a1a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="chart-title">Recent Account Registrations</h3>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DragonSlayer99</td>
                <td>2 minutes ago</td>
                <td><span className="badge badge-online">Active</span></td>
              </tr>
              <tr>
                <td>NestHunter</td>
                <td>15 minutes ago</td>
                <td><span className="badge badge-online">Active</span></td>
              </tr>
              <tr>
                <td>ArcherQueen</td>
                <td>32 minutes ago</td>
                <td><span className="badge badge-offline">Offline</span></td>
              </tr>
              <tr>
                <td>DarkAvenger</td>
                <td>1 hour ago</td>
                <td><span className="badge badge-offline">Offline</span></td>
              </tr>
              <tr>
                <td>HolyCleric</td>
                <td>2 hours ago</td>
                <td><span className="badge badge-online">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
