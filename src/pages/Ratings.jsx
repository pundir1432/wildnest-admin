import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRatings, deleteRating } from '../redux/ratings/thunk';
import PageLoader from '../components/PageLoader';
import { RefreshCw, Trash2, Star } from 'lucide-react';

const FILTERS = ['all', 'camp', 'rafting', 'rental'];

const StarRow = ({ rating }) => (
  <div className="star-row">
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={14}
        fill={s <= rating ? '#f59e0b' : 'none'}
        stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
      />
    ))}
    <span className="star-value">{rating}/5</span>
  </div>
);

const avgRating = (ratings) => {
  if (!ratings.length) return 0;
  return (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1);
};

export default function Ratings() {
  const dispatch = useDispatch();
  const { ratings, total, loading, error } = useSelector(s => s.ratings);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchRatings(filter === 'all' ? '' : filter));
  }, [dispatch, filter]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this rating?')) return;
    dispatch(deleteRating(id));
  };

  const filtered = ratings.filter(r => {
    const name  = r.userId?.name  || '';
    const item  = r.campId?.name  || r.raftingId?.name || r.rentalId?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
           item.toLowerCase().includes(search.toLowerCase());
  });

  const avg = avgRating(filtered);

  if (loading && ratings.length === 0) return <PageLoader />;

  return (
    <div className="page">

      {/* ── Toolbar ── */}
      <div className="page-toolbar">
        <div className="activity-type-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`activity-type-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '⭐ All' : f === 'camp' ? '⛺ Camp' : f === 'rafting' ? '🚣 Rafting' : '🎒 Rental'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => dispatch(fetchRatings(filter === 'all' ? '' : filter))} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {/* ── Summary cards ── */}
      <div className="ratings-summary">
        <div className="rating-summary-card">
          <p className="rating-summary-label">Total Reviews</p>
          <p className="rating-summary-value">{total}</p>
        </div>
        <div className="rating-summary-card">
          <p className="rating-summary-label">Average Rating</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="rating-summary-value">{avg}</p>
            <StarRow rating={Math.round(avg)} />
          </div>
        </div>
        <div className="rating-summary-card">
          <p className="rating-summary-label">5 ⭐ Reviews</p>
          <p className="rating-summary-value">{ratings.filter(r => r.rating === 5).length}</p>
        </div>
        <div className="rating-summary-card">
          <p className="rating-summary-label">Showing</p>
          <p className="rating-summary-value">{filtered.length}</p>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="search-box" style={{ maxWidth: 320 }}>
        <Star size={15} />
        <input
          placeholder="Search by user or activity..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Ratings table ── */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Activity</th>
                <th>Type</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Booking</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="empty-row">No ratings found</td></tr>
              ) : filtered.map((r, idx) => {
                const activityName = r.campId?.name || r.raftingId?.name || r.rentalId?.name || '—';
                const activityLoc  = r.campId?.location || r.raftingId?.location || '—';
                const itemType     = r.campId ? 'camp' : r.raftingId ? 'rafting' : r.rentalId ? 'rental' : '—';
                return (
                  <tr key={r._id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{r.userId?.name || '—'}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.userId?.email || ''}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{activityName}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{activityLoc}</p>
                      </div>
                    </td>
                    <td>
                      <span className="type-chip">
                        {itemType === 'camp' ? '⛺' : itemType === 'rafting' ? '🚣' : itemType === 'rental' ? '🎒' : ''}
                        {' '}{itemType}
                      </span>
                    </td>
                    <td><StarRow rating={r.rating} /></td>
                    <td>
                      <p className="rating-review-text">{r.review || <span style={{ color: 'var(--text-muted)' }}>No review</span>}</p>
                    </td>
                    <td>
                      {r.bookingId ? (
                        <div>
                          <span className={`badge ${r.bookingId.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                            {r.bookingId.status}
                          </span>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                            ₹{(r.bookingId.totalAmount || 0).toLocaleString()}
                          </p>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(r._id)}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
