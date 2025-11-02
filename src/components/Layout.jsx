import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-container">
      <nav className="nav-header">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            🇩🇪 MachMitDeutsch
          </Link>
          <div className="nav-links">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/manage"
              className={`nav-link ${isActive('/manage') ? 'active' : ''}`}
            >
              Manage Cards
            </Link>
            <Link
              to="/practice/setup"
              className={`nav-link ${isActive('/practice') ? 'active' : ''}`}
            >
              Practice
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>MachMitDeutsch - German Vocabulary Learning</p>
      </footer>
    </div>
  );
}

export default Layout;
