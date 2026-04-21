import { bookings, revenueData, activityStats, payments } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CalendarCheck, IndianRupee, Users, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626'];

const today = '2025-07-15';
const totalRevenue = payments.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);
const todayBookings = bookings.filter(b => b.date === today).length;

export default function Dashboard() {
  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: '#2563eb' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: '#16a34a' },
    { label: "Today's Bookings", value: todayBookings, icon: TrendingUp, color: '#d97706' },
    { label: 'Total Users', value: 6, icon: Users, color: '#7c3aed' },
  ];

  return (
    <div className="page">
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <Icon size={24} />
            </div>
            <div>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3 className="card-title">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Bookings by Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={activityStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {activityStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Recent Bookings</h3>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>User</th><th>Activity</th><th>Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.slice(0, 5).map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user}</td>
                <td>{b.activity}</td>
                <td>{b.date}</td>
                <td>₹{b.amount.toLocaleString()}</td>
                <td><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
