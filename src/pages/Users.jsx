import { useState } from 'react';
import { users as initial } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Search, Pencil, X } from 'lucide-react';

export default function Users() {
  const [data, setData] = useState(initial);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});

  const filtered = data.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (u) => { setEditUser(u.id); setForm({ ...u }); };
  const save = () => {
    setData(prev => prev.map(u => u.id === editUser ? { ...form } : u));
    setEditUser(null);
  };

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <p className="toolbar-count">{filtered.length} users</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Joined</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.bookings}</td>
                <td>{u.joined}</td>
                <td><StatusBadge status={u.status} /></td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(u)}><Pencil size={14} /> Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="icon-btn" onClick={() => setEditUser(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
              ].map(({ label, key }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditUser(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
