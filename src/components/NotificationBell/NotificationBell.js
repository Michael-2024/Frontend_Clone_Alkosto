// src/components/NotificationBell/NotificationBell.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationController from '../../controllers/NotificationController';
import UserController from '../../controllers/UserController';
import './NotificationBell.css';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    updateNotifications();

    // Listener para cambios en notificaciones
    const unsubscribe = NotificationController.addListener(() => {
      updateNotifications();
    });

    // Listener para cambios de autenticación
    const unsubscribeAuth = UserController.addAuthListener(() => {
      updateNotifications();
    });

    // Click fuera del panel para cerrarlo
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      unsubscribeAuth();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateNotifications = () => {
    const user = UserController.getCurrentUser();
    if (user) {
      const userNotifications = NotificationController.getUserNotifications(user.id, 10);
      const unread = NotificationController.getUnreadCount(user.id);
      setNotifications(userNotifications);
      setUnreadCount(unread);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleBellClick = () => {
    const user = UserController.getCurrentUser();
    if (!user) {
      navigate('/login/options');
      return;
    }
    setShowPanel(!showPanel);
  };

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    NotificationController.markAsRead(notification.id);

    // Navegar según el tipo de notificación
    if (notification.data.orderId) {
      navigate('/perfil/pedidos');
    } else if (notification.data.productId) {
      navigate(`/producto/${notification.data.productId}`);
    } else if (notification.type === 'account') {
      navigate('/perfil/datos');
    }

    setShowPanel(false);
  };

  const handleMarkAllRead = () => {
    const user = UserController.getCurrentUser();
    if (user) {
      NotificationController.markAllAsRead(user.id);
      updateNotifications();
    }
  };

  const handleClearAll = () => {
    const user = UserController.getCurrentUser();
    if (user && window.confirm('¿Eliminar todas las notificaciones?')) {
      NotificationController.clearAllNotifications(user.id);
      updateNotifications();
      setShowPanel(false);
    }
  };

  const user = UserController.getCurrentUser();
  if (!user) {
    return null; // No mostrar campana si no hay usuario logueado
  }

  return (
    <div className="notification-bell-container" ref={panelRef}>
      <button
        className="notification-bell-button"
        onClick={handleBellClick}
        aria-label="Notificaciones"
        aria-expanded={showPanel}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showPanel && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            {notifications.length > 0 && (
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read"
                    onClick={handleMarkAllRead}
                    title="Marcar todas como leídas"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="clear-all"
                  onClick={handleClearAll}
                  title="Eliminar todas"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="empty-icon">🔔</span>
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">{notification.getIcon()}</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.getTimeAgo()}</div>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                className="view-all-button"
                onClick={() => {
                  navigate('/perfil/notificaciones');
                  setShowPanel(false);
                }}
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
