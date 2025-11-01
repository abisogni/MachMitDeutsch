import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '1rem',
        background: '#1a1f2e',
        borderBottom: '2px solid #2563eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            MachMitDeutsch
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/manage" style={{ color: '#fff', textDecoration: 'none' }}>
              Manage Cards
            </Link>
            <Link to="/practice/setup" style={{ color: '#fff', textDecoration: 'none' }}>
              Practice
            </Link>
          </div>
        </div>
      </nav>

      <main style={{
        flex: 1,
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Outlet />
      </main>

      <footer style={{
        padding: '1rem',
        textAlign: 'center',
        background: '#1a1f2e',
        color: '#9ca3af'
      }}>
        <p>MachMitDeutsch - German Vocabulary Learning</p>
      </footer>
    </div>
  );
}

export default Layout;
