import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="main-area">
        <Header onMenuClick={() => setMobileOpen(p => !p)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
