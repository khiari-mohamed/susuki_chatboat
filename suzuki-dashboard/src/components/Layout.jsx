import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../api/socket';
import { ENTITIES, ENTITY_NAV_ORDER } from '../config/entities';

export default function Layout() {
  const { user, logout } = useAuth();
  const [online, setOnline] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    function handlePresence(payload) {
      setOnline(payload.online || []);
    }
    socket.on('presence', handlePresence);
    return () => socket.off('presence', handlePresence);
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">CarPro</span>
          <span className="sidebar-brand-sub">Portail Admin Suzuki</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            📊 Tableau de bord
          </NavLink>

          <div className="nav-section-label">Catalogue</div>
          {ENTITY_NAV_ORDER.map((key) => (
            <NavLink
              key={key}
              to={`/data/${key}`}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {ENTITIES[key].label}
            </NavLink>
          ))}

          {user?.role === 'ADMIN' && (
            <>
              <div className="nav-section-label">Administration</div>
              <NavLink to="/users" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                👤 Utilisateurs
              </NavLink>
            </>
          )}

          <div className="nav-section-label">Base de données</div>
          <NavLink to="/explorer" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            🗄 Explorateur complet
          </NavLink>
          <NavLink to="/diagnostics" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            📈 Diagnostics
          </NavLink>
        </nav>

        <div className="sidebar-presence">
          <span className="presence-dot" />
          {online.length} connecté{online.length > 1 ? 's' : ''}
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div />
          <div className="topbar-user">
            <span className="topbar-name">{user?.name}</span>
            <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
            <button className="btn-secondary" onClick={logout}>
              Déconnexion
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
