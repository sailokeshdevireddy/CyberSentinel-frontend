import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut, Check } from 'lucide-react';
import { getUser, logout } from '../services/authService';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';

const TopNav = () => {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read).length;

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

  return (
    <header className="top-nav" style={{ position: 'relative' }}>
      <div className="nav-left"></div>
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Notification Button */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            aria-label="Notifications" 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--status-critical)', color: 'white', fontSize: '0.7rem', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold' }}>
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--brand-color)', cursor: 'pointer', fontSize: '0.85rem' }}>Mark all read</button>
                )}
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.1)', cursor: 'pointer' }} onClick={() => navigateToRelated(n)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.9rem', color: n.read ? 'var(--text-primary)' : 'var(--active-color)' }}>{n.title}</strong>
                        {!n.read && (
                          <button onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Mark as read">
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{n.message}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn" aria-label="Settings" onClick={() => navigate('/settings')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Settings size={20} />
        </button>
        
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} />
          </div>
          <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="user-name" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.name || 'Guest'}</span>
            <span className="user-role" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || ''}</span>
          </div>
        </div>

        <button className="icon-btn" aria-label="Logout" onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--status-critical)', cursor: 'pointer', marginLeft: '10px' }} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;