import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Watchlist.css';

const Watchlist = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Form state for adding new item
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    coinName: '',
    note: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWatchlist();
  }, [isAuthenticated, navigate, page]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/watchlist', {
        params: {
          page,
          limit
        }
      });
      setItems(res.data.items);
      setTotal(res.data.meta.total);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      setError('Failed to load watchlist');
      console.error(err);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await api.post('/api/watchlist', formData);
      setFormData({ symbol: '', coinName: '', note: '' });
      setShowAddForm(false);
      fetchWatchlist();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add coin to watchlist');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this coin from watchlist?')) return;
    
    try {
      await api.delete(`/api/watchlist/${id}`);
      fetchWatchlist();
    } catch (err) {
      setError('Failed to delete watchlist item');
    }
  };

  const handleUpdateNote = async (id, note) => {
    try {
      await api.put(`/api/watchlist/${id}`, { note });
      fetchWatchlist();
    } catch (err) {
      setError('Failed to update note');
    }
  };

  if (loading && items.length === 0) {
    return <div className="watchlist-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <div>
          <h1 className="watchlist-title">My Watchlist</h1>
          <p className="watchlist-subtitle">Track your favorite cryptocurrencies</p>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Coin'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showAddForm && (
        <div className="add-form-card">
          <h3>Add Coin to Watchlist</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Symbol (e.g., BTC, ETH)</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="BTC"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Coin Name</label>
              <input
                type="text"
                value={formData.coinName}
                onChange={(e) => setFormData({ ...formData, coinName: e.target.value })}
                placeholder="Bitcoin"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Note (optional)</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add a note..."
                className="form-textarea"
                rows="3"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Adding...' : 'Add to Watchlist'}
            </button>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="no-items">No coins in watchlist. Add your first coin!</div>
      ) : (
        <>
          <div className="watchlist-table">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Coin Name</th>
                  <th>Note</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><span className="symbol-badge">{item.symbol}</span></td>
                    <td>{item.coinName}</td>
                    <td>
                      <NoteEditor
                        note={item.note}
                        onSave={(note) => handleUpdateNote(item.id, note)}
                      />
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="delete-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages} (Total: {total})
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="page-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Simple note editor component
const NoteEditor = ({ note, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(note || '');

  if (editing) {
    return (
      <div className="note-editor">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="note-input"
          autoFocus
        />
        <button onClick={() => { onSave(value); setEditing(false); }} className="save-btn">✓</button>
        <button onClick={() => { setValue(note || ''); setEditing(false); }} className="cancel-btn">✕</button>
      </div>
    );
  }

  return (
    <div className="note-display">
      <span>{note || '-'}</span>
      <button onClick={() => setEditing(true)} className="edit-btn">✏️</button>
    </div>
  );
};

export default Watchlist;

