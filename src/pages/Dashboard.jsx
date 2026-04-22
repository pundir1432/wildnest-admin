import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { CalendarCheck, IndianRupee, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { getDashboard, getPaymentDashboard } from '../services/dashboardService';
import StatusBadge from '../components/StatusBadge';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626'];

const weeklyData = [
  { label: 'Mon', revenue: 8400, bookings: 3 },
  { label: 'Tue', revenue: 12600, bookings: 5 },
  { label: 'Wed', revenue: 9800, bookings: 4 },
  { label: 'Thu', revenue: 15200, bookings: 6 },
  { label: 'Fri', revenue: 18900, bookings: 8 },
  { label: 'Sat', revenue: 24300, bookings: 11 },
  { label: 'Sun', revenue: 21000, bookings: 9 },
];

const monthlyData = [
  { label: 'Jan', revenue: 45000, bookings: 38 },
  { label: 'Feb', revenue: 52000, bookings: 44 },
  { label: 'Mar', revenue: 61000, bookings: 52 },
  { label: 'Apr', revenue: 58000, bookings: 49 },
  { label: 'May', revenue: 74000, bookings: 63 },
  { label: 'Jun', revenue: 89000, bookings: 76 },
  { label: 'Jul', revenue: 110200, bookings: 94 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name === 'revenue' ? `₹${p.value.toLocaleString()}` : `${p.value} bookings`}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [period, setPeriod] = useState('Weekly');
  const [dash, setDash] = useState(null);
  const [payDash, setPayDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [d, p] = await Promise.all([getDashboard(), getPaymentDashboard()]);
        setDash(d.data);
        setPayDash(p.data);
      } catch {
        // fallback to null — UI shows 0s
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const chartData = period === 'Weekly' ? weeklyData : monthlyData;

  const stats = [
    { label: 'Total Bookings', value: dash?.totalBookings ?? '—', icon: CalendarCheck, color: '#2563eb' },
    { label: 'Total Revenue',  value: dash ? `₹${(dash.totalRevenue || 0).toLocaleString()}` : '—', icon: IndianRupee, color: '#16a34a' },
    { label: 'Total Users',    value: dash?.totalUsers ?? '—', icon: Users, color: '#7c3aed' },
    { label: 'Total Camps',    value: dash?.totalCamps ?? '—', icon: TrendingUp, color: '#d97706' },
  ];

  // Build activity revenue from paymentDashboard revenueByType
  const activityRevenue = (payDash?.revenueByType || []).map((r, i) => {
    const meta = {
      camp:    { color: '#16a34a', bg: '#f0fdf4', icon: '⛺' },
      rafting: { color: '#2563eb', bg: '#eff6ff', icon: '🚣' },
      rental:  { color: '#7c3aed', bg: '#f5f3ff', icon: '🎒' },
    };
    const m = meta[r._id] || { color: COLORS[i % COLORS.length], bg: '#f8fafc', icon: '🏕️' };
    return { name: r._id.charAt(0).toUpperCase() + r._id.slice(1), revenue: r.total, bookings: r.count, ...m };
  });

  const totalRev = activityRevenue.reduce((s, a) => s + a.revenue, 0);
  const maxRev = Math.max(...activityRevenue.map(a => a.revenue), 1);

  const pieData = activityRevenue.map(a => ({ name: a.name, value: a.bookings }));

  const recentBookings = dash?.recentBookings || [];

  return (
    <div className="page">
      {/* Stats */}
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <Icon size={22} />
            </div>
            <div className="stat-info">
              <p className="stat-label">{label}</p>
              <p className="stat-value">{loading ? '...' : value}</p>
              <span className="stat-change up"><ArrowUpRight size={13} />Live data</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Trend Chart */}
      <div className="card">
        <div className="card-toolbar">
          <div>
            <h3 className="card-title" style={{ marginBottom: 2 }}>Revenue & Bookings Trend</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {period === 'Weekly' ? 'This week' : 'This year'} overview
            </p>
          </div>
          <div className="period-tabs">
            {['Weekly', 'Monthly'].map(p => (
              <button key={p} className={`tab-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="bk" orientation="right" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" name="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5 }} />
            <Area yAxisId="bk"  type="monotone" dataKey="bookings" name="bookings" stroke="#16a34a" strokeWidth={2.5} fill="url(#bkGrad)" dot={false} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: '#2563eb' }} />Revenue</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#16a34a' }} />Bookings</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="charts-grid">
        {/* Activity Revenue Breakdown */}
        <div className="card">
          <h3 className="card-title">Activity Revenue Breakdown</h3>
          {activityRevenue.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{loading ? 'Loading...' : 'No data available'}</p>
          ) : (
            <div className="activity-revenue-list">
              {activityRevenue.map(a => {
                const pct = totalRev > 0 ? Math.round((a.revenue / totalRev) * 100) : 0;
                return (
                  <div key={a.name} className="activity-revenue-item">
                    <div className="activity-revenue-top">
                      <div className="activity-revenue-left">
                        <div className="activity-revenue-icon" style={{ background: a.bg }}>{a.icon}</div>
                        <span className="activity-revenue-name">{a.name}</span>
                      </div>
                      <div className="activity-revenue-right">
                        <span className="activity-revenue-value">₹{a.revenue.toLocaleString()}</span>
                        <span className="activity-revenue-bookings">{a.bookings} bookings · {pct}%</span>
                      </div>
                    </div>
                    <div className="activity-revenue-bar-bg">
                      <div className="activity-revenue-bar-fill" style={{ width: `${(a.revenue / maxRev) * 100}%`, background: a.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookings by Activity Pie */}
        <div className="card">
          <h3 className="card-title">Bookings by Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData.length ? pieData : [{ name: 'No data', value: 1 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {(pieData.length ? pieData : [{}]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={10} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <h3 className="card-title">Recent Bookings</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>User</th><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="empty-row">Loading...</td></tr>
              ) : recentBookings.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No recent bookings</td></tr>
              ) : recentBookings.slice(0, 5).map((b, i) => (
                <tr key={b._id || i}>
                  <td>{b._id?.slice(-6).toUpperCase() || '—'}</td>
                  <td>{b.user?.name || b.userName || '—'}</td>
                  <td>{b.bookingType || b.type || '—'}</td>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td>₹{(b.totalAmount || b.amount || 0).toLocaleString()}</td>
                  <td><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
