import { useState } from 'react';
import { bookings as initialBookings } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Download, Search } from 'lucide-react';

const STATUSES = ['All', 'Confirmed', 'Pending', 'Cancelled'];
const ACTIVITIES = ['All', 'Rafting', 'Camp', 'Kayaking', 'Rental'];

export default function Bookings() {
  const [data, setData] = useState(initialBookings);
  const [search, setSearch] = useState('');
  const [filterActivity, setFilterActivity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const filtered = data.filter(b => {
    const matchSearch = b.user.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search);
    const matchActivity = filterActivity === 'All' || b.activity === filterActivity;
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchDate = !filterDate || b.date === filterDate;
    return matchSearch && matchActivity && matchStatus && matchDate;
  });

  const updateStatus = (id, status) => {
    setData(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const exportCSV = () => {
    const headers = ['ID,User,Activity,Date,Time,Persons,Amount,Status,Payment'];
    const rows = filtered.map(b => `${b.id},${b.user},${b.activity},${b.date},${b.time},${b.persons},${b.amount},${b.status},${b.payment}`);
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bookings.csv'; a.click();
  };

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="filters">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <input type="date" className="filter-input" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          <select className="filter-input" value={filterActivity} onChange={e => setFilterActivity(e.target.value)}>
            {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
          </select>
          <select className="filter-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>User</th><th>Activity</th><th>Date</th><th>Time</th><th>Persons</th><th>Amount</th><th>Payment</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="empty-row">No bookings found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user}</td>
                <td>{b.activity}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.persons}</td>
                <td>₹{b.amount.toLocaleString()}</td>
                <td><StatusBadge status={b.payment} /></td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  <select
                    className="status-select"
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value)}
                  >
                    {['Confirmed', 'Pending', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
