import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../redux/booking/thunk';
import { clearBookingError } from '../redux/booking/slice';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';
import { Download, Search, RefreshCw, X } from 'lucide-react';

const STATUSES = ['All', 'draft', 'pending', 'confirmed', 'cancelled', 'completed'];
const TYPES    = ['All', 'camp', 'rafting', 'rental'];

export default function Bookings() {
  const dispatch = useDispatch();
  const { bookings, loading, error, updating } = useSelector(s => s.booking);

  const [search,       setSearch]       = useState('');
  const [filterType,   setFilterType]   = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate,   setFilterDate]   = useState('');

  // ── Fetch on mount + filter change ────────────────────────
  useEffect(() => {
    const params = {};
    if (filterStatus !== 'All') params.status      = filterStatus;
    if (filterType   !== 'All') params.bookingType = filterType;
    dispatch(fetchBookings(params));
  }, [dispatch, filterStatus, filterType]);

  // ── Status update ──────────────────────────────────────────
  const handleStatusChange = (id, status) => {
    dispatch(updateBookingStatus({ id, status }));
  };

  // ── Client-side search + date filter ──────────────────────
  const filtered = bookings.filter(b => {
    const name = b.user?.name || b.userName || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                        (b._id || '').toLowerCase().includes(search.toLowerCase());
    const matchDate   = !filterDate || (b.createdAt || '').startsWith(filterDate);
    return matchSearch && matchDate;
  });

  // ── CSV export ─────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['ID,User,Phone,Type,Date,Amount,Payment,Status'];
    const rows = filtered.map(b =>
      `${b._id},${b.user?.name || ''},${b.user?.phone || ''},${b.bookingType || ''},${b.createdAt?.slice(0, 10) || ''},${b.totalAmount || 0},${b.paymentStatus || ''},${b.status}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bookings.csv';
    a.click();
  };

  const refetch = () => {
    const params = {};
    if (filterStatus !== 'All') params.status      = filterStatus;
    if (filterType   !== 'All') params.bookingType = filterType;
    dispatch(fetchBookings(params));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="filters">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search by user name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="filter-input"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <select className="filter-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="filter-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={refetch} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          </button>
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="auth-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={() => dispatch(clearBookingError())}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Summary chips ── */}
      <div className="booking-summary">
        <span className="summary-chip total">Total: {bookings.length}</span>
        <span className="summary-chip confirmed">Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
        <span className="summary-chip pending">Pending: {bookings.filter(b => b.status === 'pending').length}</span>
        <span className="summary-chip cancelled">Cancelled: {bookings.filter(b => b.status === 'cancelled').length}</span>
      </div>

      {/* ── Table ── */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>User</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="empty-row">Loading bookings...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="empty-row">No bookings found</td></tr>
              ) : filtered.map((b, idx) => (
                <tr key={b._id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="mono-id">{b._id?.slice(-8).toUpperCase()}</td>
                  <td>{b.user?.name || b.userName || '—'}</td>
                  <td>{b.user?.phone || '—'}</td>
                  <td>
                    <span className="type-chip">
                      {b.bookingType === 'camp' ? '⛺' : b.bookingType === 'rafting' ? '🚣' : b.bookingType === 'rental' ? '🎒' : '—'}
                      {' '}{b.bookingType || '—'}
                    </span>
                  </td>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td><strong>₹{(b.totalAmount || 0).toLocaleString()}</strong></td>
                  <td><StatusBadge status={b.paymentStatus || 'pending'} /></td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <select
                      className="status-select"
                      value={b.status}
                      disabled={updating === b._id}
                      onChange={e => handleStatusChange(b._id, e.target.value)}
                    >
                      {['draft', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
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
