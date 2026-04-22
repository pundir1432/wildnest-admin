import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react';

import { fetchCamps, createCamp, updateCamp, deleteCamp }       from '../redux/camp/thunnk';
import { fetchRaftings, createRafting, updateRafting, deleteRafting } from '../redux/rafting/thunk';
import { fetchRentals, createRental, updateRental, deleteRental }     from '../redux/rental/thunk';

// ── Field config per type ──────────────────────────────────────
const FIELDS = {
  camp: [
    { k: 'name',        l: 'Name',        t: 'text',   req: true  },
    { k: 'location',    l: 'Location',    t: 'text',   req: true  },
    { k: 'price',       l: 'Price (₹)',   t: 'number', req: true  },
    { k: 'maxGuests',   l: 'Max Guests',  t: 'number', req: false },
    { k: 'amenities',   l: 'Amenities (comma separated)', t: 'text', req: false },
    { k: 'description', l: 'Description', t: 'textarea', req: false },
  ],
  rafting: [
    { k: 'name',        l: 'Name',        t: 'text',   req: true  },
    { k: 'location',    l: 'Location',    t: 'text',   req: true  },
    { k: 'price',       l: 'Price (₹)',   t: 'number', req: true  },
    { k: 'duration',    l: 'Duration',    t: 'text',   req: false },
    { k: 'difficulty',  l: 'Difficulty',  t: 'select', req: false, opts: ['Easy', 'Medium', 'Hard'] },
    { k: 'maxPersons',  l: 'Max Persons', t: 'number', req: false },
    { k: 'description', l: 'Description', t: 'textarea', req: false },
  ],
  rental: [
    { k: 'name',        l: 'Name',             t: 'text',   req: true  },
    { k: 'type',        l: 'Type',             t: 'select', req: true, opts: ['Scooter', 'Bike', 'Car', 'Other'] },
    { k: 'pricePerDay', l: 'Price Per Day (₹)', t: 'number', req: true  },
    { k: 'description', l: 'Description',      t: 'textarea', req: false },
  ],
};

// ── Table columns per type ─────────────────────────────────────
const COLS = {
  camp:    ['Name', 'Location', 'Price', 'Max Guests', 'Amenities'],
  rafting: ['Name', 'Location', 'Price', 'Duration', 'Difficulty', 'Max Persons'],
  rental:  ['Name', 'Type', 'Price/Day'],
};

const buildFormData = (fields, files = []) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') fd.append(k, v); });
  files.forEach(f => fd.append('images', f));
  return fd;
};

const TABS = ['camp', 'rafting', 'rental'];
const ICONS = { camp: '⛺', rafting: '🚣', rental: '🎒' };

export default function Store() {
  const dispatch = useDispatch();
  const campState    = useSelector(s => s.camp);
  const raftingState = useSelector(s => s.rafting);
  const rentalState  = useSelector(s => s.rental);

  const [tab, setTab]       = useState('camp');
  const [modal, setModal]   = useState(null);   // null | 'add' | 'edit'
  const [form, setForm]     = useState({});
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formErr, setFormErr] = useState('');

  // ── Selectors per tab ──────────────────────────────────────
  const stateMap = { camp: campState, rafting: raftingState, rental: rentalState };
  const { loading, saving, error } = stateMap[tab];
  const items = tab === 'camp' ? campState.camps : tab === 'rafting' ? raftingState.raftings : rentalState.rentals;

  // ── Fetch on tab change ────────────────────────────────────
  useEffect(() => {
    if (tab === 'camp'    && campState.camps.length    === 0) dispatch(fetchCamps());
    if (tab === 'rafting' && raftingState.raftings.length === 0) dispatch(fetchRaftings());
    if (tab === 'rental'  && rentalState.rentals.length  === 0) dispatch(fetchRentals());
  }, [tab]);

  const refresh = () => {
    if (tab === 'camp')    dispatch(fetchCamps());
    if (tab === 'rafting') dispatch(fetchRaftings());
    if (tab === 'rental')  dispatch(fetchRentals());
  };

  // ── Modal helpers ──────────────────────────────────────────
  const openAdd  = () => { setForm({}); setImages([]); setEditId(null); setFormErr(''); setModal('add'); };
  const openEdit = (item) => {
    const f = {};
    FIELDS[tab].forEach(({ k }) => { if (item[k] !== undefined) f[k] = item[k]; });
    setForm(f); setImages([]); setEditId(item._id); setFormErr(''); setModal('edit');
  };
  const close = () => setModal(null);
  const setF  = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Save (create / update) ─────────────────────────────────
  const handleSave = async () => {
    setFormErr('');
    const required = FIELDS[tab].filter(f => f.req);
    for (const f of required) {
      if (!form[f.k]) { setFormErr(`${f.l} is required.`); return; }
    }
    const fd = buildFormData(form, images);
    try {
      if (modal === 'add') {
        if (tab === 'camp')    await dispatch(createCamp(fd)).unwrap();
        if (tab === 'rafting') await dispatch(createRafting(fd)).unwrap();
        if (tab === 'rental')  await dispatch(createRental(fd)).unwrap();
      } else {
        if (tab === 'camp')    await dispatch(updateCamp({ id: editId, formData: fd })).unwrap();
        if (tab === 'rafting') await dispatch(updateRafting({ id: editId, formData: fd })).unwrap();
        if (tab === 'rental')  await dispatch(updateRental({ id: editId, formData: fd })).unwrap();
      }
      close();
    } catch (e) {
      setFormErr(typeof e === 'string' ? e : 'Save failed. Please try again.');
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!window.confirm('Delete this item?')) return;
    if (tab === 'camp')    dispatch(deleteCamp(id));
    if (tab === 'rafting') dispatch(deleteRafting(id));
    if (tab === 'rental')  dispatch(deleteRental(id));
  };

  // ── Table row renderer ─────────────────────────────────────
  const renderRow = (item) => {
    if (tab === 'camp') return (
      <>
        <td>{item.name}</td>
        <td>{item.location || '—'}</td>
        <td>₹{(item.price || 0).toLocaleString()}</td>
        <td>{item.maxGuests || '—'}</td>
        <td>{item.amenities || '—'}</td>
      </>
    );
    if (tab === 'rafting') return (
      <>
        <td>{item.name}</td>
        <td>{item.location || '—'}</td>
        <td>₹{(item.price || 0).toLocaleString()}</td>
        <td>{item.duration || '—'}</td>
        <td>{item.difficulty || '—'}</td>
        <td>{item.maxPersons || '—'}</td>
      </>
    );
    if (tab === 'rental') return (
      <>
        <td>{item.name}</td>
        <td>{item.type || '—'}</td>
        <td>₹{(item.pricePerDay || 0).toLocaleString()}/day</td>
      </>
    );
  };

  const colCount = COLS[tab].length + 2; // +2 for image col + actions

  return (
    <div className="page">

      {/* ── Toolbar ── */}
      <div className="page-toolbar">
        <div className="activity-type-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`activity-type-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}s
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={refresh} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        </div>
      </div>

      {/* ── API error ── */}
      {error && <div className="auth-error">{error}</div>}

      {/* ── Table ── */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                {COLS[tab].map(c => <th key={c}>{c}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={colCount} className="empty-row">Loading {tab}s...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={colCount} className="empty-row">No {tab}s found. Click "Add" to create one.</td></tr>
              ) : items.map(item => (
                <tr key={item._id}>
                  <td>
                    {item.images?.[0]
                      ? <img src={item.images[0]} alt="" className="table-thumb" onError={e => e.target.style.display = 'none'} />
                      : <div className="table-thumb-placeholder">{ICONS[tab]}</div>
                    }
                  </td>
                  {renderRow(item)}
                  <td>
                    <div className="action-cell">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(item)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)} disabled={saving}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add' : 'Edit'} {ICONS[tab]} {tab.charAt(0).toUpperCase() + tab.slice(1)}</h3>
              <button className="icon-btn" onClick={close}><X size={20} /></button>
            </div>

            <div className="modal-body">
              {formErr && <div className="auth-error" style={{ marginTop: 0 }}>{formErr}</div>}

              <div className="modal-form-grid">
                {FIELDS[tab].map(({ k, l, t, req, opts }) =>
                  t === 'textarea' ? (
                    <div className="form-group full-width" key={k}>
                      <label>{l}</label>
                      <textarea rows={3} value={form[k] || ''} onChange={e => setF(k, e.target.value)} />
                    </div>
                  ) : t === 'select' ? (
                    <div className="form-group" key={k}>
                      <label>{l}{req ? ' *' : ''}</label>
                      <select value={form[k] || ''} onChange={e => setF(k, e.target.value)}>
                        <option value="">Select</option>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="form-group" key={k}>
                      <label>{l}{req ? ' *' : ''}</label>
                      <input
                        type={t}
                        value={form[k] || ''}
                        onChange={e => setF(k, e.target.value)}
                      />
                    </div>
                  )
                )}

                <div className="form-group full-width">
                  <label>Images (max 10)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="file-input"
                    onChange={e => setImages(Array.from(e.target.files).slice(0, 10))}
                  />
                  {images.length > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      {images.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : null}
                {saving ? 'Saving...' : modal === 'add' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
