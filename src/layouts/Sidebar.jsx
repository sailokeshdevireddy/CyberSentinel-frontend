import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  AppWindow, 
  Settings, 
  Building, 
  ClipboardList,
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const handleNavClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose} 
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo-wrapper">
            <div className="brand-icon-box">
              <Shield className="logo-icon" size={20} />
            </div>
            <div className="brand-details">
              <span className="brand-title">CyberSentinel</span>
              <span className="brand-badge">SOC PLATFORM</span>
            </div>
          </div>
          {onClose && (
            <button 
              className="mobile-close-btn" 
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="sidebar-scrollable">
          <nav className="sidebar-nav">
            <div className="nav-section-label">MONITORING & RESPONSE</div>
            
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <LayoutDashboard size={18} className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/events" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <FileText size={18} className="nav-icon" />
              <span>Security Events</span>
            </NavLink>

            <NavLink 
              to="/threats" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <AlertTriangle size={18} className="nav-icon" />
              <span>Threats</span>
            </NavLink>

            <NavLink 
              to="/incidents" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <ShieldAlert size={18} className="nav-icon" />
              <span>Incidents</span>
            </NavLink>

            <div className="nav-section-label" style={{ marginTop: '16px' }}>GOVERNANCE & ASSETS</div>

            <NavLink 
              to="/applications" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <AppWindow size={18} className="nav-icon" />
              <span>Applications</span>
            </NavLink>

            <NavLink 
              to="/organizations" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <Building size={18} className="nav-icon" />
              <span>Organizations</span>
            </NavLink>

            <NavLink 
              to="/audit-logs" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <ClipboardList size={18} className="nav-icon" />
              <span>Audit Logs</span>
            </NavLink>

            <div className="nav-section-label" style={{ marginTop: '16px' }}>CONFIGURATION</div>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              <Settings size={18} className="nav-icon" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="soc-status">
            <span className="soc-indicator-dot"></span>
            <span className="soc-status-text">Engine Online</span>
          </div>
          <span className="soc-version">v2.4.0</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
