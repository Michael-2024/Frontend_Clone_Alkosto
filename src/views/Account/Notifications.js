// src/views/Account/Notifications.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import NotificationController from '../../controllers/NotificationController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Notifications = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'order', 'offer', 'account', 'system'

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    loadNotifications();

    // Listener para cambios en notificaciones
    const unsubscribe = NotificationController.addListener(() => {
      loadNotifications();
    });

    return () => unsubscribe();
  }, [navigate, filter]);

  const loadNotifications = () => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      let userNotifications = NotificationController.getUserNotifications(currentUser.id);
      
      // Aplicar filtros
      if (filter === 'unread') {
        userNotifications = userNotifications.filter(n => !n.read);
      } else if (filter !== 'all') {
        userNotifications = userNotifications.filter(n => n.type === filter);
      }
      
      setNotifications(userNotifications);
    }
  };

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    NotificationController.markAsRead(notification.id);

    // Navegar según el tipo
    if (notification.data.orderId) {
      navigate('/perfil/pedidos');
    } else if (notification.data.productId) {
      navigate(`/producto/${notification.data.productId}`);
    } else if (notification.type === 'account') {
      navigate('/perfil/datos');
    }
  };

  const handleMarkAllRead = () => {
    if (user) {
      NotificationController.markAllAsRead(user.id);
    }
  };

  const handleDeleteNotification = (notificationId, e) => {
    e.stopPropagation();
    NotificationController.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    if (user && window.confirm('¿Eliminar todas las notificaciones?')) {
      NotificationController.clearAllNotifications(user.id);
    }
  };

  const onLogout = () => {
    UserController.logout();
    navigate('/');
  };

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>🔔</div>
              <div className="hero-texts">
                <h1 className="account-title">Notificaciones</h1>
                <p className="account-sub">
                  {unreadCount > 0
                    ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                    : 'Todas las notificaciones están al día'}
                </p>
              </div>
            </div>

            {/* Filtros */}
            <div className="notification-filters">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todas
              </button>
              <button
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                No leídas {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                className={`filter-btn ${filter === 'order' ? 'active' : ''}`}
                onClick={() => setFilter('order')}
              >
                📦 Pedidos
              </button>
              <button
                className={`filter-btn ${filter === 'offer' ? 'active' : ''}`}
                onClick={() => setFilter('offer')}
              >
                🎁 Ofertas
              </button>
              <button
                className={`filter-btn ${filter === 'account' ? 'active' : ''}`}
                onClick={() => setFilter('account')}
              >
                👤 Cuenta
              </button>
              <button
                className={`filter-btn ${filter === 'system' ? 'active' : ''}`}
                onClick={() => setFilter('system')}
              >
                🔔 Sistema
              </button>
            </div>

            {/* Acciones */}
            {notifications.length > 0 && (
              <div className="notification-toolbar">
                {unreadCount > 0 && (
                  <button className="toolbar-btn" onClick={handleMarkAllRead}>
                    ✓ Marcar todas como leídas
                  </button>
                )}
                <button className="toolbar-btn danger" onClick={handleClearAll}>
                  🗑️ Eliminar todas
                </button>
              </div>
            )}

            {/* Lista de notificaciones */}
            {notifications.length === 0 ? (
              <div className="account-grid">
                <div className="account-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  <div className="card-icon" aria-hidden>🔔</div>
                  <div className="card-title">No hay notificaciones</div>
                  <div className="card-desc">
                    {filter === 'all'
                      ? 'No tienes notificaciones en este momento.'
                      : `No tienes notificaciones de tipo "${filter}".`}
                  </div>
                </div>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-card ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-card-icon">{notification.getIcon()}</div>
                    <div className="notification-card-content">
                      <div className="notification-card-header">
                        <h3 className="notification-card-title">{notification.title}</h3>
                        <button
                          className="notification-delete"
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                          aria-label="Eliminar notificación"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="notification-card-message">{notification.message}</p>
                      <div className="notification-card-footer">
                        <span className="notification-card-time">{notification.getTimeAgo()}</span>
                        {!notification.read && (
                          <span className="notification-card-badge">Nueva</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
