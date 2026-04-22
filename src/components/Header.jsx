import { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, User, Menu, TreePine, ChevronDown, X, Trash2, CalendarCheck, UserPlus } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const titles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/bookings':  'Booking Management',
  '/admin/store':     'Store Management',
  '/admin/gallery':   'Gallery',
  '/admin/users':     'User Management',
  '/admin/payments':  'Payments & Reports',
  '/admin/settings':  'Settings',
  '/admin/profile':   'My Profile',
};

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

const NOTIF_ICON = {
  new_booking: <CalendarCheck size={14} />,
  new_user:    <UserPlus size={14} />,
};

const NOTIF_COLOR = {
  new_booking: '#2563eb',
  new_user:    '#16a34a',
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { logout, profile } = useAuth();
  const { notifications, unreadCount, markAllRead, clearAll, dismiss } = useSocket();
  const navigate = useNavigate();

  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useOutsideClick(notifRef,   () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  // Mark all read when dropdown opens
  const handleBellClick = () => {
    setNotifOpen(p => !p);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn hamburger-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <h1 className="header-title">{titles[pathname] || 'Admin Panel'}</h1>
      </div>

      <div className="header-actions">
        {/* Search */}
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>

        {/* ── Notification Bell ── */}
        <div className="dropdown-wrap" ref={notifRef}>
          <button className="icon-btn notif-btn" onClick={handleBellClick}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="dropdown notif-dropdown">
              {/* Header */}
              <div className="dropdown-header">
                <span>Notifications {notifications.length > 0 && <span className="notif-count-pill">{notifications.length}</span>}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {unreadCount > 0 && (
                    <button className="dropdown-action" onClick={markAllRead}>Mark all read</button>
                  )}
                  {notifications.length > 0 && (
                    <button className="dropdown-action danger-action" onClick={clearAll}>
                      <Trash2 size={12} /> Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    <Bell size={28} />
                    <p>No notifications yet</p>
                  </div>
                ) : notifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    {/* Type icon */}
                    <div
                      className="notif-type-icon"
                      style={{ background: `${NOTIF_COLOR[n.type] || '#64748b'}18`, color: NOTIF_COLOR[n.type] || '#64748b' }}
                    >
                      {NOTIF_ICON[n.type] || <Bell size={14} />}
                    </div>

                    {/* Body */}
                    <div className="notif-body">
                      <p className="notif-text">{n.text}</p>
                      {n.meta && <p className="notif-meta">{n.meta}</p>}
                      <span className="notif-time">{n.time}</span>
                    </div>

                    {/* Dismiss */}
                    <button
                      className="notif-dismiss"
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                      title="Dismiss"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Profile Dropdown ── */}
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
              <Link to="/admin/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                <User size={15} /> My Profile
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
