import { useState } from 'react';
import { payments, revenueData } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';

const PERIODS = ['Daily', 'Weekly', 'Monthly'];

const monthlyData = [
  { month: 'Jan', revenue: 45000 }, { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 }, { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 74000 }, { month: 'Jun', revenue: 89000 },
  { month: 'Jul', revenue: 110200 },
];

export default function Payments() {
  const [period, setPeriod] = useState('Weekly');
  const [filterStatus, setFilterStatus] = useState('All');

  const chartData = period === 'Monthly' ? monthlyData : revenueData;
  const xKey = period === 'Monthly' ? 'month' : 'day';

  const filtered = payments.filter(p => filterStatus === 'All' || p.status === filterStatus);
  const totalRevenue = payments.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);

  const exportCSV = () => {
    const headers = ['ID,Booking ID,User,Activity,Amount,Method,Date,Status'];
    const rows = filtered.map(p => `${p.id},${p.bookingId},${p.user},${p.activity},${p.amount},${p.method},${p.date},${p.status}`);
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'payments.csv'; a.click();
  };

  return (
    <div className="page">
      <div className="stats-grid">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#16a34a' },
          { label: 'Total Transactions', value: payments.filter(p => p.status === 'Success').length, color: '#2563eb' },
          { label: 'Refunded', value: `₹${totalRefunded.toLocaleString()}`, color: '#dc2626' },
          { label: 'Pending Payments', value: 2, color: '#d97706' },
        ].map(({ label, value, color }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>₹</span>
            </div>
            <div>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
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
              {['All', 'Success', 'Refunded'].map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary" onClick={exportCSV}><Download size={16} /> Export</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Booking</th><th>User</th><th>Activity</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.bookingId}</td>
                <td>{p.user}</td>
                <td>{p.activity}</td>
                <td>₹{p.amount.toLocaleString()}</td>
                <td>{p.method}</td>
                <td>{p.date}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
