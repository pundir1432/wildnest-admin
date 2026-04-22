import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Capitalize first letter of each word
const capitalizeName = (val) =>
  val.replace(/\b\w/g, (c) => c.toUpperCase());

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const errorTimer = useRef(null);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (!error) return;
    clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(errorTimer.current);
  }, [error]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePhone = (v) => {
    // Only digits, max 10
    const digits = v.replace(/\D/g, '').slice(0, 10);
    set('phone', digits);
  };

  const handlePassword = (k, v) => {
    // Max 12 characters
    set(k, v.slice(0, 12));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (form.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.phone, form.password);
      navigate('/admin/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              onChange={e => set('name', capitalizeName(e.target.value))}
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
            <label>Phone <span className="field-hint">(10 digits)</span></label>
            <input
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={e => handlePhone(e.target.value)}
              maxLength={10}
            />
          </div>

          <div className="form-group">
            <label>Password <span className="field-hint">(6–12 characters)</span></label>
            <div className="input-with-icon">
              <input
                type={showPass.password ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => handlePassword('password', e.target.value)}
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPass(p => ({ ...p, password: !p.password }))}>
                {showPass.password ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="password-strength">
              <div className="strength-bar">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="strength-seg"
                    style={{
                      background: form.password.length > i * 3
                        ? form.password.length < 6 ? '#ef4444'
                          : form.password.length < 9 ? '#f59e0b' : '#16a34a'
                        : 'var(--border)'
                    }}
                  />
                ))}
              </div>
              <span className="strength-label">
                {form.password.length === 0 ? '' :
                  form.password.length < 6 ? 'Weak' :
                  form.password.length < 9 ? 'Medium' : 'Strong'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showPass.confirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={e => handlePassword('confirm', e.target.value)}
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}>
                {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
