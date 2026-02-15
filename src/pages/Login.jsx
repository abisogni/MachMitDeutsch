import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { login, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await login(email);

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the magic link!');
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueOffline = () => {
    navigate(from, { replace: true });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>MachMitDeutsch</h1>
          <div className="offline-notice">
            <h2>Offline Mode</h2>
            <p>
              Supabase is not configured. You can continue using the app in offline mode,
              but your progress will only be saved locally on this device.
            </p>
            <p>
              To enable cloud sync and multi-device support, set up Supabase by following
              the instructions in <code>supabase/SETUP.md</code>.
            </p>
            <button onClick={handleContinueOffline} className="btn-primary">
              Continue Offline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>MachMitDeutsch</h1>
        <p className="subtitle">German Vocabulary Practice</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <div className="login-info">
          <p>
            We'll send you a magic link to sign in.
            No password required!
          </p>
          <button onClick={handleContinueOffline} className="btn-secondary">
            Continue Offline Instead
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
