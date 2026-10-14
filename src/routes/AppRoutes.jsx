import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../layouts/AppShell';
import Spinner from '../components/ui/Spinner';

// Route-level code splitting for frontend performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const SecurityEvents = lazy(() => import('../pages/SecurityEvents'));
const Threats = lazy(() => import('../pages/Threats'));
const Incidents = lazy(() => import('../pages/Incidents'));
const Applications = lazy(() => import('../pages/Applications'));
const Organizations = lazy(() => import('../pages/Organizations'));
const AuditLogs = lazy(() => import('../pages/AuditLogs'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

const RouteSuspenseFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
    <Spinner />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteSuspenseFallback />}>
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
    </Suspense>
  );
};

export default AppRoutes;