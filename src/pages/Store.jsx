import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import PageLoader from '../components/PageLoader';

import { fetchCamps, createCamp, updateCamp, deleteCamp }            from '../redux/camp/thunnk';
import { fetchRaftings, createRafting, updateRafting, deleteRafting } from '../redux/rafting/thunk';
import { fetchRentals, createRental, updateRental, deleteRental }     from '../redux/rental/thunk';

const TABS  = ['camp', 'rafting', 'rental'];
const ICONS = { camp: '⛺', rafting: '🚣', rental: '🎒' };
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path}`;
};

// ── Field configs ──────────────────────────────────────────────
const FIELDS = {
  camp: [
    { k: 'name',           l: 'Name',                          t: 'text',     req: true  },
    { k: 'location',       l: 'Location',                      t: 'text',     req: true  },
    { k: 'price',          l: 'Price (₹)',                     t: 'number',   req: true  },
    { k: 'maxGuests',      l: 'Max Guests',                    t: 'number',   req: false },
    { k: 'duration',       l: 'Duration (e.g. 2 Days)',        t: 'text',     req: false },
    { k: 'checkIn',        l: 'Check-In Time',                 t: 'text',     req: false, ph: '11:00 AM' },
    { k: 'checkOut',       l: 'Check-Out Time',                t: 'text',     req: false, ph: '10:00 AM' },
    { k: 'season',         l: 'Season',                        t: 'text',     req: false, ph: 'All Seasons' },
    { k: 'amenities',      l: 'Amenities (comma separated)',   t: 'text',     req: false, ph: 'Bonfire,Tent,WiFi' },
    { k: 'idealFor',       l: 'Ideal For (comma separated)',   t: 'text',     req: false, ph: 'Couples,Friends,Family' },
    { k: 'notes',          l: 'Notes (comma separated)',       t: 'text',     req: false, ph: 'Bring warm clothes,No pets' },
    { k: 'availableDates', l: 'Available Dates (comma separated)', t: 'text', req: false, ph: '2024-12-01,2024-12-02' },
    { k: 'description',    l: 'Description',                   t: 'textarea', req: false },
  ],
  rafting: [
    { k: 'name',           l: 'Name',                          t: 'text',     req: true  },
    { k: 'location',       l: 'Location',                      t: 'text',     req: true  },
    { k: 'price',          l: 'Price (₹)',                     t: 'number',   req: true  },
    { k: 'duration',       l: 'Duration (e.g. 2 Hours)',       t: 'text',     req: false },
    { k: 'distanceKm',     l: 'Distance (km)',                 t: 'number',   req: true  },
    { k: 'startPoint',     l: 'Start Point (Yahan Se)',        t: 'text',     req: true  },
    { k: 'endPoint',       l: 'End Point (Yahan Tak)',         t: 'text',     req: true  },
    { k: 'difficulty',     l: 'Difficulty',                    t: 'select',   req: false, opts: ['Easy', 'Medium', 'Hard'] },
    { k: 'maxPersons',     l: 'Max Persons',                   t: 'number',   req: false },
    { k: 'checkIn',        l: 'Start Time',                    t: 'text',     req: false, ph: '09:00 AM' },
    { k: 'season',         l: 'Season',                        t: 'text',     req: false, ph: 'Oct-March' },
    { k: 'idealFor',       l: 'Ideal For (comma separated)',   t: 'text',     req: false, ph: 'Adventure lovers' },
    { k: 'notes',          l: 'Notes (comma separated)',       t: 'text',     req: false, ph: 'Swimming not required' },
    { k: 'availableDates', l: 'Available Dates (comma separated)', t: 'text', req: false, ph: '2024-12-01,2024-12-02' },
    { k: 'description',    l: 'Description',                   t: 'textarea', req: false },
  ],
  rental: [
    { k: 'name',           l: 'Name',                          t: 'text',     req: true  },
    { k: 'type',           l: 'Type',                          t: 'select',   req: true,  opts: ['Scooter', 'Bike', 'Car', 'Other'] },
    { k: 'pricePerDay',    l: 'Price Per Day (₹)',             t: 'number',   req: true  },
    { k: 'season',         l: 'Season',                        t: 'text',     req: false, ph: 'All Seasons' },
    { k: 'idealFor',       l: 'Ideal For (comma separated)',   t: 'text',     req: false, ph: 'Solo riders' },
    { k: 'notes',          l: 'Notes (comma separated)',       t: 'text',     req: false, ph: 'Helmet included,Fuel extra' },
    { k: 'description',    l: 'Description',                   t: 'textarea', req: false },
  ],
};

// ── Table columns ──────────────────────────────────────────────
const COLS = {
  camp:    ['Name', 'Location', 'Price', 'Duration', 'Season', 'Max Guests'],
  rafting: ['Name', 'Location', 'Price', 'Duration', 'Difficulty', 'Max Persons'],
  rental:  ['Name', 'Type', 'Price/Day', 'Season'],
};

// ── Serialize form → FormData ──────────────────────────────────
// Comma-separated fields → sent as-is (server splits them)
// itinerary → JSON string
// availableDates → JSON string array
const buildPayload = (form, images, itinerary) => {
  const fd = new FormData();

  Object.entries(form).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    fd.append(k, v);
  });

  // itinerary: append each item as indexed fields so server parses as array of objects
  const validItinerary = itinerary.filter(r => r.title || r.description);
  validItinerary.forEach((row, i) => {
    fd.append(`itinerary[${i}][title]`, row.title || '');
    fd.append(`itinerary[${i}][description]`, row.description || '');
  });

  // availableDates: comma string → JSON array of valid dates only
  if (form.availableDates) {
    const dates = form.availableDates.split(',').map(d => d.trim()).filter(d => d && !isNaN(Date.parse(d)));
    if (dates.length > 0) fd.set('availableDates', JSON.stringify(dates));
    else fd.delete('availableDates');
  }

  images.forEach(f => fd.append('images', f));
  return fd;
};

// ── Edit: flatten array fields back to comma strings ──────────
const flattenItem = (item, tab) => {
  const f = {};
  FIELDS[tab].forEach(({ k }) => {
    const v = item[k];
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      // availableDates array → comma string
      f[k] = v.join(',');
    } else {
      f[k] = v;
    }
  });
  return f;
};

export default function Store() {
  const dispatch = useDispatch();
  const campState    = useSelector(s => s.camp);
  const raftingState = useSelector(s => s.rafting);
  const rentalState  = useSelector(s => s.rental);

  const [tab,      setTab]      = useState('camp');
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState({});
  const [images,   setImages]   = useState([]);
  const [editId,   setEditId]   = useState(null);
  const [formErr,  setFormErr]  = useState('');
  // itinerary rows: [{ title, description }]
  const [itinerary, setItinerary] = useState([{ title: '', description: '' }]);

  const stateMap = { camp: campState, rafting: raftingState, rental: rentalState };
  const { loading, saving, error } = stateMap[tab];
  const items = tab === 'camp' ? campState.camps : tab === 'rafting' ? raftingState.raftings : rentalState.rentals;

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

  const openAdd = () => {
    setForm({}); setImages([]); setEditId(null); setFormErr('');
    setItinerary([{ title: '', description: '' }]);
    setModal('add');
  };

  const openEdit = (item) => {
    setForm(flattenItem(item, tab));
    setImages([]); setEditId(item._id); setFormErr('');
    // restore itinerary
    const it = Array.isArray(item.itinerary) && item.itinerary.length > 0
      ? item.itinerary
      : [{ title: '', description: '' }];
    setItinerary(it);
    setModal('edit');
  };

  const close = () => setModal(null);
  const setF  = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // itinerary row helpers
  const setItRow = (i, k, v) => setItinerary(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const addItRow = () => setItinerary(prev => [...prev, { title: '', description: '' }]);
  const removeItRow = (i) => setItinerary(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setFormErr('');
    const required = FIELDS[tab].filter(f => f.req);
    for (const f of required) {
      if (!form[f.k]) { setFormErr(`${f.l.replace(' *', '')} is required.`); return; }
    }
    const fd = buildPayload(form, images, itinerary);
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

  const handleDelete = (id) => {
    if (!window.confirm('Delete this item?')) return;
    if (tab === 'camp')    dispatch(deleteCamp(id));
    if (tab === 'rafting') dispatch(deleteRafting(id));
    if (tab === 'rental')  dispatch(deleteRental(id));
  };

  const renderRow = (item) => {
    if (tab === 'camp') return (
      <>
        <td>{item.name}</td>
        <td>{item.location || '—'}</td>
        <td>₹{(item.price || 0).toLocaleString()}</td>
        <td>{item.duration || '—'}</td>
        <td>{item.season || '—'}</td>
        <td>{item.maxGuests || '—'}</td>
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
        <td>{item.season || '—'}</td>
      </>
    );
  };

  const colCount = COLS[tab].length + 2;
  const showItinerary = tab === 'camp' || tab === 'rafting';

  if (loading && items.length === 0) return <PageLoader />;

  return (
    <div className="page">
      {/* ── Toolbar ── */}
      <div className="page-toolbar">
        <div className="activity-type-tabs">
          {TABS.map(t => (
            <button key={t} className={`activity-type-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
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
                      ? <img src={getImageUrl(item.images[0])} alt="" className="table-thumb" onError={e => e.target.style.display = 'none'} />
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
          <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add' : 'Edit'} {ICONS[tab]} {tab.charAt(0).toUpperCase() + tab.slice(1)}</h3>
              <button className="icon-btn" onClick={close}><X size={20} /></button>
            </div>

            <div className="modal-body">
              {formErr && <div className="auth-error" style={{ marginTop: 0 }}>{formErr}</div>}

              <div className="modal-form-grid">
                {FIELDS[tab].map(({ k, l, t, req, opts, ph }) =>
                  t === 'textarea' ? (
                    <div className="form-group full-width" key={k}>
                      <label>{l}{req ? ' *' : ''}</label>
                      <textarea rows={3} placeholder={ph || ''} value={form[k] || ''} onChange={e => setF(k, e.target.value)} />
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
                      <input type={t} placeholder={ph || ''} value={form[k] || ''} onChange={e => setF(k, e.target.value)} />
                    </div>
                  )
                )}

                {/* Images */}
                <div className="form-group full-width">
                  <label>Images (max 10)</label>
                  <input type="file" multiple accept="image/*" className="file-input"
                    onChange={e => setImages(Array.from(e.target.files).slice(0, 10))} />
                  {images.length > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{images.length} file(s) selected</p>
                  )}
                </div>
              </div>

              {/* ── Itinerary (camp + rafting only) ── */}
              {showItinerary && (
                <div className="itinerary-section">
                  <div className="itinerary-header">
                    <span className="itinerary-title">Itinerary</span>
                    <button type="button" className="btn btn-sm btn-outline" onClick={addItRow}>
                      <Plus size={13} /> Add Day
                    </button>
                  </div>
                  {itinerary.map((row, i) => (
                    <div className="itinerary-row" key={i}>
                      <div className="itinerary-day-badge">Day {i + 1}</div>
                      <div className="itinerary-fields">
                        <input
                          placeholder="Title (e.g. Arrival & Camp Setup)"
                          value={row.title}
                          onChange={e => setItRow(i, 'title', e.target.value)}
                        />
                        <input
                          placeholder="Description"
                          value={row.description}
                          onChange={e => setItRow(i, 'description', e.target.value)}
                        />
                      </div>
                      {itinerary.length > 1 && (
                        <button type="button" className="icon-btn" onClick={() => removeItRow(i)}>
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
