import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, fetchUserBookings, updateBookingStatus } from '../redux/booking/thunk';
import { clearBookingError, clearUserBookingError } from '../redux/booking/slice';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';
import { Download, Search, RefreshCw, X, ShieldCheck, User } from 'lucide-react';

const ADMIN_STATUSES = ['All', 'draft', 'pending', 'confirmed', 'cancelled', 'completed'];
const USER_STATUSES = ['All', 'confirmed', 'pending', 'draft', 'cancelled', 'completed'];
const TYPES = ['All', 'camp', 'rafting', 'rental'];

const TYPE_ICON = { camp: '⛺', rafting: '🚣', rental: '🎒' };

// ── Shared table row ───────────────────────────────────────────
function BookingRow({ b, idx, updating, onStatusChange, showUser = true }) {
  const activityName = b.itemId?.name || '—';
  const activityLoc = b.itemId?.location || '';

  return (
    <tr key={b._id}>
      <td className="text-muted">{idx + 1}</td>
      <td className="mono-id">{b._id?.slice(-8).toUpperCase()}</td>
      {showUser && (
        <td>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13 }}>{b.user?.name || '—'}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.user?.phone || ''}</p>
          </div>
        </td>
      )}
      <td>
        <div>
          <p style={{ fontWeight: 600, fontSize: 13 }}>{activityName}</p>
          {activityLoc && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{activityLoc}</p>}
        </div>
      </td>
      <td>
        <span className="type-chip">
          {TYPE_ICON[b.bookingType] || ''} {b.bookingType || '—'}
        </span>
      </td>
      <td>{b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-IN') : b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—'}</td>
      <td className='d-flex justify-contetnt-center align-items-center'>{b.checkOut ? new Date(b.checkOut).toLocaleDateString('en-IN') : '—'}</td>
      <td>{b.guests ?? '—'}</td>
      <td><strong>₹{(b.totalAmount || 0).toLocaleString()}</strong></td>
      <td><StatusBadge status={b.paymentStatus || 'unpaid'} /></td>
      <td>
        <span style={{ fontSize: 12, fontWeight: 600, color: b.rentalAdded ? 'var(--success, #22c55e)' : 'var(--text-muted)' }}>
          {b.rentalAdded ? '✔ Yes' : '✘ No'}
        </span>
      </td>
      <td><StatusBadge status={b.status} /></td>
      <td>
        <select
          className="status-select"
          value={b.status}
          disabled={updating === b._id}
          onChange={e => onStatusChange(b._id, e.target.value)}
        >
          {['draft', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

export default function Bookings() {
  const dispatch = useDispatch();
  const {
    bookings, loading, error, updating,
    userBookings, userLoading, userError,
  } = useSelector(s => s.booking);

  const [activeTab, setActiveTab] = useState('admin');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [userStatus, setUserStatus] = useState('All');

  // ── Fetch admin bookings ───────────────────────────────────
  useEffect(() => {
    const params = {};
    if (filterStatus !== 'All') params.status = filterStatus;
    if (filterType !== 'All') params.bookingType = filterType;
    dispatch(fetchBookings(params));
  }, [dispatch, filterStatus, filterType]);

  // ── Fetch user bookings ────────────────────────────────────
  useEffect(() => {
    dispatch(fetchUserBookings(userStatus === 'All' ? '' : userStatus));
  }, [dispatch, userStatus]);

  const handleStatusChange = (id, status) => dispatch(updateBookingStatus({ id, status }));

  // ── Filter admin bookings client-side ──────────────────────
  const filteredAdmin = bookings.filter(b => {
    const name = b.user?.name || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      (b._id || '').toLowerCase().includes(search.toLowerCase());
    const matchDate = !filterDate || (b.createdAt || '').startsWith(filterDate);
    return matchSearch && matchDate;
  });

  // ── Filter user bookings client-side ───────────────────────
  const filteredUser = userBookings.filter(b => {
    const name = b.itemId?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (b._id || '').toLowerCase().includes(search.toLowerCase());
  });

  const exportCSV = (data) => {
    const headers = ['ID,User,Activity,Type,CheckIn,Guests,Amount,Payment,RentalAdded,Status'];
    const rows = data.map(b =>
      `${b._id},${b.user?.name || ''},${b.itemId?.name || ''},${b.bookingType || ''},${b.checkIn?.slice(0, 10) || ''},${b.guests || 0},${b.totalAmount || 0},${b.paymentStatus || ''},${b.rentalAdded ? 'Yes' : 'No'},${b.status}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${activeTab}-bookings.csv`;
    a.click();
  };

  const isAdminTab = activeTab === 'admin';
  const currentData = isAdminTab ? filteredAdmin : filteredUser;
  const currentLoading = isAdminTab ? loading : userLoading;
  const currentError = isAdminTab ? error : userError;

  if (currentLoading && currentData?.length === 0) return <PageLoader />;

  const colSpan = isAdminTab ? 12 : 11;

  return (
    <div className="page">

      {/* ── Tab switcher ── */}
      <div className="booking-tab-switcher">
        <button
          className={`booking-tab-btn ${isAdminTab ? 'active' : ''}`}
          onClick={() => { setActiveTab('admin'); setSearch(''); }}
        >
          <ShieldCheck size={15} /> All Bookings
        </button>
        <button
          className={`booking-tab-btn ${!isAdminTab ? 'active' : ''}`}
          onClick={() => { setActiveTab('user'); setSearch(''); }}
        >
          <User size={15} /> My Bookings
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="page-toolbar">
        <div className="filters">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder={isAdminTab ? 'Search by user or ID...' : 'Search by activity or ID...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {isAdminTab ? (
            <>
              <input type="date" className="filter-input" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              <select className="filter-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="filter-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {ADMIN_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </>
          ) : (
            <select className="filter-input" value={userStatus} onChange={e => setUserStatus(e.target.value)}>
              {USER_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline"
            disabled={currentLoading}
            onClick={() => isAdminTab
              ? dispatch(fetchBookings(filterStatus !== 'All' ? { status: filterStatus } : {}))
              : dispatch(fetchUserBookings(userStatus === 'All' ? '' : userStatus))
            }
          >
            <RefreshCw size={15} className={currentLoading ? 'spin-icon' : ''} />
          </button>
          <button className="btn btn-outline" onClick={() => exportCSV(currentData)}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {currentError && (
        <div className="auth-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{currentError}</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={() => dispatch(isAdminTab ? clearBookingError() : clearUserBookingError())}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Summary chips ── */}
      <div className="booking-summary">
        <span className="summary-chip total">Total: {currentData.length}</span>
        <span className="summary-chip confirmed">Confirmed: {currentData.filter(b => b.status === 'confirmed').length}</span>
        <span className="summary-chip pending">Pending: {currentData.filter(b => b.status === 'pending').length}</span>
        <span className="summary-chip cancelled">Cancelled: {currentData.filter(b => b.status === 'cancelled').length}</span>
      </div>

      {/* ── Table ── */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                {isAdminTab && <th>User</th>}
                <th>Activity</th>
                <th>Type</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Rental</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr><td colSpan={colSpan} className="empty-row">No bookings found</td></tr>
              ) : currentData.map((b, idx) => (
                <BookingRow
                  key={b._id}
                  b={b}
                  idx={idx}
                  updating={updating}
                  onStatusChange={handleStatusChange}
                  showUser={isAdminTab}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
