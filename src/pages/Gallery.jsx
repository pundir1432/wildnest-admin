import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../redux/gallery/thunk';
import PageLoader from '../components/PageLoader';
import { Plus, Pencil, Trash2, X, RefreshCw, Image } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CATEGORIES = ['all', 'camp', 'rafting', 'kayaking', 'rental', 'night', 'food', 'general', 'bungee'];

const CAT_ICONS = {
  all:      '🖼️',
  camp:     '⛺',
  rafting:  '🚣',
  kayaking: '🛶',
  rental:   '🎒',
  night:    '🌙',
  food:     '🍽️',
  general:  '📷',
  bungee:   '🪂',
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path}`;
};

export default function Gallery() {
  const dispatch = useDispatch();
  const { items, loading, saving, error } = useSelector(s => s.gallery);

  const [category, setCategory] = useState('all');
  const [modal,    setModal]    = useState(null);   // null | 'add' | 'edit'
  const [editItem, setEditItem] = useState(null);
  const [form,     setForm]     = useState({ title: '', category: 'general' });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [formErr,   setFormErr]   = useState('');
  const [lightbox,  setLightbox]  = useState(null); // full-screen preview

  useEffect(() => {
    dispatch(fetchGallery(category === 'all' ? '' : category));
  }, [dispatch, category]);

  const openAdd = () => {
    setForm({ title: '', category: 'general' });
    setImageFile(null); setPreview(null); setFormErr(''); setEditItem(null); setModal('add');
  };

  const openEdit = (item) => {
    setForm({ title: item.title || '', category: item.category || 'general' });
    setImageFile(null); setPreview(getImageUrl(item.image)); setFormErr(''); setEditItem(item); setModal('edit');
  };

  const close = () => { setModal(null); setPreview(null); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setFormErr('');
    if (modal === 'add' && !imageFile) { setFormErr('Image is required.'); return; }

    const fd = new FormData();
    if (imageFile) fd.append('image', imageFile);
    if (form.title)    fd.append('title', form.title);
    if (form.category) fd.append('category', form.category);

    try {
      if (modal === 'add') {
        await dispatch(createGalleryItem(fd)).unwrap();
      } else {
        await dispatch(updateGalleryItem({ id: editItem._id, formData: fd })).unwrap();
      }
      close();
    } catch (e) {
      setFormErr(typeof e === 'string' ? e : 'Save failed.');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this image?')) return;
    dispatch(deleteGalleryItem(id));
  };

  if (loading && items.length === 0) return <PageLoader />;

  return (
    <div className="page">

      {/* ── Toolbar ── */}
      <div className="page-toolbar">
        <div className="gallery-cat-tabs">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`gallery-cat-btn ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {CAT_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => dispatch(fetchGallery(category === 'all' ? '' : category))} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={15} /> Add Image
          </button>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {/* ── Count ── */}
      <p className="toolbar-count">{items.length} image{items.length !== 1 ? 's' : ''}</p>

      {/* ── Grid ── */}
      {items.length === 0 ? (
        <div className="empty-state">
          <Image size={40} style={{ marginBottom: 8, opacity: 0.3 }} />
          <p>No images found. Click "Add Image" to upload.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {items.map(item => (
            <div className="gallery-card" key={item._id}>
              <div className="gallery-img-wrap" onClick={() => setLightbox(item)}>
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || ''}
                    className="gallery-img"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="gallery-img-placeholder"><Image size={32} /></div>
                )}
                <div className="gallery-overlay">
                  <span className="gallery-zoom">🔍 View</span>
                </div>
              </div>
              <div className="gallery-info">
                <div className="gallery-info-top">
                  <p className="gallery-title">{item.title || 'Untitled'}</p>
                  <span className="gallery-cat-badge">{CAT_ICONS[item.category] || '📷'} {item.category || 'general'}</span>
                </div>
                <div className="gallery-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(item)}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)} disabled={saving}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Upload Image' : 'Edit Image'}</h3>
              <button className="icon-btn" onClick={close}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {formErr && <div className="auth-error" style={{ marginTop: 0 }}>{formErr}</div>}

              {/* Image upload area */}
              <div className="gallery-upload-area" onClick={() => document.getElementById('gallery-file-input').click()}>
                {preview ? (
                  <img src={preview} alt="preview" className="gallery-upload-preview" />
                ) : (
                  <>
                    <Image size={36} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click to select image</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
              <input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFile}
              />

              <div className="form-group">
                <label>Title <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. River Rafting Adventure"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['camp', 'rafting', 'kayaking', 'rental', 'night', 'food', 'general', 'bungee'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : null}
                {saving ? 'Saving...' : modal === 'add' ? 'Upload' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><X size={22} /></button>
          <img
            src={getImageUrl(lightbox.image)}
            alt={lightbox.title || ''}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.title && <p className="lightbox-caption">{lightbox.title}</p>}
        </div>
      )}
    </div>
  );
}
