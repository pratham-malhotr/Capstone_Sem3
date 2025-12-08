import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="home-grid">
        <section className="hero-section">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">BitPort</span>
          </h1>
          <p className="hero-subtitle">
            A focused crypto swap desk with real‑time pricing, deep history, and a clean dashboard experience.
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn-primary">Create Account</Link>
              <Link to="/login" className="btn-secondary">Sign In</Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
              <Link to="/swap" className="btn-secondary">Open Swap Desk</Link>
            </div>
          )}

          <div className="features-section">
            <h2 className="section-title">Why BitPort?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Execution focused</h3>
                <p>Clean swap flow with no distractions – choose your pair, confirm the rate, and execute.</p>
              </div>
              <div className="feature-card">
                <h3>Market‑aware</h3>
                <p>Live market prices directly from CoinGecko so you always see current levels.</p>
              </div>
              <div className="feature-card">
                <h3>Traceable</h3>
                <p>Every swap is recorded with rich filters and notes so you can audit your history.</p>
              </div>
              <div className="feature-card">
                <h3>Secure by design</h3>
                <p>JWT‑based authentication and a hardened API layer protect your account.</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="home-dashboard-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span className="preview-label">Dashboard Snapshot</span>
              <span className="preview-pill">Demo</span>
            </div>
            <div className="preview-metrics">
              <div className="preview-metric">
                <span className="preview-metric-label">Recent Swaps</span>
                <span className="preview-metric-value">10</span>
              </div>
              <div className="preview-metric">
                <span className="preview-metric-label">Top Pair</span>
                <span className="preview-metric-value">BTC → ETH</span>
              </div>
              <div className="preview-metric">
                <span className="preview-metric-label">Last Price Update</span>
                <span className="preview-metric-value">Live</span>
              </div>
            </div>
            <div className="preview-table">
              <div className="preview-row header">
                <span>Pair</span>
                <span>Amount</span>
                <span>Time</span>
              </div>
              <div className="preview-row">
                <span>BTC → ETH</span>
                <span>0.250</span>
                <span>Just now</span>
              </div>
              <div className="preview-row">
                <span>ETH → SOL</span>
                <span>12.4</span>
                <span>2 min</span>
              </div>
              <div className="preview-row">
                <span>DOT → BTC</span>
                <span>150</span>
                <span>5 min</span>
              </div>
            </div>
            <div className="preview-footer">
              {isAuthenticated ? (
                <Link to="/dashboard" className="preview-link">Open your real dashboard →</Link>
              ) : (
                <Link to="/login" className="preview-link">Log in to view your dashboard →</Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;

