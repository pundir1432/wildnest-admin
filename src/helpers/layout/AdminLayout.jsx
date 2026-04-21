import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      <div className="main-area">
        <Header />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
