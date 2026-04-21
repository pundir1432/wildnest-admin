import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, Eye, EyeOff, TreePine } from 'lucide-react';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ ...profile });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setPass = (k, v) => setPassForm(p => ({ ...p, [k]: v }));

  const handleSaveProfile = () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    updateProfile(form);
    setSaved(true);
    setError('');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = () => {
    setError('');
    if (!passForm.current || !passForm.newPass || !passForm.confirm) {
      setError('All password fields are required.'); return;
    }
    if (passForm.newPass.length < 6) {
      setError('New password must be at least 6 characters.'); return;
    }
    if (passForm.newPass !== passForm.confirm) {
      setError('Passwords do not match.'); return;
    }
    // Simulate API call
    setSaved(true);
    setPassForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSaved(false), 2500);
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page">
      {saved && <div className="toast">✓ {activeTab === 'profile' ? 'Profile updated' : 'Password changed'} successfully</div>}

      <div className="profile-header-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-lg">
            <TreePine size={32} />
          </div>
          <div className="profile-header-info">
            <h2 className="profile-header-name">{profile.name}</h2>
            <p className="profile-header-role">{profile.role}</p>
            <p className="profile-header-email">{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setError(''); }}
        >
          <User size={16} />
          Profile Information
        </button>
        <button
          className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => { setActiveTab('password'); setError(''); }}
        >
          <Lock size={16} />
          Change Password
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {activeTab === 'profile' ? (
        <div className="card">
          <h3 className="card-title">Personal Information</h3>
          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSaveProfile}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 className="card-title">Change Password</h3>
          <div className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-with-icon">
                <input
                  type={showPass.current ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={passForm.current}
                  onChange={e => setPass('current', e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPass(p => ({ ...p, current: !p.current }))}
                >
                  {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <input
                  type={showPass.newPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={passForm.newPass}
                  onChange={e => setPass('newPass', e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPass(p => ({ ...p, newPass: !p.newPass }))}
                >
                  {showPass.newPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <input
                  type={showPass.confirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={passForm.confirm}
                  onChange={e => setPass('confirm', e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                >
                  {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleChangePassword}>
                <Lock size={16} /> Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
