import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-brand">
            <h3 className="footer-logo">
              <span className="footer-logo-icon">₿</span>
              BitPort
            </h3>
            <p className="footer-tagline">
              Professional cryptocurrency swap platform with live market pricing
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/swap">Swap</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li><a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer">CoinGecko API</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">Documentation</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">Support</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Legal</h4>
          <ul className="footer-links">
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#security">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} BitPort. All rights reserved.
        </p>
        <div className="footer-social">
          <span className="footer-social-text">Powered by CoinGecko API</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

