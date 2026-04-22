import { useState, useEffect } from 'react';
import { getUsers, toggleUser } from '../services/userService';
import StatusBadge from '../components/StatusBadge';
import { Search, RefreshCw, ShieldOff, ShieldCheck } from 'lucide-react';

export default function Users() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [toggling, setToggling] = useState(null);

  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const res = await getUsers();
      setData(res.data?.users || res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await toggleUser(id);
      const updated = res.data?.user || res.data;
      setData(prev => prev.map(u => u._id === id ? { ...u, isBlocked: updated?.isBlocked ?? !u.isBlocked } : u));
    } catch { alert('Action failed.'); }
    finally { setToggling(null); }
  };

  const filtered = data.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="toolbar-count">{filtered.length} users</span>
          <button className="btn btn-outline" onClick={fetchUsers}><RefreshCw size={15} /></button>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="empty-row">Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id}>
                  <td>{u.name || '—'}</td>
                  <td>{u.email || '—'}</td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td><StatusBadge status={u.isBlocked ? 'Blocked' : 'Active'} /></td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.isBlocked ? 'btn-outline' : 'btn-danger'}`}
                      disabled={toggling === u._id}
                      onClick={() => handleToggle(u._id)}
                    >
                      {toggling === u._id
                        ? '...'
                        : u.isBlocked
                          ? <><ShieldCheck size={13} /> Unblock</>
                          : <><ShieldOff size={13} /> Block</>
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
