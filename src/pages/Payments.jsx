import { useState, useEffect } from 'react';
import { getPaymentDashboard } from '../services/dashboardService';
import { getBookings } from '../services/bookingService';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';

const PERIODS = ['Weekly', 'Monthly'];

const weeklyData = [
  { day: 'Mon', revenue: 8400 }, { day: 'Tue', revenue: 12600 },
  { day: 'Wed', revenue: 9800 }, { day: 'Thu', revenue: 15200 },
  { day: 'Fri', revenue: 18900 }, { day: 'Sat', revenue: 24300 }, { day: 'Sun', revenue: 21000 },
];
const monthlyData = [
  { month: 'Jan', revenue: 45000 }, { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 }, { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 74000 }, { month: 'Jun', revenue: 89000 },
  { month: 'Jul', revenue: 110200 },
];

export default function Payments() {
  const [period, setPeriod]           = useState('Weekly');
  const [filterStatus, setFilterStatus] = useState('All');
  const [payDash, setPayDash]         = useState(null);
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pd, bk] = await Promise.all([
        getPaymentDashboard(),
        getBookings(),
      ]);
      setPayDash(pd.data);
      setBookings(bk.data?.bookings || bk.data || []);
    } catch { /* keep empty */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const chartData = period === 'Monthly' ? monthlyData : weeklyData;
  const xKey      = period === 'Monthly' ? 'month' : 'day';

  const filtered = bookings.filter(b =>
    filterStatus === 'All' || b.paymentStatus === filterStatus.toLowerCase()
  );

  const exportCSV = () => {
    const headers = ['ID,User,Type,Amount,Payment,Status,Date'];
    const rows = filtered.map(b =>
      `${b._id},${b.user?.name || ''},${b.bookingType || ''},${b.totalAmount || 0},${b.paymentStatus || ''},${b.status},${b.createdAt?.slice(0, 10) || ''}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'payments.csv'; a.click();
  };

  const stats = [
    { label: 'Total Revenue',      value: `₹${(payDash?.totalRevenue || 0).toLocaleString()}`,  color: '#16a34a' },
    { label: 'Paid Bookings',      value: payDash?.paidBookings ?? '—',                          color: '#2563eb' },
    { label: 'Unpaid Bookings',    value: payDash?.unpaidBookings ?? '—',                        color: '#d97706' },
    { label: 'Refunded Bookings',  value: payDash?.refundedBookings ?? '—',                      color: '#dc2626' },
  ];

  return (
    <div className="page">
      <div className="stats-grid">
        {stats.map(({ label, value, color }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <span style={{ fontSize: 20, fontWeight: 700 }}>₹</span>
            </div>
            <div className="stat-info">
              <p className="stat-label">{label}</p>
              <p className="stat-value">{loading ? '...' : value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-toolbar">
          <h3 className="card-title">Revenue Report</h3>
          <div className="period-tabs">
            {PERIODS.map(p => (
              <button key={p} className={`tab-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          {period === 'Monthly' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <h3 className="card-title">Transaction History</h3>
          <div className="filters">
            <select className="filter-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {['All', 'Paid', 'Pending', 'Refunded'].map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-outline" onClick={fetchAll}><RefreshCw size={15} /></button>
            <button className="btn btn-primary" onClick={exportCSV}><Download size={15} /> Export</button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="empty-row">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-row">No transactions found</td></tr>
              ) : filtered.map(b => (
                <tr key={b._id}>
                  <td className="mono-id">{b._id?.slice(-6).toUpperCase()}</td>
                  <td>{b.user?.name || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{b.bookingType || '—'}</td>
                  <td>₹{(b.totalAmount || 0).toLocaleString()}</td>
                  <td><StatusBadge status={b.paymentStatus || 'pending'} /></td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
