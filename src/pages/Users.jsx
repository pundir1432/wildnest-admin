import { useState, useEffect } from 'react';
import apiCore from '../context/api/apiCore';
import { ADMIN_USERS, ADMIN_USER_STATUS, ADMIN_USER_TOGGLE } from '../context/api/adminEndPoints';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';
import { Search, RefreshCw, ShieldOff, ShieldCheck, Pencil, X } from 'lucide-react';

export default function Users() {
  const [data,     setData]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');
  const [toggling, setToggling] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [formErr,  setFormErr]  = useState('');

  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const res = await apiCore.get(ADMIN_USERS);
      setData(res?.users ?? res ?? []);
    } catch (e) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Block / Unblock via explicit status endpoint ──────────
  const handleStatusToggle = async (user) => {
    setToggling(user._id);
    try {
      const newStatus = !(user.isActive ?? !user.isBlocked);
      await apiCore.put(ADMIN_USER_STATUS(user._id), { isActive: newStatus });
      setData(prev => prev.map(u =>
        u._id === user._id ? { ...u, isActive: newStatus, isBlocked: !newStatus } : u
      ));
    } catch {
      // fallback to toggle endpoint
      try {
        await apiCore.put(ADMIN_USER_TOGGLE(user._id));
        setData(prev => prev.map(u =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked, isActive: u.isBlocked } : u
        ));
      } catch { setError('Action failed.'); }
    } finally {
      setToggling(null);
    }
  };

  // ── Edit user ─────────────────────────────────────────────
  const openEdit = (u) => {
    setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '' });
    setEditUser(u); setFormErr('');
  };

  const handleSave = async () => {
    setFormErr('');
    if (!form.name || !form.email) { setFormErr('Name and email are required.'); return; }
    setSaving(true);
    try {
      await apiCore.put(`${ADMIN_USERS}/${editUser._id}`, form);
      setData(prev => prev.map(u => u._id === editUser._id ? { ...u, ...form } : u));
      setEditUser(null);
    } catch (e) {
      setFormErr(e.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const isActive = (u) => u.isActive ?? !u.isBlocked ?? true;

  const filtered = data.filter(u =>
    (u.name  || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search)
  );

  if (loading) return <PageLoader />;

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="toolbar-count">{filtered.length} users</span>
          <button className="btn btn-outline" onClick={fetchUsers}>
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-row">No users found</td></tr>
              ) : filtered.map((u, idx) => (
                <tr key={u._id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td><strong>{u.name || '—'}</strong></td>
                  <td>{u.email || '—'}</td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <StatusBadge status={isActive(u) ? 'Active' : 'Blocked'} />
                  </td>
                  <td>
                    <div className="action-cell">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        className={`btn btn-sm ${isActive(u) ? 'btn-danger' : 'btn-outline'}`}
                        disabled={toggling === u._id}
                        onClick={() => handleStatusToggle(u)}
                      >
                        {toggling === u._id ? '...' : isActive(u)
                          ? <><ShieldOff size={13} /> Block</>
                          : <><ShieldCheck size={13} /> Unblock</>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="icon-btn" onClick={() => setEditUser(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {formErr && <div className="auth-error" style={{ marginTop: 0 }}>{formErr}</div>}
              {[
                { k: 'name',  l: 'Full Name', t: 'text'  },
                { k: 'email', l: 'Email',     t: 'email' },
                { k: 'phone', l: 'Phone',     t: 'tel'   },
              ].map(({ k, l, t }) => (
                <div className="form-group" key={k}>
                  <label>{l}</label>
                  <input
                    type={t}
                    value={form[k] || ''}
                    onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditUser(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : null}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
