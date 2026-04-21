export default function StatusBadge({ status }) {
  const map = {
    Confirmed: 'badge-success',
    Active: 'badge-success',
    Available: 'badge-success',
    Success: 'badge-success',
    Paid: 'badge-success',
    Pending: 'badge-warning',
    Full: 'badge-warning',
    Cancelled: 'badge-danger',
    Inactive: 'badge-danger',
    Blocked: 'badge-danger',
    Refunded: 'badge-info',
  };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
}
