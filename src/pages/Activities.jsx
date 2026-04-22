import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import {
  getCamps, createCamp, updateCamp, deleteCamp,
  getRaftings, createRafting, updateRafting, deleteRafting,
  getRentals, createRental, updateRental, deleteRental,
  buildFormData,
} from '../services/activityService';

const TABS = ['camp', 'rafting', 'rental'];

const FIELDS = {
  camp:    [{ k: 'name', l: 'Name *', t: 'text' }, { k: 'location', l: 'Location *', t: 'text' }, { k: 'price', l: 'Price (₹) *', t: 'number' }, { k: 'maxGuests', l: 'Max Guests', t: 'number' }, { k: 'amenities', l: 'Amenities (comma separated)', t: 'text' }, { k: 'description', l: 'Description', t: 'textarea' }],
  rafting: [{ k: 'name', l: 'Name *', t: 'text' }, { k: 'location', l: 'Location *', t: 'text' }, { k: 'price', l: 'Price (₹) *', t: 'number' }, { k: 'duration', l: 'Duration', t: 'text' }, { k: 'difficulty', l: 'Difficulty', t: 'select', opts: ['Easy', 'Medium', 'Hard'] }, { k: 'maxPersons', l: 'Max Persons', t: 'number' }, { k: 'description', l: 'Description', t: 'textarea' }],
  rental:  [{ k: 'name', l: 'Name *', t: 'text' }, { k: 'type', l: 'Type', t: 'select', opts: ['Scooter', 'Bike', 'Car', 'Other'] }, { k: 'pricePerDay', l: 'Price Per Day (₹) *', t: 'number' }, { k: 'description', l: 'Description', t: 'textarea' }],
};

const API = {
  camp:    { getAll: getCamps,    create: createCamp,    update: updateCamp,    remove: deleteCamp    },
  rafting: { getAll: getRaftings, create: createRafting, update: updateRafting, remove: deleteRafting },
  rental:  { getAll: getRentals,  create: createRental,  update: updateRental,  remove: deleteRental  },
};

export default function Activities() {
  const [tab, setTab]         = useState('camp');
  const [data, setData]       = useState({ camp: [], rafting: [], rental: [] });
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({});
  const [images, setImages]   = useState([]);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const fetchTab = async (t = tab) => {
    setLoading(true);
    try {
      const res = await API[t].getAll();
      const list = res.data?.camps || res.data?.raftings || res.data?.rentals || res.data || [];
      setData(prev => ({ ...prev, [t]: list }));
    } catch { /* keep existing */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTab(tab); }, [tab]);

  const openAdd  = () => { setForm({}); setImages([]); setEditId(null); setError(''); setModal('add'); };
  const openEdit = (item) => { setForm({ ...item }); setImages([]); setEditId(item._id); setError(''); setModal('edit'); };
  const close    = () => setModal(null);

  const save = async () => {
    setError('');
    const required = FIELDS[tab].filter(f => f.l.includes('*'));
    for (const f of required) {
      if (!form[f.k]) { setError(`${f.l.replace(' *', '')} is required.`); return; }
    }
    setSaving(true);
    try {
      const fd = buildFormData(form, images);
      if (modal === 'add') {
        await API[tab].create(fd);
      } else {
        await API[tab].update(editId, fd);
      }
      close();
      fetchTab();
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API[tab].remove(id);
      setData(prev => ({ ...prev, [tab]: prev[tab].filter(i => i._id !== id) }));
    } catch { alert('Delete failed.'); }
  };

  const items = data[tab];

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="activity-type-tabs">
          {TABS.map(t => (
            <button key={t} className={`activity-type-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'camp' ? '⛺' : t === 'rafting' ? '🚣' : '🎒'}
              {t.charAt(0).toUpperCase() + t.slice(1)}s
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => fetchTab()}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add {tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">No {tab}s found. Click "Add" to create one.</div>
      ) : (
        <div className="cards-grid">
          {items.map(item => (
            <div className="activity-card" key={item._id}>
              {item.images?.[0] && (
                <img src={item.images[0]} alt={item.name} className="activity-img" onError={e => e.target.style.display = 'none'} />
              )}
              <div className="activity-body">
                <div className="activity-header">
                  <h4>{item.name}</h4>
                  <span className="badge badge-success">Active</span>
                </div>
                <p className="activity-type" style={{ textTransform: 'capitalize' }}>{tab}</p>
                <p className="activity-desc">{item.description || '—'}</p>
                <div className="activity-meta">
                  <span>₹{(item.price || item.pricePerDay || 0).toLocaleString()}</span>
                  {item.location && <span>📍 {item.location}</span>}
                  {item.duration && <span>⏱ {item.duration}</span>}
                  {item.difficulty && <span>⚡ {item.difficulty}</span>}
                  {item.maxGuests && <span>👥 {item.maxGuests}</span>}
                  {item.maxPersons && <span>👥 {item.maxPersons}</span>}
                </div>
                <div className="activity-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(item)}><Pencil size={14} /> Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(item._id)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add' : 'Edit'} {tab.charAt(0).toUpperCase() + tab.slice(1)}</h3>
              <button className="icon-btn" onClick={close}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {error && <div className="auth-error" style={{ marginTop: 0 }}>{error}</div>}
              <div className="modal-form-grid">
                {FIELDS[tab].map(({ k, l, t, opts }) => (
                  t === 'textarea' ? (
                    <div className="form-group full-width" key={k}>
                      <label>{l}</label>
                      <textarea rows={3} value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                    </div>
                  ) : t === 'select' ? (
                    <div className="form-group" key={k}>
                      <label>{l}</label>
                      <select value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}>
                        <option value="">Select</option>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="form-group" key={k}>
                      <label>{l}</label>
                      <input type={t} value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                    </div>
                  )
                ))}
                <div className="form-group full-width">
                  <label>Images (max 10)</label>
                  <input type="file" multiple accept="image/*" className="file-input"
                    onChange={e => setImages(Array.from(e.target.files).slice(0, 10))} />
                  {images.length > 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{images.length} file(s) selected</p>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : null}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
