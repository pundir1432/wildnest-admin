import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Store, Users,
  CreditCard, Settings, ChevronLeft, ChevronRight, TreePine, X, Image
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/bookings',  icon: CalendarCheck,   label: 'Bookings'  },
  { to: '/admin/store',     icon: Store,           label: 'Store'     },
  { to: '/admin/gallery',   icon: Image,           label: 'Gallery'   },
  { to: '/admin/users',     icon: Users,           label: 'Users'     },
  { to: '/admin/payments',  icon: CreditCard,      label: 'Payments'  },
  { to: '/admin/settings',  icon: Settings,        label: 'Settings'  },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <TreePine size={28} className="logo-icon" />
        {!collapsed && <span className="logo-text">WildNest</span>}
        {/* Close button — mobile only */}
        <button className="sidebar-close-btn" onClick={onMobileClose}>
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle — desktop only */}
      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
