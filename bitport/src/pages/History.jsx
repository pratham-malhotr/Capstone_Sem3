import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './History.css';

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filters
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteValue, setNoteValue] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSwaps();
  }, [isAuthenticated, navigate, page, search, sortBy, sortOrder, filterFrom, filterTo, dateFrom, dateTo]);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(filterFrom && { from: filterFrom }),
        ...(filterTo && { to: filterTo }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo })
      };
      
      const res = await api.get('/api/history', { params });
      setSwaps(res.data.items);
      setTotal(res.data.meta.total);
    } catch (err) {
      setError('Failed to load swap history');
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this swap?')) return;
    
    try {
      await api.delete(`/api/history/${id}`);
      fetchSwaps();
    } catch (err) {
      setError('Failed to delete swap');
    }
  };

  const handleEditNote = (swap) => {
    setEditingNote(swap.id);
    setNoteValue(swap.note || '');
  };

  const handleSaveNote = async (id) => {
    try {
      await api.put(`/api/history/${id}`, { note: noteValue });
      setEditingNote(null);
      fetchSwaps();
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteValue('');
  };

  const clearFilters = () => {
    setSearch('');
    setFilterFrom('');
    setFilterTo('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && swaps.length === 0) {
    return <div className="history-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h1 className="history-title">Swap History</h1>
          <p className="history-subtitle">
            Explore, filter, and refine your past swaps with full control over pairs, dates, and notes.
          </p>
        </div>
      </div>

      <div className="history-filters">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by symbol..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="From symbol..."
            value={filterFrom}
            onChange={(e) => { setFilterFrom(e.target.value); setPage(1); }}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="To symbol..."
            value={filterTo}
            onChange={(e) => { setFilterTo(e.target.value); setPage(1); }}
            className="filter-input"
          />
        </div>
        <div className="filter-row">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="filter-input"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="filter-input"
          />
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="created_at">Date</option>
            <option value="from_symbol">From Symbol</option>
            <option value="to_symbol">To Symbol</option>
            <option value="amount_from">Amount From</option>
            <option value="amount_to">Amount To</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
          <button onClick={clearFilters} className="clear-filters-btn">Clear Filters</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {swaps.length === 0 ? (
        <div className="no-swaps">No swaps found</div>
      ) : (
        <>
          <div className="swaps-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount From</th>
                  <th>Amount To</th>
                  <th>Price (USD)</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {swaps.map(swap => (
                  <tr key={swap.id}>
                    <td>{new Date(swap.created_at).toLocaleString()}</td>
                    <td><span className="symbol-badge">{swap.from_symbol}</span></td>
                    <td><span className="symbol-badge">{swap.to_symbol}</span></td>
                    <td>{parseFloat(swap.amount_from).toFixed(8)}</td>
                    <td>{parseFloat(swap.amount_to).toFixed(8)}</td>
                    <td>${parseFloat(swap.price_usd).toLocaleString()}</td>
                    <td>
                      {editingNote === swap.id ? (
                        <div className="note-edit">
                          <input
                            type="text"
                            value={noteValue}
                            onChange={(e) => setNoteValue(e.target.value)}
                            className="note-input"
                            autoFocus
                          />
                          <button onClick={() => handleSaveNote(swap.id)} className="save-btn">✓</button>
                          <button onClick={handleCancelEdit} className="cancel-btn">✕</button>
                        </div>
                      ) : (
                        <div className="note-display">
                          <span>{swap.note || '-'}</span>
                          <button onClick={() => handleEditNote(swap)} className="edit-btn">✏️</button>
                        </div>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(swap.id)} className="delete-btn">Delete</button>
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

export default History;

