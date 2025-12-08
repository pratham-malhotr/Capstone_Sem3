import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSwaps();
  }, [isAuthenticated, navigate]);

  const fetchSwaps = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      // Fetch the most recent 10 swaps for the dashboard
      const res = await api.get('/api/history', {
        params: {
          page: 1,
          limit: 10,
          sortBy: 'created_at',
          sortOrder: 'DESC',
        },
      });
      setSwaps(res.data.items || []);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
    setLoading(false);
    setRefreshing(false);
  };

  const metrics = useMemo(() => {
    if (!swaps.length) {
      return {
        totalSwaps: 0,
        totalVolumeFrom: 0,
        totalVolumeTo: 0,
        lastPair: '-',
      };
    }
    const totalSwaps = swaps.length;
    const totalVolumeFrom = swaps.reduce((sum, s) => sum + Number(s.amount_from || 0), 0);
    const totalVolumeTo = swaps.reduce((sum, s) => sum + Number(s.amount_to || 0), 0);
    const last = swaps[0];
    const lastPair = `${last.from_symbol} → ${last.to_symbol}`;
    return {
      totalSwaps,
      totalVolumeFrom,
      totalVolumeTo,
      lastPair,
    };
  }, [swaps]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back{user?.name ? `, ${user.name}` : ''}. Here is a quick overview of your recent swaps.
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            className="dashboard-refresh"
            type="button"
            onClick={() => fetchSwaps(true)}
            disabled={refreshing}
            title="Refresh dashboard"
          >
            {refreshing ? '⟳' : '↻'}
          </button>
          <button
            className="dashboard-cta"
            type="button"
            onClick={() => navigate('/swap')}
          >
            Start a New Swap
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        <section className="dashboard-metrics">
          <div className="metric-card" data-tone="sky">
            <p className="metric-label">Total Swaps (last 10)</p>
            <p className="metric-value">{metrics.totalSwaps}</p>
          </div>
          <div className="metric-card" data-tone="mint">
            <p className="metric-label">Volume From</p>
            <p className="metric-value">
              {metrics.totalVolumeFrom.toFixed(4)}
            </p>
          </div>
          <div className="metric-card" data-tone="rose">
            <p className="metric-label">Volume To</p>
            <p className="metric-value">
              {metrics.totalVolumeTo.toFixed(4)}
            </p>
          </div>
          <div className="metric-card" data-tone="amber">
            <p className="metric-label">Last Pair</p>
            <p className="metric-value metric-pill">{metrics.lastPair}</p>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Recent Swaps</h2>
              <p className="panel-subtitle">
                A snapshot of your latest activity. Go to full history for search and advanced filters.
              </p>
            </div>
            <button
              className="panel-link"
              type="button"
              onClick={() => navigate('/history')}
            >
              View Full History
            </button>
          </div>

          {error && <div className="panel-alert">{error}</div>}

          {loading ? (
            <div className="panel-loading">Loading dashboard...</div>
          ) : swaps.length === 0 ? (
            <div className="panel-empty">
              No swaps yet. Start with your first trade on the{' '}
              <button
                type="button"
                className="inline-link"
                onClick={() => navigate('/swap')}
              >
                Swap
              </button>{' '}
              page.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Pair</th>
                    <th>Amount</th>
                    <th>Received</th>
                    <th>Price (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {swaps.map((swap) => (
                    <tr key={swap.id}>
                      <td>{new Date(swap.created_at).toLocaleString()}</td>
                      <td>
                        <span className="pair-pill">
                          {swap.from_symbol} → {swap.to_symbol}
                        </span>
                      </td>
                      <td>{Number(swap.amount_from).toFixed(6)}</td>
                      <td>{Number(swap.amount_to).toFixed(6)}</td>
                      <td>${Number(swap.price_usd).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;


