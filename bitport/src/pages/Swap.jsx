import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Swap.css';

const Swap = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [fromSymbol, setFromSymbol] = useState('bitcoin');
  const [toSymbol, setToSymbol] = useState('ethereum');
  const [amount, setAmount] = useState('');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const popularCoins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const fetchPrices = async () => {
    try {
      const res = await api.get('/api/swap/prices');
      setPrices(res.data);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    }
  };

  const calculateAmount = () => {
    if (!amount || !prices[fromSymbol] || !prices[toSymbol]) return 0;
    const fromPrice = prices[fromSymbol]?.usd || 0;
    const toPrice = prices[toSymbol]?.usd || 0;
    if (toPrice === 0) return 0;
    return (parseFloat(amount) * fromPrice) / toPrice;
  };

  const currentRate = () => {
    if (!prices[fromSymbol] || !prices[toSymbol]) return null;
    const fromPrice = prices[fromSymbol]?.usd || 0;
    const toPrice = prices[toSymbol]?.usd || 0;
    if (!fromPrice || !toPrice) return null;
    return fromPrice / toPrice;
  };

  const handleSwap = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    // Demo mode - simulate swap without API call
    if (demoMode) {
      const calculatedAmount = calculateAmount();
      setTimeout(() => {
        setSuccess(`[DEMO] Would swap ${amount} ${getCoinSymbol(fromSymbol)} to ${calculatedAmount.toFixed(6)} ${getCoinSymbol(toSymbol)}`);
        setAmount('');
        setLoading(false);
        setTimeout(() => setSuccess(''), 5000);
      }, 1000);
      return;
    }

    // Real swap
    try {
      const res = await api.post('/api/swap/execute', {
        from: fromSymbol,
        to: toSymbol,
        amount: parseFloat(amount)
      });

      setSuccess(`Successfully swapped ${amount} ${getCoinSymbol(fromSymbol)} to ${res.data.amountTo.toFixed(6)} ${getCoinSymbol(toSymbol)}`);
      setAmount('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Swap failed. Please try again.');
    }
    setLoading(false);
  };

  const getCoinSymbol = (coinId) => {
    const coin = popularCoins.find(c => c.id === coinId);
    return coin?.symbol || coinId.toUpperCase();
  };

  const getCoinName = (coinId) => {
    const coin = popularCoins.find(c => c.id === coinId);
    return coin?.name || coinId;
  };

  const swapCoins = () => {
    const temp = fromSymbol;
    setFromSymbol(toSymbol);
    setToSymbol(temp);
  };

  return (
    <div className="swap-container">
      <div className="swap-card">
        <div className="swap-header">
          <div>
            <h1 className="swap-title">Swap</h1>
            <p className="swap-subtitle">Professional-grade swap desk with live market pricing</p>
          </div>
          <div className="swap-meta">
            <div className="swap-demo-toggle">
              <label className="demo-switch">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                />
                <span className="demo-slider"></span>
              </label>
              <span className="demo-label">{demoMode ? 'Demo Mode' : 'Live Mode'}</span>
            </div>
            {currentRate() && (
              <p className="swap-meta-line">
                1 {getCoinSymbol(fromSymbol)} ≈ {currentRate().toFixed(4)} {getCoinSymbol(toSymbol)}
              </p>
            )}
            {lastUpdated && (
              <p className="swap-meta-line subtle">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSwap} className="swap-form">
          <div className="swap-input-group">
            <label>From</label>
            <div className="swap-input-wrapper">
              <select
                value={fromSymbol}
                onChange={(e) => setFromSymbol(e.target.value)}
                className="swap-select"
              >
                {popularCoins.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.00000001"
                min="0"
                className="swap-amount-input"
                required
              />
            </div>
            {prices[fromSymbol] && (
              <p className="price-info">${prices[fromSymbol].usd.toLocaleString()} USD</p>
            )}
          </div>

          <div className="swap-button-wrapper">
            <button type="button" onClick={swapCoins} className="swap-button-icon">
              ⇅
            </button>
          </div>

          <div className="swap-input-group">
            <label>To</label>
            <div className="swap-input-wrapper">
              <select
                value={toSymbol}
                onChange={(e) => setToSymbol(e.target.value)}
                className="swap-select"
              >
                {popularCoins.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={calculateAmount().toFixed(8)}
                readOnly
                className="swap-amount-input"
                placeholder="0.00"
              />
            </div>
            {prices[toSymbol] && (
              <p className="price-info">${prices[toSymbol].usd.toLocaleString()} USD</p>
            )}
          </div>

          <button type="submit" className="swap-submit-button" disabled={loading}>
            {loading ? 'Processing...' : demoMode ? 'Preview Swap (Demo)' : 'Execute Swap'}
          </button>
          {demoMode && (
            <p className="demo-notice">
              Demo mode: This will simulate a swap without executing it. Toggle off to perform real swaps.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Swap;

