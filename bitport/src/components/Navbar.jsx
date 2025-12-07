import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">BitPort</Link>
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/swap" className={`nav-link ${isActive('/swap') ? 'active' : ''}`}>Swap</Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
              <Link to="/watchlist" className={`nav-link ${isActive('/watchlist') ? 'active' : ''}`}>Watchlist</Link>
              <Link to="/alerts" className={`nav-link ${isActive('/alerts') ? 'active' : ''}`}>Alerts</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
              <span className="nav-user">{user?.name || user?.email}</span>
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

