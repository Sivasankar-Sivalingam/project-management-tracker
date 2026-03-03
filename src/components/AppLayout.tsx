import { NavLink, useLocation } from 'react-router-dom';
import './AppLayout.css';
import type { ReactNode } from 'react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'home',    label: 'Dashboard',       path: '/',         icon: '⊞' },
  { id: 'members', label: 'Team Members',    path: '/members',  icon: '👥', badge: 'US_02' },
  { id: 'add',     label: 'Add Member',      path: '/add-member', icon: '➕', badge: 'US_01' },
  { id: 'tasks',   label: 'View Tasks',      path: '/tasks',    icon: '📋', badge: 'US_04' },
  { id: 'assign',  label: 'Assign Task',     path: '/assign-task', icon: '✅', badge: 'US_03' },
  { id: 'alloc',   label: 'Update Allocation', path: '/allocation', icon: '📊', badge: 'US_05' },
];

function Navbar() {
  const now = new Date();
  const formatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="pmt-navbar">
      <div className="pmt-navbar__brand">
        <div className="pmt-navbar__logo">📁</div>
        <div>
          <div className="pmt-navbar__title">PM Tracker</div>
          <div className="pmt-navbar__subtitle">Project Management System</div>
        </div>
      </div>
      <div className="pmt-navbar__spacer" />
      <div className="pmt-navbar__meta">
        <span>📅 {formatted}</span>
        <div className="pmt-navbar__avatar" title="Manager">M</div>
      </div>
    </header>
  );
}

function Sidebar() {
  const location = useLocation();

  return (
    <nav className="pmt-sidebar">
      <span className="pmt-sidebar__section-label">Navigation</span>
      {navItems.map(item => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `pmt-sidebar__item${isActive ? ' active' : ''}`
          }
        >
          <span className="pmt-sidebar__icon">{item.icon}</span>
          {item.label}
          {item.badge && (
            <span className="pmt-sidebar__badge">{item.badge}</span>
          )}
        </NavLink>
      ))}

      <span className="pmt-sidebar__section-label" style={{ marginTop: 'auto' }}>System</span>
      <div className="pmt-sidebar__item" style={{ color: 'var(--accent-success)', cursor: 'default' }}>
        <span className="pmt-sidebar__icon">🟢</span>
        Mock Server :3001
      </div>
    </nav>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="pmt-shell">
        <Sidebar />
        <main className="pmt-content">
          {children}
        </main>
      </div>
    </>
  );
}
