import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../layouts/AppShell';

import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import SecurityEvents from '../pages/SecurityEvents';
import Threats from '../pages/Threats';
import Incidents from '../pages/Incidents';
import Applications from '../pages/Applications';
import Organizations from '../pages/Organizations';
import AuditLogs from '../pages/AuditLogs';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<SecurityEvents />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;