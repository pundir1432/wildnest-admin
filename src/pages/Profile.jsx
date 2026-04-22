import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, Eye, EyeOff, TreePine } from 'lucide-react';
import { getProfile, updateProfileApi } from '../services/profileService';
import { buildFormData } from '../services/activityService';
import PageLoader from '../components/PageLoader';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm]           = useState({ ...profile });
  const [avatar, setAvatar]       = useState(null);
  const [passForm, setPassForm]   = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass]   = useState({ current: false, newPass: false, confirm: false });
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState('');
  const [error, setError]         = useState('');
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    getProfile().then(res => {
      const u = res.data?.user || res.data;
      if (u) { setForm({ name: u.name, email: u.email, phone: u.phone || '', location: u.location || '', bio: u.bio || '' }); }
    }).catch(() => {}).finally(() => setProfileLoading(false));
  }, []);

  const set     = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setPass = (k, v) => setPassForm(p => ({ ...p, [k]: v }));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSaveProfile = async () => {
    setError('');
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    setSaving(true);
    try {
      const fd = buildFormData(form, avatar ? [avatar] : []);
      // profileImage field name
      if (avatar) fd.set('profileImage', avatar);
      await updateProfileApi(fd);
      updateProfile(form);
      showToast('Profile updated successfully');
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (!passForm.current || !passForm.newPass || !passForm.confirm) {
      setError('All password fields are required.'); return;
    }
    if (passForm.newPass.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (passForm.newPass !== passForm.confirm) { setError('Passwords do not match.'); return; }
    setSaving(true);
    try {
      await updateProfileApi(buildFormData({ password: passForm.newPass }));
      setPassForm({ current: '', newPass: '', confirm: '' });
      showToast('Password changed successfully');
    } catch (e) {
      setError(e.response?.data?.message || 'Password change failed.');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) return <PageLoader />;

  return (
    <div className="page">
      {toast && <div className="toast">✓ {toast}</div>}

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
        <button className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setError(''); }}>
          <User size={16} /> Profile Information
        </button>
        <button className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => { setActiveTab('password'); setError(''); }}>
          <Lock size={16} /> Change Password
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
                <input value={form.name || ''} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location || ''} onChange={e => set('location', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea rows={3} value={form.bio || ''} onChange={e => set('bio', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Profile Image</label>
              <input type="file" accept="image/*" className="file-input" onChange={e => setAvatar(e.target.files[0] || null)} />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 className="card-title">Change Password</h3>
          <div className="profile-form">
            {[
              { k: 'current', l: 'Current Password', ph: 'Enter current password' },
              { k: 'newPass', l: 'New Password',     ph: 'Min. 6 characters' },
              { k: 'confirm', l: 'Confirm Password', ph: 'Re-enter new password' },
            ].map(({ k, l, ph }) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <div className="input-with-icon">
                  <input
                    type={showPass[k] ? 'text' : 'password'}
                    placeholder={ph}
                    value={passForm[k]}
                    onChange={e => setPass(k, e.target.value)}
                  />
                  <button type="button" className="input-icon-btn" onClick={() => setShowPass(p => ({ ...p, [k]: !p[k] }))}>
                    {showPass[k] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleChangePassword} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : <Lock size={16} />}
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
