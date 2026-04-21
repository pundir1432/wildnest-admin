import { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, User, Menu, TreePine, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const titles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/bookings':   'Booking Management',
  '/admin/activities': 'Activity Management',
  '/admin/slots':      'Slot & Availability',
  '/admin/users':      'User Management',
  '/admin/payments':   'Payments & Reports',
  '/admin/settings':   'Settings',
  '/admin/profile':    'My Profile',
};

const notifications = [
  { id: 1, text: 'New booking by Arjun Sharma', time: '2 min ago', unread: true },
  { id: 2, text: 'Payment received ₹4,800', time: '15 min ago', unread: true },
  { id: 3, text: 'Slot BK007 is now full', time: '1 hr ago', unread: true },
  { id: 4, text: 'Booking BK004 cancelled', time: '3 hr ago', unread: false },
  { id: 5, text: 'New user registered: Pooja Iyer', time: 'Yesterday', unread: false },
];

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useOutsideClick(notifRef, () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const unreadCount = notifs.filter(n => n.unread).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger — mobile only */}
        <button className="icon-btn hamburger-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <h1 className="header-title">{titles[pathname] || 'Admin Panel'}</h1>
      </div>

      <div className="header-actions">
        {/* Search — hidden on small mobile */}
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>

        {/* Notification Bell */}
        <div className="dropdown-wrap" ref={notifRef}>
          <button className="icon-btn notif-btn" onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="dropdown notif-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="dropdown-action" onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className="notif-list">
                {notifs.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notif-dot" />
                    <div className="notif-body">
                      <p className="notif-text">{n.text}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown-wrap" ref={profileRef}>
          <button
            className="profile-trigger"
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
          >
            <div className="profile-avatar">
              <TreePine size={16} />
            </div>
            <span className="profile-name">{profile.name.split(' ')[0]}</span>
            <ChevronDown size={14} className={`profile-chevron ${profileOpen ? 'open' : ''}`} />
          </button>

          {profileOpen && (
            <div className="dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="profile-avatar lg">
                  <TreePine size={20} />
                </div>
                <div>
                  <p className="profile-dropdown-name">{profile.name}</p>
                  <p className="profile-dropdown-email">{profile.email}</p>
                </div>
              </div>
              <div className="dropdown-divider" />
              <Link
                to="/admin/profile"
                className="dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <User size={15} />
                My Profile
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
