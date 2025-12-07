import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Alerts.css';

const Alerts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Form state for adding new alert
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    coinName: '',
    targetPrice: '',
    condition: 'above'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAlerts();
  }, [isAuthenticated, navigate, page]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/alerts', {
        params: {
          page,
          limit
        }
      });
      setAlerts(res.data.items);
      setTotal(res.data.meta.total);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      setError('Failed to load alerts');
      console.error(err);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await api.post('/api/alerts', formData);
      setFormData({ symbol: '', coinName: '', targetPrice: '', condition: 'above' });
      setShowAddForm(false);
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    
    try {
      await api.delete(`/api/alerts/${id}`);
      fetchAlerts();
    } catch (err) {
      setError('Failed to delete alert');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/api/alerts/${id}`, { isActive: !currentStatus });
      fetchAlerts();
    } catch (err) {
      setError('Failed to update alert');
    }
  };

  if (loading && alerts.length === 0) {
    return <div className="alerts-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <div>
          <h1 className="alerts-title">Price Alerts</h1>
          <p className="alerts-subtitle">Get notified when prices hit your targets</p>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Create Alert'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showAddForm && (
        <div className="add-form-card">
          <h3>Create Price Alert</h3>
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
              <label>Target Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.targetPrice}
                onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                placeholder="50000"
                required
                min="0"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Alert When Price</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="form-select"
              >
                <option value="above">Goes Above</option>
                <option value="below">Goes Below</option>
              </select>
            </div>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Creating...' : 'Create Alert'}
            </button>
          </form>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="no-items">No alerts created. Create your first price alert!</div>
      ) : (
        <>
          <div className="alerts-table">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Coin Name</th>
                  <th>Target Price</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className={alert.isActive ? '' : 'inactive'}>
                    <td><span className="symbol-badge">{alert.symbol}</span></td>
                    <td>{alert.coinName}</td>
                    <td>${parseFloat(alert.targetPrice).toLocaleString()}</td>
                    <td>
                      <span className={`condition-badge ${alert.condition}`}>
                        {alert.condition === 'above' ? '↑ Above' : '↓ Below'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${alert.isActive ? 'active' : 'inactive'}`}>
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(alert.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleToggleActive(alert.id, alert.isActive)} 
                        className="toggle-btn"
                      >
                        {alert.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(alert.id)} 
                        className="delete-btn"
                      >
                        Delete
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

export default Alerts;

