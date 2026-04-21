import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const titles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/bookings':   'Booking Management',
  '/admin/activities': 'Activity Management',
  '/admin/slots':      'Slot & Availability',
  '/admin/users':      'User Management',
  '/admin/payments':   'Payments & Reports',
  '/admin/settings':   'Settings',
};

export default function Header() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="header">
      <h1 className="header-title">{titles[pathname] || 'Admin Panel'}</h1>
      <div className="header-actions">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>
        <button className="icon-btn"><Bell size={20} /></button>
        <div className="admin-avatar">
          <UserCircle size={28} />
          <span>Admin</span>
        </div>
        <button className="btn btn-logout" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
