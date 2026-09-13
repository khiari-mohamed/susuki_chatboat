import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminOnlyRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardHome from './pages/DashboardHome';
import EntityPage from './pages/EntityPage';
import UsersPage from './pages/UsersPage';
import DbExplorerPage from './pages/DbExplorerPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import { ENTITIES } from './config/entities';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardHome />} />

              {Object.values(ENTITIES).map((entity) => (
                <Route key={entity.key} path={`/data/${entity.key}`} element={<EntityPage entity={entity} />} />
              ))}

              <Route path="/explorer" element={<DbExplorerPage />} />
              <Route path="/diagnostics" element={<DiagnosticsPage />} />

              <Route element={<AdminOnlyRoute />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
