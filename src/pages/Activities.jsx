import { useState } from 'react';
import { activities as initial } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const empty = { name: '', type: 'Rafting', price: '', duration: '', capacity: '', description: '', status: 'Active', image: '' };
const TYPES = ['Rafting', 'Camp', 'Kayaking', 'Rental'];

export default function Activities() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const openAdd = () => { setForm(empty); setModal('add'); };
  const openEdit = (act) => { setForm(act); setEditId(act.id); setModal('edit'); };
  const close = () => setModal(null);

  const save = () => {
    if (!form.name || !form.price) return;
    if (modal === 'add') {
      setData(prev => [...prev, { ...form, id: `ACT${Date.now()}` }]);
    } else {
      setData(prev => prev.map(a => a.id === editId ? { ...form, id: editId } : a));
    }
    close();
  };

  const remove = (id) => setData(prev => prev.filter(a => a.id !== id));

  return (
    <div className="page">
      <div className="page-toolbar">
        <p className="toolbar-count">{data.length} activities</p>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Activity</button>
      </div>

      <div className="cards-grid">
        {data.map(act => (
          <div className="activity-card" key={act.id}>
            <img src={act.image} alt={act.name} className="activity-img" onError={e => e.target.style.display = 'none'} />
            <div className="activity-body">
              <div className="activity-header">
                <h4>{act.name}</h4>
                <StatusBadge status={act.status} />
              </div>
              <p className="activity-type">{act.type}</p>
              <p className="activity-desc">{act.description}</p>
              <div className="activity-meta">
                <span>₹{act.price}/person</span>
                <span>{act.duration}</span>
                <span>Cap: {act.capacity}</span>
              </div>
              <div className="activity-actions">
                <button className="btn btn-sm btn-outline" onClick={() => openEdit(act)}><Pencil size={14} /> Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(act.id)}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add Activity' : 'Edit Activity'}</h3>
              <button className="icon-btn" onClick={close}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Price (₹/person)', key: 'price', type: 'number' },
                { label: 'Duration', key: 'duration', type: 'text' },
                { label: 'Capacity', key: 'capacity', type: 'number' },
                { label: 'Image URL', key: 'image', type: 'text' },
              ].map(({ label, key, type }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
