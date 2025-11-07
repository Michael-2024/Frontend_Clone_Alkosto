// src/controllers/NotificationController.js
import Notification from '../models/Notification';

/**
 * Controlador de Notificaciones
 * Maneja la creación, lectura, actualización y eliminación de notificaciones
 * Patrón Singleton
 */
class NotificationController {
  constructor() {
    if (NotificationController.instance) {
      return NotificationController.instance;
    }
    NotificationController.instance = this;
    
    this.STORAGE_KEY = 'alkosto_notifications';
    this.notifications = [];
    this.listeners = []; // Listeners para cambios en notificaciones
    
    this.loadNotifications();
  }

  /**
   * Obtiene la instancia única del controlador
   */
  static getInstance() {
    if (!NotificationController.instance) {
      NotificationController.instance = new NotificationController();
    }
    return NotificationController.instance;
  }

  /**
   * Carga notificaciones desde localStorage
   */
  loadNotifications() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.map(n => Notification.fromJSON(n));
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      this.notifications = [];
    }
  }

  /**
   * Guarda notificaciones en localStorage
   */
  saveNotifications() {
    try {
      const data = this.notifications.map(n => n.toJSON());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  }

  /**
   * Crea una nueva notificación
   */
  createNotification(userId, type, title, message, priority = 'normal', data = {}) {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification = new Notification(id, userId, type, title, message, priority, data);
    
    this.notifications.unshift(notification); // Agregar al inicio
    this.saveNotifications();
    
    return notification;
  }

  /**
   * Obtiene todas las notificaciones de un usuario
   */
  getUserNotifications(userId, limit = null) {
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    return limit ? userNotifications.slice(0, limit) : userNotifications;
  }

  /**
   * Obtiene notificaciones no leídas de un usuario
   */
  getUnreadNotifications(userId) {
    return this.notifications.filter(n => n.userId === userId && !n.read);
  }

  /**
   * Cuenta notificaciones no leídas
   */
  getUnreadCount(userId) {
    return this.getUnreadNotifications(userId).length;
  }

  /**
   * Obtiene una notificación por ID
   */
  getNotificationById(notificationId) {
    return this.notifications.find(n => n.id === notificationId);
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(notificationId) {
    const notification = this.getNotificationById(notificationId);
    if (notification && !notification.read) {
      notification.markAsRead();
      this.saveNotifications();
      return true;
    }
    return false;
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas
   */
  markAllAsRead(userId) {
    let changed = false;
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.markAsRead();
        changed = true;
      }
    });
    
    if (changed) {
      this.saveNotifications();
    }
    return changed;
  }

  /**
   * Elimina una notificación
   */
  deleteNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      return true;
    }
    return false;
  }

  /**
   * Elimina todas las notificaciones de un usuario
   */
  clearAllNotifications(userId) {
    this.notifications = this.notifications.filter(n => n.userId !== userId);
    this.saveNotifications();
  }

  /**
   * Elimina notificaciones leídas antiguas (más de 30 días)
   */
  cleanOldNotifications(userId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const initialCount = this.notifications.length;
    this.notifications = this.notifications.filter(n => {
      if (n.userId !== userId) return true;
      if (!n.read) return true;
      const createdDate = new Date(n.createdAt);
      return createdDate > thirtyDaysAgo;
    });
    
    if (this.notifications.length < initialCount) {
      this.saveNotifications();
    }
  }

  // ========================================
  // NOTIFICACIONES ESPECÍFICAS POR TIPO
  // ========================================

  /**
   * Notificación de pedido creado
   */
  notifyOrderCreated(userId, orderId, trackingNumber, total) {
    return this.createNotification(
      userId,
      'order',
      '¡Pedido confirmado!',
      `Tu pedido #${trackingNumber} ha sido confirmado por $${total.toLocaleString('es-CO')}`,
      'high',
      { orderId, trackingNumber, action: 'order_created' }
    );
  }

  /**
   * Notificación de cambio de estado de pedido
   */
  notifyOrderStatusChange(userId, orderId, trackingNumber, newStatus) {
    const statusMessages = {
      procesando: 'Tu pedido está siendo preparado',
      enviado: 'Tu pedido ha sido enviado',
      entregado: '¡Tu pedido ha sido entregado!',
      cancelado: 'Tu pedido ha sido cancelado'
    };

    const message = statusMessages[newStatus] || 'Estado de tu pedido actualizado';
    const priority = newStatus === 'entregado' ? 'high' : 'normal';

    return this.createNotification(
      userId,
      'order',
      `Pedido #${trackingNumber}`,
      message,
      priority,
      { orderId, trackingNumber, status: newStatus, action: 'status_change' }
    );
  }

  /**
   * Notificación de oferta/promoción
   */
  notifyOffer(userId, title, message, productId = null) {
    return this.createNotification(
      userId,
      'offer',
      title,
      message,
      'normal',
      { productId, action: 'offer' }
    );
  }

  /**
   * Notificación de cuenta (cambio de contraseña, etc.)
   */
  notifyAccount(userId, title, message) {
    return this.createNotification(
      userId,
      'account',
      title,
      message,
      'normal',
      { action: 'account_update' }
    );
  }

  /**
   * Notificación de sistema
   */
  notifySystem(userId, title, message, priority = 'normal') {
    return this.createNotification(
      userId,
      'system',
      title,
      message,
      priority,
      { action: 'system' }
    );
  }

  // ========================================
  // NOTIFICACIONES DE BIENVENIDA Y DEMO
  // ========================================

  /**
   * Crea notificaciones de bienvenida para nuevo usuario
   */
  createWelcomeNotifications(userId) {
    // Notificación de bienvenida
    this.notifySystem(
      userId,
      '¡Bienvenido a Alkosto!',
      'Gracias por crear tu cuenta. Explora nuestras ofertas y productos.',
      'high'
    );

    // Notificación de oferta de bienvenida
    setTimeout(() => {
      this.notifyOffer(
        userId,
        '🎁 Oferta de Bienvenida',
        '¡Descuento del 10% en tu primera compra! Usa el código BIENVENIDO10'
      );
    }, 1000);
  }

  // ========================================
  // LISTENERS
  // ========================================

  /**
   * Agrega un listener para cambios en notificaciones
   */
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notifica a todos los listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error en listener de notificaciones:', error);
      }
    });
  }
}

export default NotificationController.getInstance();
