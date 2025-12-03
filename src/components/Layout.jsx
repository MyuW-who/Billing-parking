import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>🅿️ Parking Management</h2>
        </div>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/available"
            className={`nav-link ${isActive('/available') ? 'active' : ''}`}
          >
            Available Spaces
          </Link>
          <Link
            to="/occupied"
            className={`nav-link ${isActive('/occupied') ? 'active' : ''}`}
          >
            Occupied Spaces
          </Link>
          <Link
            to="/billing"
            className={`nav-link ${isActive('/billing') ? 'active' : ''}`}
          >
            Billing
          </Link>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
