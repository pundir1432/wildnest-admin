import { useState } from 'react';
import { slots as initial } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Plus, Ban, Trash2, X } from 'lucide-react';

const ACTIVITIES = ['Rafting', 'Camp', 'Kayaking', 'Rental'];
const empty = { activity: 'Rafting', date: '', time: '', capacity: '', status: 'Available' };

export default function Slots() {
  const [data, setData] = useState(initial);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [filterActivity, setFilterActivity] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const filtered = data.filter(s => {
    const matchA = filterActivity === 'All' || s.activity === filterActivity;
    const matchD = !filterDate || s.date === filterDate;
    return matchA && matchD;
  });

  const addSlot = () => {
    if (!form.date || !form.time || !form.capacity) return;
    setData(prev => [...prev, { ...form, id: `SL${Date.now()}`, booked: 0 }]);
    setModal(false); setForm(empty);
  };

  const toggleBlock = (id) => {
    setData(prev => prev.map(s => s.id === id
      ? { ...s, status: s.status === 'Blocked' ? 'Available' : 'Blocked' }
      : s
    ));
  };

  const remove = (id) => setData(prev => prev.filter(s => s.id !== id));

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="filters">
          <input type="date" className="filter-input" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          <select className="filter-input" value={filterActivity} onChange={e => setFilterActivity(e.target.value)}>
            <option>All</option>
            {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Slot</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Activity</th><th>Date</th><th>Time</th><th>Capacity</th><th>Booked</th><th>Available</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.activity}</td>
                <td>{s.date}</td>
                <td>{s.time}</td>
                <td>{s.capacity}</td>
                <td>{s.booked}</td>
                <td>{Math.max(0, s.capacity - s.booked)}</td>
                <td><StatusBadge status={s.status} /></td>
                <td className="action-cell">
                  <button className="btn btn-sm btn-outline" onClick={() => toggleBlock(s.id)}>
                    <Ban size={14} /> {s.status === 'Blocked' ? 'Unblock' : 'Block'}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(s.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Slot</h3>
              <button className="icon-btn" onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Activity</label>
                <select value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}>
                  {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addSlot}>Add Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
