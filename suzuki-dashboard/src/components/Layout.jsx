import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, Layers, Link2, Car, GitMerge, Cpu, BookOpen,
  MessageSquare, Users, Database, BarChart2, LogOut, ChevronRight, Circle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../api/socket';
import { ENTITIES, ENTITY_NAV_ORDER } from '../config/entities';

const ENTITY_ICONS = {
  parts: Package,
  stock: Layers,
  fitments: Link2,
  vehicles: Car,
  'vehicle-model-map': GitMerge,
  'vehicle-types': Cpu,
  'item-references': BookOpen,
  synonyms: MessageSquare,
};

function NavItem({ to, icon: Icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
    >
      <Icon size={15} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const [online, setOnline] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const h = (p) => setOnline(p.online || []);
    socket.on('presence', h);
    return () => socket.off('presence', h);
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-mark">CP</div>
          <div>
            <span className="sidebar-logo">CarPro</span>
            <span className="sidebar-brand-sub">Portail Admin Suzuki</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavItem to="/" icon={LayoutDashboard} label="Tableau de bord" end />

          <div className="nav-section-label">Catalogue</div>
          {ENTITY_NAV_ORDER.map((key) => {
            const Icon = ENTITY_ICONS[key] || Package;
            return <NavItem key={key} to={`/data/${key}`} icon={Icon} label={ENTITIES[key].label} />;
          })}

          {user?.role === 'ADMIN' && (
            <>
              <div className="nav-section-label">Administration</div>
              <NavItem to="/users" icon={Users} label="Utilisateurs" />
            </>
          )}

          <div className="nav-section-label">Base de données</div>
          <NavItem to="/explorer" icon={Database} label="Explorateur" />
          <NavItem to="/diagnostics" icon={BarChart2} label="Diagnostics" />
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-presence">
            <Circle size={8} fill="#22c55e" color="#22c55e" />
            <span>{online.length} connecté{online.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <ChevronRight size={14} className="topbar-chevron" />
          </div>
          <div className="topbar-user">
            <div className="topbar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="topbar-info">
              <span className="topbar-name">{user?.name}</span>
              <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
            </div>
            <button className="topbar-logout" onClick={logout} title="Déconnexion">
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
