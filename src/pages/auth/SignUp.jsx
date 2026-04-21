import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    // Simulate API call — replace with real API
    await new Promise(r => setTimeout(r, 900));
    login();
    navigate('/admin/dashboard', { replace: true });
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <TreePine size={32} />
          <span>WildNest</span>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Set up your admin account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : <UserPlus size={16} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/admin/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
