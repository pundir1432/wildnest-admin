import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Tent, Clock, Users,
  CreditCard, Settings, ChevronLeft, ChevronRight, TreePine
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/bookings',   icon: CalendarCheck,   label: 'Bookings'   },
  { to: '/admin/activities', icon: Tent,            label: 'Activities' },
  { to: '/admin/slots',      icon: Clock,           label: 'Slots'      },
  { to: '/admin/users',      icon: Users,           label: 'Users'      },
  { to: '/admin/payments',   icon: CreditCard,      label: 'Payments'   },
  { to: '/admin/settings',   icon: Settings,        label: 'Settings'   },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <TreePine size={28} className="logo-icon" />
        {!collapsed && <span className="logo-text">WildNest</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}

            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
