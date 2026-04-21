import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }

    setLoading(true);
    // Simulate API call — replace with real API
    await new Promise(r => setTimeout(r, 900));

    // Demo credentials: admin@wildnest.com / admin123
    if (form.email === 'admin@wildnest.com' && form.password === 'admin123') {
      login();
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <TreePine size={32} />
          <span>WildNest</span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your admin account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@wildnest.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : <LogIn size={16} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/admin/signup">Create account</Link>
        </p>

        <div className="auth-demo-hint">
          <span>Demo: admin@wildnest.com / admin123</span>
        </div>
      </div>
    </div>
  );
}
