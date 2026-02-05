import { useState, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import './AccountsPage.css';

interface Account {
  AccountName: string;
  CreateDate: string;
  LastLoginDate: string;
  Cash: number;
}

interface AccountsResponse {
  data: Account[];
  total: number;
  page: number;
  limit: number;
}

// Fallback demo data
const demoAccounts: Account[] = [
  { AccountName: 'DragonSlayer99', CreateDate: '2024-01-15T10:30:00', LastLoginDate: '2024-12-01T14:22:00', Cash: 15000 },
  { AccountName: 'NestHunter', CreateDate: '2024-02-20T08:15:00', LastLoginDate: '2024-11-30T22:45:00', Cash: 8500 },
  { AccountName: 'ArcherQueen', CreateDate: '2024-03-10T16:00:00', LastLoginDate: '2024-11-29T18:30:00', Cash: 22000 },
  { AccountName: 'DarkAvenger', CreateDate: '2024-04-05T12:45:00', LastLoginDate: '2024-11-28T09:10:00', Cash: 5200 },
  { AccountName: 'HolyCleric', CreateDate: '2024-05-18T09:20:00', LastLoginDate: '2024-12-01T16:55:00', Cash: 31000 },
  { AccountName: 'SilentAssassin', CreateDate: '2024-06-22T14:10:00', LastLoginDate: '2024-11-27T20:40:00', Cash: 12800 },
  { AccountName: 'IceWitch', CreateDate: '2024-07-08T11:30:00', LastLoginDate: '2024-11-25T13:15:00', Cash: 9400 },
  { AccountName: 'SteelMachina', CreateDate: '2024-08-14T17:55:00', LastLoginDate: '2024-12-01T08:30:00', Cash: 44000 },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    fetchAccounts();
  }, [page, search]);

  async function fetchAccounts() {
    setLoading(true);
    try {
      const res = await axios.get<AccountsResponse>('/api/accounts', {
        params: { page, limit, search },
        withCredentials: true,
      });
      setAccounts(res.data.data);
      setTotal(res.data.total);
    } catch {
      setAccounts(demoAccounts);
      setTotal(demoAccounts.length);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <h1>Accounts</h1>
        <p>Manage player accounts on the Dragon Nest server</p>
      </div>

      <div className="accounts-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search accounts..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <span className="text-muted">{total.toLocaleString()} total accounts</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Created</th>
              <th>Last Login</th>
              <th>Cash</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="loading-spinner"><div className="spinner" /></div>
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p>No accounts found</p>
                  </div>
                </td>
              </tr>
            ) : (
              accounts.map(account => (
                <tr key={account.AccountName}>
                  <td>
                    <span className="account-name">{account.AccountName}</span>
                  </td>
                  <td className="text-secondary">
                    {new Date(account.CreateDate).toLocaleDateString()}
                  </td>
                  <td className="text-secondary">
                    {new Date(account.LastLoginDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge badge-accent">{account.Cash.toLocaleString()}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <FiChevronLeft />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1;
            return (
              <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>
                {p}
              </button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
