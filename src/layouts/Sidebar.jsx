import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, AlertTriangle, ShieldAlert, FileText, AppWindow, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Shield className="logo-icon" size={24} />
        <h2>CyberSentinel</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FileText size={18} />
          <span>Security Events</span>
        </NavLink>
        <NavLink to="/threats" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <AlertTriangle size={18} />
          <span>Threats</span>
        </NavLink>
        <NavLink to="/incidents" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <ShieldAlert size={18} />
          <span>Incidents</span>
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <AppWindow size={18} />
          <span>Applications</span>
        </NavLink>
        <NavLink to="/organizations" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <Shield size={18} />
          <span>Organizations</span>
        </NavLink>
        <NavLink to="/audit-logs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FileText size={18} />
          <span>Audit Logs</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
