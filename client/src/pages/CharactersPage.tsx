import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import axios from 'axios';
import './CharactersPage.css';

interface Character {
  CharacterID: number;
  CharacterName: string;
  AccountName: string;
  CharacterClass: number;
  CharacterLevel: number;
  CurHP: number;
  CurMP: number;
  Money: number;
  LoginStatus: number;
}

const CLASS_NAMES: Record<number, string> = {
  1: 'Warrior',
  2: 'Archer',
  3: 'Sorceress',
  4: 'Cleric',
  5: 'Academic',
  6: 'Kali',
  7: 'Assassin',
  8: 'Lencea',
  9: 'Machina',
  10: 'Vandar',
};

// Fallback demo data
const demoCharacters: Character[] = [
  { CharacterID: 1, CharacterName: 'ShadowBlade', AccountName: 'DragonSlayer99', CharacterClass: 7, CharacterLevel: 95, CurHP: 485000, CurMP: 120000, Money: 542000000, LoginStatus: 1 },
  { CharacterID: 2, CharacterName: 'HolyLight', AccountName: 'HolyCleric', CharacterClass: 4, CharacterLevel: 95, CurHP: 380000, CurMP: 250000, Money: 312000000, LoginStatus: 1 },
  { CharacterID: 3, CharacterName: 'FireStorm', AccountName: 'IceWitch', CharacterClass: 3, CharacterLevel: 93, CurHP: 320000, CurMP: 310000, Money: 189000000, LoginStatus: 0 },
  { CharacterID: 4, CharacterName: 'IronShield', AccountName: 'SteelMachina', CharacterClass: 9, CharacterLevel: 90, CurHP: 520000, CurMP: 95000, Money: 770000000, LoginStatus: 1 },
  { CharacterID: 5, CharacterName: 'SwiftArrow', AccountName: 'ArcherQueen', CharacterClass: 2, CharacterLevel: 88, CurHP: 290000, CurMP: 140000, Money: 455000000, LoginStatus: 0 },
  { CharacterID: 6, CharacterName: 'DarkPaladin', AccountName: 'DarkAvenger', CharacterClass: 1, CharacterLevel: 85, CurHP: 460000, CurMP: 100000, Money: 234000000, LoginStatus: 0 },
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const limit = 20;

  useEffect(() => {
    fetchCharacters();
  }, [page, search]);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const res = await axios.get('/api/characters', {
        params: { page, limit, search },
        withCredentials: true,
      });
      setCharacters(res.data.data);
      setTotal(res.data.total);
    } catch {
      setCharacters(demoCharacters);
      setTotal(demoCharacters.length);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  function formatGold(money: number): string {
    if (money >= 1_000_000_000) return `${(money / 1_000_000_000).toFixed(1)}B`;
    if (money >= 1_000_000) return `${(money / 1_000_000).toFixed(1)}M`;
    if (money >= 1_000) return `${(money / 1_000).toFixed(1)}K`;
    return money.toString();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Characters</h1>
        <p>Browse and manage player characters</p>
      </div>

      <div className="accounts-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search characters..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <span className="text-muted">{total.toLocaleString()} total characters</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Account</th>
              <th>Class</th>
              <th>Level</th>
              <th>Gold</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="loading-spinner"><div className="spinner" /></div>
                </td>
              </tr>
            ) : characters.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-icon">🗡️</div>
                    <p>No characters found</p>
                  </div>
                </td>
              </tr>
            ) : (
              characters.map(char => (
                <tr key={char.CharacterID}>
                  <td><span className="account-name">{char.CharacterName}</span></td>
                  <td className="text-secondary">{char.AccountName}</td>
                  <td>
                    <span className="badge badge-accent">
                      {CLASS_NAMES[char.CharacterClass] || `Class ${char.CharacterClass}`}
                    </span>
                  </td>
                  <td>
                    <span className="level-badge">Lv. {char.CharacterLevel}</span>
                  </td>
                  <td className="text-secondary">{formatGold(char.Money)}</td>
                  <td>
                    <span className={`badge ${char.LoginStatus === 1 ? 'badge-online' : 'badge-offline'}`}>
                      {char.LoginStatus === 1 ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => navigate(`/characters/${char.CharacterID}`)}
                    >
                      <FiEye />
                    </button>
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
