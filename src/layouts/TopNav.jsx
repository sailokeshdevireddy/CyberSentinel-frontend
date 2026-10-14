import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Settings, LogOut, Check, Menu, ShieldCheck } from 'lucide-react';
import { getUser, logout } from '../services/authService';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';

const ROUTE_TITLES = {
  '/dashboard': 'Operations Dashboard',
  '/events': 'Security Events Monitoring',
  '/threats': 'Threat Intelligence',
  '/incidents': 'Incident Response',
  '/applications': 'Protected Applications',
  '/organizations': 'Organization Context',
  '/audit-logs': 'Audit Trail & Compliance',
  '/settings': 'System Settings'
};

const TopNav = ({ onMenuToggle }) => {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentTitle = ROUTE_TITLES[location.pathname] || 'CyberSentinel';

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotifications();
      if (res.success) setNotifications(res.data);
    };
    fetchNotifications();

    const handleAuthChange = () => {
      setUser(getUser());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const fetchNotifications = async () => {
    const res = await getNotifications();
    if (res.success) setNotifications(res.data);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const navigateToRelated = (notif) => {
    if (notif.relatedEntityType === 'INCIDENT') {
      navigate('/incidents');
    }
    setShowNotifications(false);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showNotifications && !e.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showNotifications]);

  return (
    <header className="top-nav">
      <div className="nav-left">
        <button 
          className="mobile-hamburger-btn" 
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb-wrapper">
          <span className="breadcrumb-root">SOC</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{currentTitle}</span>
        </div>
      </div>

      <div className="nav-right">
        {/* Status Pill */}
        <div className="system-status-pill">
          <ShieldCheck size={14} className="status-icon" />
          <span className="status-text">Defenses Active</span>
        </div>

        {/* Notification Button & Dropdown */}
        <div className="notification-container" style={{ position: 'relative' }}>
          <button 
            className={`icon-btn ${unreadCount > 0 ? 'has-badge' : ''}`} 
            aria-label="Notifications" 
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge-count">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <div className="notif-header-title">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="notif-unread-tag">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead} 
                    className="notif-mark-all-btn"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                    <p>All caught up! No notifications.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`notif-item ${n.read ? 'read' : 'unread'}`}
                      onClick={() => navigateToRelated(n)}
                    >
                      <div className="notif-item-top">
                        <span className="notif-item-title">{n.title}</span>
                        {!n.read && (
                          <button 
                            className="notif-read-check"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleMarkRead(n.id); 
                            }} 
                            title="Mark as read"
                            aria-label="Mark notification as read"
                          >
                            <Check size={13} />
                          </button>
                        )}
                      </div>
                      <p className="notif-item-message">{n.message}</p>
                      <span className="notif-item-time">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Shortcut */}
        <button 
          className="icon-btn" 
          aria-label="Settings" 
          onClick={() => navigate('/settings')}
          title="Open Settings"
        >
          <Settings size={18} />
        </button>
        
        {/* User Profile Pill */}
        <div className="user-profile">
          <div className="avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Guest User'}</span>
            <span className="user-role">{user?.role ? user.role.replace(/_/g, ' ') : 'Security Analyst'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          className="logout-btn" 
          aria-label="Logout" 
          onClick={handleLogout} 
          title="Sign out of platform"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;