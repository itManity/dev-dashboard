import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiDroplet, FiDollarSign, FiShield } from 'react-icons/fi';
import axios from 'axios';
import './CharacterDetailPage.css';

interface CharacterDetail {
  CharacterID: number;
  CharacterName: string;
  AccountName: string;
  CharacterClass: number;
  CharacterLevel: number;
  CurHP: number;
  CurMP: number;
  Money: number;
  CreateDate: string;
  LastLoginDate: string;
  LoginStatus: number;
}

interface InventoryItem {
  ItemID: number;
  ItemName: string;
  Quantity: number;
  EnhanceLevel: number;
  SlotNo: number;
}

const CLASS_NAMES: Record<number, string> = {
  1: 'Warrior', 2: 'Archer', 3: 'Sorceress', 4: 'Cleric',
  5: 'Academic', 6: 'Kali', 7: 'Assassin', 8: 'Lencea',
  9: 'Machina', 10: 'Vandar',
};

const demoCharacter: CharacterDetail = {
  CharacterID: 1,
  CharacterName: 'ShadowBlade',
  AccountName: 'DragonSlayer99',
  CharacterClass: 7,
  CharacterLevel: 95,
  CurHP: 485000,
  CurMP: 120000,
  Money: 542000000,
  CreateDate: '2024-01-20T10:30:00',
  LastLoginDate: '2024-12-01T14:22:00',
  LoginStatus: 1,
};

const demoInventory: InventoryItem[] = [
  { ItemID: 10001, ItemName: 'Apocalypse Dagger +12', Quantity: 1, EnhanceLevel: 12, SlotNo: 1 },
  { ItemID: 10002, ItemName: 'Shadow Walker Armor +10', Quantity: 1, EnhanceLevel: 10, SlotNo: 2 },
  { ItemID: 10003, ItemName: 'Dragon Jade (Destructive)', Quantity: 3, EnhanceLevel: 0, SlotNo: 10 },
  { ItemID: 10004, ItemName: 'Goddess Lustrous Necklace', Quantity: 1, EnhanceLevel: 0, SlotNo: 5 },
  { ItemID: 10005, ItemName: 'HP Potion (Large)', Quantity: 99, EnhanceLevel: 0, SlotNo: 20 },
];

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [charRes, invRes] = await Promise.all([
          axios.get(`/api/characters/${id}`, { withCredentials: true }),
          axios.get(`/api/characters/${id}/inventory`, { withCredentials: true }),
        ]);
        setCharacter(charRes.data);
        setInventory(invRes.data.data);
      } catch {
        setCharacter(demoCharacter);
        setInventory(demoInventory);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  if (!character) {
    return <div className="empty-state"><p>Character not found</p></div>;
  }

  return (
    <div className="character-detail">
      <button className="btn back-btn" onClick={() => navigate('/characters')}>
        <FiArrowLeft /> Back to Characters
      </button>

      <div className="character-header-card card">
        <div className="character-header-info">
          <div className="character-avatar">
            {character.CharacterName.charAt(0)}
          </div>
          <div>
            <h1 className="character-name">{character.CharacterName}</h1>
            <div className="character-meta">
              <span className="badge badge-accent">
                {CLASS_NAMES[character.CharacterClass] || 'Unknown'}
              </span>
              <span className="level-badge">Level {character.CharacterLevel}</span>
              <span className={`badge ${character.LoginStatus === 1 ? 'badge-online' : 'badge-offline'}`}>
                {character.LoginStatus === 1 ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Account: {character.AccountName}
            </p>
          </div>
        </div>
      </div>

      <div className="character-stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">HP</div>
            <div className="stat-icon" style={{ color: '#e53e3e' }}><FiHeart /></div>
          </div>
          <div className="stat-value">{character.CurHP.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">MP</div>
            <div className="stat-icon" style={{ color: '#3182ce' }}><FiDroplet /></div>
          </div>
          <div className="stat-value">{character.CurMP.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">Gold</div>
            <div className="stat-icon" style={{ color: '#d69e2e' }}><FiDollarSign /></div>
          </div>
          <div className="stat-value">{character.Money.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="stat-label">Created</div>
            <div className="stat-icon"><FiShield /></div>
          </div>
          <div className="stat-value" style={{ fontSize: '1rem' }}>
            {new Date(character.CreateDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="chart-title">Inventory</h3>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Name</th>
                <th>Enhancement</th>
                <th>Quantity</th>
                <th>Slot</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state"><p>No items found</p></div>
                  </td>
                </tr>
              ) : (
                inventory.map(item => (
                  <tr key={`${item.ItemID}-${item.SlotNo}`}>
                    <td className="text-muted">{item.ItemID}</td>
                    <td>
                      <span className="account-name">
                        {item.ItemName}
                      </span>
                    </td>
                    <td>
                      {item.EnhanceLevel > 0 && (
                        <span className="badge badge-accent">+{item.EnhanceLevel}</span>
                      )}
                    </td>
                    <td>{item.Quantity}</td>
                    <td className="text-muted">{item.SlotNo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
